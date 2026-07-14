import React from 'react';
import { motion } from 'motion/react';

interface AboutUsProps {
  onOpenPortal: () => void;
}

export default function AboutUs({ onOpenPortal }: AboutUsProps) {
  return (
    <section className="pt-36 pb-24 md:pt-44 md:pb-24 bg-white dark:bg-[#070d1e] transition-colors duration-300 overflow-hidden" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Asymmetric Curved Image Section with elegant viewport entrance and interactive hover */}
          <motion.div 
            className="lg:col-span-6 flex justify-center"
            initial={{ opacity: 0, x: -40, scale: 0.96 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div 
              className="relative w-full max-w-[260px] xs:max-w-[320px] sm:max-w-md group cursor-pointer"
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Premium backglow accent that expands on hover and tracks the glow animation */}
              <div className="absolute inset-0 bg-[#ff5a22]/15 dark:bg-[#ff5a22]/20 blur-2xl rounded-full scale-90 group-hover:scale-105 transition-all duration-500 pointer-events-none" />
              
              {/* The custom curved outer border frame with liquid flow animation */}
              <div className="curved-image-about p-[3px] animated-border-glow relative z-10 shadow-[0_20px_50px_rgba(255,90,34,0.12)] dark:shadow-[0_25px_60px_rgba(255,90,34,0.18)] transition-all duration-500 group-hover:shadow-[0_30px_70px_rgba(255,90,34,0.28)]">
                {/* Inner container to hold and clip image precisely inside the frame */}
                <div className="curved-image-about overflow-hidden bg-white dark:bg-[#070d1e] w-full h-full">
                  <img 
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600&h=600" 
                    alt="AB Consulting AI Consultants collaborating on laptop" 
                    referrerPolicy="no-referrer"
                    className="w-full h-auto aspect-square object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* About Us Content with elegant staggered viewport entrance */}
          <motion.div 
            className="lg:col-span-6 space-y-8 text-left"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="space-y-4">
              <h2 className="font-display font-bold text-4xl sm:text-5xl text-[#070d1e] dark:text-white tracking-tight leading-none transition-colors duration-300">
                About Us
              </h2>
              {/* Solid orange underline matching the layout */}
              <div className="w-20 h-1 bg-[#ff5a22] rounded mt-3" />
            </div>

            {/* Typography matching mockup style and exact copy */}
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-sans font-medium text-sm sm:text-base pt-2 transition-colors duration-300">
              Credibly innovate granular internal or organic sources whereas high standards in web-readiness. Energistically scale future-proof core competencies vis-a-vis impactful experiences.
            </p>

            {/* Custom rounded leaf-shaped button matching the mockup */}
            <div className="pt-4">
              <button 
                onClick={onOpenPortal}
                className="px-8 py-4 bg-[#ff5a22] hover:bg-[#e04510] text-white text-xs font-bold rounded-[20px_4px_20px_4px] uppercase tracking-widest shadow-md hover:shadow-lg hover:scale-103 active:scale-97 transition-all cursor-pointer"
              >
                Get a Quote
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
