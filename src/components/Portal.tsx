import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Lock, User, Send, Database, RefreshCw, 
  CheckCircle2, Clock, Sparkles, AlertCircle, 
  Layers, MessageSquare, Briefcase, Key, ChevronRight, FileText, Check, AlertTriangle,
  Download, FileSpreadsheet, FileDown
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  getCurrentUser, loginUser, registerUser, setCurrentUser,
  fetchQuotes, submitQuote, updateQuoteStatus, 
  fetchChats, sendChatMessage, subscribeToRealtime, 
  isUsingSupabase, subscribeToSupabaseStatus, setIsUsingSupabase 
} from '../lib/supabase';
import { UserProfile, QuoteRequest, ChatMessage } from '../types';

interface PortalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Portal({ isOpen, onClose }: PortalProps) {
  const [activeTab, setActiveTab] = useState<'auth' | 'client' | 'consultant'>('auth');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Dynamic Supabase connection status state
  const [supabaseActive, setSupabaseActive] = useState(isUsingSupabase);

  useEffect(() => {
    const unsubscribe = subscribeToSupabaseStatus((active) => {
      setSupabaseActive(active);
    });
    return unsubscribe;
  }, []);
  
  // Auth Form
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'client' | 'consultant'>('client');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  
  // Database States
  const [user, setUser] = useState<UserProfile | null>(null);
  const [quotesList, setQuotesList] = useState<QuoteRequest[]>([]);
  const [chatsList, setChatsList] = useState<ChatMessage[]>([]);
  const [dbLoading, setDbLoading] = useState(false);
  
