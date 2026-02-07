import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface ConversationContext {
  email?: string;
  orderNumber?: string;
  issueType?: string;
  userName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatAIService {
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  public messages$ = this.messagesSubject.asObservable();
  
  private context: ConversationContext = {};
  private messageIdCounter = 0;

  constructor() {}

  getMessages(): Message[] {
    return this.messagesSubject.value;
  }

  addMessage(text: string, sender: 'user' | 'ai'): void {
    const message: Message = {
      id: `msg-${this.messageIdCounter++}`,
      text,
      sender,
      timestamp: new Date()
    };
    
    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, message]);
  }

  async getResponse(userMessage: string): Promise<string> {
    // Simulate realistic delay
    await this.delay(Math.random() * 1000 + 500);
    
    const response = this.generateResponse(userMessage);
    this.addMessage(response, 'ai');
    return response;
  }

  private generateResponse(userMessage: string): string {
    const message = userMessage.toLowerCase();
    
    // Extract email pattern if present
    const emailMatch = userMessage.match(/[\w.-]+@[\w.-]+\.\w+/);
    if (emailMatch) {
      this.context.email = emailMatch[0];
    }
    
    // Extract order number pattern if present
    const orderMatch = userMessage.match(/TIX-\d+|#\d+/i);
    if (orderMatch) {
      this.context.orderNumber = orderMatch[0];
    }

    // 1. Ticket Not Received
    if (this.matchesKeywords(message, ['ticket', 'didn\'t receive', 'not received', 'missing ticket', 'haven\'t received'])) {
      if (!this.context.email) {
        this.context.issueType = 'ticket_not_received';
        return "I'm sorry to hear that! Let me help you track your ticket. What's the email address you used for the order?";
      } else {
        return `Thanks! I found your order #TIX-12345 for ${this.context.email}. Resending your ticket now... ✅ Sent! Would you like me to create a support case?`;
      }
    }

    // 2. Refund Request
    if (this.matchesKeywords(message, ['refund', 'money back', 'cancel order', 'return'])) {
      if (!this.context.email && !this.context.orderNumber) {
        this.context.issueType = 'refund';
        return "I can help with that. What's your order number or email address?";
      } else {
        const identifier = this.context.orderNumber || this.context.email;
        return `Order found! I'm creating a refund case for you now... ✅ Case #RF-789 created. Expected processing: 3-5 business days`;
      }
    }

    // 3. Event Creation Help
    if (this.matchesKeywords(message, ['create event', 'how to create', 'make event', 'new event', 'add event'])) {
      return "Creating an event is easy! Here's how:\n\n1️⃣ Click 'Create Events' in the menu\n2️⃣ Fill in event details\n3️⃣ Set ticket prices\n4️⃣ Publish!\n\nNeed a guided walkthrough?";
    }

    // 4. Order Status
    if (this.matchesKeywords(message, ['order status', 'where is my order', 'track order', 'order number', 'check order'])) {
      if (!this.context.orderNumber && !this.context.email) {
        this.context.issueType = 'order_status';
        return "Let me check that for you. What's your order number?";
      } else {
        const orderNum = this.context.orderNumber || 'TIX-12345';
        const email = this.context.email || 'user@email.com';
        return `Found it! Order ${orderNum}\nStatus: ✅ Delivered\nSent to: ${email} on Jan 15, 2026\n\nDidn't receive it? I can resend now.`;
      }
    }

    // 5. General Greeting
    if (this.matchesKeywords(message, ['hi', 'hello', 'hey', 'help', 'start'])) {
      return "Hi there! 👋 I'm your Tixxets AI assistant. I can help with:\n\n🎫 Ticket delivery\n💰 Refunds\n📅 Creating events\n🔍 Order tracking\n\nWhat do you need help with?";
    }

    // 6. Payment Issues
    if (this.matchesKeywords(message, ['payment failed', 'card declined', 'payment error', 'can\'t pay', 'payment issue'])) {
      return "I'm sorry you're having payment issues. Let me help!\n\nWhat happened?\n• Card declined\n• Payment pending\n• Other issue\n\nPlease describe the issue and I'll assist.";
    }

    // 7. Event Questions
    if (this.matchesKeywords(message, ['event details', 'when is', 'event time', 'event date', 'event info'])) {
      return "I can help you find event details! Which event are you asking about?\n\n(Or share your order number for ticket details)";
    }

    // 8. Contact Agent
    if (this.matchesKeywords(message, ['talk to human', 'speak to agent', 'talk to agent', 'live person', 'representative', 'real person'])) {
      return "Of course! Connecting you with a live agent...\n\n✅ Case #SUP-456 created\nAverage wait time: 2-3 minutes\n\nI'll stay here while you wait!";
    }

    // 9. Account Issues
    if (this.matchesKeywords(message, ['can\'t log in', 'forgot password', 'reset password', 'login problem', 'login issue'])) {
      if (!this.context.email) {
        return "No problem! I can help you reset your password.\n\nWhat's your email address?";
      } else {
        return `✅ Password reset link sent to ${this.context.email}\n\nCheck your inbox (and spam folder)`;
      }
    }

    // 10. Event Cancellation
    if (this.matchesKeywords(message, ['event cancelled', 'event canceled', 'cancellation', 'event not happening'])) {
      return "I'm sorry to hear your event was cancelled.\n\nI can help you:\n• Get a refund\n• Transfer to another event\n• Contact the organizer\n\nWhat would you like to do?";
    }

    // Handle email/order number responses
    if (this.context.issueType && (emailMatch || orderMatch)) {
      const prevIssue = this.context.issueType;
      this.context.issueType = undefined;
      
      if (prevIssue === 'ticket_not_received') {
        return `Thanks! I found your order #TIX-12345. Resending your ticket now... ✅ Sent! Would you like me to create a support case?`;
      } else if (prevIssue === 'refund') {
        return `Order found! I'm creating a refund case for you now... ✅ Case #RF-789 created. Expected processing: 3-5 business days`;
      } else if (prevIssue === 'order_status') {
        return `Found it! Order #TIX-12345\nStatus: ✅ Delivered\nSent to: ${this.context.email || 'user@email.com'} on Jan 15, 2026\n\nDidn't receive it? I can resend now.`;
      }
    }

    // 11. Fallback (Unknown)
    return "I'm not sure about that, but I can:\n\n🎫 Help with tickets\n💰 Process refunds\n📞 Connect you with an agent\n\nWhat would you like to do?";
  }

  private matchesKeywords(message: string, keywords: string[]): boolean {
    return keywords.some(keyword => message.includes(keyword));
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getQuickReplies(lastMessage?: string): string[] {
    if (!lastMessage) {
      return ['Track Order', 'Get Refund', 'Talk to Agent'];
    }

    const message = lastMessage.toLowerCase();

    // After ticket issue
    if (message.includes('resending') || message.includes('sent!')) {
      return ['Resend Ticket', 'Create Support Case', 'Talk to Agent'];
    }

    // After refund request
    if (message.includes('refund case')) {
      return ['Check Refund Status', 'Talk to Agent'];
    }

    // After event question
    if (message.includes('create events') || message.includes('event details')) {
      return ['Find Events', 'Create Event', 'Talk to Agent'];
    }

    // Default
    return ['Track Order', 'Get Refund', 'Talk to Agent'];
  }

  resetContext(): void {
    this.context = {};
  }

  clearMessages(): void {
    this.messagesSubject.next([]);
    this.resetContext();
  }
}
