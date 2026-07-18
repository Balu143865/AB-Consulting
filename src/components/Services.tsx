import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  MessageSquare, 
  Network, 
  Workflow, 
  BrainCircuit, 
  ArrowUpRight,
  ArrowRight
} from 'lucide-react';

interface ServicesProps {
  onOpenPortal: () => void;
}

export default function Services({ onOpenPortal }: ServicesProps) {
  // Stagger animation variants for viewport entering
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring" as const, 
        stiffness: 100, 
        damping: 16 
      } 
    }
  };

  return (
    <section className="py-20 sm:py-24 bg-[#f8f9fc] dark:bg-[#030712] relative overflow-hidden transition-colors duration-300" id="services">
      
      {/* Elegant ambient waves & glowing lines matching referral image */}
      <div className="absolute inset-0 z-0 opacity-15 dark:opacity-40 pointer-events-none">
        <svg className="w-full h-full min-h-[800px]" viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M-100 550 C 300 450, 600 650, 1000 500 C 1200 400, 1400 450, 1600 400" stroke="url(#orange-glow-grad)" strokeWidth="2" strokeOpacity="0.4" />
          <path d="M-50 580 C 350 490, 650 620, 950 540 C 1150 460, 1350 480, 1550 440" stroke="url(#orange-glow-grad-2)" strokeWidth="1.5" strokeOpacity="0.25" strokeDasharray="5 10" />
          <path d="M0 610 C 400 530, 700 590, 900 580 C 1100 570, 1300 510, 1500 480" stroke="url(#orange-glow-grad)" strokeWidth="1" strokeOpacity="0.3" />
          <defs>
            <linearGradient id="orange-glow-grad" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ff5a22" stopOpacity="0" />
              <stop offset="50%" stopColor="#ff7a45" stopOpacity="1" />
              <stop offset="100%" stopColor="#ffaa00" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="orange-glow-grad-2" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ff7a45" stopOpacity="0" />
              <stop offset="40%" stopColor="#ffaa00" stopOpacity="1" />
              <stop offset="80%" stopColor="#ff5a22" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/12 w-80 h-80 bg-[#ff5a22]/3 dark:bg-[#ff5a22]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/12 w-96 h-96 bg-[#ff7a45]/3 dark:bg-[#ff7a45]/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Responsive Flat 2D Grid mimicking referral image precisely */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          
          {/* CELL 1: Left Heading, Paragraph & Call to Action */}
          <motion.div 
            className="flex flex-col justify-center text-left py-4 pr-0 lg:pr-6"
            variants={cardVariants}
          >
            <div className="space-y-4">
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight leading-tight">
                We Provide Best <br />
                <span className="text-[#ff5a22]">AI</span> Consulting
              </h2>
              
              {/* Premium small horizontal orange accent line */}
              <div className="w-16 h-[3.5px] bg-[#ff5a22] rounded-full mt-1" />
              
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed pt-2 max-w-sm">
                We empower businesses with cutting-edge Artificial Intelligence solutions that streamline operations, automate workflows, improve decision making, and accelerate digital transformation.
              </p>
              
              <div className="pt-4">
                <button 
                  onClick={onOpenPortal}
                  className="px-6 py-3.5 bg-gradient-to-r from-[#ff5a22] to-[#ff7a45] hover:from-[#ff7a45] hover:to-[#ffaa00] text-white text-[11px] font-bold rounded-full uppercase tracking-widest shadow-md shadow-[#ff5a22]/15 hover:shadow-[#ff5a22]/30 hover:scale-103 active:scale-97 transition-all flex items-center gap-2.5 cursor-pointer"
                >
                  <span>View All Services</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* CELL 2: AI-Consulting offerings */}
          <motion.div 
            className="group relative bg-white dark:bg-[#040916]/80 border border-slate-100 dark:border-white/5 rounded-2xl p-5 sm:p-6 md:p-7 flex flex-col justify-between text-left overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.02)] dark:shadow-2xl transition-all duration-300 hover:border-brand-orange/20 hover:bg-[#fffbf9] dark:hover:bg-[#081026] hover:shadow-[0_15px_40px_rgba(255,90,34,0.15)] dark:hover:shadow-[0_0_30px_rgba(255,90,34,0.15)] w-full min-h-[190px] sm:min-h-[210px] lg:min-h-[230px] cursor-pointer"
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.025 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
          >
            {/* Premium Glow Accents on Top/Bottom edges of the Card */}
            <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#ff5a22]/70 to-transparent opacity-40 group-hover:opacity-100 group-hover:scale-x-110 transition-all duration-500 shadow-[0_0_12px_rgba(255,90,34,0.4)]" />
            <div className="absolute bottom-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#ff5a22]/70 to-transparent opacity-40 group-hover:opacity-100 group-hover:scale-x-110 transition-all duration-500 shadow-[0_0_12px_rgba(255,90,34,0.4)]" />

            <div>
              {/* Circular icon ring with chat bubble */}
              <div className="w-12 h-12 rounded-full border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#080d19] flex items-center justify-center text-[#ff5a22] shrink-0 mb-4 transition-colors duration-300 group-hover:border-[#ff5a22]/30">
                <MessageSquare className="w-5.5 h-5.5 stroke-[1.5]" />
              </div>
              
              <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 dark:text-white leading-snug group-hover:text-[#ff5a22] transition-colors duration-300">
                AI-Consulting <br />
                offerings
              </h3>
              
              {/* Accent Orange Underline */}
              <div className="w-8 h-[2px] bg-[#ff5a22] mt-2 mb-3 rounded-full" />
              
              <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300/90 leading-relaxed font-sans">
                Credibly innovate granular internal or organic sources.
              </p>
            </div>

            {/* Bottom-right diagonal pointer button */}
            <div className="flex justify-end mt-4">
              <div className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 group-hover:text-white group-hover:border-[#ff5a22] group-hover:bg-[#ff5a22] flex items-center justify-center transition-all duration-300">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </motion.div>

          {/* CELL 3: Business Process Automation */}
          <motion.div 
            className="group relative bg-white dark:bg-[#040916]/80 border border-slate-100 dark:border-white/5 rounded-2xl p-5 sm:p-6 md:p-7 flex flex-col justify-between text-left overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.02)] dark:shadow-2xl transition-all duration-300 hover:border-brand-orange/20 hover:bg-[#fffbf9] dark:hover:bg-[#081026] hover:shadow-[0_15px_40px_rgba(255,90,34,0.15)] dark:hover:shadow-[0_0_30px_rgba(255,90,34,0.15)] w-full min-h-[190px] sm:min-h-[210px] lg:min-h-[230px] cursor-pointer"
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.025 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
          >
            {/* Premium Glow Accents on Top/Bottom edges of the Card */}
            <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#ff5a22]/70 to-transparent opacity-40 group-hover:opacity-100 group-hover:scale-x-110 transition-all duration-500 shadow-[0_0_12px_rgba(255,90,34,0.4)]" />
            <div className="absolute bottom-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#ff5a22]/70 to-transparent opacity-40 group-hover:opacity-100 group-hover:scale-x-110 transition-all duration-500 shadow-[0_0_12px_rgba(255,90,34,0.4)]" />

            <div>
              {/* Circular icon container */}
              <div className="w-12 h-12 rounded-full border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#080d19] flex items-center justify-center text-[#ff5a22] shrink-0 mb-4 transition-colors duration-300 group-hover:border-[#ff5a22]/30">
                <Workflow className="w-5.5 h-5.5 stroke-[1.5]" />
              </div>
              
              <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 dark:text-white leading-snug group-hover:text-[#ff5a22] transition-colors duration-300">
                Business Process <br />
                Automation
              </h3>
              
              {/* Accent Underline */}
              <div className="w-8 h-[2px] bg-[#ff5a22] mt-2 mb-3 rounded-full" />
              
              <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                Credibly innovate granular internal or organic sources.
              </p>
            </div>

            {/* Bottom-right arrow button */}
            <div className="flex justify-end mt-4">
              <div className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 group-hover:text-white group-hover:border-[#ff5a22] group-hover:bg-[#ff5a22] flex items-center justify-center transition-all duration-300">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </motion.div>

          {/* CELL 4: Secure AI Implementation strategies */}
          <motion.div 
            className="group relative bg-white dark:bg-[#040916]/80 border border-slate-100 dark:border-white/5 rounded-2xl p-5 sm:p-6 md:p-7 flex flex-col justify-between text-left overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.02)] dark:shadow-2xl transition-all duration-300 hover:border-brand-orange/20 hover:bg-[#fffbf9] dark:hover:bg-[#081026] hover:shadow-[0_15px_40px_rgba(255,90,34,0.15)] dark:hover:shadow-[0_0_30px_rgba(255,90,34,0.15)] w-full min-h-[190px] sm:min-h-[210px] lg:min-h-[230px] cursor-pointer"
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.025 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
          >
            {/* Premium Glow Accents on Top/Bottom edges of the Card */}
            <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#ff5a22]/70 to-transparent opacity-40 group-hover:opacity-100 group-hover:scale-x-110 transition-all duration-500 shadow-[0_0_12px_rgba(255,90,34,0.4)]" />
            <div className="absolute bottom-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#ff5a22]/70 to-transparent opacity-40 group-hover:opacity-100 group-hover:scale-x-110 transition-all duration-500 shadow-[0_0_12px_rgba(255,90,34,0.4)]" />

            <div>
              {/* Circular icon container */}
              <div className="w-12 h-12 rounded-full border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#080d19] flex items-center justify-center text-[#ff5a22] shrink-0 mb-4 transition-colors duration-300 group-hover:border-[#ff5a22]/30">
                <ShieldCheck className="w-5.5 h-5.5 stroke-[1.5]" />
              </div>
              
              <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 dark:text-white leading-snug group-hover:text-[#ff5a22] transition-colors duration-300">
                Secure AI <br />
                Implementation strategies
              </h3>
              
              {/* Accent Underline */}
              <div className="w-8 h-[2px] bg-[#ff5a22] mt-2 mb-3 rounded-full" />
              
              <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                Credibly innovate granular internal or organic sources.
              </p>
            </div>

            {/* Bottom-right arrow button */}
            <div className="flex justify-end mt-4">
              <div className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 group-hover:text-white group-hover:border-[#ff5a22] group-hover:bg-[#ff5a22] flex items-center justify-center transition-all duration-300">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </motion.div>

          {/* CELL 5: Knowledge centralization Solutions */}
          <motion.div 
            className="group relative bg-white dark:bg-[#040916]/80 border border-slate-100 dark:border-white/5 rounded-2xl p-5 sm:p-6 md:p-7 flex flex-col justify-between text-left overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.02)] dark:shadow-2xl transition-all duration-300 hover:border-brand-orange/20 hover:bg-[#fffbf9] dark:hover:bg-[#081026] hover:shadow-[0_15px_40px_rgba(255,90,34,0.15)] dark:hover:shadow-[0_0_30px_rgba(255,90,34,0.15)] w-full min-h-[190px] sm:min-h-[210px] lg:min-h-[230px] cursor-pointer"
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.025 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
          >
            {/* Premium Glow Accents on Top/Bottom edges of the Card */}
            <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#ff5a22]/70 to-transparent opacity-40 group-hover:opacity-100 group-hover:scale-x-110 transition-all duration-500 shadow-[0_0_12px_rgba(255,90,34,0.4)]" />
            <div className="absolute bottom-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#ff5a22]/70 to-transparent opacity-40 group-hover:opacity-100 group-hover:scale-x-110 transition-all duration-500 shadow-[0_0_12px_rgba(255,90,34,0.4)]" />

            <div>
              {/* Circular icon container */}
              <div className="w-12 h-12 rounded-full border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#080d19] flex items-center justify-center text-[#ff5a22] shrink-0 mb-4 transition-colors duration-300 group-hover:border-[#ff5a22]/30">
                <Network className="w-5.5 h-5.5 stroke-[1.5]" />
              </div>
              
              <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 dark:text-white leading-snug group-hover:text-[#ff5a22] transition-colors duration-300">
                Knowledge <br />
                centralization Solutions
              </h3>
              
              {/* Accent Underline */}
              <div className="w-8 h-[2px] bg-[#ff5a22] mt-2 mb-3 rounded-full" />
              
              <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                Credibly innovate granular internal or organic sources.
              </p>
            </div>

            {/* Bottom-right arrow button */}
            <div className="flex justify-end mt-4">
              <div className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-800 text-slate-500 group-hover:text-white group-hover:border-[#ff5a22] group-hover:bg-[#ff5a22] flex items-center justify-center transition-all duration-300">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </motion.div>

          {/* CELL 6: AI implementation */}
          <motion.div 
            className="group relative bg-white dark:bg-[#040916]/80 border border-slate-100 dark:border-white/5 rounded-2xl p-5 sm:p-6 md:p-7 flex flex-col justify-between text-left overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.02)] dark:shadow-2xl transition-all duration-300 hover:border-brand-orange/20 hover:bg-[#fffbf9] dark:hover:bg-[#081026] hover:shadow-[0_15px_40px_rgba(255,90,34,0.15)] dark:hover:shadow-[0_0_30px_rgba(255,90,34,0.15)] w-full min-h-[190px] sm:min-h-[210px] lg:min-h-[230px] cursor-pointer"
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.025 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
          >
            {/* Premium Glow Accents on Top/Bottom edges of the Card */}
            <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#ff5a22]/70 to-transparent opacity-40 group-hover:opacity-100 group-hover:scale-x-110 transition-all duration-500 shadow-[0_0_12px_rgba(255,90,34,0.4)]" />
            <div className="absolute bottom-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#ff5a22]/70 to-transparent opacity-40 group-hover:opacity-100 group-hover:scale-x-110 transition-all duration-500 shadow-[0_0_12px_rgba(255,90,34,0.4)]" />

            <div>
              {/* Circular icon container */}
              <div className="w-12 h-12 rounded-full border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#080d19] flex items-center justify-center text-[#ff5a22] shrink-0 mb-4 transition-colors duration-300 group-hover:border-[#ff5a22]/30">
                <BrainCircuit className="w-5.5 h-5.5 stroke-[1.5]" />
              </div>
              
              <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 dark:text-white leading-snug group-hover:text-[#ff5a22] transition-colors duration-300">
                AI <br />
                implementation
              </h3>
              
              {/* Accent Underline */}
              <div className="w-8 h-[2px] bg-[#ff5a22] mt-2 mb-3 rounded-full" />
              
              <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                Credibly innovate granular internal or organic sources.
              </p>
            </div>

            {/* Bottom-right arrow button */}
            <div className="flex justify-end mt-4">
              <div className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-800 text-slate-500 group-hover:text-white group-hover:border-[#ff5a22] group-hover:bg-[#ff5a22] flex items-center justify-center transition-all duration-300">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </motion.div>

        </motion.div>

      </div>
    </section>
  );
}
