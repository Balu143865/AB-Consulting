import React, { useState, useEffect } from 'react';
import { Sparkles, Users, Star, Briefcase, Play, ArrowUpRight, TrendingUp, CheckCircle2, ShieldAlert, ThumbsUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
const glowingHeadImg = "/src/assets/images/glowing_ai_hologram_head_1783951135502.jpg";

interface HeroProps {
  onOpenPortal: () => void;
}

// Custom Counter Component that animates from 0 to target number
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = target;
    const duration = 1500; // 1.5 seconds
    const steps = 30;
    const stepValue = end / steps;
    const intervalTime = duration / steps;

    const timer = setInterval(() => {
      start += stepValue;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [target]);

  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  return (
    <span>
      {formatNumber(count)}
      {suffix}
    </span>
  );
}

export default function Hero({ onOpenPortal }: HeroProps) {
  return (
    <section 
      className="relative z-20 bg-[#050811] pt-6 pb-16 sm:pt-8 sm:pb-20 md:pt-10 md:pb-24 flex flex-col justify-between text-white" 
      id="hero"
    >
      {/* BACKGROUND EFFECTS matching high-end sci-fi look */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Subtle high-tech grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />
        
        {/* Deep background mesh glow */}
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-[#ff5a22]/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/5 blur-[150px] rounded-full" />
        
        {/* Soft radial vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050811] via-transparent to-[#050811]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT SIDE CONTENT - Pixel Perfect to the mockup */}
          <div className="lg:col-span-5 space-y-6 text-left">
            
            {/* Small Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ff5a22]/10 border border-[#ff5a22]/20 text-[#ff5a22] text-xs font-semibold tracking-wider"
              id="hero-badge"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5a22] animate-pulse" />
              Trusted AI Solutions
            </motion.div>

            {/* Huge Bold Heading */}
            <div className="space-y-3">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                className="font-display font-extrabold text-4xl sm:text-5xl lg:text-[56px] text-white tracking-tight leading-[1.05]"
                id="hero-title"
              >
                AI Consulting <br />
                <span className="text-[#ff5a22] inline-block mt-1">
                  Services
                </span>
              </motion.h1>
              {/* Thin solid orange underline matching mockup */}
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: 110 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="h-[3px] bg-[#ff5a22]" 
              />
            </div>

            {/* Premium Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-slate-300 font-sans font-medium text-sm sm:text-[15px] leading-relaxed max-w-xl"
              id="hero-description"
            >
              We empower businesses with cutting-edge Artificial Intelligence solutions that streamline operations, automate workflows, improve decision making, and accelerate digital transformation.
            </motion.p>

            {/* Action Buttons exactly matching layout and icons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="flex flex-wrap items-center gap-5 pt-2"
              id="hero-actions"
            >
              {/* Primary: Get A Quote with Arrow */}
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 15px 30px -10px rgba(255,90,34,0.45)" }}
                whileTap={{ scale: 0.97 }}
                onClick={onOpenPortal}
                className="px-8 py-4 bg-[#ff5a22] hover:bg-[#e04510] text-white text-xs sm:text-sm font-bold rounded-full uppercase tracking-widest transition-all cursor-pointer font-sans flex items-center gap-2 shadow-lg shadow-[#ff5a22]/10"
              >
                Get A Quote
                <ArrowUpRight className="w-4 h-4" />
              </motion.button>
              
              {/* Secondary: Explore Services with Play Icon */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 bg-transparent hover:bg-white/10 border border-white/10 hover:border-white/30 text-white text-xs sm:text-sm font-bold rounded-full uppercase tracking-widest transition-all duration-300 cursor-pointer font-sans flex items-center gap-2"
              >
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                  <Play className="w-2.5 h-2.5 text-white fill-white ml-0.5" />
                </div>
                Explore Services
              </motion.button>
            </motion.div>

          </div>

          {/* RIGHT SIDE FUTURISTIC AI LANDSCAPE - 100% Matching Mockup Design */}
          <div className="lg:col-span-7 relative flex items-center justify-center min-h-[380px] lg:min-h-[440px] w-full" id="hero-right-side">
            
            {/* Base Glowing Hologram Platform/Pedestal Under the Head */}
            <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[280px] h-[280px] pointer-events-none z-0">
              {/* Concentric rings */}
              <div className="absolute inset-0 rounded-full border border-[#ff5a22]/20 animate-[spin_40s_linear_infinite]" />
              <div className="absolute inset-4 rounded-full border border-dashed border-[#ff5a22]/30 animate-[spin_20s_linear_infinite_reverse]" />
              <div className="absolute inset-12 rounded-full border border-[#ff5a22]/40" />
              
              {/* Pedestal perspective ellipse */}
              <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-[180px] h-[30px] bg-gradient-to-t from-[#ff5a22]/30 to-transparent blur-md rounded-full" />
              <div className="absolute bottom-[-2px] left-1/2 -translate-x-1/2 w-[140px] h-[15px] border border-[#ff5a22]/60 rounded-full shadow-[0_0_15px_rgba(255,90,34,0.4)]" />
            </div>
 
            {/* Central Holographic Head Profile */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative z-10 w-[240px] h-[240px] lg:w-[285px] lg:h-[285px] flex items-center justify-center"
            >
              {/* Beautiful glowing network lines on the head */}
              <div className="absolute inset-0 rounded-full overflow-hidden bg-gradient-to-tr from-[#050811] to-[#ff5a22]/15 p-1 border border-white/10 shadow-2xl">
                <img 
                  src={glowingHeadImg} 
                  alt="Futuristic AI Glowing Humanoid Head"
                  className="w-full h-full object-cover rounded-full brightness-115 contrast-115"
                  referrerPolicy="no-referrer"
                />
                
                {/* Horizontal holographic scan sweep */}
                <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff5a22] to-transparent shadow-[0_0_12px_#ff5a22] animate-scan" />
              </div>

              {/* Pedestal Floor Glow Light source */}
              <div className="absolute bottom-0 w-44 h-12 bg-[#ff5a22]/20 blur-xl rounded-full" />
            </motion.div>

            {/* FLOATING GLASS CARDS WITH PRECISE DETAILS FROM MOCKUP */}

            {/* Card 1: AI Analytics (Left Upper) */}
            <motion.div
              initial={{ opacity: 0, x: -30, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute top-[2%] left-0 sm:left-[6%] z-20 bg-[#080d1a]/90 border border-[#ff5a22]/20 backdrop-blur-md rounded-2xl p-4 shadow-xl w-[180px]"
            >
              <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff5a22] shadow-[0_0_6px_#ff5a22]" />
                AI Analytics
              </div>
              <h4 className="text-xl font-black text-white leading-none">95.6%</h4>
              <p className="text-xs text-slate-400 mt-0.5 mb-2.5">Model Accuracy</p>
              
              {/* Mini Sparkline Line Graph */}
              <div className="h-7 w-full mb-3 overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 100 30">
                  <defs>
                    <linearGradient id="orangeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ff5a22" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#ff5a22" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path 
                    d="M 0 25 Q 15 10 30 18 T 60 5 T 90 12 T 100 8" 
                    fill="none" 
                    stroke="#ff5a22" 
                    strokeWidth="1.5" 
                  />
                  <path 
                    d="M 0 25 Q 15 10 30 18 T 60 5 T 90 12 T 100 8 L 100 30 L 0 30 Z" 
                    fill="url(#orangeGrad)" 
                  />
                  {/* Floating dot */}
                  <circle cx="60" cy="5" r="2" fill="#ff5a22" className="animate-ping" />
                </svg>
              </div>

              <div className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                +18.6%
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Performance Increase</p>
            </motion.div>

            {/* Card 2: Automation (Left Lower) */}
            <motion.div
              initial={{ opacity: 0, x: -30, y: 30 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="absolute bottom-[12%] left-[-2%] sm:left-[2%] z-20 bg-[#080d1a]/90 border border-[#ff5a22]/20 backdrop-blur-md rounded-2xl p-4 shadow-xl w-[175px]"
            >
              <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300 mb-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff5a22] shadow-[0_0_6px_#ff5a22]" />
                Automation
              </div>
              <h4 className="text-xl font-black text-white leading-none">78%</h4>
              <p className="text-xs text-slate-400 mt-0.5 mb-2.5">Workflows Automated</p>
              
              {/* Progress bar matching mockup layout */}
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-1.5">
                <div className="bg-[#ff5a22] h-full w-[78%] rounded-full shadow-[0_0_8px_rgba(255,90,34,0.5)]" />
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                <span>Efficiency Boost</span>
                <span className="text-[#ff5a22] font-bold">Max</span>
              </div>
            </motion.div>

            {/* Card 3: AI Insights (Right Upper) */}
            <motion.div
              initial={{ opacity: 0, x: 30, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="absolute top-[8%] right-0 sm:right-[2%] z-20 bg-[#080d1a]/90 border border-[#ff5a22]/20 backdrop-blur-md rounded-2xl p-4 shadow-xl w-[200px]"
            >
              <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300 mb-3.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff5a22] shadow-[0_0_6px_#ff5a22]" />
                AI Insights
              </div>

              {/* Radial donut chart */}
              <div className="flex justify-center mb-4">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-white/5"
                      strokeWidth="2.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#ff5a22]"
                      strokeDasharray="86, 100"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-xs font-black text-white leading-none block">86%</span>
                    <span className="text-[10px] text-slate-300 uppercase tracking-widest block font-mono">Success</span>
                  </div>
                </div>
              </div>

              {/* List bullet parameters exactly matching mockup style */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Data Processing</span>
                  <span className="text-white font-mono font-bold">92%</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Pattern Recognition</span>
                  <span className="text-white font-mono font-bold">85%</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Decision Making</span>
                  <span className="text-white font-mono font-bold">78%</span>
                </div>
              </div>
            </motion.div>

            {/* Card 4: Machine Learning (Right Lower) */}
            <motion.div
              initial={{ opacity: 0, x: 30, y: 30 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="absolute bottom-[4%] right-[-2%] sm:right-[1%] z-20 bg-[#080d1a]/90 border border-[#ff5a22]/20 backdrop-blur-md rounded-2xl p-4 shadow-xl w-[200px]"
            >
              <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300 mb-3.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff5a22] shadow-[0_0_6px_#ff5a22]" />
                Machine Learning
              </div>

              {/* Node-link network graph SVG */}
              <div className="h-14 w-full bg-[#050811]/60 rounded-lg p-2 mb-3.5 border border-white/5 relative overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 100 40">
                  {/* Neural connection paths */}
                  <line x1="10" y1="20" x2="40" y2="10" stroke="rgba(255,90,34,0.3)" strokeWidth="0.75" />
                  <line x1="10" y1="20" x2="40" y2="30" stroke="rgba(255,90,34,0.3)" strokeWidth="0.75" />
                  <line x1="40" y1="10" x2="70" y2="15" stroke="rgba(255,90,34,0.3)" strokeWidth="0.75" />
                  <line x1="40" y1="30" x2="70" y2="25" stroke="rgba(255,90,34,0.3)" strokeWidth="0.75" />
                  <line x1="70" y1="15" x2="90" y2="20" stroke="rgba(255,90,34,0.6)" strokeWidth="0.75" />
                  <line x1="70" y1="25" x2="90" y2="20" stroke="rgba(255,90,34,0.6)" strokeWidth="0.75" />

                  {/* Node dots with pulse animation */}
                  <circle cx="10" cy="20" r="2.5" fill="#ff5a22" />
                  <circle cx="40" cy="10" r="2.5" fill="#ff5a22" />
                  <circle cx="40" cy="30" r="2.5" fill="#ff5a22" />
                  <circle cx="70" cy="15" r="2.5" fill="#ff5a22" />
                  <circle cx="70" cy="25" r="2.5" fill="#ff5a22" />
                  <circle cx="90" cy="20" r="3.5" fill="#ff5a22" />
                </svg>
              </div>

              {/* Mini vertical bar graph matching style */}
              <div className="flex justify-between items-end gap-1 h-6 px-1">
                <div className="w-2.5 bg-white/5 h-[30%] rounded-sm" />
                <div className="w-2.5 bg-white/10 h-[50%] rounded-sm" />
                <div className="w-2.5 bg-[#ff5a22]/40 h-[70%] rounded-sm" />
                <div className="w-2.5 bg-[#ff5a22] h-[95%] rounded-sm" />
                <div className="w-2.5 bg-[#ff5a22]/60 h-[60%] rounded-sm" />
                <div className="w-2.5 bg-white/10 h-[40%] rounded-sm" />
                <div className="w-2.5 bg-white/5 h-[20%] rounded-sm" />
              </div>
            </motion.div>

          </div>

        </div>
      </div>

      {/* BOTTOM FLOATING STATS CARD - Beautiful asymmetrical curved leaf shape matching the mockup exactly */}
      <div className="absolute bottom-0 left-4 md:left-auto right-4 sm:right-6 lg:right-12 md:w-[50%] lg:w-[40%] z-25 translate-y-1/2">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          whileHover={{ y: -5, boxShadow: "0 20px 40px -10px rgba(255,90,34,0.25)" }}
          className="bg-[#040d21]/95 border border-white/5 border-b-[3px] border-b-[#ff5a22] rounded-tl-[40px] sm:rounded-tl-[70px] md:rounded-tl-[80px] rounded-br-[40px] sm:rounded-br-[70px] md:rounded-br-[80px] rounded-tr-none rounded-bl-none px-4 sm:px-6 py-5 md:py-6 shadow-2xl relative backdrop-blur-lg transition-all duration-300"
        >
          <div className="grid grid-cols-3 gap-2 md:gap-4 items-stretch">
            
            {/* Stat 1: Specialised Consultants */}
            <div className="flex flex-col items-center text-center">
              {/* Thin white outline icon */}
              <div className="mb-1.5 md:mb-2 text-slate-300 hover:text-[#ff5a22] transition-colors duration-200">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" strokeWidth={1.3} />
              </div>
              <div>
                <h3 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-extrabold text-white tracking-tight leading-none">
                  <AnimatedCounter target={200} suffix="+" />
                </h3>
                <p className="text-[8px] sm:text-[9px] md:text-[10px] text-slate-400 font-medium mt-1 md:mt-1.5 leading-tight">
                  Specialised Consultants
                </p>
              </div>
            </div>
 
            {/* Stat 2: Customer Satisfaction */}
            <div className="flex flex-col items-center text-center">
              {/* Thin white outline icon */}
              <div className="mb-1.5 md:mb-2 text-slate-300 hover:text-[#ff5a22] transition-colors duration-200">
                <ThumbsUp className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" strokeWidth={1.3} />
              </div>
              <div>
                <h3 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-extrabold text-white tracking-tight leading-none">
                  <AnimatedCounter target={100} suffix="%" />
                </h3>
                <p className="text-[8px] sm:text-[9px] md:text-[10px] text-slate-400 font-medium mt-1 md:mt-1.5 leading-tight">
                  Customer Satisfaction
                </p>
              </div>
            </div>
 
            {/* Stat 3: Completed Cases */}
            <div className="flex flex-col items-center text-center">
              {/* Thin white outline icon */}
              <div className="mb-1.5 md:mb-2 text-slate-300 hover:text-[#ff5a22] transition-colors duration-200">
                <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" strokeWidth={1.3} />
              </div>
              <div>
                <h3 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-extrabold text-white tracking-tight leading-none">
                  <AnimatedCounter target={1000} suffix="+" />
                </h3>
                <p className="text-[8px] sm:text-[9px] md:text-[10px] text-slate-400 font-medium mt-1 md:mt-1.5 leading-tight">
                  Completed Cases
                </p>
              </div>
            </div>
 
          </div>
        </motion.div>
      </div>

    </section>
  );
}
