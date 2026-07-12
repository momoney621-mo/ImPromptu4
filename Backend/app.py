"""
==========================================
SpeakUp AI Backend Server
Main Flask Application
==========================================
"""

import json
import os

from flask import Flask, request, jsonify
from flask_cors import CORS

from upload import save_uploaded_video

# AI Modules
from ai.analyzer import analyze_video
from ai.whisper import transcribe_video


# ==========================================
# Flask App
# ==========================================

app = Flask(__name__)

CORS(
    app,
    resources={
        r"/*": {
            "origins": [
                "http://127.0.0.1:8000",
                "http://localhost:8000",
                "http://127.0.0.1:5500",
                "http://localhost:5500"
            ]
        }
    }
)


# ==========================================
# Paths
# ==========================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")

LATEST_RESULTS_FILE = os.path.join(
    BASE_DIR,
    "latest_results.json"
)

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


# ==========================================
# Save Latest Results
# ==========================================

def save_latest_results(results):

    try:

        with open(
            LATEST_RESULTS_FILE,
            "w",
            encoding="utf-8"
        ) as file:

            json.dump(
                results,
                file,
                indent=4
            )

        print("Latest results saved successfully.")

    except Exception as error:

        print(
            "Could not save latest results:",
            error
        )


# ==========================================
# Home Route
# ==========================================

@app.route("/")
def home():

    return jsonify({

        "message": "SpeakUp AI Backend Running",

        "status": "success"

    })


# ==========================================
# Health Check
# ==========================================

@app.route("/health")
def health():

    return jsonify({

        "server": "online",

        "ai": "ready"

    })


# ==========================================
# Upload Route
# ==========================================

@app.route("/upload", methods=["POST"])
def upload_video():

    if "video" not in request.files:

        return jsonify({

            "success": False,

            "message": "No video uploaded."

        }), 400

    video = request.files["video"]

    if video.filename == "":

        return jsonify({

            "success": False,

            "message": "No file selected."

        }), 400

    try:

        video_path = save_uploaded_video(

            video,

            app.config["UPLOAD_FOLDER"]

        )

        return jsonify({

            "success": True,

            "filepath": video_path

        }), 200

    except Exception as error:

        print("Upload Error:", error)

        return jsonify({

            "success": False,

            "message": str(error)

        }), 500


# ==========================================
# Analyze Speech
# ==========================================

@app.route("/analyze", methods=["POST"])
def analyze_speech():

    if "video" not in request.files:

        return jsonify({

            "success": False,

            "message": "No video uploaded."

        }), 400

    video = request.files["video"]

    if video.filename == "":

        return jsonify({

            "success": False,

            "message": "No file selected."

        }), 400

    try:

        # ------------------------------------
        # Save Video
        # ------------------------------------

        video_path = save_uploaded_video(

            video,

            app.config["UPLOAD_FOLDER"]

        )

        print("Saved video:", video_path)

        # ------------------------------------
        # Generate Transcript
        # ------------------------------------

        transcript_data = transcribe_video(video_path)

        if isinstance(transcript_data, dict):

            transcript = transcript_data.get(
                "transcript",
                ""
            )

        else:

            transcript = str(transcript_data)

            transcript_data = {

                "transcript": transcript

            }

        # ------------------------------------
        # Analyze Video
        # ------------------------------------

        results = analyze_video(

            video_path,

            transcript

        )

        if not isinstance(results, dict):

            raise TypeError(
                "analyze_video() must return a dictionary."
            )

        # ------------------------------------
        # Build Frontend Response
        # ------------------------------------

        response = {

            "success": True,

            "overall_score": results.get(
                "overall_score",
                70
            ),

            "eye_contact": results.get(
                "eye_contact_score",
                results.get("eye_contact", 70)
            ),

            "confidence": results.get(
                "confidence_score",
                results.get("confidence", 70)
            ),

            "voice_clarity": results.get(
                "voice_clarity_score",
                results.get("voice_clarity", 70)
            ),

            "speaking_pace": results.get(
                "speaking_pace_score",
                results.get("speaking_pace", 70)
            ),

            "body_language": results.get(
                "body_language_score",
                results.get("body_language", 70)
            ),

            "organization": results.get(
                "organization_score",
                results.get("organization", 70)
            ),

            "transcript": transcript_data,

            "suggestion": results.get(
                "suggestion",
                "Great job! Keep practicing to improve your presentation skills."
            )

        }

        # ------------------------------------
        # Print Results
        # ------------------------------------

        print("\n========== FINAL RESPONSE ==========")
        print(response)
        print("====================================\n")

        # ------------------------------------
        # Save Results for Frontend Backup
        # ------------------------------------

        save_latest_results(response)

        return jsonify(response), 200

    except Exception as error:

        print("\n========== ANALYZE ERROR ==========")
        print(repr(error))
        print("===================================\n")

        return jsonify({

            "success": False,

            "message": str(error)

        }), 500


# ==========================================
# Latest Results Route
# ==========================================

@app.route("/latest-results", methods=["GET"])
def latest_results():

    if not os.path.exists(LATEST_RESULTS_FILE):

        return jsonify({

            "success": False,

            "message": "No analysis results are available yet."

        }), 404

    try:

        with open(
            LATEST_RESULTS_FILE,
            "r",
            encoding="utf-8"
        ) as file:

            results = json.load(file)

        return jsonify(results), 200

    except Exception as error:

        print("Latest Results Error:", error)

        return jsonify({

            "success": False,

            "message": str(error)

        }), 500


# ==========================================
# Start Server
# ==========================================

if __name__ == "__main__":

    app.run(

        host="0.0.0.0",

        port=5000,

        debug=True,

        use_reloader=False

    )