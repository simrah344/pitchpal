import whisper

model = whisper.load_model("base")

def transcribe_audio(file_path):
    result = model.transcribe(file_path, temperature=0.3, fp16=False)

    result = model.transcribe(
    file_path,
    temperature=0,
    fp16=False,
    language="en"
    )

    return {
        "text": result["text"],
        "language": result.get("language", "unknown")
    }