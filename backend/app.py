from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from speech_analysis_project.main import run_speech
from speech_analysis_project.scoring import score_speech, score_content, final_score
from camera import start_camera, stop_camera, get_body_data

app = FastAPI()

is_recording = False

#Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

latest_data = {}


@app.get("/live-feedback")
def live_feedback():
    global latest_data, is_recording

    if not is_recording:
        return {
        "posture": "Idle",
        "eye_contact": "Idle",
        "confidence": "Idle",   
        "clarity": "Idle",
        "speed": "Idle",
        "filler_words": 0,
        "transcript": ""
        }  

    data = run_speech()

    latest_data = data

    body = get_body_data()

    return {
    # "posture": "Good" if data["wps"] > 1 else "Improve",

    # "eye_contact": "Good",

    "posture": body["posture"],

    "eye_contact": body["eye_contact"],

    "confidence": (
        "Strong" if data["fillers"] < 2
        else "Okay" if data["fillers"] < 4
        else "Low"
    ),

    "clarity": (
        "Clear" if data["pauses"] < 3
        else "Needs Work"
    ),

    "speed": (
         "Slow" if data["wps"] < 1.2
            else "Fast" if data["wps"] > 3
            else "Good"
    ),

    # "filler_words": data["fillers"],

    # "transcript": data["text"]
    }

@app.post("/stop-session")
def stop_session():
    global latest_data, is_recording

    is_recording = False   
    stop_camera()

    if not latest_data:
        return {
            "summary": "No session data available.",
            "overall_score": 0,
            "speech_score": 0,
            "body_score": 0,
            "content_score": 0,
            "confidence_score": 0,
            "suggestions": ["Try recording again."]
        }

    speech = score_speech(
        latest_data["wps"],
        latest_data["pauses"],
        latest_data["fillers"]
    )

    body = 80
    content = score_content(
        latest_data["word_count"],
        latest_data["text"]
    )

    overall = final_score(speech, body, content)

    suggestions = []

    if latest_data["fillers"] > 3:
        suggestions.append("Reduce filler words")

    if latest_data["wps"] > 3:
        suggestions.append("Slow down your speech")
    elif latest_data["wps"] < 1:
        suggestions.append("Speak more confidently")

    if latest_data["pauses"] > 4:
        suggestions.append("Avoid too many pauses")

    if latest_data["word_count"] < 5:
        suggestions.append("Add more content to your response")

    if not suggestions:
        summary = "Excellent performance. You were clear, confident, and well-paced."
    else:
        summary = "Good performance overall. Improve " + ", ".join(suggestions) + "."

    return {
    "summary": summary,

    "overall_score": overall,
    "speech_score": speech,
    "body_score": body,
    "content_score": content,
    "confidence_score": 85,

    # "suggestions": [
    #     "Maintain eye contact",
    #     "Reduce filler words",
    #     "Slow down slightly"
    # ]
    
    "suggestions": suggestions if suggestions else ["Great job! Keep practicing."]
    }
    

@app.post("/start-session")
def start_session():
    global is_recording

    is_recording = True
    start_camera() 

    return {"status": "started"}