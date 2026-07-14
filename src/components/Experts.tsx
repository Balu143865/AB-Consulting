import React from 'react';
import { motion } from 'motion/react';
import { Linkedin, Twitter, Mail, User } from 'lucide-react';

export default function Experts() {
  const team = [
    {
      name: "Saskia Daly",
      role: "Founder",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=500"
    },
    {
      name: "Shayne Wallace",
      role: "HR Manager",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=500"
    },
    {
      name: "Niko Anderson",
      role: "CEO",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=500"
    }
  ];

  return (
    <section className="py-16 bg-white dark:bg-[#020714] relative overflow-hidden transition-colors duration-300" id="experts">
      
      {/* Decorative premium background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#ff5a22]/5 via-transparent to-transparent pointer-events-none" />
      
      {/* Glowing background waves */}
      <div className="absolute top-1/4 -left-1/4 w-[60%] aspect-square bg-[#ff5a22]/3 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-1/4 w-[60%] aspect-square bg-[#ff5a22]/3 rounded-full blur-[130px] pointer-events-none" />

      {/* Dot Grids in corners */}
      <div className="absolute top-12 left-12 w-24 h-24 bg-[radial-gradient(#ff5a22_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none hidden lg:block" />
      <div className="absolute bottom-12 right-12 w-24 h-24 bg-[radial-gradient(#ff5a22_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none hidden lg:block" />

      {/* High Fidelity Thin Accent Lines */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-slate-100 dark:via-white/5 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2.5">
          <div className="flex items-center justify-center gap-3">
            <div className="w-6 h-[1px] bg-[#ff5a22]/40" />
            <span className="text-xs font-bold text-[#ff5a22] uppercase tracking-[0.25em] font-mono block">
              CONSULTING LEADERSHIP
            </span>
            <div className="w-6 h-[1px] bg-[#ff5a22]/40" />
          </div>
          
          <h2 className="font-display font-black text-3xl sm:text-4xl text-[#0f172a] dark:text-white tracking-tight leading-none mb-3 transition-colors duration-300">
            Our <span className="text-[#ff5a22]">Experts</span>
          </h2>
          
          <div className="w-12 h-[2.5px] bg-[#ff5a22] mx-auto rounded-full mb-4" />
          
          <p className="text-slate-500 dark:text-slate-400 font-medium text-xs sm:text-sm leading-relaxed max-w-lg mx-auto transition-colors duration-300">
            Credibly innovate granular internal or organic sources whereas high standards in web-readiness.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {team.map((member, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="group relative bg-[#fafbfc] dark:bg-[#040916]/80 border border-slate-100 dark:border-white/5 rounded-2xl p-5 flex flex-col items-center justify-between text-center overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.02)] dark:shadow-2xl transition-all duration-500 hover:border-slate-200 dark:hover:border-white/10 hover:shadow-[0_15px_40px_rgba(255,90,34,0.15)] dark:hover:shadow-[0_0_30px_rgba(255,90,34,0.15)] hover:-translate-y-2 hover:scale-[1.02] w-full max-w-sm mx-auto"
            >
              {/* Premium Glow Accents on Top/Bottom edges of the Card */}
              <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#ff5a22]/70 to-transparent opacity-40 group-hover:opacity-100 group-hover:scale-x-110 transition-all duration-500 shadow-[0_0_12px_rgba(255,90,34,0.4)]" />
              <div className="absolute bottom-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#ff5a22]/70 to-transparent opacity-40 group-hover:opacity-100 group-hover:scale-x-110 transition-all duration-500 shadow-[0_0_12px_rgba(255,90,34,0.4)]" />

              {/* Top-Left Tiny Silhouette Icon in Circle */}
              <div className="absolute top-4 left-4 w-8 h-8 rounded-full border border-slate-100 dark:border-white/10 group-hover:border-[#ff5a22]/30 flex items-center justify-center text-[#ff5a22] bg-[#ff5a22]/5 transition-colors duration-300">
                <User className="w-3.5 h-3.5" />
              </div>

              {/* Portrait Container with Elegant Dark/Light Backdrop */}
              <div className="relative w-full aspect-[4/3.6] rounded-xl overflow-hidden mb-4 bg-gradient-to-b from-slate-100 to-slate-200 dark:from-[#0a1120] dark:to-[#040812]">
                <img 
                  src={member.image} 
                  alt={member.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top filter grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-102"
                />
                
                {/* Subtle bottom dark/light gradient overlay on image */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#fafbfc] dark:from-[#040916] to-transparent transition-all duration-500" />
              </div>

              {/* Member Details */}
              <div className="w-full space-y-1">
                <h3 className="font-display font-bold text-lg text-[#0f172a] dark:text-white group-hover:text-[#ff5a22] transition-colors duration-300">
                  {member.name}
                </h3>

                {/* Role with horizontal lines divider (Same as Mockup!) */}
                <div className="flex items-center justify-center gap-2.5 w-full my-1.5">
                  <div className="h-[1px] bg-gradient-to-r from-transparent to-[#ff5a22]/40 flex-1" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#ff5a22] font-mono leading-none whitespace-nowrap">
                    {member.role}
                  </span>
                  <div className="h-[1px] bg-gradient-to-l from-transparent to-[#ff5a22]/40 flex-1" />
                </div>
              </div>

              {/* Hoverable Social Icons */}
              <div className="flex items-center justify-center gap-2.5 mt-3">
                <a 
                  href="#" 
                  aria-label={`${member.name} LinkedIn`}
                  className="w-8 h-8 rounded-full border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-[#ff5a22] dark:hover:text-white hover:border-[#ff5a22]/50 hover:bg-[#ff5a22]/10 transition-all duration-300 shadow-sm"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                </a>
                <a 
                  href="#" 
                  aria-label={`${member.name} Twitter`}
                  className="w-8 h-8 rounded-full border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-[#ff5a22] dark:hover:text-white hover:border-[#ff5a22]/50 hover:bg-[#ff5a22]/10 transition-all duration-300 shadow-sm"
                >
                  <Twitter className="w-3.5 h-3.5" />
                </a>
                <a 
                  href="#" 
                  aria-label={`${member.name} Email`}
                  className="w-8 h-8 rounded-full border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-[#ff5a22] dark:hover:text-white hover:border-[#ff5a22]/50 hover:bg-[#ff5a22]/10 transition-all duration-300 shadow-sm"
                >
                  <Mail className="w-3.5 h-3.5" />
                </a>
              </div>

            </motion.div>
          ))}
        </div>

        {/* Dynamic Dot Indicators (Same as Mockup!) */}
        <div className="flex justify-center items-center gap-2 mt-8 relative z-10">
          <button 
            className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-800 hover:bg-slate-400 dark:hover:bg-slate-700 transition-colors cursor-pointer" 
            aria-label="Go to team slide 1" 
          />
          <button 
            className="w-5 h-2 rounded-full bg-[#ff5a22] transition-all cursor-pointer" 
            aria-label="Go to team slide 2" 
          />
          <button 
            className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-800 hover:bg-slate-400 dark:hover:bg-slate-700 transition-colors cursor-pointer" 
            aria-label="Go to team slide 3" 
          />
        </div>

      </div>
    </section>
  );
}
