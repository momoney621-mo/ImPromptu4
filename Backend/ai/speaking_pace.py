import re


def analyze_speaking_pace(transcript, video_path=None):
    """
    Analyze speaking pace using an existing transcript.

    video_path is optional and ignored.
    It is kept only so analyzer.py doesn't need to change.
    """

    # ----------------------------
    # Get transcript text
    # ----------------------------

    if isinstance(transcript, dict):
        transcript = transcript.get("transcript", "")

    transcript = str(transcript).strip()

    # ----------------------------
    # Count words
    # ----------------------------

    words = re.findall(r"\b[\w']+\b", transcript)

    total_words = len(words)

    # ----------------------------
    # Estimate speaking duration
    # Average speaking speed = 150 WPM
    # ----------------------------

    if total_words == 0:
        duration_minutes = 1 / 60
    else:
        duration_minutes = total_words / 150

    duration_seconds = duration_minutes * 60

    # ----------------------------
    # Calculate WPM
    # ----------------------------

    wpm = total_words / max(duration_minutes, 0.0001)

    # ----------------------------
    # Speaking Pace Score
    # ----------------------------

    if 130 <= wpm <= 160:
        score = 100

    elif 120 <= wpm < 130:
        score = 96 - ((130 - wpm) * 0.8)

    elif 160 < wpm <= 170:
        score = 96 - ((wpm - 160) * 0.8)

    elif 100 <= wpm < 120:
        score = 80 - ((120 - wpm) * 1)

    elif 170 < wpm <= 200:
        score = 80 - ((wpm - 170) * 1)

    elif 80 <= wpm < 100:
        score = 60 - ((100 - wpm) * 0.75)

    elif 200 < wpm <= 220:
        score = 60 - ((wpm - 200) * 0.75)

    else:
        score = 40

    score = max(0, min(100, round(score)))

    print("\n========== SPEAKING PACE ==========")
    print(f"Words: {total_words}")
    print(f"WPM: {wpm:.2f}")
    print(f"Score: {score}")
    print("===================================\n")

    return {
        "speaking_pace_score": score,
        "wpm": round(wpm, 2),
        "duration": round(duration_seconds, 2),
        "words": total_words,
        "transcript": transcript
    }