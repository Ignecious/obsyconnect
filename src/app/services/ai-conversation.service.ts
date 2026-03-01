import { Injectable } from '@angular/core';
import { AIConversation, AIConversationStatus, AIConversationGroup } from '../models/ai-conversation.model';

@Injectable({
  providedIn: 'root'
})
export class AIConversationService {

  constructor() {}

  /**
   * Get all AI conversations
   * TODO: Replace with actual API call
   */
  getAIConversations(): AIConversation[] {
    return [
      {
        id: 'ai-conv-1',
        customerId: 'test',
        customerName: 'test',
        channel: 'web',
        firstMessage: "What's your refund policy?",
        lastMessage: "Full refunds up to 14 days before the event. After that, refunds are subject to event organizer approval.",
        status: 'resolved',
        confidence: 95,
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        messageCount: 2
      },
      {
        id: 'ai-conv-2',
        customerId: 'anonymous-1',
        customerName: 'Anonymous',
        channel: 'web',
        firstMessage: "What are your business hours?",
        lastMessage: "We're open Monday to Friday, 9:00 AM - 5:00 PM SAST. Closed on weekends and public holidays.",
        status: 'resolved',
        confidence: 90,
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        messageCount: 2
      },
      {
        id: 'ai-conv-3',
        customerId: 'test',
        customerName: 'test',
        channel: 'web',
        firstMessage: "Can I pay with Bitcoin?",
        lastMessage: "That's a great question! Let me connect you with a team member who can help with that specific request.",
        status: 'escalated',
        confidence: 20,
        timestamp: new Date(Date.now() - 8 * 60 * 1000),
        messageCount: 2
      },
      {
        id: 'ai-conv-4',
        customerId: 'john-123',
        customerName: 'John',
        channel: 'web',
        firstMessage: "How do I contact support?",
        lastMessage: "Email support@tixxets.com or call +27 82 555 0123. We respond within 24 hours.",
        status: 'resolved',
        confidence: 92,
        timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000),
        messageCount: 2
      },
      {
        id: 'ai-conv-5',
        customerId: 'sarah-456',
        customerName: 'Sarah',
        channel: 'web',
        firstMessage: "Do you offer VIP packages?",
        lastMessage: "Yes! VIP packages include premium seating, backstage access, and exclusive perks. Visit our VIP page for details.",
        status: 'resolved',
        confidence: 88,
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        messageCount: 2
      },
      {
        id: 'ai-conv-6',
        customerId: 'mike-789',
        customerName: 'Mike',
        channel: 'web',
        firstMessage: "Where can I park?",
        lastMessage: "Most venues have on-site parking or nearby garages. Check venue details for parking information.",
        status: 'resolved',
        confidence: 90,
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        messageCount: 2
      }
    ];
  }

  /**
   * Filter conversations by status
   */
  filterByStatus(conversations: AIConversation[], status?: AIConversationStatus): AIConversation[] {
    if (!status) return conversations;
    return conversations.filter(c => c.status === status);
  }

  /**
   * Get conversation counts by status
   */
  getStatusCounts(conversations: AIConversation[]): { all: number; resolved: number; escalated: number } {
    return {
      all: conversations.length,
      resolved: conversations.filter(c => c.status === 'resolved').length,
      escalated: conversations.filter(c => c.status === 'escalated').length
    };
  }

  /**
   * Group conversations by date
   */
  groupByDate(conversations: AIConversation[]): AIConversationGroup[] {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);
    const weekStart = new Date(todayStart.getTime() - 6 * 24 * 60 * 60 * 1000);

    const today: AIConversation[] = [];
    const yesterday: AIConversation[] = [];
    const thisWeek: AIConversation[] = [];
    const older: AIConversation[] = [];

    conversations.forEach(conv => {
      const convDate = new Date(conv.timestamp.getFullYear(), conv.timestamp.getMonth(), conv.timestamp.getDate());

      if (convDate >= todayStart) {
        today.push(conv);
      } else if (convDate >= yesterdayStart) {
        yesterday.push(conv);
      } else if (convDate >= weekStart) {
        thisWeek.push(conv);
      } else {
        older.push(conv);
      }
    });

    const groups: AIConversationGroup[] = [];

    if (today.length > 0) {
      groups.push({ label: `Today (${today.length})`, conversations: today });
    }
    if (yesterday.length > 0) {
      groups.push({ label: `Yesterday (${yesterday.length})`, conversations: yesterday });
    }
    if (thisWeek.length > 0) {
      groups.push({ label: `This Week (${thisWeek.length})`, conversations: thisWeek });
    }
    if (older.length > 0) {
      groups.push({ label: `Older (${older.length})`, conversations: older });
    }

    return groups;
  }

  /**
   * Load AI conversations from localStorage (temporary storage)
   * TODO: Replace with actual API call
   */
  getAIConversationsFromStorage(): AIConversation[] {
    try {
      const stored = localStorage.getItem('ai_conversations');
      if (!stored) return this.getAIConversations();

      const conversations = JSON.parse(stored);

      return conversations.map((conv: any) => ({
        id: conv.id,
        customerId: conv.customerId,
        customerName: conv.customerName,
        channel: conv.channel,
        firstMessage: conv.messages.find((m: any) => m.sender === 'customer')?.text || '',
        lastMessage: conv.messages[conv.messages.length - 1]?.text || '',
        status: conv.status === 'ai_resolved' ? 'resolved' : conv.status,
        confidence: conv.confidence,
        timestamp: new Date(conv.updatedAt),
        messageCount: conv.messages.length
      })) as AIConversation[];

    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return this.getAIConversations();
    }
  }

  /**
   * Get relative timestamp
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
