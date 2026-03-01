import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService, Conversation, Message } from '../../services/supabase.service';

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

  // Customer info collection
  showWelcomeForm = false;
  customerName = '';
  customerEmail = '';
  showNameError = false;
  isStartingChat = false;
  
  private shouldScrollToBottom = false;

  constructor(private supabase: SupabaseService) {}

  async ngOnInit(): Promise<void> {
    const existingConversationId = localStorage.getItem('webchat_conversation_id');
    
    if (existingConversationId) {
      this.conversationId = existingConversationId;
      await this.loadMessages();
    } else {
      // Show welcome form for new conversations
      this.showWelcomeForm = true;
    }

    // Subscribe to new messages (real-time)
    this.supabase.subscribeToMessages((message) => {
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

  onFormKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.startChat();
    }
  }

  async startChat(): Promise<void> {
    if (!this.customerName.trim()) {
      this.showNameError = true;
      return;
    }
    this.showNameError = false;
    this.isStartingChat = true;

    try {
      const conversation = await this.supabase.createConversation(
        this.customerName.trim(),
        this.customerEmail.trim() || undefined,
        undefined
      );

      if (conversation) {
        this.conversationId = conversation.id;
        localStorage.setItem('webchat_conversation_id', conversation.id);

        // Send initial greeting
        await this.supabase.sendMessage(
          conversation.id,
          'system',
          `Hi ${this.customerName}! 👋 How can I help you today?`
        );

        this.showWelcomeForm = false;
        this.shouldScrollToBottom = true;
        await this.loadMessages();
      } else {
        alert('Failed to start chat. Please try again.');
      }
    } catch (error) {
      console.error('Error starting chat:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      this.isStartingChat = false;
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
    
    try {
      await this.supabase.sendMessage(
        this.conversationId,
        'customer',
        messageText
      );

      // Check if auto-reply has already been sent
      const conversation = await this.supabase.getConversation(this.conversationId);
      
      if (conversation && !conversation.auto_reply_sent) {
        this.isTyping = true;
        
        setTimeout(async () => {
          if (this.conversationId) {
            await this.supabase.sendMessage(
              this.conversationId,
              'agent',
              "Thanks for your message! An agent will respond shortly."
            );

            // Mark auto-reply as sent so it only fires once
            await this.supabase.updateConversation(this.conversationId, {
              auto_reply_sent: true
            });
          }
          this.isTyping = false;
        }, 1500);
      }

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
