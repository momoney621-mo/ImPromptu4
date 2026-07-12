from ai.body_language import BodyLanguageAnalyzer

analyzer = BodyLanguageAnalyzer()

result = analyzer.analyze_video("uploads/test.mp4")

print(result)