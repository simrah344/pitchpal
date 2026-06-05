def score_speech(words_per_sec, pauses, filler_count):
    score = 100

    # Speed
    if words_per_sec < 1.3:
        score -= 20
    elif words_per_sec > 3.2:
        score -= 15

    # Pauses / hesitation
    if pauses > 15:
        score -= 25
    elif pauses > 8:
        score -= 10

    # Fillers
    if filler_count > 5:
        score -= 20
    elif filler_count > 2:
        score -= 10

    return max(score, 0)


def score_body(posture_bad_frames, head_bad_frames, eye_bad_frames, total_frames):
    score = 100

    posture_ratio = posture_bad_frames / total_frames
    head_ratio = head_bad_frames / total_frames
    eye_ratio = eye_bad_frames / total_frames

    if posture_ratio > 0.3:
        score -= 20

    if head_ratio > 0.3:
        score -= 20

    if eye_ratio > 0.3:
        score -= 25

    return max(score, 0)


def score_content(word_count, text):
    score = 100

    # Length
    if word_count < 5:
        score -= 30
    elif word_count < 10:
        score -= 10

    # Sentence structure
    if "." not in text:
        score -= 10

    # Confidence
    weak_words = ["maybe", "i think", "kind of"]
    if any(w in text.lower() for w in weak_words):
        score -= 15

    return max(score, 0)


def final_score(speech, body, content):
    return int((speech * 0.4) + (body * 0.3) + (content * 0.3))