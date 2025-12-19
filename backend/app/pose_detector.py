from ultralytics import YOLO
import cv2
import base64
import numpy as np
from app.geometry_utils import calculate_angle

class PoseDetector:
    def __init__(self):
        # Load the "Nano" model (fastest for CPU)
        # It will auto-download 'yolov8n-pose.pt' on first run
        self.model = YOLO('yolov8n-pose.pt')

    def process_frame(self, base64_image):
        # 1. Decode image
        try:
            img_data = base64.b64decode(base64_image.split(',')[1])
            nparr = np.frombuffer(img_data, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        except:
            return {"error": "Image decode failed"}

        # 2. Run YOLO Inference
        # verbose=False keeps the terminal clean
        results = self.model(frame, verbose=False)
        
        # Get image dimensions for normalization
        height, width, _ = frame.shape

        # 3. Extract Keypoints
        # results[0].keypoints.data is a tensor of shape (1, 17, 3) -> (Batch, Points, x/y/conf)
        if len(results) > 0 and results[0].keypoints.data.shape[1] > 0:
            keypoints = results[0].keypoints.data[0].cpu().numpy()
            
            # YOLO COCO Keypoint Indices:
            # 5: Left Shoulder
            # 7: Left Elbow
            # 9: Left Wrist
            
            # Check confidence (index 2) to ensure detection is good
            if keypoints[5][2] < 0.5 or keypoints[7][2] < 0.5 or keypoints[9][2] < 0.5:
                return {"feedback": "Body not clear", "angle": 0, "landmarks": None}

            # Extract (x, y) coordinates
            # Note: YOLO returns pixel coordinates. We normalize them (0-1) 
            # so the frontend drawing logic works exactly the same as before.
            shoulder_px = keypoints[5][:2]
            elbow_px = keypoints[7][:2]
            wrist_px = keypoints[9][:2]

            shoulder = [shoulder_px[0] / width, shoulder_px[1] / height]
            elbow = [elbow_px[0] / width, elbow_px[1] / height]
            wrist = [wrist_px[0] / width, wrist_px[1] / height]

            # 4. Calculate Angle
            angle = calculate_angle(shoulder, elbow, wrist)

            # 5. Feedback Logic
            feedback = "Hold..."
            if angle > 160:
                feedback = "Arm Straight - Down"
            elif angle < 45: # Slightly adjusted for YOLO sensitivity
                feedback = "Arm Curl - Up"
            else:
                feedback = f"Moving... {int(angle)}°"

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