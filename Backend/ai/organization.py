import re


def analyze_organization(transcript):

    if not transcript or len(transcript.strip()) == 0:
        return {
            "organization_score": 70
        }

    text = transcript.lower()

    raw_points = 0

    # ----------------------------------
    # Introduction (0-6)
    # ----------------------------------

    intro_patterns = [
        "today",
        "i'm going to",
        "i will",
        "i'll",
        "my topic",
        "i want to talk",
        "i will discuss",
        "i will cover"
    ]

    intro_score = 0

    if any(p in text for p in intro_patterns):
        intro_score = 6
    elif "hello" in text or "good morning" in text:
        intro_score = 4

    raw_points += intro_score

    # ----------------------------------
    # Body Structure (0-8)
    # ----------------------------------

    markers = [
        "first",
        "firstly",
        "second",
        "secondly",
        "third",
        "thirdly",
        "finally",
        "next",
        "another",
        "lastly"
    ]

    marker_count = sum(text.count(m) for m in markers)

    if marker_count >= 5:
        body_score = 8
    elif marker_count >= 3:
        body_score = 6
    elif marker_count >= 1:
        body_score = 4
    else:
        body_score = 2

    raw_points += body_score

    # ----------------------------------
    # Transitions (0-6)
    # ----------------------------------

    transitions = [
        "however",
        "therefore",
        "because",
        "also",
        "additionally",
        "furthermore",
        "for example",
        "on the other hand",
        "moving on",
        "as a result",
        "in addition"
    ]

    transition_count = sum(text.count(t) for t in transitions)

    if transition_count >= 5:
        transition_score = 6
    elif transition_count >= 3:
        transition_score = 5
    elif transition_count >= 1:
        transition_score = 3
    else:
        transition_score = 1

    raw_points += transition_score

    # ----------------------------------
    # Conclusion (0-5)
    # ----------------------------------

    conclusions = [
        "in conclusion",
        "to conclude",
        "to summarize",
        "overall",
        "thank you",
        "in summary"
    ]

    if any(c in text for c in conclusions):
        conclusion_score = 5
    else:
        conclusion_score = 2

    raw_points += conclusion_score

    # ----------------------------------
    # Length (0-5)
    # ----------------------------------

    words = re.findall(r"\b\w+\b", text)
    word_count = len(words)

    if word_count >= 200:
        length_score = 5
    elif word_count >= 120:
        length_score = 4
    elif word_count >= 70:
        length_score = 3
    elif word_count >= 40:
        length_score = 2
    else:
        length_score = 1

    raw_points += length_score

    # ----------------------------------
    # Repetition Penalty
    # ----------------------------------

    unique_words = len(set(words))

    repetition_ratio = unique_words / max(word_count, 1)

    if repetition_ratio < 0.35:
        raw_points -= 3

    raw_points = max(0, min(30, raw_points))

    organization_score = 70 + raw_points

    return {
        "organization_score": organization_score,
        "raw_points": raw_points,
        "breakdown": {
            "introduction": intro_score,
            "body_structure": body_score,
            "transitions": transition_score,
            "conclusion": conclusion_score,
            "length": length_score
        }
    }