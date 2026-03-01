export type AIConversationStatus = 'resolved' | 'escalated';

export interface AIConversation {
  id: string;
  customerId: string;
  customerName: string;
  channel: 'web' | 'whatsapp' | 'email';
  firstMessage: string;
  lastMessage: string;
  status: AIConversationStatus;
  confidence: number;
  timestamp: Date;
  messageCount: number;
}

export interface AIConversationGroup {
  label: string;
  conversations: AIConversation[];
}
