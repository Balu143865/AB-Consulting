import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";
import { UserProfile, QuoteRequest, ChatMessage } from "./src/types";

dotenv.config();

// Initialize Supabase Server client if configured
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
let supabaseServer: any = null;

if (supabaseUrl && supabaseAnonKey && supabaseUrl !== "YOUR_SUPABASE_URL") {
  try {
    supabaseServer = createClient(supabaseUrl, supabaseAnonKey);
    console.log("Supabase Server client initialized successfully!");
  } catch (err) {
    console.error("Failed to initialize Supabase Server client:", err);
  }
}

// Initialize Express
const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry and graceful missing-key fallback
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("GoogleGenAI initialized successfully with backend key.");
  } catch (err) {
    console.error("Failed to initialize GoogleGenAI:", err);
  }
} else {
  console.warn("GEMINI_API_KEY is not set or using placeholder. Running in mock AI mode.");
}

// --- IN-MEMORY DATABASE (FALLBACK/PREVIEW ENGINE) ---
let users: UserProfile[] = [
  { id: "1", email: "balunaikbanavath662@gmail.com", name: "Balu Naik", role: "client" },
  { id: "2", email: "consultant@abconsulting.com", name: "Saskia Daly", role: "consultant" }
];

let quotes: QuoteRequest[] = [
  {
    id: "q1",
    client_name: "Balu Naik",
    client_email: "balunaikbanavath662@gmail.com",
    company: "Future Tech Corp",
    services: ["AI-Consulting offerings", "Business Process Automation"],
    message: "We need an AI consulting roadmap for our automation department. Looking forward to working with AB Consulting.",
    budget: "$10,000 - $25,000",
    status: "pending",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: "q2",
    client_name: "John Doe",
    client_email: "john@domain.com",
    company: "E-Commerce Solutions",
    services: ["AI implementation"],
    message: "Interested in integrating a recommendation engine for our online store.",
    budget: "$25,000 - $50,000",
    status: "reviewed",
    created_at: new Date(Date.now() - 3600000 * 10).toISOString()
  }
];

let chats: ChatMessage[] = [
  {
    id: "m1",
    user_id: "1",
    sender: "ai",
    message: "Welcome to AB Consulting! I'm your digital AI agent. How can I help you transform your business with AI today?",
    created_at: new Date(Date.now() - 3600000).toISOString()
  }
];

// --- SERVER-SENT EVENTS (SSE) REAL-TIME CONNECTIONS ---
let sseClients: any[] = [];

function broadcast(type: string, data: any) {
  const payload = { type, data };
  console.log(`Broadcasting event: ${type}`);
  sseClients.forEach((client) => {
    client.write(`data: ${JSON.stringify(payload)}\n\n`);
  });
}

// --- API ROUTES ---

// Healthcheck & config detection
app.get("/api/config", (req, res) => {
  res.json({
    supabaseConfigured: !!(process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_ANON_KEY),
    supabaseUrl: process.env.VITE_SUPABASE_URL || "",
    geminiConfigured: !!ai,
    localTime: new Date().toISOString()
  });
});

// SSE Connection Endpoint
app.get("/api/db/realtime", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "X-Accel-Buffering": "no"
  });

  // Initial greeting
  res.write(`data: ${JSON.stringify({ type: "system", data: "Connected to AB Consulting Real-Time Engine" })}\n\n`);

  sseClients.push(res);

  // Setup periodic heartbeat to prevent timeouts (every 15 seconds)
  const heartbeatInterval = setInterval(() => {
    if (!res.writableEnded) {
      res.write(`:keepalive\n\n`);
    }
  }, 15000);

  req.on("close", () => {
    clearInterval(heartbeatInterval);
    sseClients = sseClients.filter((client) => client !== res);
  });
});

// Authentication
app.post("/api/auth/signup", (req, res) => {
  const { email, password, name, role } = req.body;
  if (!email || !name) {
    return res.status(400).json({ error: "Email and name are required." });
  }

  const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(400).json({ error: "User already exists." });
  }

  const newUser: UserProfile = {
    id: `u-${Date.now()}`,
    email,
    name,
    role: role || "client",
    created_at: new Date().toISOString()
  };

  users.push(newUser);
  res.status(201).json({ user: newUser });
});

