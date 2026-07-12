from ai.speaking_pace import analyze_speaking_pace

video_path = "uploads/test.mp4"

score = analyze_speaking_pace(video_path)

print(f"Speaking Pace Score: {score}")