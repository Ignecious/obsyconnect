import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AIConversation, AIConversationStatus, AIConversationGroup } from '../../models/ai-conversation.model';
import { AIConversationService } from '../../services/ai-conversation.service';

@Component({
  selector: 'app-ai-conversations-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-conversations-panel.component.html',
  styleUrl: './ai-conversations-panel.component.scss'
})
export class AIConversationsPanelComponent implements OnInit {
  @Output() conversationSelected = new EventEmitter<AIConversation>();

  allConversations: AIConversation[] = [];
  filteredConversations: AIConversation[] = [];
  conversationGroups: AIConversationGroup[] = [];

  activeFilter: 'all' | AIConversationStatus = 'all';
  statusCounts = { all: 0, resolved: 0, escalated: 0 };

  selectedConversationId: string | null = null;

  constructor(private aiConversationService: AIConversationService) {}

  ngOnInit() {
    this.loadConversations();
  }

  loadConversations() {
    const storedConversations = this.aiConversationService.getAIConversationsFromStorage();
    const mockConversations = this.aiConversationService.getAIConversations();

    const allConversations = [...storedConversations];

    mockConversations.forEach(mock => {
      if (!allConversations.find(c => c.id === mock.id)) {
        allConversations.push(mock);
      }
    });

    this.allConversations = allConversations;
    this.statusCounts = this.aiConversationService.getStatusCounts(this.allConversations);
    this.applyFilter('all');
  }

  applyFilter(filter: 'all' | AIConversationStatus) {
    this.activeFilter = filter;

    if (filter === 'all') {
      this.filteredConversations = this.allConversations;
    } else {
      this.filteredConversations = this.aiConversationService.filterByStatus(
        this.allConversations,
        filter
      );
    }

    this.conversationGroups = this.aiConversationService.groupByDate(this.filteredConversations);
  }

  selectConversation(conversation: AIConversation) {
    this.selectedConversationId = conversation.id;
    this.conversationSelected.emit(conversation);
  }

  getChannelIcon(channel: string): string {
    const icons: { [key: string]: string } = {
      'web': '🌐',
      'whatsapp': '📱',
      'email': '📧'
    };
    return icons[channel] || '💬';
  }

  truncateMessage(message: string, maxLength: number = 50): string {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  }

  getRelativeTime(timestamp: Date): string {
    return this.aiConversationService.getRelativeTime(timestamp);
  }

  getStatusDisplay(conversation: AIConversation): string {
    if (conversation.status === 'resolved') {
      return `Resolved by AI (${conversation.confidence}%)`;
    }
    return `Escalated (${conversation.confidence}%)`;
  }

  getStatusClass(status: AIConversationStatus): string {
    return status === 'resolved' ? 'resolved' : 'escalated';
  }
}
