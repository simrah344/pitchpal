# import cv2
# import mediapipe as mp
# import threading

# mp_pose = mp.solutions.pose
# pose = mp_pose.Pose()

# mp_face = mp.solutions.face_mesh
# face_mesh = mp_face.FaceMesh(refine_landmarks=True)

# body_data = {
#     "posture": "Good",
#     "eye_contact": "Good",
#     "head": "Good"
# }

# running = False


# def start_camera():
#     global running

#     if running:
#         return

#     running = True

#     def run():
#         global body_data

#         cap = cv2.VideoCapture(0)

#         while running:
#             ret, frame = cap.read()
#             if not ret:
#                 continue

#             rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

#             pose_results = pose.process(rgb)
#             face_results = face_mesh.process(rgb)

#             deviation = 0
#             horizontal_diff = 0
#             avg_ratio = 0.5

#             # POSTURE
#             if pose_results.pose_landmarks:
#                 landmarks = pose_results.pose_landmarks.landmark

#                 left_shoulder = landmarks[11]
#                 right_shoulder = landmarks[12]
#                 left_hip = landmarks[23]
#                 right_hip = landmarks[24]

#                 mid_shoulder_x = (left_shoulder.x + right_shoulder.x) / 2
#                 mid_hip_x = (left_hip.x + right_hip.x) / 2

#                 deviation = abs(mid_shoulder_x - mid_hip_x)

#             # EYE CONTACT
#             if face_results.multi_face_landmarks:
#                 face_landmarks = face_results.multi_face_landmarks[0].landmark

#                 left_eye_left = face_landmarks[33].x
#                 left_eye_right = face_landmarks[133].x
#                 left_iris = face_landmarks[468].x

#                 right_eye_left = face_landmarks[362].x
#                 right_eye_right = face_landmarks[263].x
#                 right_iris = face_landmarks[473].x

#                 left_ratio = (left_iris - left_eye_left) / (left_eye_right - left_eye_left)
#                 right_ratio = (right_iris - right_eye_left) / (right_eye_right - right_eye_left)

#                 avg_ratio = (left_ratio + right_ratio) / 2

#             # HEAD
#             if face_results.multi_face_landmarks:
#                 face_landmarks = face_results.multi_face_landmarks[0].landmark

#                 nose = face_landmarks[1]
#                 left_eye = face_landmarks[33]
#                 right_eye = face_landmarks[263]

#                 eye_x = (left_eye.x + right_eye.x) / 2
#                 horizontal_diff = nose.x - eye_x

#             # 🔥 UPDATE GLOBAL DATA
#             body_data = {
#                 "posture": "Good" if deviation < 0.05 else "Fix posture",
#                 "eye_contact": "Good" if 0.35 < avg_ratio < 0.65 else "Look at camera",
#                 "head": "Straight" if abs(horizontal_diff) < 0.01 else "Keep head straight"
#             }

#         cap.release()

#     threading.Thread(target=run, daemon=True).start()


# def stop_camera():
#     global running
#     running = False


# def get_body_data():
#     return body_data

import random
import threading
import time

body_data = {
    "posture": "Good",
    "eye_contact": "Good",
    "head": "Straight"
}

running = False


def start_camera():
    global running
    running = True


def stop_camera():
    global running
    running = False


def get_body_data(wps=0, fillers=0, pauses=0):
    global body_data

    if 1.2 <= wps <= 3 and fillers <= 2 and pauses <= 3:
        posture = "Good"

    elif fillers >= 5 or pauses >= 6:
        posture = "Fix posture"

    else:
        posture = random.choice(["Slight Slouch", "Good"])

    if fillers > 3:
        eye = "Look at camera"
    elif pauses > 5:
        eye = "Looking Away"
    else:
        eye = "Good"

    if wps > 3:
        head = "Moving too much"
    elif wps < 1:
        head = "Still / Low energy"
    else:
        head = "Straight"

    body_data = {
        "posture": posture,
        "eye_contact": eye,
        "head": head
    }

    return body_data