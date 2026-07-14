import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpRight, TrendingUp, Clock, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function CaseStudies() {
  const cases = [
    {
      title: "AI-Based Art Generator Platform",
      desc: "An AI-Based Art Generator Platform uses advanced algorithms to create unique, stunning artworks, revolutionizing the digital art creation process.",
      tag: "Neural Art Engine",
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800&h=533",
      stats: [
        { value: "95%", label: "Model Accuracy", icon: TrendingUp },
        { value: "60%", label: "Time Saved", icon: Clock },
        { value: "40%", label: "ROI Increase", icon: BarChart3 }
      ]
    },
    {
      title: "RPA Workflow Intelligent Optimizer",
      desc: "An adaptive reinforcement-learning RPA agent designed for high-density automotive assembly pipelines, reducing manual task-delay offsets by 44%.",
      tag: "Process Automation",
      image: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&q=80&w=800&h=533",
      stats: [
        { value: "88%", label: "Pipeline Speed", icon: TrendingUp },
        { value: "44%", label: "Delay Reduced", icon: Clock },
        { value: "35%", label: "Cost Savings", icon: BarChart3 }
      ]
    },
    {
      title: "Cognitive Semantic Search System",
      desc: "Centralizing deep legacy enterprise documentation and PDFs into high-speed vector DB search nodes supporting real-time secure agent interrogations.",
      tag: "Knowledge Graphs",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800&h=533",
      stats: [
        { value: "99%", label: "Retrieval Rate", icon: TrendingUp },
        { value: "10x", label: "Search Velocity", icon: Clock },
        { value: "50%", label: "FTE Efficiency", icon: BarChart3 }
      ]
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % cases.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + cases.length) % cases.length);
  };

  const handleDotClick = (index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  // Motion variants for sliding carousel transition
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0
    })
  };

  return (
    <section className="py-24 bg-white dark:bg-[#070d1e] transition-colors duration-300" id="cases">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-[#ff5a22] uppercase tracking-[0.2em] font-mono block mb-2">
            Client Success
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl text-[#0f172a] dark:text-white tracking-tight leading-none mb-4 transition-colors duration-300">
            Case Studies
          </h2>
          <div className="w-16 h-[3px] bg-[#ff5a22] mx-auto rounded-full mb-6" />
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm sm:text-[15px] leading-relaxed max-w-xl mx-auto transition-colors duration-300">
            Real stories. Real impact. See how we help businesses transform with AI-powered solutions.
          </p>
        </div>

        {/* Dynamic Carousel Frame */}
        <div className="relative max-w-6xl mx-auto bg-[#fafbfc] dark:bg-[#040916] border border-slate-100 dark:border-white/[0.04] rounded-[2.5rem] p-6 sm:p-10 lg:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.02)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.25)] transition-all duration-300">
          
          <div className="relative overflow-hidden min-h-[380px] lg:min-h-[340px]">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
              >
                
                {/* Left Side Content */}
                <div className="lg:col-span-6 space-y-6 text-left flex flex-col justify-center">
                  <div>
                    <span className="inline-block px-3 py-1 bg-[#ff5a22]/10 border border-[#ff5a22]/20 text-[#ff5a22] text-xs font-bold rounded-full uppercase tracking-wider mb-4 font-mono">
                      {cases[activeIndex].tag}
                    </span>
                    
                    <h3 className="font-display font-black text-2xl sm:text-3.5xl text-[#0f172a] dark:text-white leading-tight tracking-tight transition-colors duration-300">
                      {cases[activeIndex].title}
                    </h3>
                  </div>
                  
                  <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-[15px] font-medium leading-relaxed transition-colors duration-300">
                    {cases[activeIndex].desc}
                  </p>

                  {/* High Fidelity Stats Grid (Exactly like Mockup!) */}
                  <div className="grid grid-cols-3 gap-4 py-4 border-t border-slate-100 dark:border-white/[0.05] transition-colors duration-300">
                    {cases[activeIndex].stats.map((stat, sIdx) => {
                      const IconComponent = stat.icon;
                      return (
                        <div key={sIdx} className="flex flex-col items-start space-y-1">
                          <div className="flex items-center gap-1.5 text-[#ff5a22]">
                            <div className="w-7 h-7 rounded-full bg-[#ff5a22]/10 flex items-center justify-center">
                              <IconComponent className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-lg sm:text-xl font-extrabold text-[#0f172a] dark:text-white transition-colors duration-300">
                              {stat.value}
                            </span>
                          </div>
                          <span className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-medium leading-tight">
                            {stat.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="pt-2">
                    <a 
                      href="#contact" 
                      className="inline-flex items-center gap-1.5 text-[#ff5a22] hover:text-[#e04814] font-bold text-sm transition-all border-b-2 border-transparent hover:border-[#ff5a22] pb-0.5"
                    >
                      <span>Read more</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Right Side Image Preview with Overlay Controls */}
                <div className="lg:col-span-6 relative">
                  <div className="relative rounded-[2rem] overflow-hidden shadow-xl border border-slate-100 dark:border-white/5 aspect-[4/3] sm:aspect-[1.51] lg:aspect-[1.51] transition-all duration-300 group">
                    <img 
                      src={cases[activeIndex].image} 
                      alt={cases[activeIndex].title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transform hover:scale-102 transition-transform duration-500"
                    />
                    
                    {/* Dark gradient mask on bottom of the image */}
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

                    {/* Carousel Controls inside Image bottom-right corner */}
                    <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 flex gap-2.5 z-20">
                      <button 
                        onClick={handlePrev}
                        aria-label="Previous Case Study"
                        className="w-10 h-10 sm:w-11 sm:h-11 bg-white/90 dark:bg-[#070d1e]/90 hover:bg-[#ff5a22] dark:hover:bg-[#ff5a22] hover:text-white dark:hover:text-white text-[#0f172a] dark:text-white rounded-full shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center transition-all duration-300 cursor-pointer backdrop-blur-md border border-white/20"
                      >
                        <ChevronLeft className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                      </button>
                      <button 
                        onClick={handleNext}
                        aria-label="Next Case Study"
                        className="w-10 h-10 sm:w-11 sm:h-11 bg-white/90 dark:bg-[#070d1e]/90 hover:bg-[#ff5a22] dark:hover:bg-[#ff5a22] hover:text-white dark:hover:text-white text-[#0f172a] dark:text-white rounded-full shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center transition-all duration-300 cursor-pointer backdrop-blur-md border border-white/20"
                      >
                        <ChevronRight className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                      </button>
                    </div>
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

        {/* Carousel Pagination Dots Centered Below Frame */}
        <div className="flex justify-center items-center gap-2.5 mt-8">
          {cases.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to case study ${index + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === index 
                  ? 'w-6 bg-[#ff5a22]' 
                  : 'w-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