app.post("/api/auth/login", (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    // For ease of demo, auto-register if they login with a new email, keeping it extremely frictionless
    const newUser: UserProfile = {
      id: `u-${Date.now()}`,
      email,
      name: email.split("@")[0],
      role: email.includes("autenta") ? "consultant" : "client",
      created_at: new Date().toISOString()
    };
    users.push(newUser);
    return res.json({ user: newUser, message: "Welcome as a new user!" });
  }

  res.json({ user });
});

// Quotes Requests CRUD
app.get("/api/quotes", (req, res) => {
  res.json(quotes);
});

app.post("/api/quotes", (req, res) => {
  const { client_name, client_email, company, services, message, budget } = req.body;
  if (!client_name || !client_email || !message) {
    return res.status(400).json({ error: "Client name, email, and message are required." });
  }

  const newQuote: QuoteRequest = {
    id: `q-${Date.now()}`,
    client_name,
    client_email,
    company: company || "N/A",
    services: services || [],
    message,
    budget: budget || "Flexible",
    status: "pending",
    created_at: new Date().toISOString()
  };

  quotes.unshift(newQuote);
  broadcast("quote_created", newQuote);
  res.status(201).json(newQuote);
});

app.patch("/api/quotes/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const index = quotes.findIndex((q) => q.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Quote request not found." });
  }

  quotes[index] = { ...quotes[index], status };
  broadcast("quote_updated", quotes[index]);
  res.json(quotes[index]);
});

// Real-Time Chat
app.get("/api/chats", async (req, res) => {
  if (supabaseServer) {
    try {
      const { data, error } = await supabaseServer
        .from('chats')
        .select('*')
        .order('created_at', { ascending: true });
      if (!error && data) {
        return res.json(data);
      }
    } catch (err) {
      console.error("Failed to fetch chats from Supabase:", err);
    }
  }
  res.json(chats);
});

