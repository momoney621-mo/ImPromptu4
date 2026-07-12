"""
SpeakUp AI
AI Pipeline

Runs every AI model and combines
the results into one report.
"""

from speaking_pace import analyze_speaking_pace
from eye_contact import analyze_eye_contact
from body_language import analyze_body_language
from voice_clarity import analyze_voice_clarity
from organization import analyze_organization
from confidence import analyze_confidence
from overall_score import calculate_score


def analyze(video_path):

    try:

        # -------------------------------
        # Speech to Text + Speaking Pace
        # -------------------------------

        transcript, pace, duration = analyze_speaking_pace(video_path)

        # -------------------------------
        # Computer Vision
        # -------------------------------

        eye = analyze_eye_contact(video_path)

        body = analyze_body_language(video_path)

        # -------------------------------
        # LLM Analysis
        # -------------------------------

        clarity = analyze_voice_clarity(transcript)

        organization = analyze_organization(transcript)

        confidence = analyze_confidence(
            transcript,
            eye,
            body,
            pace
        )

        # -------------------------------
        # Overall Score
        # -------------------------------

        overall = calculate_score(
            eye,
            confidence,
            clarity,
            pace,
            body,
            organization
        )

        # -------------------------------
        # Return Everything
        # -------------------------------

        return {

            "success": True,

            "overall": overall,

            "eyeContact": eye,

            "confidence": confidence,

            "voiceClarity": clarity,

            "speakingPace": pace,

            "bodyLanguage": body,

            "organization": organization,

            "duration": duration,

            "transcript": transcript

        }

    except Exception as e:

        return {

            "success": False,

            "error": str(e)

        }