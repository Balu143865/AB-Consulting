import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, Linkedin, Github } from 'lucide-react';
import { motion } from 'motion/react';

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-brand-dark dark:bg-[#030712] text-slate-400 text-left pt-12 pb-6 border-t border-brand-blue/60 dark:border-white/5 transition-colors duration-300" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. TOP CONTACT ROW - Polished & Cohesive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10 items-stretch">
          
          {/* Phone Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#0c1530] dark:bg-slate-900/30 border border-slate-800 dark:border-white/5 py-4 px-5 rounded-xl flex items-center gap-4 transition-all duration-300 hover:border-brand-orange/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-1"
          >
            <div className="w-10 h-10 rounded-lg bg-brand-orange/10 flex items-center justify-center text-brand-orange shrink-0">
              <Phone className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 font-mono">Give Us A Call</p>
              <h4 className="font-display font-bold text-xs text-white mt-0.5">+91 6304045279</h4>
            </div>
          </motion.div>

          {/* Email Card (Highly highlighted with brand-orange gradient) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="bg-gradient-to-r from-brand-orange to-[#ff7a45] text-white py-4 px-5 rounded-xl flex items-center gap-4 shadow-lg transition-all duration-300 hover:shadow-[0_12px_35px_rgba(255,90,34,0.35)] hover:-translate-y-1"
          >
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-white shrink-0">
              <Mail className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-white/80 font-mono">Drop Us a Line</p>
              <h4 className="font-display font-bold text-xs text-white mt-0.5">balunaikbanavath662@gmail.com</h4>
            </div>
          </motion.div>

          {/* Location Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#0c1530] dark:bg-slate-900/30 border border-slate-800 dark:border-white/5 py-4 px-5 rounded-xl flex items-center gap-4 transition-all duration-300 hover:border-brand-orange/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-1"
          >
            <div className="w-10 h-10 rounded-lg bg-brand-orange/10 flex items-center justify-center text-brand-orange shrink-0">
              <MapPin className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 font-mono">Office Location</p>
              <h4 className="font-display font-bold text-xs text-white mt-0.5">Macherla, Palnadu, AP - 522426</h4>
            </div>
          </motion.div>

        </div>

        {/* 2. MAIN FOOTER CONTENT COLS */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-800/80 dark:border-white/5"
        >
          
          {/* Col 1: Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="px-2.5 h-9 rounded-xl bg-brand-orange flex items-center justify-center text-white font-black text-base tracking-tight shadow-md shadow-brand-orange/20">
                AB
              </div>
              <span className="font-display font-bold text-xl tracking-wide">
                <span className="text-[#FF6B35] font-extrabold">AB</span>
                <span className="text-white ml-1 font-semibold">Consulting</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Empowering enterprise leaders with cutting-edge artificial intelligence systems, robust automations, and scalable software architectures to compound growth.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3 pt-1">
              <a 
                href="https://www.linkedin.com/in/banavath-balu-naik-a9ab03298" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800/60 dark:bg-slate-900/60 hover:bg-brand-orange dark:hover:bg-brand-orange text-slate-300 hover:text-white flex items-center justify-center transition-all duration-300 shadow-md hover:-translate-y-0.5"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href="https://github.com/Balu143865" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800/60 dark:bg-slate-900/60 hover:bg-brand-orange dark:hover:bg-brand-orange text-slate-300 hover:text-white flex items-center justify-center transition-all duration-300 shadow-md hover:-translate-y-0.5"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="md:col-span-2 space-y-3">
            <h5 className="font-display font-bold text-[11px] text-slate-200 uppercase tracking-widest font-mono">Quick Links</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#about" className="hover:text-brand-orange transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-transparent group-hover:bg-brand-orange transition-all duration-300" />
                  About Us
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-brand-orange transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-transparent group-hover:bg-brand-orange transition-all duration-300" />
                  Services
                </a>
              </li>
              <li>
                <a href="#cases" className="hover:text-brand-orange transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-transparent group-hover:bg-brand-orange transition-all duration-300" />
                  Cases
                </a>
              </li>
              <li>
                <a href="#hero" className="hover:text-brand-orange transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-transparent group-hover:bg-brand-orange transition-all duration-300" />
                  Pricing
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-brand-orange transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-transparent group-hover:bg-brand-orange transition-all duration-300" />
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Useful Links */}
          <div className="md:col-span-2 space-y-3">
            <h5 className="font-display font-bold text-[11px] text-slate-200 uppercase tracking-widest font-mono">Useful Links</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#about" className="hover:text-brand-orange transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-transparent group-hover:bg-brand-orange transition-all duration-300" />
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-brand-orange transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-transparent group-hover:bg-brand-orange transition-all duration-300" />
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-brand-orange transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-transparent group-hover:bg-brand-orange transition-all duration-300" />
                  Disclaimer
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-brand-orange transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-transparent group-hover:bg-brand-orange transition-all duration-300" />
                  Support
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-brand-orange transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-transparent group-hover:bg-brand-orange transition-all duration-300" />
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter Form */}
          <div className="md:col-span-4 space-y-3">
            <h5 className="font-display font-bold text-[11px] text-slate-200 uppercase tracking-widest font-mono">Newsletter</h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              Subscribe to our enterprise brief to receive deep technical perspectives and smart automation workflows.
            </p>
            
            {newsletterSubscribed ? (
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-400 font-medium">
                Thank you for subscribing!
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex bg-[#0c1530] dark:bg-slate-900/60 p-1 rounded-xl border border-slate-800 dark:border-white/10 focus-within:border-brand-orange/50 transition-all duration-300">
                <input 
                  type="email" 
                  required
                  placeholder="Your Email Address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-transparent text-xs text-white focus:outline-none placeholder:text-slate-500"
                />
                <button 
                  type="submit"
                  className="px-3.5 py-1.5 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 hover:shadow-lg hover:shadow-brand-orange/20 shrink-0"
                >
                  <span>Send</span>
                  <Send className="w-3 h-3" />
                </button>
              </form>
            )}
          </div>

        </motion.div>

        {/* 3. COPYRIGHT & LEGAL ROW */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} AB Consulting. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#about" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#about" className="hover:text-slate-400 transition-colors">Terms of Service</a>
            <a href="#about" className="hover:text-slate-400 transition-colors">Cookie Settings</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
