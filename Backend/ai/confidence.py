import librosa
import numpy as np
import subprocess
import tempfile
import os


# =====================================================
# Extract Audio
# =====================================================

def extract_audio(video_path):

    audio_file = tempfile.NamedTemporaryFile(
        suffix=".wav",
        delete=False
    ).name

    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-i",
            video_path,
            "-vn",
            "-ac",
            "1",
            "-ar",
            "16000",
            audio_file
        ],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )

    return audio_file


# =====================================================
# Confidence Analyzer
# =====================================================

def analyze_confidence(video_path, transcript):

    try:

        audio_path = extract_audio(video_path)

        y, sr = librosa.load(
            audio_path,
            sr=16000
        )

        rms = librosa.feature.rms(y=y)[0]

        ##################################################
        # Voice Strength (0-8)
        ##################################################

        avg_volume = float(np.mean(rms))

        if avg_volume >= 0.12:
            volume_points = 8
        elif avg_volume >= 0.10:
            volume_points = 7
        elif avg_volume >= 0.08:
            volume_points = 6
        elif avg_volume >= 0.06:
            volume_points = 5
        elif avg_volume >= 0.04:
            volume_points = 3
        else:
            volume_points = 1

        ##################################################
        # Voice Stability (0-8)
        ##################################################

        variation = float(np.std(rms))

        if variation <= 0.020:
            stability_points = 8
        elif variation <= 0.030:
            stability_points = 7
        elif variation <= 0.040:
            stability_points = 6
        elif variation <= 0.050:
            stability_points = 5
        elif variation <= 0.070:
            stability_points = 3
        else:
            stability_points = 1

        ##################################################
        # Filler Words (0-8)
        ##################################################

        text = transcript.lower()

        fillers = [
            "um",
            "uh",
            "like",
            "actually",
            "basically",
            "you know",
            "i mean",
            "sort of",
            "kind of"
        ]

        filler_count = 0

        for word in fillers:
            filler_count += text.count(word)

        total_words = max(1, len(text.split()))

        filler_rate = filler_count / total_words

        if filler_rate <= 0.01:
            filler_points = 8
        elif filler_rate <= 0.02:
            filler_points = 7
        elif filler_rate <= 0.03:
            filler_points = 6
        elif filler_rate <= 0.05:
            filler_points = 5
        elif filler_rate <= 0.08:
            filler_points = 3
        else:
            filler_points = 1

        ##################################################
        # Speaking Rate Confidence (0-6)
        ##################################################

        duration = librosa.get_duration(y=y, sr=sr)

        wpm = total_words / max(duration / 60, 1e-6)

        if 120 <= wpm <= 160:
            pace_points = 6
        elif 110 <= wpm <= 170:
            pace_points = 5
        elif 100 <= wpm <= 180:
            pace_points = 4
        elif 90 <= wpm <= 190:
            pace_points = 3
        elif 80 <= wpm <= 210:
            pace_points = 2
        else:
            pace_points = 1

        ##################################################
        # Final Score
        ##################################################

        raw_points = (
            volume_points +
            stability_points +
            filler_points +
            pace_points
        )

        raw_points = max(0, min(30, raw_points))

        confidence_score = 70 + raw_points

        os.remove(audio_path)

        return {
            "confidence_score": confidence_score,
            "raw_points": raw_points,
            "voice_strength": volume_points,
            "voice_stability": stability_points,
            "filler_words": filler_points,
            "speaking_rate": pace_points,
            "average_volume": round(avg_volume, 4),
            "volume_variation": round(variation, 4),
            "words_per_minute": round(wpm, 1),
            "filler_count": filler_count
        }

    except Exception as e:

        print("Confidence Error:", e)

        return {
            "confidence_score": 70,
            "raw_points": 0
        }