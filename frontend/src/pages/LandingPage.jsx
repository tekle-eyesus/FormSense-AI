import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, ArrowRight, Zap, ShieldCheck, Play } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F2F4F7] p-4 md:p-8 font-sans text-gray-900 selection:bg-orange-200">
      
      {/* Navbar */}
      <nav className="flex justify-between items-center mb-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-black text-white p-2 rounded-lg">
            <Activity size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight">FormSense AI</span>
        </div>
        <button className="px-5 py-2 rounded-full bg-white border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors hidden md:block">
          Contact Support
        </button>
      </nav>

      {/* Main Grid Layout */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        
        {/* Left: Main Hero Card (The Big Orange/Pink Gradient) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-8 bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden text-white flex flex-col justify-between min-h-[500px] shadow-2xl shadow-orange-500/20"
        >
            {/* Background Abstract Shapes */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 blur-[100px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2"></div>

            {/* Content */}
            <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/10 text-xs font-medium mb-6">
                    <Zap size={12} className="text-yellow-300" />
                    <span>AI-Powered Computer Vision</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold leading-[0.95] mb-6 tracking-tight">
                    Perfect form.<br />
                    <span className="text-white/90">Every rep.</span>
                </h1>
                
                <p className="text-lg text-white/80 mb-8 max-w-md leading-relaxed">
                    The first AI coach that analyzes your posture in real-time using just your webcam. No wearables required.
                </p>

                {/* Main CTA Button */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                        onClick={() => navigate('/app')}
                        className="group flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                    >
                        Start Training
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                    </button>
                    
                    <button className="flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all font-medium">
                        <Play size={18} fill="currentColor" />
                        Watch Demo
                    </button>
                </div>
            </div>

            {/* Bottom Floating Stats */}
            <div className="relative z-10 mt-12 flex items-center gap-4">
                <div className="flex -space-x-3">
                    {[1,2].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-orange-400 bg-gray-300 overflow-hidden">
                           
                                 <img src={`./img${i}.png`} alt="logo" /> 
                            
                            
                        </div>
                    ))}
                </div>
                <div className="text-sm font-medium">
                    <p>Build by Tekleeyesus M.</p>
                    <div className="flex gap-1 text-yellow-300 text-xs">★★★★★</div>
                </div>
            </div>
        </motion.div>

        {/* Right Column: Feature Bento Grid */}
        <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Top Right: Live Analysis Preview */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="bg-white rounded-[2.5rem] p-8 flex-1 border border-white shadow-xl shadow-gray-200/50 flex flex-col relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl">
                        <Activity size={24} />
                    </div>
                    <span className="text-xs font-bold bg-black text-white px-2 py-1 rounded-full">LIVE</span>
                </div>
                
                <h3 className="text-2xl font-bold mb-2">Real-time Feedback</h3>
                <p className="text-gray-500 text-sm mb-6">Instant audio & visual corrections tracking 33 body keypoints.</p>
                
                {/* Abstract Visual representation of skeleton */}
                <div className="mt-auto relative h-32 w-full bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center">
                   <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 gap-1 opacity-20">
                      {[...Array(24)].map((_, i) => <div key={i} className="bg-purple-500/20"></div>)}
                   </div>
                   <div className="w-16 h-16 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
                </div>
            </motion.div>

            {/* Bottom Right: Privacy Card */}
            <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: 0.4, duration: 0.6 }}
                className="bg-[#111] text-white rounded-[2.5rem] p-8 border border-gray-800 relative overflow-hidden"
            >
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">100% Private</h3>
                        <p className="text-gray-400 text-xs">Local processing</p>
                    </div>
                </div>
                <p className="text-gray-400 text-sm">
                    Your video feed never leaves your device. AI processing happens locally in your browser.
                </p>
            </motion.div>

        </div>
      </main>
    </div>
  );
};

export default LandingPage;