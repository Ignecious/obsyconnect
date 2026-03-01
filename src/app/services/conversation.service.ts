import { Injectable } from '@angular/core';
import { Conversation, ConversationMessage, MessageSender, ESCALATION_CONFIDENCE_THRESHOLD } from '../models/conversation.model';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  constructor() {}

  /**
   * Get escalated AI conversations from localStorage
   */
  getEscalatedAIConversations(): Conversation[] {
    try {
      const stored = localStorage.getItem('ai_conversations');
      if (!stored) return [];

      const aiConversations = JSON.parse(stored);

      return aiConversations
        .filter((conv: any) => conv.status === 'escalated')
        .map((conv: any) => this.mapStoredToConversation(conv));

    } catch (error) {
      console.error('Failed to load escalated conversations:', error);
      return [];
    }
  }

  /**
   * Map stored localStorage conversation to Conversation model
   */
  private mapStoredToConversation(stored: any): Conversation {
    const messages: ConversationMessage[] = (stored.messages || []).map((msg: any, index: number) => ({
      id: `msg_${stored.id}_${index}`,
      sender: msg.sender as MessageSender,
      text: msg.text,
      timestamp: new Date(msg.timestamp),
      confidence: msg.confidence,
      isEscalated: msg.confidence != null && msg.confidence < ESCALATION_CONFIDENCE_THRESHOLD && msg.sender === 'ai'
    }));

    const lastMessage = messages[messages.length - 1];

    return {
      id: stored.id,
      customerId: stored.customerId,
      customerName: stored.customerName,
      customerEmail: stored.customerEmail,
      channel: stored.channel,
      status: stored.status,
      lastMessage: lastMessage?.text || '',
      lastMessageTime: lastMessage?.timestamp || new Date(stored.updatedAt),
      messages: messages,
      createdAt: new Date(stored.createdAt),
      updatedAt: new Date(stored.updatedAt),
      aiHandled: true,
      avgConfidence: stored.confidence,
      escalationReason: stored.confidence < ESCALATION_CONFIDENCE_THRESHOLD
        ? `AI confidence too low (${stored.confidence}%)`
        : undefined
    };
  }

  /**
   * Get conversation by ID
   */
  getConversationById(id: string): Conversation | null {
    const allConversations = this.getEscalatedAIConversations();
    return allConversations.find(c => c.id === id) || null;
  }

  /**
   * Add agent message to conversation in localStorage
   */
  addAgentMessage(conversationId: string, messageText: string): void {
    try {
      const stored = localStorage.getItem('ai_conversations');
      if (!stored) return;

      const aiConversations = JSON.parse(stored);
      const convIndex = aiConversations.findIndex((c: any) => c.id === conversationId);

      if (convIndex >= 0) {
        aiConversations[convIndex].messages.push({
          sender: 'agent',
          text: messageText,
          timestamp: new Date()
        });

        aiConversations[convIndex].status = 'pending';
        aiConversations[convIndex].updatedAt = new Date();

        localStorage.setItem('ai_conversations', JSON.stringify(aiConversations));
        console.log('✅ Agent message added to conversation:', conversationId);
      }

    } catch (error) {
      console.error('Failed to add agent message:', error);
    }
  }

  /**
   * Get relative time string from a Date
   */
  getRelativeTime(timestamp: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  }
}
