import mediapipe as mp
import cv2
import base64
import numpy as np
from app.geometry_utils import calculate_angle

mp_pose = mp.solutions.pose

class PoseDetector:
    def __init__(self):
        self.pose = mp_pose.Pose(
            static_image_mode=False,
            model_complexity=1,
            smooth_landmarks=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )

    def process_frame(self, base64_image):
        # Decode the base64 string from Frontend to an Image
        img_data = base64.b64decode(base64_image.split(',')[1])
        nparr = np.frombuffer(img_data, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # Convert BGR (OpenCV standard) to RGB (MediaPipe standard)
        image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # Process
        results = self.pose.process(image_rgb)
        
        feedback = "No body detected"
        angle = 0
        
        # Extract Landmarks if found
        if results.pose_landmarks:
            landmarks = results.pose_landmarks.landmark
            
            # Get coordinates for Left Arm (Shoulder, Elbow, Wrist)
            # MediaPipe Indexes: 11=Left Shoulder, 13=Left Elbow, 15=Left Wrist
            shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x,
                        landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
            elbow = [landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x,
                     landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y]
            wrist = [landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].x,
                     landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].y]
            
            # Calculate angle
            angle = calculate_angle(shoulder, elbow, wrist)
            
            # Simple Logic for Bicep Curl
            if angle > 160:
                feedback = "Arm Straight - Down"
            elif angle < 30:
                feedback = "Arm Curl - Up"
            else:
                feedback = f"Moving... Angle: {int(angle)}"
            
            return {
                "angle": int(angle),
                "feedback": feedback,
                "landmarks": {
                    "shoulder": shoulder,
                    "elbow": elbow,
                    "wrist": wrist
                }
            }

        return {"error": "No person detected"}