app.post("/api/chats", async (req, res) => {
  const { user_id, sender, message } = req.body;
  console.log(`[BACKEND CHAT] Received chat message from user_id=${user_id}, sender=${sender}, text="${message}"`);
  if (!user_id || !sender || !message) {
    return res.status(400).json({ error: "user_id, sender, and message are required." });
  }

  const newMsg: ChatMessage = {
    id: `m-${Date.now()}`,
    user_id,
    sender,
    message,
    created_at: new Date().toISOString()
  };

  // Persist user's message to Supabase if configured
  if (supabaseServer) {
    try {
      const { data, error } = await supabaseServer
        .from('chats')
        .insert([{
          user_id,
          sender,
          message,
          created_at: newMsg.created_at
        }])
        .select()
        .single();
      if (error) {
        console.error("Error inserting client chat to Supabase:", error);
      } else if (data) {
        newMsg.id = String(data.id);
      }
    } catch (dbErr) {
      console.error("Failed to write client message to Supabase:", dbErr);
    }
  }

  chats.push(newMsg);
  broadcast("chat_message", newMsg);

  let generatedAiMsg: ChatMessage | null = null;

  // If message is sent by user to 'ai', generate background Gemini consultant reply
  if (sender === "user") {
    try {
      let replyText = "";
      if (ai) {
        console.log("Calling Gemini API to answer client request...");
        
        // Retrieve context history (from Supabase if configured, otherwise from memory)
        let chatContext = chats;
        if (supabaseServer) {
          try {
            const { data } = await supabaseServer
              .from('chats')
              .select('*')
              .order('created_at', { ascending: false })
              .limit(10);
            if (data && data.length > 0) {
              chatContext = [...data].reverse();
            }
          } catch (ctxErr) {
            console.error("Failed to fetch context from Supabase:", ctxErr);
          }
        }

        const contextHistory = chatContext
          .map((m) => `${m.sender === "user" ? "Client" : "Consultant"}: ${m.message}`)
          .join("\n");

        try {
          console.log("[GEMINI API] Attempting to call generateContent with model gemini-3.5-flash...");
          const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: `You are Saskia Daly, Senior Artificial Intelligence Consultant and Founder of AB Consulting, a premier boutique AI Consulting Firm.
We specialize in:
1. AI-Consulting offerings (strategy, business evaluation, roadmaps)
2. Business Process Automation (workflow redesign, LLM orchestrations)
3. Secure AI Implementation strategies (privacy, safety rails, self-hosting)
4. Knowledge centralization Solutions (enterprise search, RAG systems)
5. AI implementation (custom models, API integrations, software engineering)

Answer the client's query professionally, insightfully, and concisely (under 150 words). Provide real consulting suggestions. Adopt a sophisticated, helpful, and highly competent consultant persona.
Here is the chat history:
${contextHistory}

Saskia Daly's Response:`,
          });
          replyText = response.text || "I apologize, but I could not formulate a response at this time. How else can I assist you with AB Consulting's solutions?";
          console.log("[GEMINI API] Call succeeded. Generated response length:", replyText.length);
        } catch (apiErr: any) {
          console.error("[GEMINI API ERROR] Error calling Gemini API service:", apiErr);
          if (apiErr.status || apiErr.statusCode) {
            console.error(`[GEMINI API ERROR DETAILS] HTTP Status/Code: ${apiErr.status || apiErr.statusCode}`);
          }
          if (apiErr.message) {
            console.error(`[GEMINI API ERROR DETAILS] Error Message: ${apiErr.message}`);
          }
          if (apiErr.stack) {
            console.error(`[GEMINI API ERROR DETAILS] Stack trace: ${apiErr.stack}`);
          }
          throw apiErr; // rethrow so that the outer catch block logs, creates, persists, and broadcasts the proper fallback response
        }
      } else {
        // Mock fallback if API key is not configured
        await new Promise((resolve) => setTimeout(resolve, 1500));
        replyText = `Thank you for contacting AB Consulting! 
*(Preview Mode: Please add your GEMINI_API_KEY in Settings > Secrets to enable fully dynamic AI responses)*

As a premium AI Consulting firm, we specialize in automating workflows, setting up safe LLM guards, and creating custom roadmaps. Based on your input: "${message}", I recommend setting up a discovery consultation. We can design a tailored AI-Consulting roadmap to secure your data and centralize knowledge.

Would you like to schedule a session or submit a quote request?`;
      }

      const aiMsg: ChatMessage = {
        id: `m-${Date.now()}-ai`,
        user_id,
        sender: "ai",
        message: replyText,
        created_at: new Date().toISOString()
      };

      // Persist AI reply to Supabase if configured
      if (supabaseServer) {
        try {
          const { data, error } = await supabaseServer
            .from('chats')
            .insert([{
              user_id,
              sender: "ai",
              message: replyText,
              created_at: aiMsg.created_at
            }])
            .select()
            .single();
          if (error) {
            console.error("Error inserting AI response to Supabase:", error);
          } else if (data) {
            aiMsg.id = String(data.id);
          }
        } catch (dbErr) {
          console.error("Failed to write AI response to Supabase:", dbErr);
        }
      }

      chats.push(aiMsg);
      broadcast("chat_message", aiMsg);
      generatedAiMsg = aiMsg;
    } catch (err) {
      console.error("Error generating Gemini response:", err);
      // Fallback message
      const errorMsg: ChatMessage = {
        id: `m-${Date.now()}-err`,
        user_id,
        sender: "ai",
        message: "I received your message, and our consulting team is reviewing it immediately. Please feel free to submit a Quote Request via the Portal to accelerate the process!",
        created_at: new Date().toISOString()
      };

      if (supabaseServer) {
        try {
          await supabaseServer.from('chats').insert([{
            user_id,
            sender: "ai",
            message: errorMsg.message,
            created_at: errorMsg.created_at
          }]);
        } catch (supErr) {
          console.error("Failed to insert fallback message to Supabase:", supErr);
        }
      }

      chats.push(errorMsg);
      broadcast("chat_message", errorMsg);
      generatedAiMsg = errorMsg;
    }
  }

  // Return generated messages to client immediately
  if (generatedAiMsg) {
    res.status(201).json({
      message: newMsg,
      aiResponse: generatedAiMsg
    });
  } else {
    res.status(201).json(newMsg);
  }
});

// --- VITE DEV & PRODUCTION ROUTER SETUP ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
