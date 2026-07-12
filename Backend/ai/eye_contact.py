import os
import cv2
import math
import numpy as np
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

def analyze_eye_contact(video_path):
    """
    Exposes a top-level functional wrapper that hooks directly into analyzer.py.
    Usage inside analyzer.py:
        eye = analyze_eye_contact(video_path)
    """
    analyzer = EyeContactAnalyzer()
    return analyzer.process_video(video_path)

class EyeContactAnalyzer:
    def __init__(self):
        # Configure path for the face landmarker asset bundle
        # Ensure 'face_landmarker.task' exists inside your Backend/ai/ directory
        model_path = os.path.join(os.path.dirname(__file__), 'face_landmarker.task')
        
        base_options = python.BaseOptions(model_asset_path=model_path)
        options = vision.FaceLandmarkerOptions(
            base_options=base_options,
            output_face_blendshapes=False,
            output_facial_transformation_matrixes=True, # Critical for extraction without heavy rotation geometry matrices
            running_mode=vision.RunningMode.VIDEO
        )
        # Handle lazy initialization or verification gracefully if file missing during backend setup
        if os.path.exists(model_path):
            self.landmarker = vision.FaceLandmarker.create_from_options(options)
        else:
            self.landmarker = None

    def process_video(self, video_path):
        """
        Processes every 3rd frame of an uploaded MP4 presentation to evaluate
        vocal speaker orientation, gaze metrics, consistency streaks, and head stability.
        """
        # Universal fallback error catch if task asset file is missing or corrupted
        if not self.landmarker:
            return self._get_empty_metrics("Face landmarker model asset bundle asset ('face_landmarker.task') not found.")

        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            return self._get_empty_metrics("Video unreadable or invalid path.")

        fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
        
        # Metric calculation state trackers
        frame_count = 0
        visible_frames = 0
        
        yaws = []
        pitches = []
        
        forward_looking_frames = 0
        current_streak = 0
        streaks = []

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            frame_count += 1
            # Performance Optimization: Process every 3rd frame to optimize local CPU throughput
            if frame_count % 3 != 0:
                continue

            # Prep image channels for MediaPipe Task ingestion
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)
            frame_timestamp_ms = int((frame_count / fps) * 1000)

            # Perform local frame landmark generation
            detection_result = self.landmarker.detect_for_video(mp_image, frame_timestamp_ms)
            print(detection_result)

            # Check if at least one speaker face is present
            if detection_result.face_landmarks and detection_result.facial_transformation_matrixes:
                visible_frames += 1
                
                # Extract the 4x4 Transformation Matrix to find spatial rotation parameters
                matrix = detection_result.facial_transformation_matrixes[0]
                
                # Extract Pitch and Yaw angles from the rotational component vectors
                # pitch: rotation around horizontal x axis (looking up/down at notes)
                # yaw: rotation around vertical y axis (looking left/right away from camera center)
                pitch = math.atan2(matrix[2][1], matrix[2][2])
                yaw = math.atan2(-matrix[2][0], math.sqrt(matrix[2][1]**2 + matrix[2][2]**2))
                
                yaws.append(yaw)
                pitches.append(pitch)

                # Determine if face angles are centered toward the camera (Audience Engagement Field)
                # We define a standard functional tolerance threshold of ~0.15 radians (~8.5 degrees deviation)
                is_facing_audience = (abs(yaw) < 0.15) and (abs(pitch) < 0.15)

                if is_facing_audience:
                    forward_looking_frames += 1
                    current_streak += 1
                else:
                    if current_streak > 0:
                        streaks.append(current_streak)
                        current_streak = 0
            else:
                if current_streak > 0:
                    streaks.append(current_streak)
                    current_streak = 0

        # Close resource window context
        if current_streak > 0:
            streaks.append(current_streak)
            
        cap.release()

        # Handle structural edge cases where a user uploads content with no frame visibility
        if visible_frames == 0 or frame_count == 0:
            return self._get_empty_metrics("No face detected.")

        return self._calculate_scores(yaws, pitches, forward_looking_frames, visible_frames, frame_count, streaks)

    def _calculate_scores(self, yaws, pitches, forward_looking_frames, visible_frames, total_frames, streaks):
        """
        Maps statistical vision trends cleanly into the 0-30 raw components ecosystem
        and outputs a perfectly formatted production dictionary JSON structure.
        """
        feedback = []

        # Calculate base statistics
        visibility_ratio = visible_frames / (total_frames / 3) # Account for downsampled frames
        visibility_ratio = min(1.0, visibility_ratio)
        forward_ratio = forward_looking_frames / visible_frames if visible_frames > 0 else 0.0
        yaw_std = float(np.std(yaws)) if yaws else 0.0
        pitch_std = float(np.std(pitches)) if pitches else 0.0

        # --- Component 1: Head Direction / Yaw Alignment (Max 6 points) ---
        avg_yaw = abs(float(np.mean(yaws))) if yaws else 0.0
        if avg_yaw < 0.08: head_direction_raw = 6
        elif avg_yaw < 0.15: head_direction_raw = 5
        elif avg_yaw < 0.22: head_direction_raw = 4
        else: head_direction_raw = 2

        if head_direction_raw < 5:
            feedback.append("Reduce frequent side glances to build trust with your audience.")

        # --- Component 2: Looking Forward / Vertical Pitch (Max 6 points) ---
        avg_pitch = float(np.mean(pitches)) if pitches else 0.0
        # Positive values typically mean looking down at notes or keyboard
        if abs(avg_pitch) < 0.08: looking_forward_raw = 6
        elif abs(avg_pitch) < 0.15: looking_forward_raw = 5
        elif avg_pitch < 0.25: looking_forward_raw = 4
        else: looking_forward_raw = 2

        if avg_pitch > 0.15:
            feedback.append("Avoid looking down at notes or slides too frequently.")

        # --- Component 3: Head Stability / Standard Deviations (Max 6 points) ---
        # High variation means erratic shaking, checking notes constantly, or fast bobbing
        if yaw_std < 0.04 and pitch_std < 0.04: 
            head_stability_raw = 6
            feedback.append("Great head stability. Your posture feels calm and controlled.")
        elif yaw_std < 0.08 and pitch_std < 0.08: 
            head_stability_raw = 5
        elif yaw_std < 0.14 and pitch_std < 0.14: 
            head_stability_raw = 4
        else: 
            head_stability_raw = 2
            feedback.append("Your head tracking data indicates excessive or fast motion patterns.")

        # --- Component 4: Visibility Ratio (Max 6 points) ---
        if visibility_ratio > 0.92: visibility_raw = 6
        elif visibility_ratio > 0.80: visibility_raw = 5
        elif visibility_ratio > 0.65: visibility_raw = 4
        else: visibility_raw = 2

        if visibility_raw < 5:
            feedback.append("Ensure your face stays completely framed and well-lit.")

        # --- Component 5: Focus Consistency Streaks (Max 6 points) ---
        # Long uninterrupted continuous streaks imply deep audience eye-contact connection
        max_streak = max(streaks) if streaks else 0
        # Relative score based on total length of face time tracked
        streak_ratio = max_streak / visible_frames if visible_frames > 0 else 0.0

        if streak_ratio > 0.40 or forward_ratio > 0.85: 
            focus_consistency_raw = 6
            feedback.append("Excellent eye contact! You held strong, continuous focus directly with the camera.")
        elif streak_ratio > 0.20 or forward_ratio > 0.65: 
            focus_consistency_raw = 4
            feedback.append("Maintain longer periods of uninterrupted audience focus between slides.")
        else: 
            focus_consistency_raw = 2
            feedback.append("Your focus is highly fragmented. Try anchoring your gaze for full sentences.")

        # Assemble and clamp raw points inside 0-30 ecosystem boundaries
        raw_points = head_direction_raw + looking_forward_raw + head_stability_raw + visibility_raw + focus_consistency_raw
        raw_points = max(0, min(30, raw_points))

        # Apply exact formula floor constraint logic requested
        eye_contact_score = 70 + raw_points

        # Default fallback catch to append context if list remains blank
        if not feedback:
            feedback.append("Solid overall engagement layout.")

        return {
            "eye_contact_score": int(eye_contact_score),
            "raw_points": int(raw_points),
            "breakdown": {
                "head_direction": int(head_direction_raw),
                "looking_forward": int(looking_forward_raw),
                "head_stability": int(head_stability_raw),
                "visibility": int(visibility_raw),
                "focus_consistency": int(focus_consistency_raw)
            },
            "statistics": {
                "yaw_std": float(round(yaw_std, 4)),
                "pitch_std": float(round(pitch_std, 4)),
                "visibility_ratio": float(round(visibility_ratio, 3)),
                "forward_ratio": float(round(forward_ratio, 3))
            },
            "feedback": feedback
        }

    def _get_empty_metrics(self, error_message):
        """
        Ensures perfect schema matching output even if error conditions occur.
        """
        return {
            "eye_contact_score": 70,
            "raw_points": 0,
            "breakdown": {
                "head_direction": 0,
                "looking_forward": 0,
                "head_stability": 0,
                "visibility": 0,
                "focus_consistency": 0
            },
            "statistics": {
                "yaw_std": 0.0,
                "pitch_std": 0.0,
                "visibility_ratio": 0.0,
                "forward_ratio": 0.0
            },
            "feedback": [error_message]
        }