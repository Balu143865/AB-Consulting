import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Lock, User, Send, Database, RefreshCw, 
  CheckCircle2, Clock, Sparkles, AlertCircle, 
  Layers, MessageSquare, Briefcase, Key, ChevronRight, FileText, Check, AlertTriangle
} from 'lucide-react';
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
                        {quotesList.map((q) => {
                          const isOwn = q.client_email === user.email;
                          return (
                            <div 
                              key={q.id} 
                              className={`p-3 rounded-xl border transition-all ${
                                isOwn 
                                  ? 'border-brand-orange/20 bg-brand-orange/5 dark:bg-brand-orange/10' 
                                  : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#121b33]/40'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-xs text-brand-dark dark:text-white max-w-[120px] truncate">{q.company}</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                                  q.status === 'pending' ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400' :
                                  q.status === 'reviewed' ? 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400' :
                                  q.status === 'approved' ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400' :
                                  'bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400'
                                }`}>
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
                        {quotesList.map((q) => (
                          <div 
                            key={q.id} 
                            className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#121b33] hover:border-slate-200 dark:hover:border-slate-700 transition-all space-y-3"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <h6 className="font-semibold text-sm text-brand-dark dark:text-white leading-tight">{q.company}</h6>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">By {q.client_name} • {q.client_email}</p>
                              </div>
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                q.status === 'pending' ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400' :
                                q.status === 'reviewed' ? 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400' :
                                q.status === 'approved' ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400' :
                                'bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400'
                              }`}>
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
                        key={msg.id || i} 
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
