import os
import cv2
import numpy as np
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

def analyze_body_language(video_path):
    """
    Top-level function exposed for analyzer.py to import directly.
    Exposes: from ai.body_language import analyze_body_language
    """
    analyzer = BodyLanguageAnalyzer()
    return analyzer.analyze_video(video_path)

class BodyLanguageAnalyzer:
    def __init__(self):
        # Configure the modern MediaPipe Tasks API
        self.model_path = os.path.join(os.path.dirname(__file__), 'pose_landmarker_full.task')

    def analyze_video(self, video_path):
        """
        Executes an advanced computer-vision analysis covering distinct metrics:
        Head Stability, Slouching, Proximity Drift, Gesture Velocity, Symmetry, 
        Confidence Posture, Head Orientation, Jumps/Jerks, and Idle Time.
        """
        try:
            # Handle model existence verification safely without crashing
            if not os.path.exists(self.model_path):
                return {
                    "body_language_score": 70,
                    "raw_points": 0,
                    "breakdown": {"posture": 0, "centering": 0, "head_stability": 0, "gestures": 0, "visibility": 0},
                    "feedback": ["Pose model not found."],
                    "success": False
                }

            base_options = python.BaseOptions(model_asset_path=self.model_path)
            options = vision.PoseLandmarkerOptions(
                base_options=base_options,
                output_segmentation_masks=False,
                running_mode=vision.RunningMode.VIDEO
            )
            landmarker = vision.PoseLandmarker.create_from_options(options)

            cap = cv2.VideoCapture(video_path)
            if not cap.isOpened():
                landmarker.close()
                return self._get_empty_metrics("Could not open video file.")

            fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
            
            # Core data tracking arrays
            head_x, head_y = [], []
            shoulder_y_diffs, nose_to_shoulder_y = [], []
            shoulder_distances = []
            left_wrist_x, left_wrist_y = [], []
            right_wrist_x, right_wrist_y = [], []
            shoulder_hip_distances = []
            
            # Temporal velocity tracking variables
            prev_nose_x, prev_nose_y = None, None
            frame_velocities = []
            
            frame_count = 0
            visible_frames = 0
            total_analyzed = 0
            x_positions = []

            while cap.isOpened():
                ret, frame = cap.read()
                if not ret:
                    break
                
                frame_count += 1
                # Downsample to save local CPU/GPU cycles while ensuring tracking fidelity
                if frame_count % 3 != 0:
                    continue

                total_analyzed += 1

                # Convert BGR image frame to MediaPipe's Image object
                rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)
                
                # Timestamp in milliseconds required for Video mode
                frame_timestamp_ms = int((frame_count / fps) * 1000)
                detection_result = landmarker.detect_for_video(mp_image, frame_timestamp_ms)

                if detection_result.pose_landmarks and len(detection_result.pose_landmarks) > 0:
                    visible_frames += 1
                    # Grab the primary person visible in frame
                    landmarks = detection_result.pose_landmarks[0]

                    # Map crucial tracking landmarks based on MediaPipe structural mappings
                    nose = landmarks[0]
                    left_shoulder, right_shoulder = landmarks[11], landmarks[12]
                    left_wrist, right_wrist = landmarks[15], landmarks[16]
                    left_hip, right_hip = landmarks[23], landmarks[24]

                    # Ensure visibility profiles are healthy enough to record data coordinates
                    if nose.visibility > 0.5:
                        head_x.append(nose.x)
                        head_y.append(nose.y)
                        x_positions.append(nose.x)
                        
                        # Compute frame-to-frame sudden jerks/velocity transitions
                        if prev_nose_x is not None and prev_nose_y is not None:
                            vel = np.sqrt((nose.x - prev_nose_x)**2 + (nose.y - prev_nose_y)**2)
                            frame_velocities.append(vel)
                        prev_nose_x, prev_nose_y = nose.x, nose.y

                    if left_shoulder.visibility > 0.5 and right_shoulder.visibility > 0.5:
                        shoulder_y_diffs.append(abs(left_shoulder.y - right_shoulder.y))
                        avg_sh_y = (left_shoulder.y + right_shoulder.y) / 2
                        nose_to_shoulder_y.append(avg_sh_y - nose.y)
                        
                        # 3D Distance proxy tracking camera proximity/drift changes
                        sh_dist = np.sqrt((left_shoulder.x - right_shoulder.x)**2 + (left_shoulder.y - right_shoulder.y)**2)
                        shoulder_distances.append(sh_dist)

                    # Append wrist tracking data frames for symmetry and velocity evaluation
                    if left_wrist.visibility > 0.5:
                        left_wrist_x.append(left_wrist.x)
                        left_wrist_y.append(left_wrist.y)
                    if right_wrist.visibility > 0.5:
                        right_wrist_x.append(right_wrist.x)
                        right_wrist_y.append(right_wrist.y)

                    # Confidence Expansion: Distance between shoulder center and hip center
                    if left_shoulder.visibility > 0.5 and left_hip.visibility > 0.5:
                        avg_sh_x = (left_shoulder.x + right_shoulder.x) / 2
                        avg_hip_x = (left_hip.x + right_hip.x) / 2
                        avg_hip_y = (left_hip.y + right_hip.y) / 2
                        torso_dist = np.sqrt((avg_sh_x - avg_hip_x)**2 + (avg_sh_y - avg_hip_y)**2)
                        shoulder_hip_distances.append(torso_dist)

            cap.release()
            landmarker.close()

            if visible_frames == 0 or total_analyzed == 0:
                return self._get_empty_metrics("No speaker detected in the video clip.")

            return self._calculate_advanced_scores(
                head_x, head_y, shoulder_y_diffs, nose_to_shoulder_y, shoulder_distances,
                left_wrist_x, left_wrist_y, right_wrist_x, right_wrist_y,
                shoulder_hip_distances, frame_velocities, x_positions, visible_frames, total_analyzed
            )
        except Exception as e:
            return {
                "body_language_score": 70,
                "raw_points": 0,
                "breakdown": {"posture": 0, "centering": 0, "head_stability": 0, "gestures": 0, "visibility": 0},
                "feedback": [str(e)],
                "success": False
            }

    def _calculate_advanced_scores(self, head_x, head_y, shoulder_y_diffs, nose_to_shoulder_y, shoulder_distances,
                                   left_wrist_x, left_wrist_y, right_wrist_x, right_wrist_y,
                                   shoulder_hip_distances, frame_velocities, x_positions, visible_frames, total_analyzed):
        
        feedback = []

        # 1. Posture & Slouching Calibration (Max 6 points)
        avg_slope = np.mean(shoulder_y_diffs) if shoulder_y_diffs else 0.0
        avg_drop = np.mean(nose_to_shoulder_y) if nose_to_shoulder_y else 0.2
        # Penalize if shoulders are crooked or nose drops significantly toward chest line
        if avg_slope < 0.03 and avg_drop > 0.15:
            posture_raw = 6
            feedback.append("Excellent alignment. Your upper torso posture and head height remained steady.")
        elif avg_slope < 0.05 and avg_drop > 0.11:
            posture_raw = 4
            feedback.append("Moderate posture. Try to lift your chin slightly to avoid minor slouching trends.")
        else:
            posture_raw = 2
            feedback.append("Noticeable slouching or asymmetric leaning observed. Ground your shoulders evenly.")

        # 2. Centering & Pacing Drift Stability (Max 6 points)
        avg_x = np.mean(x_positions) if x_positions else 0.5
        dev_from_center = abs(avg_x - 0.5)
        x_std = np.std(x_positions) if x_positions else 0.0
        
        if dev_from_center < 0.10 and (0.01 <= x_std <= 0.06):
            pacing_raw = 6
            feedback.append("Great spatial handling. You kept your position centralized with balanced pacing movement.")
        elif x_std < 0.01:
            pacing_raw = 4
            feedback.append("Your physical staging is highly centered but looks static. Incorporate natural weight shifts.")
        else:
            pacing_raw = 3
            feedback.append("Excessive side-to-side drift detected. Focus on grounding yourself during key transitions.")

        # 3. Head Stability & Eye Contact/Orientation Proxy (Max 6 points)
        head_x_std = np.std(head_x) if head_x else 0.0
        head_y_std = np.std(head_y) if head_y else 0.0
        # High variation means excessive bobbing/nodding or side turning away from camera axis
        if head_x_std < 0.025 and head_y_std < 0.025:
            stability_raw = 6
            feedback.append("Superb head stability. You maintained clear, reliable orientation toward the audience.")
        elif head_x_std < 0.05 and head_y_std < 0.05:
            stability_raw = 4
            feedback.append("Minor head bobbing detected. Focus on stabilizing your eye-level path.")
        else:
            stability_raw = 2
            feedback.append("Frequent or rapid head movement/turning noted. Anchor your gaze forward.")

        # 4. Gesture Expressiveness & Symmetry Dynamics (Max 6 points)
        l_movement = np.sum(np.sqrt(np.diff(left_wrist_x)**2 + np.diff(left_wrist_y)**2)) if len(left_wrist_x) > 1 else 0
        r_movement = np.sum(np.sqrt(np.diff(right_wrist_x)**2 + np.diff(right_wrist_y)**2)) if len(right_wrist_x) > 1 else 0
        total_gesture_velocity = l_movement + r_movement
        
        # Symmetry index (closer to 1.0 means perfectly equal arm usage, near 0.0 means one dead arm)
        symmetry_ratio = min(l_movement, r_movement) / max(l_movement, r_movement) if max(l_movement, r_movement) > 0 else 1.0
        
        if 0.5 <= total_gesture_velocity <= 2.5 and symmetry_ratio > 0.4:
            gesture_raw = 6
            feedback.append("Fluid, symmetrical hand gestures! Both arms moved purposefully to drive emphasis.")
        elif total_gesture_velocity < 0.5:
            gesture_raw = 3
            feedback.append("Stiff arm presence detected. Bring your hands up to illustrate your key structural topics.")
        elif symmetry_ratio <= 0.4 and total_gesture_velocity >= 0.5:
            gesture_raw = 4
            feedback.append("Asymmetric gesturing. You heavily favored one hand; try using both naturally.")
        else:
            gesture_raw = 3
            feedback.append("Frantic or highly repetitive arm movement patterns recorded. Slow down your gestures.")

        # 5. Proximity Drift & Frame Visibility Velocity (Max 6 points)
        dist_std = np.std(shoulder_distances) if shoulder_distances else 0.0
        max_jerk = np.max(frame_velocities) if frame_velocities else 0.0
        visibility_ratio = visible_frames / total_analyzed

        if dist_std < 0.03 and max_jerk < 0.05 and visibility_ratio > 0.95:
            proximity_raw = 6
        elif max_jerk >= 0.05:
            proximity_raw = 4
            feedback.append("Watch out for abrupt, sudden frame jerks or fast shifts away from your baseline position.")
        else:
            proximity_raw = 3
            feedback.append("Significant back-and-forth structural camera depth movement detected.")

        # Aggregate core points into the custom 0-30 scoring ecosystem
        raw_score = posture_raw + pacing_raw + stability_raw + gesture_raw + proximity_raw
        raw_score = max(0, min(30, raw_score))
        
        # Apply the exact baseline formula requested
        final_score = 70 + raw_score

        return {
            "body_language_score": int(final_score),
            "raw_points": int(raw_score),
            "breakdown": {
                "posture": int(posture_raw),
                "centering": int(pacing_raw),
                "head_stability": int(stability_raw),
                "gestures": int(gesture_raw),
                "visibility": int(proximity_raw)
            },
            "statistics": {
                "average_shoulder_slope": float(round(avg_slope, 4)),
                "movement_std": float(round(x_std, 4)),
                "head_movement_std": float(round(head_x_std, 4)),
                "gesture_symmetry_ratio": float(round(symmetry_ratio, 3)),
                "proximity_drift_std": float(round(dist_std, 4)),
                "peak_jerk_velocity": float(round(max_jerk, 4))
            },
            "feedback": feedback,
            "success": True
        }

    def _get_empty_metrics(self, error_message):
        return {
            "body_language_score": 70,
            "raw_points": 0,
            "breakdown": {"posture": 0, "centering": 0, "head_stability": 0, "gestures": 0, "visibility": 0},
            "statistics": {"average_shoulder_slope": 0.0, "movement_std": 0.0, "head_movement_std": 0.0, "gesture_symmetry_ratio": 1.0, "proximity_drift_std": 0.0, "peak_jerk_velocity": 0.0},
            "feedback": [error_message, "Ensure your presentation setting is clear and your complete upper body profile stays framed."],
            "success": False
        }