/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import AboutUs from './components/AboutUs';
import Services from './components/Services';
import Experts from './components/Experts';
import Process from './components/Process';
import CaseStudies from './components/CaseStudies';
import SuccessStories from './components/SuccessStories';
import Footer from './components/Footer';
import Portal from './components/Portal';
import { Database, Sparkles } from 'lucide-react';
import { getCurrentUser } from './lib/supabase';

export default function App() {
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    }
    return 'light';
  });
  const activeUser = getCurrentUser();

  const handleOpenPortal = () => {
    setIsPortalOpen(true);
  };

  const handleClosePortal = () => {
    setIsPortalOpen(false);
  };

  const handleToggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', next);
      return next;
    });
  };

  return (
    <div className={`min-h-screen font-sans antialiased flex flex-col justify-between transition-colors duration-300 ${theme === 'dark' ? 'bg-[#030712] text-slate-100 dark' : 'bg-white text-slate-800'}`} id="app-root">
      
      {/* Absolute Landing Header */}
      <Header onOpenPortal={handleOpenPortal} theme={theme} onToggleTheme={handleToggleTheme} />

      {/* Main Sections */}
      <main className="flex-1">
        <Hero onOpenPortal={handleOpenPortal} />
        <AboutUs onOpenPortal={handleOpenPortal} />
        <Services onOpenPortal={handleOpenPortal} />
        <Experts />
        <Process />
        <SuccessStories />
        <CaseStudies />
      </main>

      {/* Brand Footer */}
      <Footer />

      {/* Interactive Database, Auth & Chat Console Sidebar */}
      <Portal isOpen={isPortalOpen} onClose={handleClosePortal} />

      {/* Floating Call-to-Action Sandbox Indicator (For rapid testing) */}
      <div className="fixed bottom-6 left-6 z-40 hidden sm:flex">
        <button
          onClick={handleOpenPortal}
          className="bg-brand-dark/95 backdrop-blur-xs border border-brand-blue hover:border-brand-orange text-white px-4 py-3 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-103 transition-all flex items-center gap-3 cursor-pointer group text-left"
        >
          <div className="w-8 h-8 rounded-lg bg-brand-orange/20 flex items-center justify-center text-brand-orange group-hover:scale-110 transition-transform">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-brand-orange uppercase leading-none tracking-wider">Interactive Console</p>
            <p className="text-[11px] text-slate-300 font-semibold mt-1">
              {activeUser ? `Session: ${activeUser.name}` : 'Test Real-Time DB & Auth'}
            </p>
          </div>
        </button>
      </div>

    </div>
  );
}
