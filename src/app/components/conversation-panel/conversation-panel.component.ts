import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Conversation, ESCALATION_CONFIDENCE_THRESHOLD, MEDIUM_CONFIDENCE_THRESHOLD } from '../../models/conversation.model';
import { ConversationService } from '../../services/conversation.service';

@Component({
  selector: 'app-conversation-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './conversation-panel.component.html',
  styleUrls: ['./conversation-panel.component.scss']
})
export class ConversationPanelComponent implements OnChanges {
  @Input() conversationId?: string;

  conversation: Conversation | null = null;
  agentReply: string = '';

  constructor(private conversationService: ConversationService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['conversationId'] && this.conversationId) {
      this.loadConversation();
    }
  }

  loadConversation(): void {
    if (!this.conversationId) return;
    this.conversation = this.conversationService.getConversationById(this.conversationId);
    console.log('📩 Loaded conversation:', this.conversation);
  }

  sendAgentReply(): void {
    if (!this.agentReply.trim() || !this.conversationId) return;

    const messageText = this.agentReply.trim();
    this.agentReply = '';

    this.conversationService.addAgentMessage(this.conversationId, messageText);
    this.loadConversation();
  }

  getMessageSenderLabel(sender: string): string {
    const labels: { [key: string]: string } = {
      'customer': this.conversation?.customerName || 'Customer',
      'ai': '🤖 AI Assistant',
      'agent': '👤 Agent'
    };
    return labels[sender] || sender;
  }

  getMessageClass(sender: string): string {
    return `message-${sender}`;
  }

  getRelativeTime(timestamp: Date): string {
    return this.conversationService.getRelativeTime(timestamp);
  }

  getConfidenceClass(confidence?: number): string {
    if (!confidence) return '';
    if (confidence >= ESCALATION_CONFIDENCE_THRESHOLD) return 'high-confidence';
    if (confidence >= MEDIUM_CONFIDENCE_THRESHOLD) return 'medium-confidence';
    return 'low-confidence';
  }

  isEscalatedConversation(): boolean {
    return this.conversation?.status === 'escalated' && this.conversation?.aiHandled === true;
  }

  getEscalationBanner(): string {
    if (!this.isEscalatedConversation()) return '';
    return `⚠️ Escalated from AI - ${this.conversation?.escalationReason || 'Low confidence'}`;
  }
}
