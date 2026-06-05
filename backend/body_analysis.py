import time

def get_body_data(wps=None, fillers=None):
    global last_update_time, posture_state, eye_state

    now = time.time()
    elapsed = now - last_update_time

    if elapsed > 5:
        last_update_time = now

        if fillers and fillers > 3:
            posture_state = "Slouching"
        elif wps and (wps < 1 or wps > 3):
            posture_state = "Slight Slouch"
        else:
            posture_state = "Upright"

        if fillers and fillers > 3:
            eye_state = "Looking Away"
        else:
            eye_state = "Good"

    return {
        "posture": posture_state,
        "eye_contact": eye_state
    }