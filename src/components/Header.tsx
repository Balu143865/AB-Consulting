import React from 'react';
import { Database, User, ShieldAlert, Sun, Moon } from 'lucide-react';
import { getCurrentUser } from '../lib/supabase';

interface HeaderProps {
  onOpenPortal: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export default function Header({ onOpenPortal, theme, onToggleTheme }: HeaderProps) {
  const activeUser = getCurrentUser();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-[#030712]/90 backdrop-blur-md border-b border-slate-200/50 dark:border-white/5 shadow-xs transition-colors duration-300" id="autenta-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="px-2.5 h-9 rounded-lg bg-brand-orange flex items-center justify-center text-white font-black text-base tracking-tight">
              AB
            </div>
            <span className="font-display font-bold text-xl tracking-wide transition-colors duration-300">
              <span className="text-[#FF6B35] font-extrabold">AB</span>
              <span className="text-slate-900 dark:text-white ml-1 font-semibold">Consulting</span>
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#about" className="text-sm font-medium text-slate-600 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white transition-colors duration-300">About Us</a>
            <a href="#services" className="text-sm font-medium text-slate-600 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white transition-colors duration-300">Services</a>
            <a href="#process" className="text-sm font-medium text-slate-600 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white transition-colors duration-300">Our Process</a>
            <a href="#cases" className="text-sm font-medium text-slate-600 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white transition-colors duration-300">Case Studies</a>
          </nav>

          {/* Call to Action */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleTheme}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white rounded-full border border-slate-200 dark:border-white/10 shadow-sm transition-all cursor-pointer hover:scale-105 active:scale-95 flex items-center justify-center"
              aria-label="Toggle Theme"
              id="theme-toggle"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#ff5a22]" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>
            <button 
              onClick={onOpenPortal}
              className="px-5 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-semibold rounded-full uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Database className="w-3.5 h-3.5" />
              <span>{activeUser ? `${activeUser.name}'s Portal` : 'Client Portal'}</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
