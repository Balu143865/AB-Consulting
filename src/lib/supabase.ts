import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserProfile, QuoteRequest, ChatMessage, RealtimeEvent } from '../types';

// Read client-side environment variables
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

export let supabase: SupabaseClient | null = null;
export let isUsingSupabase = false;

// Subscriptions for state changes so React can re-render
const statusListeners = new Set<(active: boolean) => void>();

export function subscribeToSupabaseStatus(listener: (active: boolean) => void): () => void {
  statusListeners.add(listener);
  listener(isUsingSupabase);
  return () => {
    statusListeners.delete(listener);
  };
}

export function setIsUsingSupabase(val: boolean) {
  if (isUsingSupabase !== val) {
    isUsingSupabase = val;
    statusListeners.forEach(listener => listener(val));
    console.log(`Database engine manually switched to: ${val ? 'Supabase' : 'Local Fallback'}`);
  }
}

export function forceDisableSupabase() {
  if (isUsingSupabase) {
    isUsingSupabase = false;
    statusListeners.forEach(listener => listener(false));
    console.warn("⚠️ Supabase has been temporarily deactivated due to missing database tables or connection rate-limits. Seamlessly using local fallback database.");
  }
}

if (supabaseUrl && supabaseAnonKey && supabaseUrl !== "YOUR_SUPABASE_URL") {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    isUsingSupabase = true;
    console.log("Supabase Client initialized successfully!");
  } catch (err) {
    console.error("Failed to initialize Supabase client:", err);
  }
}

// Global active user state (managed client-side for simple session persistence)
let currentUser: UserProfile | null = (() => {
  const saved = localStorage.getItem("autenta_user");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  }
  return null;
})();

export function getCurrentUser(): UserProfile | null {
  return currentUser;
}

export function setCurrentUser(user: UserProfile | null) {
  currentUser = user;
  if (user) {
    localStorage.setItem("autenta_user", JSON.stringify(user));
  } else {
    localStorage.removeItem("autenta_user");
  }
}

// Helper to detect schema cache / table missing errors from Supabase
function handleSupabaseError(err: any, context: string) {
  console.warn(`${context} error:`, err?.message || err);
  const errMsg = String(err?.message || "").toLowerCase();
  const errDetails = String(err?.details || "").toLowerCase();
  if (
    err?.code === 'PGRST205' || 
    errMsg.includes('schema cache') || 
    errMsg.includes('relation') || 
    errMsg.includes('table') || 
    errDetails.includes('schema cache') ||
    errDetails.includes('relation')
  ) {
    forceDisableSupabase();
  }
}

// Unified Auth Operations
export async function loginUser(email: string): Promise<{ user: UserProfile; error?: string }> {
  if (isUsingSupabase && supabase) {
    // Standard passwordless/mock login or custom credentials can be configured,
    // but for simple demo alignment, we synchronize profiles
    try {
      // Check if profile exists
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !profile) {
        // Sign up if profile does not exist
        let signUpData: any = null;
        let signUpError: any = null;

        try {
          const res = await supabase.auth.signUp({
            email,
            password: 'TemporaryPassword123!', // Simple demo password
          });
          signUpData = res.data;
          signUpError = res.error;
        } catch (suErr: any) {
          signUpError = suErr;
        }

        // If signup failed, let's try to sign in with the standard password
        // (Maybe the auth user already exists in auth.users, but the profile row is missing)
        if (signUpError) {
          try {
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
              email,
              password: 'TemporaryPassword123!',
            });
            if (!signInError) {
              signUpData = signInData;
              signUpError = null;
            }
          } catch (siErr) {
            // keep the original signup error
          }
        }

        if (signUpError) throw signUpError;

        const newProfile: UserProfile = {
          id: signUpData?.user?.id || `u-${Date.now()}`,
          email,
          name: email.split('@')[0],
          role: email.includes('autenta') ? 'consultant' : 'client'
        };

        const { error: insertError } = await supabase
          .from('profiles')
          .insert([newProfile]);

        if (insertError) {
          console.warn("Failed to insert profile row into Supabase profiles table, but proceeding:", insertError.message);
        }

        setCurrentUser(newProfile);
        return { user: newProfile };
      }

      setCurrentUser(profile as UserProfile);
      return { user: profile as UserProfile };
    } catch (err: any) {
      handleSupabaseError(err, "Supabase Login");
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await response.json();
        if (response.ok) {
          setCurrentUser(data.user);
          return { user: data.user };
        }
      } catch (fallbackErr) {
        console.error("Local fallback login also failed:", fallbackErr);
      }
      return { user: {} as UserProfile, error: err.message || "Login failed" };
    }
  } else {
    // Local API Full-Stack Mode
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (!response.ok) {
        return { user: {} as UserProfile, error: data.error || 'Login failed' };
      }
      setCurrentUser(data.user);
      return { user: data.user };
    } catch (err: any) {
      return { user: {} as UserProfile, error: err.message || 'Server connection failed' };
    }
  }
}