  // New Quote Form
  const [quoteCompany, setQuoteCompany] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [quoteMessage, setQuoteMessage] = useState('');
  const [quoteBudget, setQuoteBudget] = useState('$10,000 - $25,000');
  const [quoteSuccess, setQuoteSuccess] = useState(false);
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);
  
  // New Chat Message Form
  const [newMessage, setNewMessage] = useState('');
  const [mobileSubTab, setMobileSubTab] = useState<'workspace' | 'chat'>('workspace');
  const [chatSubmitting, setChatSubmitting] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  
  // Supabase Status
  const [configInfo, setConfigInfo] = useState({
    supabaseConfigured: false,
    supabaseUrl: '',
    geminiConfigured: false
  });

  const availableServices = [
    "AI-Consulting offerings",
    "Business Process Automation",
    "Secure AI Implementation strategies",
    "Knowledge centralization Solutions",
    "AI implementation"
  ];

  // Fetch initial configs
  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => setConfigInfo(data))
      .catch(err => console.error("Error fetching server configs:", err));
  }, []);

  // Update session on mount & state changes
  useEffect(() => {
    const activeUser = getCurrentUser();
    if (activeUser) {
      setUser(activeUser);
      setActiveTab(activeUser.role === 'consultant' ? 'consultant' : 'client');
      loadDatabaseData();
    } else {
      setActiveTab('auth');
    }
  }, []);

  // Load database data
  const loadDatabaseData = async () => {
    setDbLoading(true);
    try {
      const fetchedQuotes = await fetchQuotes();
      const fetchedChats = await fetchChats();
      setQuotesList(fetchedQuotes);
      setChatsList(fetchedChats);
    } catch (err) {
      console.error("Error loading DB records:", err);
    } finally {
      setDbLoading(false);
    }
  };

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatsList]);

  // Subscribe to Real-Time events via SSE or Supabase
  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToRealtime((event) => {
      console.log("Realtime event received in UI:", event);
      
      if (event.type === 'quote_created') {
        setQuotesList(prev => {
          // Prevent duplicates (idempotency guard)
          if (prev.some(q => q.id === event.data.id)) return prev;
          return [event.data, ...prev];
        });
      } else if (event.type === 'quote_updated') {
        setQuotesList(prev => prev.map(q => q.id === event.data.id ? event.data : q));
      } else if (event.type === 'chat_message') {
        setChatsList(prev => {
          // Prevent duplicates
          if (prev.some(c => c.id === event.data.id)) return prev;
          return [...prev, event.data];
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user, supabaseActive]);

  // Robust, automatic polling fallback to keep client and database 100% in sync
  useEffect(() => {
    if (!user || activeTab === 'auth') return;

    const interval = setInterval(async () => {
      try {
        const fetchedQuotes = await fetchQuotes();
        const fetchedChats = await fetchChats();
        
        // Update states only if deep comparison reveals actual modifications, preventing redundant state thrashing
        setQuotesList(prev => {
          if (JSON.stringify(prev) !== JSON.stringify(fetchedQuotes)) {
            return fetchedQuotes;
          }
          return prev;
        });

        setChatsList(prev => {
          if (JSON.stringify(prev) !== JSON.stringify(fetchedChats)) {
            return fetchedChats;
          }
          return prev;
        });
      } catch (err) {
        console.error("Database polling error:", err);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [user, activeTab]);

  // Handle Auth submission
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setAuthError('');
    setAuthLoading(true);

    try {
      if (authMode === 'login') {
        const result = await loginUser(email);
        if (result.error) {
          setAuthError(result.error);
        } else {
          setUser(result.user);
          setActiveTab(result.user.role === 'consultant' ? 'consultant' : 'client');
          loadDatabaseData();
        }
      } else {
        if (!name) {
          setAuthError('Name is required for registration.');
          setAuthLoading(false);
          return;
        }
        const result = await registerUser(email, name, role);
        if (result.error) {
          setAuthError(result.error);
        } else {
          setUser(result.user);
          setActiveTab(result.user.role === 'consultant' ? 'consultant' : 'client');
          loadDatabaseData();
        }
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  // Quick Login for testing side-by-side
  const triggerQuickLogin = async (targetRole: 'client' | 'consultant') => {
    const demoEmail = targetRole === 'consultant' ? 'consultant@autenta.ai' : 'balunaikbanavath662@gmail.com';
    const demoName = targetRole === 'consultant' ? 'Saskia Daly' : 'Balu Naik';
    
    setAuthError('');
    setAuthLoading(true);

    try {
      const result = await loginUser(demoEmail);
      if (!result.error) {
        setUser(result.user);
        setActiveTab(targetRole);
        loadDatabaseData();
      } else {
        // If profile doesn't exist locally, register it
        const regResult = await registerUser(demoEmail, demoName, targetRole);
        if (!regResult.error) {
          setUser(regResult.user);
          setActiveTab(targetRole);
          loadDatabaseData();
        } else {
          setAuthError(regResult.error);
        }
      }
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  // Submit quote from client
  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !quoteMessage) return;

    setQuoteSubmitting(true);
    setQuoteSuccess(false);

    try {
      const result = await submitQuote({
        client_name: user.name,
        client_email: user.email,
        company: quoteCompany || 'N/A',
        services: selectedServices,
        message: quoteMessage,
        budget: quoteBudget
      });

      if (result) {
        setQuoteSuccess(true);
        setQuoteCompany('');
        setSelectedServices([]);
        setQuoteMessage('');
        loadDatabaseData(); // Reload
      }
    } catch (err) {
      console.error("Error submitting quote:", err);
    } finally {
      setQuoteSubmitting(false);
    }
  };

  // Toggle selected services
  const toggleService = (service: string) => {
    setSelectedServices(prev => 
      prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
    );
  };

  // Update status of quote (Consultant Dashboard)
  const handleStatusUpdate = async (id: string, status: QuoteRequest['status']) => {
    try {
      await updateQuoteStatus(id, status);
      // Real-time listener will update our list automatically, but let's apply local fallback update just in case
      setQuotesList(prev => prev.map(q => q.id === id ? { ...q, status } : q));
    } catch (err) {
      console.error("Error updating quote status:", err);
    }
  };

  // Send a Chat Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newMessage.trim()) return;

    const textToSend = newMessage;
    console.log(`[CLIENT CHAT] Sending message for user_id=${user.id}: "${textToSend}"`);
    setNewMessage('');
    setChatSubmitting(true);

    try {
      // Add message as client or consultant
      const senderRole = user.role === 'consultant' ? 'consultant' : 'user';
      const result = await sendChatMessage(user.id, senderRole as any, textToSend);
      console.log("[CLIENT CHAT] sendChatMessage result:", result);
      if (result) {
        // Support both old flat response format and new multi-message format
        const sentMsg = (result as any).message || result;
        const aiResponse = (result as any).aiResponse;

        setChatsList(prev => {
          let updated = [...prev];
          if (!updated.some(c => c.id === sentMsg.id)) {
            updated.push(sentMsg);
          }
          if (aiResponse && !updated.some(c => c.id === aiResponse.id)) {
            updated.push(aiResponse);
          }
          console.log("[CLIENT CHAT] Local chatsList state updated:", updated);
          return updated;
        });
      }
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setChatSubmitting(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUser(null);
    setActiveTab('auth');
    setQuotesList([]);
    setChatsList([]);
  };

  // SQL Script for Supabase Table Setup
  const supabaseSqlScript = `-- SUPABASE DATABASE SETUP FOR AUTENTA AI CONSULTING
-- Run this in your Supabase SQL Editor to set up tables

-- 1. Create Profiles Table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'client' CHECK (role IN ('client', 'consultant')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Quotes Table
CREATE TABLE public.quotes (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  company TEXT DEFAULT 'N/A',
  services TEXT[] DEFAULT '{}',
  message TEXT NOT NULL,
  budget TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Chats Table
CREATE TABLE public.chats (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  user_id TEXT NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'ai', 'consultant')),
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;

-- 5. Open security policies (for ease of development/testing)
CREATE POLICY "Allow public access" ON public.profiles FOR ALL USING (true);
CREATE POLICY "Allow public access" ON public.quotes FOR ALL USING (true);
CREATE POLICY "Allow public access" ON public.chats FOR ALL USING (true);
`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end" id="autenta-portal">
      {/* Overlay Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Slide-out Panel */}
      <div className="relative w-full max-w-4xl h-full bg-white dark:bg-[#070d1e] text-slate-800 dark:text-slate-100 shadow-2xl flex flex-col z-10 animate-slide-in">
        
        {/* Header */}
        <div className="px-6 py-4 bg-brand-dark text-white flex items-center justify-between border-b border-brand-blue/30">
          <div className="flex items-center gap-3">
            <div className="px-2.5 h-10 rounded-lg bg-brand-orange flex items-center justify-center text-white font-black text-lg tracking-tight">
              AB
            </div>
            <div>
              <h3 className="font-display font-bold text-lg leading-tight">AB Consulting Client & Expert Portal</h3>
              <div className="text-xs text-slate-300 flex items-center gap-1.5 flex-wrap mt-0.5">
                <Database className="w-3 h-3 text-brand-orange animate-pulse" />
                {supabaseActive ? (
                  <span className="text-emerald-400 font-semibold">Supabase Cloud Connected (Real-Time Live)</span>
                ) : (
                  <span className="text-amber-400 font-semibold">Local Preview Engine (SSE Live)</span>
                )}
                
                {configInfo.supabaseConfigured && (
                  <button
                    onClick={() => {
                      const target = !supabaseActive;
                      setIsUsingSupabase(target);
                      loadDatabaseData();
                    }}
                    className="ml-2 px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[10px] text-slate-300 hover:text-white border border-white/10 transition-all flex items-center gap-1 cursor-pointer"
                    title="Switch Database Engine dynamically"
                  >
                    <RefreshCw className="w-2.5 h-2.5" />
                    <span>Use {supabaseActive ? "Local Engine" : "Supabase Cloud"}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden sm:flex items-center gap-2 bg-brand-blue/40 px-3 py-1 rounded-full text-xs">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-medium text-slate-200">{user.name} ({user.role})</span>
                <button 
                  onClick={handleLogout}
                  className="ml-2 text-slate-400 hover:text-brand-orange transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Tab Swapper (Visible on mobile/small viewports only) */}
        {user && activeTab !== 'auth' && (
          <div className="flex md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070d1e] p-1.5 gap-2 shrink-0">
            <button
              onClick={() => setMobileSubTab('workspace')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                mobileSubTab === 'workspace'
                  ? 'bg-brand-orange text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Workspace & Pipeline</span>
            </button>
            <button
              onClick={() => setMobileSubTab('chat')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 relative ${
                mobileSubTab === 'chat'
                  ? 'bg-brand-orange text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Live AI Consultation</span>
              <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </button>
          </div>
        )}

        {/* Content Container */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row bg-slate-50 dark:bg-[#040814]">
          
          {/* Main Dashboard Workspace */}
          <div className={`flex-1 p-6 overflow-y-auto flex flex-col ${mobileSubTab === 'workspace' ? 'flex' : 'hidden md:flex'}`}>
            
            {configInfo.supabaseConfigured && !supabaseActive && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-slate-800 text-xs shadow-xs space-y-2">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4.5 h-4.5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-amber-800 text-sm">Supabase Table Schema Not Detected</h5>
                    <p className="text-slate-600 mt-0.5 leading-relaxed">
                      Your Supabase connection parameters are active, but the required database tables (<code className="bg-amber-100/80 px-1 py-0.5 rounded text-amber-900 font-mono text-[10px]">profiles</code>, <code className="bg-amber-100/80 px-1 py-0.5 rounded text-amber-900 font-mono text-[10px]">quotes</code>, and <code className="bg-amber-100/80 px-1 py-0.5 rounded text-amber-900 font-mono text-[10px]">chats</code>) do not exist yet in your Supabase project.
                    </p>
                    <p className="text-slate-600 mt-1">
                      We have **seamlessly switched you to our local preview engine** so that the application is fully functional. To enable real persistent cloud storage, execute this script inside your **Supabase SQL Editor**:
                    </p>
                  </div>
                </div>
                <div className="relative mt-2">
                  <pre className="p-3 bg-slate-900 text-slate-300 rounded-xl font-mono text-[10px] overflow-x-auto max-h-36">
                    {supabaseSqlScript}
                  </pre>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(supabaseSqlScript);
                    }}
                    className="absolute right-2 top-2 px-2.5 py-1 bg-brand-orange hover:bg-brand-orange-hover text-white rounded text-[10px] font-semibold tracking-wide transition-all shadow-sm active:scale-95 cursor-pointer"
                  >
                    Copy SQL Script
                  </button>
                </div>
              </div>
            )}
            
            {/* 1. AUTHENTICATION COMPONENT */}
            {activeTab === 'auth' && (
              <div className="max-w-md mx-auto my-auto w-full bg-white dark:bg-[#0b1329] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-md p-8">
                <div className="text-center mb-8">
                  <div className="w-12 h-12 bg-brand-orange/10 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-orange">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h4 className="font-display font-bold text-2xl text-brand-dark dark:text-white">Access Secure Portal</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Sign in to manage quote requests & consult in real-time</p>
                </div>

                <div className="flex bg-slate-100 dark:bg-[#141d36] p-1 rounded-xl mb-6">
                  <button
                    onClick={() => setAuthMode('login')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                      authMode === 'login' ? 'bg-white dark:bg-[#0b1329] text-brand-dark dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setAuthMode('register')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                      authMode === 'register' ? 'bg-white dark:bg-[#0b1329] text-brand-dark dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                    }`}
                  >
                    Register
                  </button>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                  {authMode === 'register' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase mb-1">Your Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-slate-400 dark:text-slate-500" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Balu Naik"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#121b33] border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase mb-1">Email Address</label>
                    <div className="relative">
                      <Send className="absolute left-3 top-3 w-4 h-4 text-slate-400 dark:text-slate-500" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. balunaikbanavath662@gmail.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#121b33] border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                      />
                    </div>
                  </div>

                  {authMode === 'register' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase mb-1">Portal Account Role</label>
                      <div className="grid grid-cols-2 gap-3 mt-1">
                        <button
                          type="button"
                          onClick={() => setRole('client')}
                          className={`py-2 px-3 border rounded-xl text-xs font-medium text-center transition-all ${
                            role === 'client' 
                              ? 'bg-brand-orange/10 border-brand-orange text-brand-orange' 
                              : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#121b33] hover:bg-slate-100 dark:hover:bg-[#182340] text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          Client Account
                        </button>
                        <button
                          type="button"
                          onClick={() => setRole('consultant')}
                          className={`py-2 px-3 border rounded-xl text-xs font-medium text-center transition-all ${
                            role === 'consultant' 
                              ? 'bg-brand-blue/10 border-brand-blue text-brand-blue dark:text-blue-400' 
                              : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#121b33] hover:bg-slate-100 dark:hover:bg-[#182340] text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          AI Consultant
                        </button>
                      </div>
                    </div>
                  )}

                  {authError && (
                    <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-3 bg-brand-orange hover:bg-brand-orange-hover text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {authLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>{authMode === 'login' ? 'Sign In to Portal' : 'Create Account'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Developer Quick-logins (One-Click Testing) */}
                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 text-center">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                    🚀 Developer Quick-Sandbox Profiles
                  </p>
                  <p className="text-xxs text-slate-400 dark:text-slate-500 mb-4 leading-normal">
                    Perfect for testing real-time synchronization between separate screens. Open the app in two tabs to see instant updates!
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => triggerQuickLogin('client')}
                      className="py-2.5 px-3 bg-slate-50 dark:bg-[#121b33] hover:bg-slate-100 dark:hover:bg-[#182340] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-300 flex flex-col items-center gap-1 transition-all group"
                    >
                      <span className="font-semibold text-brand-orange group-hover:scale-105 transition-transform">Login as Client</span>
                      <span className="text-xxs text-slate-400 dark:text-slate-500">Balu Naik (demo)</span>
                    </button>
                    <button
                      onClick={() => triggerQuickLogin('consultant')}
                      className="py-2.5 px-3 bg-slate-50 dark:bg-[#121b33] hover:bg-slate-100 dark:hover:bg-[#182340] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-300 flex flex-col items-center gap-1 transition-all group"
                    >
                      <span className="font-semibold text-brand-blue dark:text-blue-400 group-hover:scale-105 transition-transform">Login as Expert</span>
                      <span className="text-xxs text-slate-400 dark:text-slate-500">Saskia Daly (demo)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. CLIENT PORTAL WORKSPACE */}
            {user && activeTab === 'client' && (
              <div className="space-y-6 flex-1 flex flex-col">
                
                {/* Client Welcome Banner */}
                <div className="bg-brand-blue text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 top-0 opacity-10 pointer-events-none flex items-center justify-center p-6">
                    <Sparkles className="w-40 h-40" />
                  </div>
                  <span className="px-2.5 py-1 bg-brand-orange/20 text-brand-orange text-xxs font-semibold rounded-full uppercase tracking-wider">
                    Client Workspace
                  </span>
                  <h4 className="font-display font-bold text-2xl mt-2">Welcome Back, {user.name}</h4>
                  <p className="text-sm text-slate-200 mt-1">Submit high-value quote requests and chat with our senior AI engine in real-time.</p>
                </div>

                {/* Grid Layout: Left form, Right status */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-stretch">
                  
                  {/* Submit Quote Section */}
                  <div className="lg:col-span-7 bg-white dark:bg-[#0b1329] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs p-6 flex flex-col">
                    <h5 className="font-display font-bold text-lg text-brand-dark dark:text-white mb-4 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-brand-orange" />
                      Request a Custom AI Quote
                    </h5>
                    
                    {quoteSuccess ? (
                      <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl p-5 text-center my-auto space-y-4">
                        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                          <Check className="w-6 h-6" />
                        </div>
                        <h6 className="font-display font-bold text-emerald-900 dark:text-white text-lg">Quote Request Submitted!</h6>
                        <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed max-w-sm mx-auto">
                          Your AI consulting request was broadcasted in **real-time** to our senior partners. Any status updates will reflect instantly on your dashboard.
                        </p>
                        <button
                          onClick={() => setQuoteSuccess(false)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer"
                        >
                          Submit Another Quote
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleQuoteSubmit} className="space-y-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Company Name</label>
                              <input
                                type="text"
                                value={quoteCompany}
                                onChange={(e) => setQuoteCompany(e.target.value)}
                                placeholder="e.g. Future Tech Corp"
                                className="w-full px-3 py-2 bg-white dark:bg-[#121b33] border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Estimated Budget Scope</label>
                              <select
                                value={quoteBudget}
                                onChange={(e) => setQuoteBudget(e.target.value)}
                                className="w-full px-3 py-2 bg-white dark:bg-[#121b33] border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
                              >
                                <option>$5,000 - $10,000</option>
                                <option>$10,000 - $25,000</option>
                                <option>$25,000 - $50,000</option>
                                <option>$50,000 - $100,000</option>
                                <option>$100,000+</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Select Required Services</label>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {availableServices.map((service, i) => {
                                const selected = selectedServices.includes(service);
                                return (
                                  <button
                                    key={i}
                                    type="button"
                                    onClick={() => toggleService(service)}
                                    className={`py-1.5 px-3 rounded-lg text-xs transition-all border ${
                                      selected 
                                        ? 'bg-brand-orange text-white border-brand-orange font-medium' 
                                        : 'bg-slate-50 dark:bg-[#121b33] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#192440]'
                                    }`}
                                  >
                                    {service}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Project Details / Requirements</label>
                            <textarea
                              required
                              rows={4}
                              value={quoteMessage}
                              onChange={(e) => setQuoteMessage(e.target.value)}
                              placeholder="Please describe your business requirements and objectives..."
                              className="w-full px-3 py-2 bg-white dark:bg-[#121b33] border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 resize-none"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={quoteSubmitting}
                          className="w-full mt-4 py-3 bg-brand-orange hover:bg-brand-orange-hover text-white rounded-xl text-sm font-semibold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          {quoteSubmitting ? (
                            <RefreshCw className="w-4.5 h-4.5 animate-spin" />
                          ) : (
                            <>
                              <span>Submit Broadcast Request</span>
                              <Sparkles className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </form>
                    )}
                  </div>

                  {/* Quotes Status Section */}
                  <div className="lg:col-span-5 bg-white dark:bg-[#0b1329] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs p-6 flex flex-col">
                    <h5 className="font-display font-bold text-lg text-brand-dark dark:text-white mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Layers className="w-5 h-5 text-brand-blue" />
                        <span>Live Activity Stream</span>
                      </div>
                      <span className="text-xxs px-2 py-0.5 bg-slate-100 dark:bg-[#121b33] text-slate-500 dark:text-slate-400 rounded font-semibold uppercase">
                        Quotes Active
                      </span>
                    </h5>

                    {dbLoading ? (
                      <div className="flex-1 flex flex-col items-center justify-center space-y-2 text-slate-400">
                        <RefreshCw className="w-6 h-6 animate-spin" />
                        <span className="text-xs">Connecting...</span>
                      </div>
                    ) : quotesList.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl my-auto">
                        <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2" />
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">No active quote requests</p>
                        <p className="text-xxs text-slate-400 dark:text-slate-500 mt-1">Submit the form to see real-time synchronization.</p>
                      </div>
                    ) : (
                      <div className="flex-1 space-y-3 overflow-y-auto max-h-[350px] pr-1 custom-scrollbar">
                        {quotesList.map((q, i) => {
                          const isOwn = q.client_email === user.email;
                          return (
                            <div 
                              key={`quote-item-${q.id || i}-${i}`} 
                              className={`p-3 rounded-xl border transition-all ${
                                isOwn 
                                  ? 'border-brand-orange/20 bg-brand-orange/5 dark:bg-brand-orange/10' 
                                  : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#121b33]/40'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-xs text-brand-dark dark:text-white max-w-[120px] truncate">{q.company}</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5 transition-all ${
                                  q.status === 'pending' ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400' :
                                  q.status === 'reviewed' ? 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400' :
                                  q.status === 'approved' ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400' :
                                  'bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400'
                                }`}>
                                  {q.status === 'pending' && (
                                    <span className="relative flex h-1.5 w-1.5 shrink-0">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-600 dark:bg-amber-400"></span>
                                    </span>
                                  )}
                                  {q.status === 'reviewed' && (
                                    <span className="relative flex h-1.5 w-1.5 shrink-0">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-600 dark:bg-indigo-400"></span>
                                    </span>
                                  )}
                                  {q.status === 'approved' && (
                                    <span className="relative flex h-1.5 w-1.5 shrink-0">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-600 dark:bg-emerald-400"></span>
                                    </span>
                                  )}
                                  {q.status === 'pending' && <Clock className="w-3 h-3" />}
                                  {q.status === 'reviewed' && <RefreshCw className="w-3 h-3 animate-spin" />}
                                  {q.status === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                                  {q.status.toUpperCase()}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-snug">{q.message}</p>
                              
                              <div className="mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-800/80 flex justify-between items-center text-[10px] text-slate-400">
                                <span className="font-medium text-slate-500 dark:text-slate-300">{q.budget}</span>
                                <span>{new Date(q.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Visual Analytics Section */}
                <PortalAnalytics quotesList={quotesList} chatsList={chatsList} user={user} />
              </div>
            )}

            {/* 3. CONSULTANT PORTAL WORKSPACE */}
            {user && activeTab === 'consultant' && (
              <div className="space-y-6 flex-1 flex flex-col">
                
                {/* Consultant Welcome Banner */}
                <div className="bg-brand-orange text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 top-0 opacity-10 pointer-events-none flex items-center justify-center p-6">
                    <Layers className="w-40 h-40" />
                  </div>
                  <span className="px-2.5 py-1 bg-brand-dark/20 text-brand-dark text-xxs font-bold rounded-full uppercase tracking-wider">
                    Consultant Panel
                  </span>
                  <h4 className="font-display font-bold text-2xl mt-2">Expert Console: Saskia Daly</h4>
                  <p className="text-sm text-brand-light mt-1">Review active leads and manage incoming quote requests in real-time.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-stretch">
                  
                  {/* Active Quotes Management Panel */}
                  <div className="lg:col-span-7 bg-white dark:bg-[#0b1329] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs p-6 flex flex-col">
                    <h5 className="font-display font-bold text-lg text-brand-dark dark:text-white mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-brand-orange" />
                        <span>Quotes Request Pipeline</span>
                      </div>
                      <span className="text-xxs px-2.5 py-1 bg-brand-orange/10 text-brand-orange rounded-full font-bold">
                        {quotesList.length} Active Leads
                      </span>
                    </h5>

                    {dbLoading ? (
                      <div className="flex-1 flex flex-col items-center justify-center space-y-2 text-slate-400">
                        <RefreshCw className="w-6 h-6 animate-spin" />
                        <span className="text-xs">Updating Pipe...</span>
                      </div>
                    ) : quotesList.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl my-auto">
                        <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2" />
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Pipeline is empty</p>
                        <p className="text-xxs text-slate-400 dark:text-slate-500 mt-1">Requests submitted by clients appear instantly.</p>
                      </div>
                    ) : (
                      <div className="flex-1 space-y-4 overflow-y-auto max-h-[380px] pr-1 custom-scrollbar">
                        {quotesList.map((q, i) => (
                          <div 
                            key={`consultant-quote-${q.id || i}-${i}`} 
                            className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#121b33] hover:border-slate-200 dark:hover:border-slate-700 transition-all space-y-3"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <h6 className="font-semibold text-sm text-brand-dark dark:text-white leading-tight">{q.company}</h6>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">By {q.client_name} • {q.client_email}</p>
                              </div>
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1 transition-all ${
                                q.status === 'pending' ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400' :
                                q.status === 'reviewed' ? 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400' :
                                q.status === 'approved' ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400' :
                                'bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400'
                              }`}>
                                {q.status === 'pending' && (
                                  <span className="relative flex h-1.5 w-1.5 shrink-0">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-600 dark:bg-amber-400"></span>
                                  </span>
                                )}
                                {q.status === 'reviewed' && (
                                  <span className="relative flex h-1.5 w-1.5 shrink-0">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-600 dark:bg-indigo-400"></span>
                                  </span>
                                )}
                                {q.status === 'approved' && (
                                  <span className="relative flex h-1.5 w-1.5 shrink-0">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-600 dark:bg-emerald-400"></span>
                                  </span>
                                )}
                                {q.status}
                              </span>
                            </div>

                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-normal bg-white dark:bg-[#182340] p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">{q.message}</p>

                            {q.services && q.services.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {q.services.map((srv, i) => (
                                  <span key={i} className="text-[9px] font-medium px-2 py-0.5 bg-slate-200/60 dark:bg-[#1c294a] text-slate-600 dark:text-slate-300 rounded">
                                    {srv}
                                  </span>
                                ))}
                              </div>
                            )}

                            <div className="pt-3 border-t border-slate-200/50 dark:border-slate-800/80 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2">
                              <span className="text-xs font-bold text-brand-blue dark:text-blue-400">{q.budget}</span>
                              
                              {/* Quick status actions */}
                              <div className="flex gap-1.5">
                                <button
                                  onClick={() => handleStatusUpdate(q.id, 'reviewed')}
                                  className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-all cursor-pointer ${
                                    q.status === 'reviewed' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-[#1e294b] hover:bg-indigo-50 dark:hover:bg-indigo-950 text-indigo-600 dark:text-indigo-300'
                                  }`}
                                >
                                  Reviewing
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(q.id, 'approved')}
                                  className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-all cursor-pointer ${
                                    q.status === 'approved' ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-[#1b3a2a] hover:bg-emerald-50 dark:hover:bg-emerald-950 text-emerald-600 dark:text-emerald-300'
                                  }`}
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(q.id, 'rejected')}
                                  className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-all cursor-pointer ${
                                    q.status === 'rejected' ? 'bg-red-600 text-white' : 'bg-slate-200 dark:bg-[#4a1d1d] hover:bg-red-50 dark:hover:bg-red-950 text-red-600 dark:text-red-300'
                                  }`}
                                >
                                  Reject
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Supabase Technical Integration center */}
                  <div className="lg:col-span-5 bg-slate-900 text-white rounded-2xl p-5 shadow-xs flex flex-col justify-between overflow-hidden relative">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Key className="w-5 h-5 text-brand-orange" />
                        <h5 className="font-display font-bold text-md text-white">Supabase DB Sync Guide</h5>
                      </div>
                      
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        This full-stack applet features dual-mode syncing. To run this exact app using your **live Supabase database**, copy this SQL schema to provision tables in 10 seconds:
                      </p>

                      <div className="relative group bg-black/60 rounded-lg p-3 text-xxs font-mono overflow-y-auto max-h-[190px] text-slate-400 border border-slate-800 custom-scrollbar select-all">
                        <pre className="whitespace-pre-wrap">{supabaseSqlScript}</pre>
                      </div>

                      <div className="p-3 bg-white/5 rounded-xl flex items-start gap-2.5 border border-white/10 text-slate-300">
                        <AlertTriangle className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                        <p className="text-[10px] leading-snug">
                          Paste credentials in AI Studio **Settings &gt; Secrets** (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`) to immediately trigger actual production Postgres binding.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visual Analytics Section */}
                <PortalAnalytics quotesList={quotesList} chatsList={chatsList} user={user} />
              </div>
            )}
          </div>

          {/* RIGHT SIDE: Real-time Live Consultation Chat */}
          {user && activeTab !== 'auth' && (
            <div className={`w-full md:w-[360px] border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1329] flex flex-col h-full overflow-hidden shrink-0 ${mobileSubTab === 'chat' ? 'flex' : 'hidden md:flex'}`}>
              
              {/* Chat Title bar */}
              <div className="px-4 py-3 bg-slate-50 dark:bg-[#121b33] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange font-bold text-sm">
                    <Sparkles className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-xs text-slate-800 dark:text-white leading-tight">Live Consultation Chat</h5>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Saskia Daly (AI Expert)
                    </p>
                  </div>
                </div>
                
                <span className="text-[9px] px-1.5 py-0.5 bg-slate-100 dark:bg-[#141d36] text-slate-50 dark:text-slate-400 rounded font-bold uppercase">
                  Gemini Active
                </span>
              </div>

              {/* Chat Messages Log */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-[#0e1730]/50 custom-scrollbar">
                {chatsList.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4">
                    <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2" />
                    <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">Consultation has started</p>
                    <p className="text-xxs text-slate-400 dark:text-slate-500 mt-0.5">Send a message to receive a consulting recommendation.</p>
                  </div>
                ) : (
                  chatsList.map((msg, i) => {
                    const isOwn = msg.sender === 'consultant' ? user.role === 'consultant' : (msg.sender === 'user' && user.role === 'client');
                    const senderLabel = msg.sender === 'ai' ? 'Saskia (AI)' : (msg.sender === 'consultant' ? 'Saskia (Expert)' : 'You');
                    return (
                      <div 
                        key={`chat-msg-${msg.id || i}-${i}`} 
                        className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}
                      >
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium mb-0.5 px-1">{senderLabel}</span>
                        <div className={`p-3 rounded-2xl max-w-[85%] text-xs shadow-xxs leading-relaxed ${
                          isOwn 
                            ? 'bg-brand-orange text-white rounded-br-none' 
                            : msg.sender === 'ai' 
                              ? 'bg-slate-950 dark:bg-[#182340] text-slate-100 dark:text-slate-200 rounded-bl-none border border-brand-blue/30 dark:border-slate-800'
                              : 'bg-white dark:bg-[#121b33] text-slate-700 dark:text-slate-200 rounded-bl-none border border-slate-100 dark:border-slate-800/80'
                        }`}>
                          {msg.message}
                        </div>
                      </div>
                    );
                  })
                )}
                
                {chatSubmitting && (
                  <div className="flex flex-col items-start animate-pulse">
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium mb-0.5 px-1">Saskia (AI)</span>
                    <div className="p-3 bg-slate-950 dark:bg-[#182340] text-slate-300 rounded-2xl rounded-bl-none border border-brand-blue/30 dark:border-slate-800 text-xs flex items-center gap-1.5 max-w-[85%] shadow-xxs">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                      <span className="ml-1 text-slate-400 dark:text-slate-500">Formulating recommendations...</span>
                    </div>
                  </div>
                )}

                <div ref={chatBottomRef} />
              </div>

              {/* Chat Message Input form */}
              <form onSubmit={handleSendMessage} className="p-3 bg-slate-50 dark:bg-[#121b33] border-t border-slate-200 dark:border-slate-800 flex gap-2 shrink-0">
                <input
                  type="text"
                  required
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type consulting query..."
                  className="flex-1 px-3 py-2 bg-white dark:bg-[#182340] border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-orange focus:border-brand-orange"
                />
                <button
                  type="submit"
                  disabled={chatSubmitting || !newMessage.trim()}
                  className="p-2 bg-brand-orange hover:bg-brand-orange-hover text-white rounded-xl shadow-xs transition-all flex items-center justify-center cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// PORTAL ANALYTICS VISUALIZATION COMPONENT
// ==========================================

interface PortalAnalyticsProps {
  quotesList: QuoteRequest[];
  chatsList: ChatMessage[];
  user: UserProfile | null;
}

function PortalAnalytics({ quotesList, chatsList, user }: PortalAnalyticsProps) {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsExportOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 1. Calculate project status stats
  const pending = quotesList.filter(q => q.status === 'pending').length;
  const reviewed = quotesList.filter(q => q.status === 'reviewed').length;
  const approved = quotesList.filter(q => q.status === 'approved').length;
  const rejected = quotesList.filter(q => q.status === 'rejected').length;

  const hasQuotes = quotesList.length > 0;
  
  // High-fidelity presentation data for Pie Chart
  const statusData = hasQuotes 
    ? [
        { name: 'Pending', value: pending, color: '#f59e0b' },
        { name: 'Under Review', value: reviewed, color: '#6366f1' },
        { name: 'Approved', value: approved, color: '#10b981' },
        { name: 'Rejected', value: rejected, color: '#ef4444' }
      ].filter(item => item.value > 0)
    : [
        { name: 'Pending', value: 2, color: '#f59e0b' },
        { name: 'Under Review', value: 1, color: '#6366f1' },
        { name: 'Approved', value: 3, color: '#10b981' },
        { name: 'Rejected', value: 1, color: '#ef4444' }
      ];

  // 2. Calculate AI usage metrics (character count -> tokens, count by message role)
  const hasChats = chatsList.length > 0;
  const rawChatUsage = chatsList.map((chat, idx) => {
    const charCount = chat.message ? chat.message.length : 0;
    const computedTokens = Math.round(charCount * 1.3);
    return {
      id: idx + 1,
      time: chat.created_at ? new Date(chat.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '00:00',
      userTokens: chat.sender === 'user' ? computedTokens : 0,
      aiTokens: chat.sender === 'ai' ? computedTokens : (chat.sender === 'consultant' ? computedTokens : 0),
      totalTokens: computedTokens
    };
  });

  // Aggregate by message turns or use individual elements
  const chatTimelineData = hasChats
    ? rawChatUsage.slice(-7)
    : [
        { id: 1, time: '10:00 AM', userTokens: 120, aiTokens: 0, totalTokens: 120 },
        { id: 2, time: '10:01 AM', userTokens: 0, aiTokens: 380, totalTokens: 380 },
        { id: 3, time: '10:10 AM', userTokens: 90, aiTokens: 0, totalTokens: 90 },
        { id: 4, time: '10:11 AM', userTokens: 0, aiTokens: 420, totalTokens: 420 },
        { id: 5, time: '10:20 AM', userTokens: 150, aiTokens: 0, totalTokens: 150 },
        { id: 6, time: '10:21 AM', userTokens: 0, aiTokens: 560, totalTokens: 560 },
        { id: 7, time: '10:30 AM', userTokens: 110, aiTokens: 480, totalTokens: 590 }
      ];

  // Calculate totals
  const totalQuotesCount = quotesList.length > 0 ? quotesList.length : 6;
  const approvedQuotesCount = quotesList.length > 0 ? approved : 3;
  const totalChatsCount = chatsList.length > 0 ? chatsList.length : 7;
  
  const totalTokensEstimated = chatsList.length > 0 
    ? chatsList.reduce((sum, c) => sum + Math.round((c.message ? c.message.length : 0) * 1.3), 0)
    : 2260; // baseline sum

  // ==========================================
  // EXPORT TO CSV LOGIC
  // ==========================================
  const exportToCSV = () => {
    let csvContent = "";
    
    // Header Info
    csvContent += `"AB CONSULTING - EXECUTIVE REPORT"\n`;
    csvContent += `"Generated On","${new Date().toLocaleString()}"\n`;
    csvContent += `"Client Account","${user?.email || 'N/A'}"\n\n`;

    // Section 1: KPI Metrics
    csvContent += `"METRIC KPI HIGHLIGHTS"\n`;
    csvContent += `"Total Broadcasts","${totalQuotesCount}"\n`;
    csvContent += `"Approved Leads","${approvedQuotesCount}"\n`;
    csvContent += `"Consultation Stream Length","${totalChatsCount}"\n`;
    csvContent += `"Estimated Gemini Token Compute","${totalTokensEstimated}"\n\n`;

    // Section 2: Pipeline status breakdown
    csvContent += `"PROJECT PIPELINE STATUS DETAILS"\n`;
    csvContent += `"Project ID","Company","Client Name","Client Email","Status","Date/Time"\n`;
    const quotesToExport = hasQuotes ? quotesList : [
      { id: 'sb-1', company: 'Acme Corp', client_name: 'John Doe', client_email: 'john@acme.com', status: 'approved', created_at: new Date().toISOString() },
      { id: 'sb-2', company: 'Initech LLC', client_name: 'Peter Gibbons', client_email: 'peter@initech.com', status: 'reviewed', created_at: new Date().toISOString() },
      { id: 'sb-3', company: 'Hooli Inc', client_name: 'Gavin Belson', client_email: 'gavin@hooli.com', status: 'pending', created_at: new Date().toISOString() },
      { id: 'sb-4', company: 'Soylent Corp', client_name: 'Alice Smith', client_email: 'alice@soylent.com', status: 'approved', created_at: new Date().toISOString() },
      { id: 'sb-5', company: 'Tyrell Corp', client_name: 'Roy Batty', client_email: 'roy@tyrell.com', status: 'approved', created_at: new Date().toISOString() },
      { id: 'sb-6', company: 'Cyberdyne', client_name: 'Sarah Connor', client_email: 'sarah@cyberdyne.com', status: 'rejected', created_at: new Date().toISOString() }
    ];
    quotesToExport.forEach((q, i) => {
      csvContent += `"${q.id || `row-${i+1}`}","${(q.company || '').replace(/"/g, '""')}","${(q.client_name || '').replace(/"/g, '""')}","${(q.client_email || '').replace(/"/g, '""')}","${q.status}","${q.created_at || ''}"\n`;
    });
    
    csvContent += `\n"AI CHAT & COMPUTE METRICS"\n`;
    csvContent += `"Message ID","Timestamp","Sender","Message Length (Chars)","Estimated Tokens"\n`;
    const chatsToExport = hasChats ? chatsList : [
      { id: 'chat-1', sender: 'user', message: 'Hello, need AI strategy advice.', created_at: new Date().toISOString() },
      { id: 'chat-2', sender: 'ai', message: 'I can certainly help you with a tailored AI roadmap.', created_at: new Date().toISOString() },
      { id: 'chat-3', sender: 'user', message: 'Do you offer process automations?', created_at: new Date().toISOString() },
      { id: 'chat-4', sender: 'ai', message: 'Yes, we specialize in LLM orchestrations and workflow redesign.', created_at: new Date().toISOString() },
      { id: 'chat-5', sender: 'user', message: 'What about budget requirements?', created_at: new Date().toISOString() },
      { id: 'chat-6', sender: 'ai', message: 'We offer standard tiered pricing from $5,000 to $25,000.', created_at: new Date().toISOString() },
      { id: 'chat-7', sender: 'consultant', message: 'This covers complete system deployment.', created_at: new Date().toISOString() }
    ];
    chatsToExport.forEach((chat, idx) => {
      const charCount = chat.message ? chat.message.length : 0;
      const computedTokens = Math.round(charCount * 1.3);
      csvContent += `"${chat.id || idx + 1}","${chat.created_at || ''}","${chat.sender}","${charCount}","${computedTokens}"\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Saskia_Consulting_Report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ==========================================
  // EXPORT TO PROFESSIONAL PDF LOGIC
  // ==========================================
  const exportToPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Color Palette
    const primaryColor = [11, 19, 41];    // #0b1329 - Deep Navy Blue
    const accentColor = [249, 115, 22];   // #f97316 - Amber Orange
    const lightBg = [248, 250, 252];      // #f8fafc - Slate 50
    const borderLight = [226, 232, 240];  // #e2e8f0 - Slate 200

    // 1. Header Band
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 38, 'F');

    // Brand Name & Subtitle
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('AB CONSULTING', 15, 15);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(200, 200, 200);
    doc.text('SASKIA DALY - AI STRATEGY & ENTERPRISE PORTAL', 15, 22);

    // Document Category Accent Badge
    doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.rect(15, 26, 48, 5.5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.text('EXECUTIVE PERFORMANCE REPORT', 18, 29.8);

    // Metadata Right-Aligned
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${new Date().toLocaleString()}`, 130, 15);
    doc.text(`Client Email: ${user?.email || 'N/A'}`, 130, 21);
    doc.text('Integrity: Live Real-time Database Sync', 130, 27);

    let y = 48;

    // Section 1 Heading
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('1. EXECUTIVE PERFORMANCE SUMMARY', 15, y);
    
    y += 5;
    doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.setLineWidth(0.5);
    doc.line(15, y, 195, y);

    y += 8;

    // KPI Summary Block
    doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
    doc.rect(15, y, 180, 20, 'F');
    doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
    doc.rect(15, y, 180, 20, 'D');

    doc.setTextColor(100, 116, 139);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('TOTAL BROADCASTS', 20, y + 6);
    doc.text('APPROVED LEADS', 65, y + 6);
    doc.text('CONSULT STREAM', 110, y + 6);
    doc.text('COMPUTE SIZE', 155, y + 6);

    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(String(totalQuotesCount), 20, y + 14);
    
    doc.setTextColor(16, 185, 129); // Green for Approved
    doc.text(String(approvedQuotesCount), 65, y + 14);

    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(String(totalChatsCount), 110, y + 14);

    doc.setTextColor(99, 102, 241); // Purple for Token Compute
    doc.text(`${totalTokensEstimated.toLocaleString()} Tokens`, 155, y + 14);

    y += 28;

    // Section 2 Heading
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('2. DETAILED PROJECT PIPELINE STATUS', 15, y);
    
    y += 4;
    doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
    doc.setLineWidth(0.2);
    doc.line(15, y, 195, y);

    y += 6;

    // Project Table Header
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(15, y, 180, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text('Company / Client Name', 18, y + 4.8);
    doc.text('Email Address', 75, y + 4.8);
    doc.text('Pipeline Status', 140, y + 4.8);
    doc.text('Created At', 170, y + 4.8);

    y += 7;

    const quotesToPrint = hasQuotes ? quotesList : [
      { id: 'sb-1', company: 'Acme Corp', client_name: 'John Doe', client_email: 'john@acme.com', status: 'approved', created_at: new Date().toISOString() },
      { id: 'sb-2', company: 'Initech LLC', client_name: 'Peter Gibbons', client_email: 'peter@initech.com', status: 'reviewed', created_at: new Date().toISOString() },
      { id: 'sb-3', company: 'Hooli Inc', client_name: 'Gavin Belson', client_email: 'gavin@hooli.com', status: 'pending', created_at: new Date().toISOString() },
      { id: 'sb-4', company: 'Soylent Corp', client_name: 'Alice Smith', client_email: 'alice@soylent.com', status: 'approved', created_at: new Date().toISOString() },
      { id: 'sb-5', company: 'Tyrell Corp', client_name: 'Roy Batty', client_email: 'roy@tyrell.com', status: 'approved', created_at: new Date().toISOString() },
      { id: 'sb-6', company: 'Cyberdyne', client_name: 'Sarah Connor', client_email: 'sarah@cyberdyne.com', status: 'rejected', created_at: new Date().toISOString() }
    ];

    quotesToPrint.slice(0, 10).forEach((q, i) => {
      // Alternate row colors
      if (i % 2 === 0) {
        doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
        doc.rect(15, y, 180, 7.5, 'F');
      }
      doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
      doc.line(15, y + 7.5, 195, y + 7.5);

      doc.setTextColor(51, 65, 85);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      
      const compName = q.company || 'N/A';
      const clName = q.client_name || 'Client';
      const combinedLabel = compName.length > 25 ? compName.substring(0, 22) + '...' : `${compName} (${clName})`;
      doc.text(combinedLabel, 18, y + 4.8);
      
      doc.text(q.client_email || 'N/A', 75, y + 4.8);
      
      // Color-coded statuses
      if (q.status === 'approved') {
        doc.setTextColor(16, 185, 129); // Emerald
        doc.setFont('helvetica', 'bold');
      } else if (q.status === 'pending') {
        doc.setTextColor(245, 158, 11); // Amber
        doc.setFont('helvetica', 'bold');
      } else if (q.status === 'reviewed') {
        doc.setTextColor(99, 102, 241); // Indigo
        doc.setFont('helvetica', 'bold');
      } else {
        doc.setTextColor(239, 68, 68);  // Rose / Red
        doc.setFont('helvetica', 'normal');
      }
      doc.text(q.status ? q.status.toUpperCase() : 'PENDING', 140, y + 4.8);

      doc.setTextColor(100, 116, 139);
      doc.setFont('helvetica', 'normal');
      doc.text(q.created_at ? new Date(q.created_at).toLocaleDateString() : 'N/A', 170, y + 4.8);

      y += 7.5;
    });

    y += 10;

    // Section 3 Heading
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('3. COMPUTE USAGE & GEMINI TELEMETRY', 15, y);
    
    y += 4;
    doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
    doc.line(15, y, 195, y);

    y += 6;

    // AI Table Header
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(15, y, 180, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text('Time', 18, y + 4.8);
    doc.text('Sender Role', 45, y + 4.8);
    doc.text('Message Preview', 80, y + 4.8);
    doc.text('Est. Compute Tokens', 158, y + 4.8);

    y += 7;

    const chatsToPrint = hasChats ? chatsList.slice(-6) : [
      { sender: 'user', message: 'Hello, need AI strategy advice.', created_at: new Date().toISOString() },
      { sender: 'ai', message: 'I can certainly help you with a tailored AI roadmap.', created_at: new Date().toISOString() },
      { sender: 'user', message: 'Do you offer process automations?', created_at: new Date().toISOString() },
      { sender: 'ai', message: 'Yes, we specialize in LLM orchestrations and workflow redesign.', created_at: new Date().toISOString() },
      { sender: 'user', message: 'What about budget requirements?', created_at: new Date().toISOString() },
      { sender: 'ai', message: 'We offer standard tiered pricing from $5,000 to $25,000.', created_at: new Date().toISOString() },
      { sender: 'consultant', message: 'This covers complete system deployment.', created_at: new Date().toISOString() }
    ].slice(-6);

    chatsToPrint.forEach((chat, i) => {
      if (i % 2 === 0) {
        doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
        doc.rect(15, y, 180, 7.5, 'F');
      }
      doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
      doc.line(15, y + 7.5, 195, y + 7.5);

      doc.setTextColor(100, 116, 139);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      
      const timeStr = chat.created_at ? new Date(chat.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '00:00';
      doc.text(timeStr, 18, y + 4.8);
      
      doc.setTextColor(51, 65, 85);
      const roleStr = chat.sender === 'user' ? 'Client' : (chat.sender === 'ai' ? 'Saskia (AI)' : 'Saskia (Expert)');
      doc.text(roleStr, 45, y + 4.8);

      const msgText = chat.message || '';
      const truncated = msgText.length > 45 ? msgText.substring(0, 42) + '...' : msgText;
      doc.text(truncated, 80, y + 4.8);

      const computedTokens = Math.round(msgText.length * 1.3);
      doc.setTextColor(99, 102, 241);
      doc.setFont('helvetica', 'bold');
      doc.text(`${computedTokens} tokens`, 158, y + 4.8);

      y += 7.5;
    });

    // Page border line
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.8);
    doc.line(15, 275, 195, 275);

    // Footer Info
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('Confidential Client Report - AB Consulting Solutions Platform.', 15, 284);
    doc.text('Page 1 of 1', 180, 284);

    doc.save(`Saskia_Consulting_Report_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  return (
    <div id="portal-analytics" className="bg-white dark:bg-[#0b1329] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-xs transition-all space-y-6 mt-6">
      
      {/* Analytics Summary Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-brand-orange/10 text-brand-orange">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <h5 className="font-display font-bold text-base text-brand-dark dark:text-white">
              Saskia Intelligence & Pipeline Analytics
            </h5>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time visual monitoring of consultation streams, project statuses, and Gemini compute metrics.
          </p>
        </div>

        {/* Action Controls: Dropdown Export & Pulse Badge */}
        <div className="flex flex-wrap items-center gap-3 self-start md:self-center">
          
          {/* Dropdown Menu block */}
          <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="px-3.5 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Data</span>
            </button>
            
            {isExportOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white dark:bg-[#121b33] border border-slate-200 dark:border-slate-800 shadow-xl py-1.5 z-20 animate-in fade-in slide-in-from-top-2 duration-150">
                <button
                  onClick={() => {
                    exportToCSV();
                    setIsExportOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs hover:bg-slate-50 dark:hover:bg-[#182340] text-slate-700 dark:text-slate-200 flex items-center gap-2.5 font-semibold transition-all"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                  <span>Download CSV Data</span>
                </button>
                <button
                  onClick={() => {
                    exportToPDF();
                    setIsExportOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs hover:bg-slate-50 dark:hover:bg-[#182340] text-slate-700 dark:text-slate-200 flex items-center gap-2.5 font-semibold transition-all border-t border-slate-100 dark:border-slate-800"
                >
                  <FileDown className="w-4 h-4 text-rose-500" />
                  <span>Download Professional PDF</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold tracking-wide uppercase">
              Live Stream
            </span>
          </div>

        </div>
      </div>

      {/* KPI Highlights Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#121b33] border border-slate-100 dark:border-slate-800/50 flex flex-col justify-between">
          <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Broadcasts</span>
          <div className="flex items-baseline gap-1 mt-1.5">
            <span className="text-xl font-bold text-brand-dark dark:text-white">{totalQuotesCount}</span>
            <span className="text-xxs text-slate-400">quotes</span>
          </div>
          {!hasQuotes && <span className="text-[9px] text-amber-500 mt-1 font-medium">Using sandbox baseline</span>}
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#121b33] border border-slate-100 dark:border-slate-800/50 flex flex-col justify-between">
          <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Approved Leads</span>
          <div className="flex items-baseline gap-1 mt-1.5">
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{approvedQuotesCount}</span>
            <span className="text-xxs text-slate-400">projects</span>
          </div>
          {!hasQuotes && <span className="text-[9px] text-amber-500 mt-1 font-medium">Using sandbox baseline</span>}
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#121b33] border border-slate-100 dark:border-slate-800/50 flex flex-col justify-between">
          <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Consulting Stream</span>
          <div className="flex items-baseline gap-1 mt-1.5">
            <span className="text-xl font-bold text-brand-blue dark:text-blue-400">{totalChatsCount}</span>
            <span className="text-xxs text-slate-400">messages</span>
          </div>
          {!hasChats && <span className="text-[9px] text-amber-500 mt-1 font-medium">Using sandbox baseline</span>}
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#121b33] border border-slate-100 dark:border-slate-800/50 flex flex-col justify-between">
          <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Gemini Compute Size</span>
          <div className="flex items-baseline gap-1 mt-1.5">
            <span className="text-xl font-bold text-purple-600 dark:text-purple-400">{totalTokensEstimated.toLocaleString()}</span>
            <span className="text-xxs text-slate-400">est. tokens</span>
          </div>
          {!hasChats && <span className="text-[9px] text-amber-500 mt-1 font-medium">Using sandbox baseline</span>}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Project Pipeline Donut Chart */}
        <div className="lg:col-span-5 p-5 bg-slate-50 dark:bg-[#121b33]/40 border border-slate-100 dark:border-slate-800/50 rounded-xl flex flex-col justify-between min-h-[300px]">
          <div>
            <h6 className="font-semibold text-xs text-brand-dark dark:text-white flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-brand-blue" />
              Project Pipeline Status Breakdown
            </h6>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Ratio of active leads and submission statuses</p>
          </div>

          <div className="relative h-[160px] w-full flex items-center justify-center my-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: '#1e293b', 
                    borderRadius: '8px', 
                    border: 'none',
                    fontSize: '10px',
                    color: '#fff'
                  }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Donut center stat */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-xs text-slate-400 font-medium">Total</span>
              <span className="text-xl font-black text-brand-dark dark:text-white leading-tight">
                {hasQuotes ? quotesList.length : 6}
              </span>
            </div>
          </div>

          {/* Color Key / Legend */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/40 dark:border-slate-800/60">
            {statusData.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 truncate flex-1">{item.name}</span>
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gemini API Compute Area Chart */}
        <div className="lg:col-span-7 p-5 bg-slate-50 dark:bg-[#121b33]/40 border border-slate-100 dark:border-slate-800/50 rounded-xl flex flex-col justify-between min-h-[300px]">
          <div>
            <h6 className="font-semibold text-xs text-brand-dark dark:text-white flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-brand-orange" />
              Gemini API Compute Volume (Est. Tokens)
            </h6>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Estimated input (User) vs output (Saskia AI) tokens per interaction</p>
          </div>

          <div className="h-[180px] w-full my-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chatTimelineData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="aiGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                <XAxis 
                  dataKey="time" 
                  stroke="#64748b" 
                  fontSize={8} 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={8} 
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{ 
                    background: '#1e293b', 
                    borderRadius: '8px', 
                    border: 'none',
                    fontSize: '10px',
                    color: '#fff'
                  }}
                />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '9px', paddingTop: '10px' }} />
                <Area 
                  type="monotone" 
                  name="Input (User Tokens)" 
                  dataKey="userTokens" 
                  stroke="#2563eb" 
                  fillOpacity={1} 
                  fill="url(#userGrad)" 
                  strokeWidth={1.5}
                />
                <Area 
                  type="monotone" 
                  name="Output (Saskia AI)" 
                  dataKey="aiTokens" 
                  stroke="#f97316" 
                  fillOpacity={1} 
                  fill="url(#aiGrad)" 
                  strokeWidth={1.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[9px] text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-200/40 dark:border-slate-800/60 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-brand-orange shrink-0" />
            <span>Estimated token ratios are derived dynamically from actual chat message string lengths (* 1.3).</span>
          </div>
        </div>

      </div>

    </div>
  );
}
