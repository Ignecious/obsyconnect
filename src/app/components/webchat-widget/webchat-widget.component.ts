import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatAIService, Message } from '../../services/chat-ai.service';
import { Subscription } from 'rxjs';

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
  quickReplies: string[] = ['Track Order', 'Get Refund', 'Talk to Agent'];
  
  private messagesSubscription?: Subscription;
  private shouldScrollToBottom = false;

  constructor(private chatAI: ChatAIService) {}

  ngOnInit(): void {
    // Subscribe to messages
    this.messagesSubscription = this.chatAI.messages$.subscribe(messages => {
      this.messages = messages;
      this.shouldScrollToBottom = true;
      
      // Update quick replies based on last AI message
      if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage.sender === 'ai') {
          this.quickReplies = this.chatAI.getQuickReplies(lastMessage.text);
        }
      }
    });

    // Initial AI greeting
    this.chatAI.addMessage("Hi there! 👋 I'm your Tixxets AI assistant. How can I help you today?", 'ai');
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  ngOnDestroy(): void {
    this.messagesSubscription?.unsubscribe();
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.shouldScrollToBottom = true;
    }
  }

  async sendMessage(): Promise<void> {
    if (!this.userMessage.trim()) return;
    
    // Add user message
    this.chatAI.addMessage(this.userMessage, 'user');
    const message = this.userMessage;
    this.userMessage = '';
    
    // Show typing indicator
    this.isTyping = true;
    
    try {
      // Get AI response (with delay)
      await this.chatAI.getResponse(message);
    } finally {
      // Hide typing indicator
      this.isTyping = false;
    }
  }

  selectQuickReply(reply: string): void {
    this.userMessage = reply;
    this.sendMessage();
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
