"""
==========================================
ImPromptU
Whisper Speech Transcription Module
==========================================
"""

import whisper
import re
from collections import Counter

# ----------------------------------------
# Load Whisper Once
# ----------------------------------------

print("Loading Whisper model...")

model = whisper.load_model("base")

print("Whisper model loaded successfully!")

# ----------------------------------------
# Filler Words
# ----------------------------------------

FILLER_WORDS = [

    "um",
    "uh",
    "like",
    "you know",
    "actually",
    "basically",
    "literally",
    "so",
    "well"

]

# ----------------------------------------
# Main Function
# ----------------------------------------

def transcribe_video(video_path):

    """
    Transcribes a video and returns
    useful speech statistics.
    """

    result = model.transcribe(video_path)

    transcript = result["text"].strip()

    segments = result["segments"]

    # ------------------------------------
    # Speaking Time
    # ------------------------------------

    if len(segments) > 0:

        duration = segments[-1]["end"]

    else:

        duration = 0

    minutes = duration / 60

    # ------------------------------------
    # Word Count
    # ------------------------------------

    words = re.findall(r"\b[\w']+\b", transcript)

    word_count = len(words)

    # ------------------------------------
    # Speaking Pace
    # ------------------------------------

    if minutes > 0:

        wpm = round(word_count / minutes)

    else:

        wpm = 0

    # ------------------------------------
    # Filler Words
    # ------------------------------------

    lower_text = transcript.lower()

    filler_counter = {}

    total_fillers = 0

    for word in FILLER_WORDS:

        count = lower_text.count(word)

        filler_counter[word] = count

        total_fillers += count

    # ------------------------------------
    # Speaking Time Format
    # ------------------------------------

    mins = int(duration // 60)

    secs = int(duration % 60)

    formatted_time = f"{mins:02}:{secs:02}"

    # ------------------------------------
    # Return Everything
    # ------------------------------------

    return {

        "transcript": transcript,

        "duration_seconds": round(duration, 2),

        "speaking_time": formatted_time,

        "word_count": word_count,

        "words_per_minute": wpm,

        "total_fillers": total_fillers,

        "filler_breakdown": filler_counter

    }