from ai.eye_contact import analyze_eye_contact
from ai.confidence import analyze_confidence
from ai.voice_clarity import analyze_voice_clarity
from ai.speaking_pace import analyze_speaking_pace
from ai.body_language import analyze_body_language
from ai.organization import analyze_organization


def analyze_video(video_path, transcript):

    # -----------------------------
    # Eye Contact
    # -----------------------------
    try:
        eye_result = analyze_eye_contact(video_path)
        eye_score = eye_result.get("eye_contact_score", 70)
    except Exception as e:
        print("Eye Contact Error:", e)
        eye_result = {}
        eye_score = 70

    # -----------------------------
    # Confidence
    # -----------------------------
    try:
        confidence_result = analyze_confidence(
            video_path,
            transcript
        )
        confidence_score = confidence_result.get(
            "confidence_score",
            70
        )
    except Exception as e:
        print("Confidence Error:", e)
        confidence_result = {}
        confidence_score = 70

    # -----------------------------
    # Voice Clarity
    # -----------------------------
    try:
        voice_result = analyze_voice_clarity(video_path)
        voice_score = voice_result.get(
            "voice_clarity_score",
            70
        )
    except Exception as e:
        print("Voice Clarity Error:", e)
        voice_result = {}
        voice_score = 70

    # -----------------------------
    # Speaking Pace
    # -----------------------------
    try:
        pace_result = analyze_speaking_pace(
            transcript,
            video_path
        )
        pace_score = pace_result.get(
            "speaking_pace_score",
            70
        )
    except Exception as e:
        print("Speaking Pace Error:", e)
        pace_result = {}
        pace_score = 70

    # -----------------------------
    # Body Language
    # -----------------------------
    try:
        body_result = analyze_body_language(video_path)
        body_score = body_result.get(
            "body_language_score",
            70
        )
    except Exception as e:
        print("Body Language Error:", e)
        body_result = {}
        body_score = 70

    # -----------------------------
    # Organization
    # -----------------------------
    try:
        organization_result = analyze_organization(
            transcript
        )
        organization_score = organization_result.get(
            "organization_score",
            70
        )
    except Exception as e:
        print("Organization Error:", e)
        organization_result = {}
        organization_score = 70

    # ==========================================
    # DEBUG OUTPUT
    # ==========================================

    print("\n========== AI RESULTS ==========")
    print("Eye Contact:", eye_result)
    print("Confidence:", confidence_result)
    print("Voice Clarity:", voice_result)
    print("Speaking Pace:", pace_result)
    print("Body Language:", body_result)
    print("Organization:", organization_result)
    print("================================\n")

    # -----------------------------
    # Overall Score
    # -----------------------------
    overall_score = round(
        (
            eye_score +
            confidence_score +
            voice_score +
            pace_score +
            body_score +
            organization_score
        ) / 6
    )

    # -----------------------------
    # Suggestions
    # -----------------------------
    scores = {
        "Eye Contact": eye_score,
        "Confidence": confidence_score,
        "Voice Clarity": voice_score,
        "Speaking Pace": pace_score,
        "Body Language": body_score,
        "Organization": organization_score
    }

    weakest = min(scores, key=scores.get)

    suggestion = f"Focus on improving your {weakest.lower()}."

    # -----------------------------
    # Return Results
    # -----------------------------
    return {

        "overall_score": overall_score,

        "eye_contact_score": eye_score,

        "confidence_score": confidence_score,

        "voice_clarity_score": voice_score,

        "speaking_pace_score": pace_score,

        "body_language_score": body_score,

        "organization_score": organization_score,

        "suggestion": suggestion,

        "breakdown": scores

    }