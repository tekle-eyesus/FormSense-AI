import React, { useEffect, useRef, useState } from 'react';
import { Camera, Activity, AlertCircle, CheckCircle2 } from 'lucide-react';
import { drawLandmarks } from '../utils/draw';

const FitnessTracker = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const ws = useRef(null);
  const [feedback, setFeedback] = useState("Waiting for stream...");
  const [angle, setAngle] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // 1. Initialize WebSocket
    ws.current = new WebSocket("ws://localhost:8000/ws");
    
    ws.current.onopen = () => {
        console.log("WebSocket Connected");
        setIsConnected(true);
    };
    
    ws.current.onclose = () => {
        console.log("WebSocket Disconnected");
        setIsConnected(false);
    };


    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.error) return;

      setAngle(data.angle);
      setFeedback(data.feedback);
      
      // Draw Skeleton
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      drawLandmarks(ctx, data.landmarks);
    };

    // 2. Start Camera
    startCamera();

     return () => {
        if (ws.current) {
            ws.current.close();
        }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      
      // Send frames to backend every 100ms (10 FPS) to reduce lag
      setInterval(() => {
        sendFrameToBackend();
      }, 100);
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const sendFrameToBackend = () => {
    if (!videoRef.current || ws.current.readyState !== WebSocket.OPEN) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    // Get Base64 string
    const frame = canvas.toDataURL('image/jpeg', 0.8);
    ws.current.send(frame);

    // Sync overlay canvas size with video size
    if (canvasRef.current) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
    }
  };

  // Helper for UI color based on state
  const getStatusColor = () => {
    if (feedback.includes("Down")) return "text-blue-400";
    if (feedback.includes("Up")) return "text-green-400";
    return "text-yellow-400";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      {/* Header */}
      <div className="mb-8 text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
          <Activity className="w-10 h-10 text-primary" />
          FormSense AI
        </h1>
        <p className="text-muted-foreground">Real-time Bicep Curl Analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
        
        {/* Left: Camera Feed */}
        <div className="relative rounded-2xl overflow-hidden border border-border bg-black aspect-video shadow-2xl">
            <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="absolute inset-0 w-full h-full object-cover"
            />
            <canvas 
                ref={canvasRef} 
                className="absolute inset-0 w-full h-full"
            />
            {/* Connection Status Badge */}
            <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 ${isConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
                {isConnected ? 'System Online' : 'Connecting...'}
            </div>
        </div>

        {/* Right: Metrics Dashboard */}
        <div className="flex flex-col gap-6">
            {/* Main Angle Card */}
            <div className="p-6 rounded-2xl border border-border bg-card shadow-sm">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Elbow Angle</h3>
                <div className="flex items-end gap-2">
                    <span className="text-6xl font-bold tabular-nums">{angle}°</span>
                    <span className="text-xl text-muted-foreground mb-2">degrees</span>
                </div>
                {/* Progress Bar Visual */}
                <div className="mt-4 h-4 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-primary transition-all duration-300 ease-out"
                        style={{ width: `${(angle / 180) * 100}%` }}
                    />
                </div>
            </div>

            {/* Feedback Card */}
            <div className="flex-1 p-6 rounded-2xl border border-border bg-card shadow-sm flex flex-col justify-center items-center text-center">
                {feedback.includes("Up") ? (
                    <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                ) : feedback.includes("Down") ? (
                    <Activity className="w-16 h-16 text-blue-500 mb-4" />
                ) : (
                    <AlertCircle className="w-16 h-16 text-yellow-500 mb-4" />
                )}
                
                <h2 className={`text-3xl font-bold ${getStatusColor()}`}>
                    {feedback}
                </h2>
                <p className="text-muted-foreground mt-2">
                   Keep your upper arm stationary.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default FitnessTracker;