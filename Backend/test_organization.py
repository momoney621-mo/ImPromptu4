from ai.organization import analyze_organization


text = """
First I worked on a machine learning project.
The challenge was improving accuracy.
I used data analysis and testing.
The result was a better model.
Finally I learned how important teamwork is.
"""


result = analyze_organization(text)

print(result)