from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from app.pose_detector import PoseDetector
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

detector = PoseDetector()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("Client connected")
    try:
        while True:
            # Receive base64 image from frontend
            data = await websocket.receive_text()
            
            # Process AI
            result = detector.process_frame(data)
            
            # Send result back
            await websocket.send_json(result)
            
    except Exception as e:
        print(f"Connection closed: {e}")