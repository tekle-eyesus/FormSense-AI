import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, 
  ChevronLeft, 
  Camera, 
  Zap, 
  Timer, 
  Maximize2,
  MoreVertical,
  Wifi,
  WifiOff
} from 'lucide-react';
import { drawLandmarks } from '../utils/draw';

const FitnessTracker = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const ws = useRef(null);
  
  // State
  const [feedback, setFeedback] = useState("Initializing...");
  const [angle, setAngle] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [fps, setFps] = useState(0);
  const [duration, setDuration] = useState(0);
  const framesCount = useRef(0);

  // 1. Timer Logic
  useEffect(() => {
    const timer = setInterval(() => setDuration(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format time (mm:ss)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // 2. FPS Counter Logic
  useEffect(() => {
    const fpsTimer = setInterval(() => {
      setFps(framesCount.current);
      framesCount.current = 0;
    }, 1000);
    return () => clearInterval(fpsTimer);
  }, []);

  // 3. WebSocket & Camera Logic
  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8000/ws");
    
    ws.current.onopen = () => {
        console.log("WS Connected");
        setIsConnected(true);
    };
    ws.current.onclose = () => setIsConnected(false);

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.error) return;

      setAngle(data.angle);
      setFeedback(data.feedback);
      
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      drawLandmarks(ctx, data.landmarks);
    };

    startCamera();

    return () => {
        if (ws.current) ws.current.close();
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
        }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720 } 
      });
      videoRef.current.srcObject = stream;
      
      setInterval(() => {
        sendFrameToBackend();
      }, 100); // Send every 100ms
    } catch (err) {
      console.error("Camera Error:", err);
    }
  };

  const sendFrameToBackend = () => {
    if (!videoRef.current || ws.current.readyState !== WebSocket.OPEN) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    const frame = canvas.toDataURL('image/jpeg', 0.6);
    ws.current.send(frame);
    framesCount.current += 1;

    // Sync overlay
    if (canvasRef.current) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
    }
  };

  // UI Helpers
  const getFeedbackColor = () => {
    if (feedback.includes("Up")) return "text-green-400 border-green-500/30 bg-green-500/10";
    if (feedback.includes("Down")) return "text-blue-400 border-blue-500/30 bg-blue-500/10";
    return "text-yellow-400 border-yellow-500/30 bg-yellow-500/10";
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-purple-500/30">
      
      {/* Top Navigation Bar */}
      <header className="border-b border-white/10 bg-neutral-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
            <span className="font-medium">Exit Session</span>
          </button>

          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-sm font-medium tracking-wide">
                {isConnected ? 'LIVE FEED' : 'OFFLINE'}
            </span>
          </div>

          <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <MoreVertical size={20} className="text-neutral-400" />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-4rem)]">
        
        {/* LEFT COLUMN: Main Camera Feed */}
        <div className="lg:col-span-2 flex flex-col gap-4">
            
            {/* Video Container */}
            <div className="relative flex-1 bg-black rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl shadow-purple-900/10 group">
                <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                <canvas 
                    ref={canvasRef} 
                    className="absolute inset-0 w-full h-full"
                />

                {/* Video Overlays (HUD) */}
                <div className="absolute top-6 left-6 flex items-center gap-3">
                    <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                        <Camera size={14} className="text-purple-400" />
                        <span className="text-xs font-mono text-purple-100">CAM_01</span>
                    </div>
                    <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                        <Zap size={14} className="text-yellow-400" />
                        <span className="text-xs font-mono text-yellow-100">{fps} FPS</span>
                    </div>
                </div>

                <button className="absolute bottom-6 right-6 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all">
                    <Maximize2 size={20} />
                </button>
            </div>
        </div>

        {/* RIGHT COLUMN: Stats & Controls (Bento Grid) */}
        <div className="flex flex-col gap-4">
            
            {/* Card 1: Main Feedback (Dynamic Color) */}
            <div className={`p-6 rounded-[2rem] border transition-all duration-300 flex flex-col items-center justify-center text-center min-h-[180px] ${getFeedbackColor()}`}>
                <Activity className="w-10 h-10 mb-4 opacity-80" />
                <h2 className="text-2xl font-bold tracking-tight">{feedback}</h2>
                <p className="text-sm opacity-60 mt-2">AI Motion Analysis</p>
            </div>

            {/* Card 2: Angle Gauge */}
            <div className="p-6 rounded-[2rem] bg-neutral-900/50 border border-white/5 backdrop-blur-sm relative overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-neutral-400 text-sm font-medium">Elbow Angle</h3>
                    <span className="text-3xl font-bold font-mono">{angle}°</span>
                </div>

                {/* Custom CSS Progress Bar */}
                <div className="h-4 w-full bg-neutral-800 rounded-full overflow-hidden relative">
                    <div 
                        className="h-full bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-200 ease-out"
                        style={{ width: `${(angle / 180) * 100}%` }}
                    />
                    {/* Target Zone Marker (approx 30 to 160) */}
                    <div className="absolute top-0 bottom-0 left-[16%] w-[70%] bg-white/5 border-l border-r border-white/10"></div>
                </div>
                <div className="flex justify-between text-xs text-neutral-500 mt-2 font-mono">
                    <span>0°</span>
                    <span>90°</span>
                    <span>180°</span>
                </div>
            </div>

            {/* Card 3: Session Stats */}
            <div className="grid grid-cols-2 gap-4 flex-1">
                <div className="bg-neutral-900/50 border border-white/5 rounded-[2rem] p-5 flex flex-col justify-between">
                    <Timer className="text-orange-400 mb-2" size={24} />
                    <div>
                        <div className="text-2xl font-mono font-bold">{formatTime(duration)}</div>
                        <div className="text-xs text-neutral-400">Duration</div>
                    </div>
                </div>

                <div className="bg-neutral-900/50 border border-white/5 rounded-[2rem] p-5 flex flex-col justify-between">
                   {isConnected ? (
                       <Wifi className="text-green-400 mb-2" size={24} />
                   ) : (
                       <WifiOff className="text-red-400 mb-2" size={24} />
                   )}
                    <div>
                        <div className="text-sm font-bold">{isConnected ? 'Online' : 'Reconnecting'}</div>
                        <div className="text-xs text-neutral-400">Server Status</div>
                    </div>
                </div>
            </div>

        </div>
      </main>
    </div>
  );
};

export default FitnessTracker;