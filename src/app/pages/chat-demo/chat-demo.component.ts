import { Component, Output, EventEmitter, OnInit, OnDestroy, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatAIService, Message } from '../../services/chat-ai.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-demo.component.html',
  styleUrls: ['./chat-demo.component.scss']
})
export class ChatDemoComponent implements OnInit, OnDestroy, AfterViewChecked {
  @Output() close = new EventEmitter<void>();
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  isTyping = false;
  userMessage = '';
  messages: Message[] = [];
  quickReplies: string[] = ['Track Order', 'Get Refund', 'Talk to Agent'];

  private messagesSubscription?: Subscription;
  private shouldScrollToBottom = false;

  constructor(private chatAI: ChatAIService) {}

  ngOnInit(): void {
    this.chatAI.clearMessages();
    this.messagesSubscription = this.chatAI.messages$.subscribe(messages => {
      this.messages = messages;
      this.shouldScrollToBottom = true;
      if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage.sender === 'ai') {
          this.quickReplies = this.chatAI.getQuickReplies(lastMessage.text);
        }
      }
    });
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

  closeChat(): void {
    this.close.emit();
  }

  async sendMessage(): Promise<void> {
    if (!this.userMessage.trim()) return;
    this.chatAI.addMessage(this.userMessage, 'user');
    const message = this.userMessage;
    this.userMessage = '';
    this.isTyping = true;
    try {
      await this.chatAI.getResponse(message);
    } finally {
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
