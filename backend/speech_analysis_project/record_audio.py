import sounddevice as sd
import numpy as np
from scipy.io.wavfile import write

def record_audio(filename="recorded_audio.wav", duration=6):
    device_info = sd.query_devices(9)  
    fs = int(device_info['default_samplerate'])

    print("🎤 Recording... Speak now!")
    print("Using sample rate:", fs)
    audio = sd.rec(
        int(duration * fs),
        samplerate=fs,
        channels=1,
        dtype="float32"
    )
    sd.wait()

    max_val = np.max(np.abs(audio))
    if max_val > 0:
        audio = audio / max_val

    write(filename, fs, audio)
    print("✅ Recording saved as", filename)

    audio_np = np.squeeze(audio)

    threshold = 0.01   
    min_silence_length = int(0.3 * fs)

    silent = np.abs(audio_np) < threshold

    pauses = 0
    current_silence = 0

    for s in silent:
        if s:
            current_silence += 1
        else:
            if current_silence > min_silence_length:
                pauses += 1
            current_silence = 0

    if current_silence > min_silence_length:
        pauses += 1

    return filename, pauses