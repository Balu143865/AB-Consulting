import React from 'react';
import { motion } from 'motion/react';
import { Search, ClipboardCheck, Rocket, ArrowRight } from 'lucide-react';

export default function Process() {
  const steps = [
    {
      num: "01",
      stepName: "Step 1",
      title: "Discover & Analyze",
      desc: "We deeply understand your business goals, challenges, and data to identify the right opportunities for AI.",
      icon: Search
    },
    {
      num: "02",
      stepName: "Step 2",
      title: "Design & Strategize",
      desc: "We craft a tailored AI strategy and solution architecture aligned with your objectives and future roadmap.",
      icon: ClipboardCheck
    },
    {
      num: "03",
      stepName: "Step 3",
      title: "Develop & Deliver",
      desc: "We build, test, and deploy intelligent solutions that drive real results and measurable impact.",
      icon: Rocket
    }
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-[#050811] relative overflow-hidden border-y border-slate-200/50 dark:border-white/5 transition-colors duration-300" id="process">
      
      {/* Decorative subtle background grid (adapts to light/dark) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000002_1px,transparent_1px),linear-gradient(to_bottom,#00000002_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-xs font-bold text-[#ff5a22] uppercase tracking-[0.2em] font-mono block mb-2">
            OUR METHODOLOGY
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl text-[#0f172a] dark:text-white tracking-tight leading-none mb-4 transition-colors duration-300">
            Our Process
          </h2>
          <div className="w-16 h-[3px] bg-[#ff5a22] mx-auto rounded-full mb-6" />
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm sm:text-[15px] leading-relaxed max-w-xl mx-auto transition-colors duration-300">
            We follow a proven, AI-powered methodology to deliver intelligent, scalable, and impactful solutions for your business.
          </p>
        </div>

        {/* Steps Grid Container */}
        <div className="relative mt-16">
          
          {/* Horizontal Connector Line (desktop only, aligned perfectly with center of the circles at top-8) */}
          <div className="hidden lg:block absolute top-[2rem] left-[16%] right-[16%] h-[2px] border-t-2 border-dashed border-slate-200 dark:border-slate-800 z-0 transition-colors duration-300">
            {/* Elegant CSS arrow head at the end */}
            <div className="absolute -right-1 -top-[5px] w-2.5 h-2.5 border-t-2 border-r-2 border-slate-300 dark:border-slate-700 transform rotate-45 transition-colors duration-300" />
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 relative z-10">
            {steps.map((step, i) => {
              const IconComponent = step.icon;
              return (
                <motion.div 
                  key={i} 
                  className="flex flex-col items-center group"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, delay: i * 0.18, ease: [0.16, 1, 0.3, 1] }}
                >
                  
                  {/* Top Interactive Node Container */}
                  <div className="relative w-full flex flex-col items-center mb-6">
                    
                    {/* Massive watermark outline number */}
                    <motion.div 
                      className="absolute -top-12 left-1/2 -translate-x-1/2 font-display font-black text-[7.5rem] leading-none text-slate-200/50 dark:text-slate-800/30 select-none tracking-tighter z-0 transition-colors duration-300"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      {step.num}
                    </motion.div>
                    
                    {/* Premium Circle Icon Wrapper */}
                    <motion.div 
                      className="relative z-10 w-16 h-16 rounded-full bg-white dark:bg-[#0c1324] border border-[#ff5a22]/25 dark:border-[#ff5a22]/40 flex items-center justify-center shadow-[0_10px_30px_rgba(255,90,34,0.08)] transition-all duration-300"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    >
                      <IconComponent className="w-6 h-6 text-[#ff5a22]" />
                    </motion.div>

                    {/* Small orange connector dot below circle */}
                    <motion.div 
                      className="relative z-10 w-3 h-3 rounded-full border-2 border-[#ff5a22] bg-white dark:bg-[#0c1324] mt-4 transition-colors duration-300"
                      whileHover={{ scale: 1.3 }}
                    />
                  </div>

                  {/* Card Component */}
                  <motion.div 
                    className="w-full bg-white dark:bg-slate-900/40 rounded-[2rem] border border-slate-100 dark:border-white/[0.06] hover:border-[#ff5a22]/20 p-8 shadow-[0_15px_45px_rgba(0,0,0,0.03)] dark:shadow-[0_15px_45px_rgba(0,0,0,0.2)] hover:shadow-[0_25px_55px_rgba(255,90,34,0.06)] dark:hover:shadow-[0_25px_55px_rgba(255,90,34,0.12)] text-center flex flex-col justify-between h-full relative transition-all duration-300"
                    whileHover={{ 
                      y: -10, 
                      scale: 1.02,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  >
                    <div>
                      {/* Step Tag */}
                      <span className="text-[#ff5a22] text-xs font-bold uppercase tracking-widest font-mono block mb-1">
                        {step.stepName}
                      </span>

                      {/* Step Title */}
                      <h3 className="text-[#0f172a] dark:text-white font-display font-black text-xl mb-3 transition-colors duration-300">
                        {step.title}
                      </h3>

                      {/* Step Description */}
                      <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-[13px] font-medium leading-relaxed max-w-xs mx-auto mb-6 transition-colors duration-300">
                        {step.desc}
                      </p>
                    </div>

                    {/* Bottom Action Icon Button */}
                    <motion.div 
                      className="w-8 h-8 rounded-full bg-[#ff5a22]/10 group-hover:bg-[#ff5a22] text-[#ff5a22] group-hover:text-white flex items-center justify-center transition-all duration-300 mx-auto cursor-pointer shadow-sm"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                    </motion.div>
                  </motion.div>

                </motion.div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
