<div align="center">
  <br />
    <a href="https://github.com/tekle-eyesus/FormSense-AI" target="_blank">
      <img src="https://img.shields.io/badge/FormSense-AI_Fitness_Coach-7C3AED?style=for-the-badge&logo=openai&logoColor=white" alt="Project Banner">
    </a>
  <br />

  <div>
    <img src="https://img.shields.io/badge/-React_Vite-23272F?style=flat-square&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/-FastAPI-005571?style=flat-square&logo=fastapi" alt="FastAPI" />
    <img src="https://img.shields.io/badge/-YOLOv8-blue?style=flat-square&logo=ultralytics" alt="YOLOv8" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-c24915?style=flat-square&logo=tailwind-css" alt="Tailwind" />
    <img src="https://img.shields.io/badge/-Python-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python" />
  </div>

  <h3 align="center">Real-Time Computer Vision AI for Posture Correction</h3>

  <p align="center">
    A full-stack AI application that uses <strong>YOLOv8 Pose Estimation</strong> and <strong>WebSockets</strong> to provide instant feedback on exercise form directly in the browser.
    <br />
  </p>
</div>

<hr />

## 🚀 Overview

**FormSense AI** is a cutting-edge portfolio project demonstrating the integration of **Computer Vision** with modern **Web Technologies**. unlike standard chatbots, this application processes live video feeds to analyze human body mechanics in real-time.

It tracks specific keypoints (Shoulder, Elbow, Wrist) to calculate geometric angles and provides visual and textual feedback (e.g., "Arm Curl - Up" vs "Arm Straight - Down").

### ✨ Key Features
*   **📷 Real-Time Pose Estimation:** Uses `YOLOv8-pose` (Nano model) for sub-second inference.
*   **⚡ Low-Latency Feedback:** Powered by **WebSockets** for seamless video streaming.
*   **🎨 Modern UI:** Built with **React + Framer Motion**, featuring Glassmorphism and Bento-grid layouts.
*   **🔒 Privacy First:** No video tracking data is stored; frames are processed in memory and discarded.
*   **📐 Geometric Analysis:** Python-based vector math to calculate joint angles dynamically.

---

## 🏗️ Technical Architecture

The application follows a **Monorepo** structure separating the AI Logic from the User Interface.

| Component | Tech Stack | Description |
| :--- | :--- | :--- |
| **Frontend** | React, Vite, Tailwind v4 | Captures webcam feed, renders the UI, and draws the skeletal overlay. |
| **Backend** | FastAPI, Python 3.10+ | Orchestrates the WebSocket server and handles image processing. |
| **AI Engine** | YOLOv8 (Ultralytics) | Detects human keypoints and generates confidence scores. |
| **Transport** | WebSockets | Bidirectional stream: `React (Base64 Frame)` -> `FastAPI (JSON Result)`. |

---
## 🛠️ Installation & Setup

### Prerequisites
*   Python 3.10 or higher
*   Node.js & npm

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/FormSense-AI.git
cd FormSense-AI
```
### 2. Backend Setup (Python)

```bash
cd backend
python -m venv venv

# Activate Virtual Env
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install Dependencies
pip install -r requirements.txt
```
### 3. Frontend Setup (React)

```bash
cd ../frontend
npm install
```
## Running the Application

You need to run the Backend and Frontend in separate terminals.

### Terminal 1: Backend (API)

```bash
cd backend
# Runs on localhost:8000
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Wait until you see `✅ INFO: Model Loaded successfully.`
### Terminal 2: Frontend (UI)

```bash
cd frontend
# Runs on localhost:5173
npm run dev
```
Open your browser to `http://localhost:5173`.

## How It Works (The Code Logic)

1. **Capture:** The React app captures a frame from the `<video>` element.
2. **Send:** It converts the frame to a Base64 string and sends it via WebSocket.
3. **Process:**
   - FastAPI receives the string and decodes it into an OpenCV image.
   - YOLOv8 scans the image for keypoints (indices 5, 7, 9).
   - A custom `geometry_utils.py` module calculates the angle using `arctan2`.
4. **Respond:** The backend returns the angle, feedback message, and coordinates.
5. **Render:** React draws the skeleton overlay on a transparent `<canvas>` placed on top of the video.

## Roadmap & Future Improvements

- [ ] **Repetition Counter:** Add state logic to count complete curl cycles.
- [ ] **Multi-Exercise Support:** Expand logic to detect squats and shoulder presses.
- [ ] **Cloud Deployment:** Dockerize the application for deployment on AWS/GCP.
- [ ] **User Accounts:** Save workout history using a database (PostgreSQL).

## 🤝 Contact

**Tekleeyesus Munye**  
[LinkedIn](https://www.linkedin.com/in/tekleeyesus-munye) • [Twitter](https://twitter.com/TekleeyesusM)


<p align="center">
  <img src="https://forthebadge.com/images/badges/built-with-love.svg" />
  <img src="https://forthebadge.com/images/badges/made-with-python.svg" />
</p>

