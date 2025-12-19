from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.pose_detector import PoseDetector
import json

# Global variable to hold the AI model
detector = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global detector
    print("---------------------------------------")
    print("🚀 INFO: Initializing YOLOv8 Model...")
    # Load the model here. This might take 5-10 seconds on first run.
    detector = PoseDetector()
    print("✅ INFO: Model Loaded successfully. Server is ready.")
    print("---------------------------------------")
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print(f"Client connected: {websocket.client}")
    
    try:
        while True:
            data = await websocket.receive_text()
            
            # Use the global detector
            if detector:
                result = detector.process_frame(data)
                await websocket.send_json(result)
            else:
                await websocket.send_json({"error": "Model still loading"})
            
    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        print(f"Error: {e}")