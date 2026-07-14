export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'client' | 'consultant';
  created_at?: string;
}

export interface QuoteRequest {
  id: string;
  client_name: string;
  client_email: string;
  company: string;
  services: string[];
  message: string;
  budget: string;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  created_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  sender: 'user' | 'ai' | 'consultant';
  message: string;
  created_at: string;
}

export interface RealtimeEvent {
  type: 'quote_created' | 'quote_updated' | 'chat_message' | 'system';
  data: any;
}
