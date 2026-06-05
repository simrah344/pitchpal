from .record_audio import record_audio
from .speech_to_text import transcribe_audio
#from .text_analysis import analyze_text
#from .audio_analysis import analyze_audio

def give_feedback(text):
    words = text.split()
    word_count = len(words)

    feedback = []

    if word_count < 5:
        feedback.append("Your response is too short. Try to add more detail.")
    elif word_count > 60:
        feedback.append("Your response is too long. Try to be concise.")
    else:
        feedback.append("Good response length.")

    fillers = ["um", "uh", "like", "you know", "so", "actually"]
    
    filler_count = sum(text.lower().count(f) for f in fillers)

    if filler_count > 3:
        feedback.append("Too many filler words. Try pausing instead.")
    elif filler_count > 0:
        feedback.append("Try reducing filler words.")
    else:
        feedback.append("Fluent speech, well done.")

    if "." not in text:
        feedback.append("Try speaking in complete sentences.")

    weak_words = ["maybe", "i think", "kind of"]
    if any(w in text.lower() for w in weak_words):
        feedback.append("Try sounding more confident.")

    if word_count > 10 and "," not in text:
        feedback.append("Try adding pauses for better clarity.")
    
    # Speaking pace (proxy for fillers/pauses)
    duration = 6
    word_count = len(words)

    words_per_sec = word_count / duration

    if words_per_sec < 1.2:
        feedback.append("You are hesitating too much. Try to reduce fillers and pauses.")

    return feedback

def detect_fillers_from_audio(audio_file):
    import librosa
    import numpy as np

    y, sr = librosa.load(audio_file)

    energy = np.abs(y)

    threshold = 0.02
    short_bursts = energy > threshold

    filler_like = 0
    current = 0

    for val in short_bursts:
        if val:
            current += 1
        else:
            if 1000 < current < 5000:  
                filler_like += 1
            current = 0

    return filler_like

def run_speech():
    print("Recording audio...")

    # Step 1: Record
    audio_file, pauses = record_audio(duration=6)

    # Step 2: Transcribe
    result = transcribe_audio(audio_file)
    text = result["text"].strip()

    print("\n--- TRANSCRIPT ---")
    print(text)

    words = text.split()
    word_count = len(words)

    # 🔹 Handle bad input
    if word_count < 2:
        return {
            "text": text,
            "word_count": 0,
            "wps": 0,
            "pauses": pauses,
            "fillers": 0,
            "feedback": ["No clear speech detected."]
        }

    # 🔹 Speaking speed
    duration = 6
    wps = word_count / max(1, duration - (pauses * 0.2))

    filler_count = detect_fillers_from_audio(audio_file)

    feedback = give_feedback(text)


    # Length
    if word_count < 5:
        feedback.append("Speak more — response too short")
    elif word_count > 60:
        feedback.append("Try to be more concise")
    else:
        feedback.append("Good response length")

    # Fillers / hesitation
    if filler_count > 4:
        feedback.append("Too many pauses — reduce hesitation")
    elif filler_count > 1:
        feedback.append("Some hesitation detected")
    else:
        feedback.append("Fluent speech")

    # Speed
    if wps < 1.2:
        feedback.append("Speaking too slowly")
    elif wps > 3:
        feedback.append("Speaking too fast")
    else:
        feedback.append("Good speaking pace")

    # Confidence
    if "maybe" in text.lower() or "i think" in text.lower():
        feedback.append("Try sounding more confident")

    print("\n--- FEEDBACK ---")
    for f in feedback:
        print("-", f)

    return {
        "text": text,
        "word_count": word_count,
        "wps": wps,
        "pauses": pauses,
        "fillers": filler_count,
        "feedback": feedback
    }