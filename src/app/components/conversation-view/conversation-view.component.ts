import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Message {
  id: number;
  sender: 'ai' | 'customer' | 'system' | 'agent';
  text: string;
  timestamp: string;
}

@Component({
  selector: 'app-conversation-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './conversation-view.component.html',
  styleUrls: ['./conversation-view.component.scss']
})
export class ConversationViewComponent implements OnChanges {
  @Input() conversation: any = null;

  agentTookOver: boolean = false;
  agentMessage: string = '';
  showAISuggestions: boolean = false;
  messages: Message[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['conversation'] && this.conversation) {
      this.loadMessages();
      this.agentTookOver = false;
    }
  }

  loadMessages() {
    if (this.conversation && this.conversation.id === 1) {
      // Thabo M. conversation with full AI handoff scenario
      this.messages = [
        {
          id: 1,
          sender: 'ai',
          text: 'Hi there! 👋 I\'m the Tixxets AI assistant. How can I help you today?',
          timestamp: '12:40 PM'
        },
        {
          id: 2,
          sender: 'customer',
          text: 'I didn\'t receive my ticket for the concert tomorrow',
          timestamp: '12:41 PM'
        },
        {
          id: 3,
          sender: 'ai',
          text: 'I\'m sorry to hear that! Let me help you track your ticket. What\'s the email address you used for the order?',
          timestamp: '12:41 PM'
        },
        {
          id: 4,
          sender: 'customer',
          text: 'thabo@email.com',
          timestamp: '12:42 PM'
        },
        {
          id: 5,
          sender: 'ai',
          text: 'Thanks! I found your order #TIX-12345. I\'m resending your ticket now... ✅ Sent!\n\nYou should receive it in 2-3 minutes. Check your spam folder too!',
          timestamp: '12:43 PM'
        },
        {
          id: 6,
          sender: 'customer',
          text: 'I checked everywhere, still didn\'t get it',
          timestamp: '12:45 PM'
        },
        {
          id: 7,
          sender: 'ai',
          text: 'I understand this is frustrating. Let me connect you with a live agent who can help you further...',
          timestamp: '12:46 PM'
        }
      ];
    } else {
      // Generic messages for other conversations
      this.messages = [
        {
          id: 1,
          sender: 'customer',
          text: this.conversation?.lastMessage || 'Hello, I need help',
          timestamp: this.conversation?.timestamp || 'Just now'
        }
      ];
    }
  }

  takeOverFromAI() {
    this.agentTookOver = true;
    
    this.messages.push({
      id: this.messages.length + 1,
      sender: 'system',
      text: 'Agent Sarah joined the chat',
      timestamp: this.getCurrentTime()
    });

    if (this.conversation) {
      this.conversation.status = 'agent-active';
    }

    setTimeout(() => this.scrollToBottom(), 100);
  }

  sendMessage() {
    if (!this.agentMessage.trim()) return;

    this.messages.push({
      id: this.messages.length + 1,
      sender: 'agent',
      text: this.agentMessage,
      timestamp: this.getCurrentTime()
    });

    this.agentMessage = '';
    this.showAISuggestions = false;
    setTimeout(() => this.scrollToBottom(), 100);
  }

  toggleAISuggestions() {
    this.showAISuggestions = !this.showAISuggestions;
  }

  onKeydown(event: KeyboardEvent) {
    if (!event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  getAISuggestions(): string[] {
    return [
      "Hi Thabo! I see you're having trouble receiving your ticket. Let me send it to an alternate email address. What email would you like me to use?",
      "I apologize for the inconvenience. I'm creating a priority case for you right now and will have our technical team investigate. Can you confirm your order number is TIX-12345?",
      "Let me resend your ticket via SMS as well. What's the best mobile number to use?"
    ];
  }

  useSuggestion(suggestion: string) {
    this.agentMessage = suggestion;
    this.showAISuggestions = false;
  }

  getCurrentTime(): string {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }

  scrollToBottom() {
    const element = document.querySelector('.messages-container');
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }
}
