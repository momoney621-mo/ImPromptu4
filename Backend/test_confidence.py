import whisper
from ai.confidence import analyze_confidence

model = whisper.load_model("base")

video_path = "uploads/test.mp4"

print("Transcribing...")

result = model.transcribe(video_path)

transcript = result["text"]

print("\nTranscript:")
print(transcript)

print("\nRunning confidence analysis...")

results = analyze_confidence(video_path, transcript)

print("\nConfidence Results:")
print(results)