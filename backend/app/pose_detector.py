from ultralytics import YOLO
import cv2
import base64
import numpy as np
from app.geometry_utils import calculate_angle

class PoseDetector:
    def __init__(self):
        self.model = YOLO('yolov8n-pose.pt')

    def process_frame(self, base64_image):
        try:
            img_data = base64.b64decode(base64_image.split(',')[1])
            nparr = np.frombuffer(img_data, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        except:
            return {"error": "Image decode failed"}

        # YOLO performs better with RGB
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # Run inference
        results = self.model(frame_rgb, verbose=False)
        height, width, _ = frame.shape

        if len(results) > 0 and results[0].keypoints.data.shape[1] > 0:
            keypoints = results[0].keypoints.data[0].cpu().numpy()

            # Define Indices for Both Arms
            # Left: 5 (Shoulder), 7 (Elbow), 9 (Wrist)
            # Right: 6 (Shoulder), 8 (Elbow), 10 (Wrist)
            
            # 1. Check Confidence Scores
            left_conf = (keypoints[5][2] + keypoints[7][2] + keypoints[9][2]) / 3
            right_conf = (keypoints[6][2] + keypoints[8][2] + keypoints[10][2]) / 3

            # Debugging: Print confidence to terminal to see what's happening
            print(f"Confidences -> Left: {left_conf:.2f} | Right: {right_conf:.2f}")

            # 2. Decide which arm to track (Threshold 0.5)
            selected_arm = None
            
            if left_conf > right_conf and left_conf > 0.5:
                selected_arm = "left"
                indices = [5, 7, 9]
            elif right_conf > left_conf and right_conf > 0.5:
                selected_arm = "right"
                indices = [6, 8, 10]
            else:
                return {"feedback": "Body not clear (Show full arm)", "angle": 0, "landmarks": None}

            # 3. Extract Coordinates based on selection
            s_idx, e_idx, w_idx = indices
            
            shoulder_px = keypoints[s_idx][:2]
            elbow_px = keypoints[e_idx][:2]
            wrist_px = keypoints[w_idx][:2]

            # Normalize 0-1
            shoulder = [shoulder_px[0] / width, shoulder_px[1] / height]
            elbow = [elbow_px[0] / width, elbow_px[1] / height]
            wrist = [wrist_px[0] / width, wrist_px[1] / height]

            # 4. Calculate Angle
            angle = calculate_angle(shoulder, elbow, wrist)

            # 5. Feedback
            feedback = f"Tracking {selected_arm.title()} Arm"
            if angle > 160:
                feedback = "Arm Straight - Down"
            elif angle < 50:
                feedback = "Arm Curl - Up"
            else:
                feedback = f"Angle: {int(angle)}°"

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