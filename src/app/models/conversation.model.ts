export const ESCALATION_CONFIDENCE_THRESHOLD = 85;
export const MEDIUM_CONFIDENCE_THRESHOLD = 50;

export type MessageSender = 'customer' | 'ai' | 'agent';
export type ConversationStatus = 'open' | 'pending' | 'escalated' | 'ai_resolved' | 'closed';

export interface ConversationMessage {
  id: string;
  sender: MessageSender;
  text: string;
  timestamp: Date;
  confidence?: number;
  isEscalated?: boolean;
}

export interface Conversation {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail?: string;
  channel: 'web' | 'whatsapp' | 'email';
  status: ConversationStatus;
  assignedTo?: string;
  lastMessage: string;
  lastMessageTime: Date;
  messages: ConversationMessage[];
  createdAt: Date;
  updatedAt: Date;

  // AI-specific fields
  aiHandled?: boolean;
  avgConfidence?: number;
  escalationReason?: string;
}