export async function registerUser(email: string, name: string, role: 'client' | 'consultant'): Promise<{ user: UserProfile; error?: string }> {
  if (isUsingSupabase && supabase) {
    try {
      let signUpData: any = null;
      let signUpError: any = null;

      try {
        const res = await supabase.auth.signUp({
          email,
          password: 'TemporaryPassword123!',
        });
        signUpData = res.data;
        signUpError = res.error;
      } catch (suErr: any) {
        signUpError = suErr;
      }

      // Try signing in instead if signup fails (e.g., user exists in auth.users, but we need to create profiles record)
      if (signUpError) {
        try {
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password: 'TemporaryPassword123!',
          });
          if (!signInError) {
            signUpData = signInData;
            signUpError = null;
          }
        } catch (siErr) {
          // keep the original signup error
        }
      }

      if (signUpError) throw signUpError;

      const newProfile: UserProfile = {
        id: signUpData?.user?.id || `u-${Date.now()}`,
        email,
        name,
        role
      };

      const { error: insertError } = await supabase
        .from('profiles')
        .insert([newProfile]);

      if (insertError) {
        console.warn("Failed to insert profile row into Supabase profiles table, but proceeding:", insertError.message);
      }

      setCurrentUser(newProfile);
      return { user: newProfile };
    } catch (err: any) {
      handleSupabaseError(err, "Supabase Registration");
      try {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name, role })
        });
        const data = await response.json();
        if (response.ok) {
          setCurrentUser(data.user);
          return { user: data.user };
        } else if (data.error && data.error.includes("already exists")) {
          // If the user already exists in local DB, log them in!
          const loginResponse = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
          });
          const loginData = await loginResponse.json();
          if (loginResponse.ok) {
            setCurrentUser(loginData.user);
            return { user: loginData.user };
          }
        }
      } catch (fallbackErr) {
        console.error("Local fallback signup also failed:", fallbackErr);
      }
      return { user: {} as UserProfile, error: err.message || "Registration failed" };
    }
  } else {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, role })
      });
      const data = await response.json();
      if (!response.ok) {
        return { user: {} as UserProfile, error: data.error || 'Registration failed' };
      }
      setCurrentUser(data.user);
      return { user: data.user };
    } catch (err: any) {
      return { user: {} as UserProfile, error: err.message || 'Server connection failed' };
    }
  }
}

// Unified Quotes Operations
export async function fetchQuotes(): Promise<QuoteRequest[]> {
  if (isUsingSupabase && supabase) {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        throw error;
      }
      return data as QuoteRequest[];
    } catch (err: any) {
      handleSupabaseError(err, "Fetch Quotes Supabase");
      try {
        const response = await fetch('/api/quotes');
        return await response.json();
      } catch {
        return [];
      }
    }
  } else {
    try {
      const response = await fetch('/api/quotes');
      return await response.json();
    } catch {
      return [];
    }
  }
}

export async function submitQuote(quote: Omit<QuoteRequest, 'id' | 'status' | 'created_at'>): Promise<QuoteRequest | null> {
  if (isUsingSupabase && supabase) {
    try {
      const newQuote = {
        ...quote,
        status: 'pending',
        created_at: new Date().toISOString()
      };
      const { data, error } = await supabase
        .from('quotes')
        .insert([newQuote])
        .select()
        .single();

      if (error) {
        throw error;
      }
      return data as QuoteRequest;
    } catch (err: any) {
      handleSupabaseError(err, "Submit Quote Supabase");
      try {
        const response = await fetch('/api/quotes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(quote)
        });
        return await response.json();
      } catch {
        return null;
      }
    }
  } else {
    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quote)
      });
      return await response.json();
    } catch {
      return null;
    }
  }
}

export async function updateQuoteStatus(id: string, status: QuoteRequest['status']): Promise<QuoteRequest | null> {
  if (isUsingSupabase && supabase) {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }
      return data as QuoteRequest;
    } catch (err: any) {
      handleSupabaseError(err, "Update Quote status Supabase");
      try {
        const response = await fetch(`/api/quotes/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        });
        return await response.json();
      } catch {
        return null;
      }
    }
  } else {
    try {
      const response = await fetch(`/api/quotes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      return await response.json();
    } catch {
      return null;
    }
  }
}

// Unified Chats Operations
export async function fetchChats(): Promise<ChatMessage[]> {
  if (isUsingSupabase && supabase) {
    try {
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .order('created_at', { ascending: true });
      if (error) {
        throw error;
      }
      return data as ChatMessage[];
    } catch (err: any) {
      handleSupabaseError(err, "Fetch Chats Supabase");
      try {
        const response = await fetch('/api/chats');
        return await response.json();
      } catch {
        return [];
      }
    }
  } else {
    try {
      const response = await fetch('/api/chats');
      return await response.json();
    } catch {
      return [];
    }
  }
}

export async function sendChatMessage(userId: string, sender: ChatMessage['sender'], message: string): Promise<ChatMessage | null> {
  try {
    const response = await fetch('/api/chats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, sender, message })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.error("Error sending chat message via backend api:", err);
    return null;
  }
}

// Unified Real-Time Subscription
export function subscribeToRealtime(onEvent: (event: RealtimeEvent) => void): () => void {
  if (isUsingSupabase && supabase) {
    console.log("Subscribing to real-time events via Supabase channels...");

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'quotes' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            onEvent({ type: 'quote_created', data: payload.new });
          } else if (payload.eventType === 'UPDATE') {
            onEvent({ type: 'quote_updated', data: payload.new });
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chats' },
        (payload) => {
          onEvent({ type: 'chat_message', data: payload.new });
        }
      )
      .subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  } else {
    console.log("Subscribing to real-time events via Local Server-Sent Events stream...");
    const eventSource = new EventSource('/api/db/realtime');

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload && payload.type) {
          onEvent(payload as RealtimeEvent);
        }
      } catch (err) {
        console.error("Error parsing real-time message stream:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("Real-time Server-Sent Events error (reconnecting):", err);
    };

    return () => {
      console.log("Closing local Server-Sent Events stream.");
      eventSource.close();
    };
  }
}
