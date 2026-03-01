import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AIService, AIResponse } from '../../services/ai.service';

interface ChatMessage {
  sender: 'customer' | 'ai' | 'agent';
  text: string;
  timestamp: Date;
  confidence?: number;
  isEscalated?: boolean;
}

@Component({
  selector: 'app-chat-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-demo.component.html',
  styleUrls: ['./chat-demo.component.scss']
})
export class ChatDemoComponent implements OnInit {
  messages: ChatMessage[] = [];
  userInput: string = '';
  isAIThinking: boolean = false;
  conversationId: string = '';
  conversationStatus: 'ai_resolved' | 'escalated' | 'pending' = 'pending';

  // Customer info
  customerName: string = 'test';
  customerEmail: string = 'test@example.com';

  constructor(private aiService: AIService) {}

  ngOnInit() {
    this.conversationId = 'conv_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);

    this.messages.push({
      sender: 'ai',
      text: "Hi! 👋 I'm the Tixxets AI assistant. How can I help you today?",
      timestamp: new Date(),
      confidence: 100
    });
  }

  async sendMessage() {
    if (!this.userInput.trim() || this.isAIThinking) return;

    const userMessage = this.userInput.trim();
    this.userInput = '';

    this.messages.push({
      sender: 'customer',
      text: userMessage,
      timestamp: new Date()
    });

    this.isAIThinking = true;

    try {
      const aiResponse: AIResponse = await this.aiService.getResponse(
        userMessage,
        this.getConversationHistory()
      );

      this.messages.push({
        sender: 'ai',
        text: aiResponse.text,
        timestamp: new Date(),
        confidence: aiResponse.confidence,
        isEscalated: aiResponse.confidence < 85
      });

      if (aiResponse.confidence >= 85) {
        this.conversationStatus = 'ai_resolved';
        console.log('✅ AI resolved conversation:', {
          conversationId: this.conversationId,
          confidence: aiResponse.confidence,
          status: 'ai_resolved'
        });
        this.saveConversation('ai_resolved', aiResponse.confidence);
      } else {
        this.conversationStatus = 'escalated';
        console.log('⚠️ Escalating to agent:', {
          conversationId: this.conversationId,
          confidence: aiResponse.confidence,
          status: 'escalated',
          reason: aiResponse.reasoning
        });
        this.saveConversation('escalated', aiResponse.confidence);
      }

    } catch (error) {
      console.error('AI response error:', error);

      this.messages.push({
        sender: 'ai',
        text: "I'm having trouble right now. Let me connect you with a team member who can help.",
        timestamp: new Date(),
        confidence: 0,
        isEscalated: true
      });

      this.conversationStatus = 'escalated';
      this.saveConversation('escalated', 0);

    } finally {
      this.isAIThinking = false;
    }
  }

  getConversationHistory(): any[] {
    return this.messages
      .filter(m => m.sender === 'customer' || m.sender === 'ai')
      .map(m => ({
        sender: m.sender,
        message: m.text
      }));
  }

  saveConversation(status: 'ai_resolved' | 'escalated', confidence: number) {
    const conversationData = {
      id: this.conversationId,
      customerId: this.customerEmail,
      customerName: this.customerName,
      customerEmail: this.customerEmail,
      channel: 'web',
      status: status,
      confidence: confidence,
      messages: this.messages.map(m => ({
        sender: m.sender,
        text: m.text,
        timestamp: m.timestamp,
        confidence: m.confidence
      })),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('💾 Saving conversation:', conversationData);
    this.saveToLocalStorage(conversationData);
  }

  saveToLocalStorage(conversationData: any) {
    try {
      const existingConversations = JSON.parse(
        localStorage.getItem('ai_conversations') || '[]'
      );

      const existingIndex = existingConversations.findIndex(
        (c: any) => c.id === conversationData.id
      );

      if (existingIndex >= 0) {
        existingConversations[existingIndex] = conversationData;
      } else {
        existingConversations.push(conversationData);
      }

      localStorage.setItem('ai_conversations', JSON.stringify(existingConversations));
      console.log('✅ Saved to localStorage');

    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  getTypingIndicator(): string {
    return this.isAIThinking ? 'AI is typing...' : '';
  }

  getStatusBadge(): string {
    if (this.conversationStatus === 'ai_resolved') {
      return '✓ Answered by AI';
    } else if (this.conversationStatus === 'escalated') {
      return '⏳ Connecting to agent...';
    }
    return '';
  }

  getConfidenceClass(confidence?: number): string {
    if (!confidence) return '';
    if (confidence >= 85) return 'high-confidence';
    if (confidence >= 50) return 'medium-confidence';
    return 'low-confidence';
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}
