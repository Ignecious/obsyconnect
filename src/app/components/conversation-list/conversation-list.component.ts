import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-conversation-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './conversation-list.component.html',
  styleUrls: ['./conversation-list.component.scss']
})
export class ConversationListComponent {
  @Output() conversationSelected = new EventEmitter<any>();

  activeQueue: string = 'all';
  
  conversations = [
    {
      id: 1,
      customer: {
        name: 'Thabo M.',
        phone: '+27 82 555 0123',
        email: 'thabo@email.com',
        avatar: '👤'
      },
      lastMessage: 'I didn\'t receive my ticket',
      timestamp: '12:45 PM',
      status: 'ai-escalated',
      queue: 'new',
      unread: true,
      aiHandoff: true,
      escalationReason: 'Customer issue unresolved after 3 attempts'
    },
    {
      id: 2,
      customer: {
        name: 'Rose Mashaba',
        phone: '+27 71 234 5678',
        email: 'rose@email.com',
        avatar: '👤'
      },
      lastMessage: 'What\'s the refund policy?',
      timestamp: '11:30 AM',
      status: 'agent-active',
      queue: 'active',
      unread: false,
      assignedTo: 'You'
    },
    {
      id: 3,
      customer: {
        name: 'John Khumalo',
        phone: '+27 83 456 7890',
        email: 'john@email.com',
        avatar: '👤'
      },
      lastMessage: 'How do I create an event?',
      timestamp: '10:15 AM',
      status: 'ai-handling',
      queue: 'general',
      unread: false
    },
    {
      id: 4,
      customer: {
        name: 'Sarah Dlamini',
        phone: '+27 84 567 8901',
        email: 'sarah@email.com',
        avatar: '👤'
      },
      lastMessage: 'Payment failed',
      timestamp: '09:45 AM',
      status: 'waiting-customer',
      queue: 'priority',
      unread: false,
      assignedTo: 'You'
    },
    {
      id: 5,
      customer: {
        name: 'Michael Nkosi',
        phone: '+27 76 678 9012',
        email: 'michael@email.com',
        avatar: '👤'
      },
      lastMessage: 'Where is my order?',
      timestamp: 'Just now',
      status: 'new',
      queue: 'new',
      unread: true
    }
  ];

  getStatusIcon(status: string): string {
    const icons: { [key: string]: string } = {
      'ai-handling': '🤖',
      'agent-active': '👤',
      'ai-escalated': '🤖→👤',
      'waiting-customer': '⏳',
      'closed': '✅',
      'new': '🔵'
    };
    return icons[status] || '';
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  selectConversation(conversation: any) {
    this.conversationSelected.emit(conversation);
  }

  getNewCount(): number {
    return this.conversations.filter(c => c.queue === 'new').length;
  }

  getActiveCount(): number {
    return this.conversations.filter(c => c.queue === 'active').length;
  }

  getFilteredConversations() {
    if (this.activeQueue === 'all') {
      return this.conversations;
    }
    return this.conversations.filter(c => c.queue === this.activeQueue);
  }
}
