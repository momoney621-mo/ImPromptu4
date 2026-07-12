import librosa
import numpy as np
import subprocess
import tempfile
import os


# --------------------------------------------------
# Audio Extraction
# --------------------------------------------------

def extract_audio(video_path):

    temp_audio = tempfile.NamedTemporaryFile(
        suffix=".wav",
        delete=False
    ).name

    subprocess.run([
        "ffmpeg",
        "-y",
        "-i",
        video_path,
        "-vn",
        "-ac",
        "1",
        "-ar",
        "16000",
        temp_audio
    ],
    stdout=subprocess.DEVNULL,
    stderr=subprocess.DEVNULL)

    return temp_audio


# --------------------------------------------------
# Voice Clarity Analyzer
# --------------------------------------------------

def analyze_voice_clarity(video_path):

    try:

        audio_path = extract_audio(video_path)

        y, sr = librosa.load(
            audio_path,
            sr=16000
        )

        if len(y) == 0:

            return {
                "voice_clarity_score": 70
            }

        # -----------------------------------------
        # RMS Energy
        # -----------------------------------------

        rms = librosa.feature.rms(y=y)[0]

        avg_volume = np.mean(rms)

        if avg_volume > 0.12:
            volume_points = 6
        elif avg_volume > 0.08:
            volume_points = 5
        elif avg_volume > 0.05:
            volume_points = 4
        elif avg_volume > 0.03:
            volume_points = 3
        else:
            volume_points = 1

        # -----------------------------------------
        # Voice Stability
        # -----------------------------------------

        variation = np.std(rms)

        if variation < 0.02:
            stability_points = 6
        elif variation < 0.04:
            stability_points = 5
        elif variation < 0.06:
            stability_points = 4
        elif variation < 0.08:
            stability_points = 3
        else:
            stability_points = 1

        # -----------------------------------------
        # Silence Detection
        # -----------------------------------------

        silence = np.sum(rms < 0.01)

        silence_ratio = silence / len(rms)

        if silence_ratio < 0.10:
            silence_points = 6
        elif silence_ratio < 0.20:
            silence_points = 5
        elif silence_ratio < 0.30:
            silence_points = 4
        elif silence_ratio < 0.40:
            silence_points = 3
        else:
            silence_points = 1

        # -----------------------------------------
        # Spectral Clarity
        # -----------------------------------------

        centroid = librosa.feature.spectral_centroid(
            y=y,
            sr=sr
        )[0]

        avg_centroid = np.mean(centroid)

        if 1000 < avg_centroid < 3000:
            clarity_points = 6
        elif 700 < avg_centroid < 3500:
            clarity_points = 5
        elif 500 < avg_centroid < 4000:
            clarity_points = 4
        else:
            clarity_points = 2

        # -----------------------------------------
        # Zero Crossing Rate
        # -----------------------------------------

        zcr = librosa.feature.zero_crossing_rate(y)[0]

        avg_zcr = np.mean(zcr)

        if 0.03 <= avg_zcr <= 0.10:
            articulation_points = 6
        elif 0.02 <= avg_zcr <= 0.12:
            articulation_points = 5
        elif 0.01 <= avg_zcr <= 0.15:
            articulation_points = 4
        else:
            articulation_points = 2

        # -----------------------------------------
        # Raw Score (0-30)
        # -----------------------------------------

        raw_points = (
            volume_points +
            stability_points +
            silence_points +
            clarity_points +
            articulation_points
        )

        raw_points = max(0, min(30, raw_points))

        voice_clarity_score = 70 + raw_points

        os.remove(audio_path)

        return {

            "voice_clarity_score": voice_clarity_score,

            "raw_points": raw_points,

            "breakdown": {

                "volume": volume_points,

                "stability": stability_points,

                "silence": silence_points,

                "spectral_clarity": clarity_points,

                "articulation": articulation_points

            },

            "statistics": {

                "average_volume": round(float(avg_volume),4),

                "variation": round(float(variation),4),

                "silence_ratio": round(float(silence_ratio),3),

                "spectral_centroid": round(float(avg_centroid),1),

                "zero_crossing_rate": round(float(avg_zcr),4)

            }

        }

    except Exception as e:

        print("Voice Clarity Error:", e)

        return {

            "voice_clarity_score":70,

            "raw_points":0,

            "breakdown":{},

            "statistics":{}

        }