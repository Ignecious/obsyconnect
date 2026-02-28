import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService, Message } from '../../services/supabase.service';

@Component({
  selector: 'app-webchat-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './webchat-widget.component.html',
  styleUrls: ['./webchat-widget.component.scss']
})
export class WebchatWidgetComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  
  isOpen = false;
  isTyping = false;
  userMessage = '';
  messages: Message[] = [];
  conversationId: string | null = null;
  
  private shouldScrollToBottom = false;

  constructor(private supabase: SupabaseService) {}

  async ngOnInit(): Promise<void> {
    // Check if user already has a conversation (stored in localStorage)
    const existingConversationId = localStorage.getItem('webchat_conversation_id');
    
    if (existingConversationId) {
      this.conversationId = existingConversationId;
      await this.loadMessages();
    } else {
      // Create new conversation
      await this.createNewConversation();
    }

    // Subscribe to new messages (real-time)
    this.supabase.subscribeToMessages((message) => {
      // Only add messages for this conversation
      if (message.conversation_id === this.conversationId) {
        this.messages.push(message);
        this.shouldScrollToBottom = true;
      }
    });
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  ngOnDestroy(): void {
    this.supabase.unsubscribe();
  }

  async createNewConversation(): Promise<void> {
    const conversation = await this.supabase.createConversation(
      'Anonymous',  // You can prompt for name later
      undefined,
      undefined
    );

    if (conversation) {
      this.conversationId = conversation.id;
      localStorage.setItem('webchat_conversation_id', conversation.id);

      // Send initial greeting (optional)
      await this.supabase.sendMessage(
        conversation.id,
        'system',
        "Hi there! 👋 How can I help you today?"
      );
    }
  }

  async loadMessages(): Promise<void> {
    if (!this.conversationId) return;

    this.messages = await this.supabase.getMessages(this.conversationId);
    this.shouldScrollToBottom = true;
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.shouldScrollToBottom = true;
    }
  }

  async sendMessage(): Promise<void> {
    if (!this.userMessage.trim() || !this.conversationId) return;
    
    const messageText = this.userMessage;
    this.userMessage = '';
    
    // Show typing indicator
    this.isTyping = true;
    
    try {
      // Send customer message
      await this.supabase.sendMessage(
        this.conversationId,
        'customer',
        messageText
      );

      // Simulate agent response after 2 seconds (remove this later when you add real agent replies)
      setTimeout(async () => {
        if (this.conversationId) {
          await this.supabase.sendMessage(
            this.conversationId,
            'agent',
            "Thanks for your message! An agent will respond shortly."
          );
        }
        this.isTyping = false;
      }, 2000);

    } catch (error) {
      console.error('Error sending message:', error);
      this.isTyping = false;
    }
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }
}
