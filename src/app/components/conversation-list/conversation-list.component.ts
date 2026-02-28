import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService, Conversation } from '../../services/supabase.service';

@Component({
  selector: 'app-conversation-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './conversation-list.component.html',
  styleUrls: ['./conversation-list.component.scss']
})
export class ConversationListComponent implements OnInit, OnDestroy {
  @Output() conversationSelected = new EventEmitter<Conversation>();

  conversations: Conversation[] = [];
  activeQueue: string = 'all';
  
  constructor(private supabase: SupabaseService) {}

  async ngOnInit(): Promise<void> {
    // Load all conversations
    await this.loadConversations();

    // Subscribe to new conversations (real-time)
    this.supabase.subscribeToConversations(async (conversation) => {
      console.log('New/updated conversation:', conversation);
      // Reload all conversations when there's a change
      await this.loadConversations();
    });
  }

  ngOnDestroy(): void {
    this.supabase.unsubscribe();
  }

  async loadConversations(): Promise<void> {
    this.conversations = await this.supabase.getConversations();
  }

  selectConversation(conversation: Conversation): void {
    this.conversationSelected.emit(conversation);
  }

  getStatusIcon(status: string): string {
    const icons: { [key: string]: string } = {
      'open': '🟢',
      'pending': '🟡',
      'closed': '⚫'
    };
    return icons[status] || '🔵';
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  getNewCount(): number {
    return this.conversations.filter(c => c.status === 'open').length;
  }

  getLastMessage(conversation: Conversation): string {
    if (!conversation.messages || conversation.messages.length === 0) {
      return 'No messages yet';
    }
    const lastMsg = conversation.messages[conversation.messages.length - 1];
    return lastMsg.message;
  }

  getLastMessageTime(conversation: Conversation): string {
    if (!conversation.messages || conversation.messages.length === 0) {
      return '';
    }
    const lastMsg = conversation.messages[conversation.messages.length - 1];
    const date = new Date(lastMsg.created_at);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  getFilteredConversations(): Conversation[] {
    if (this.activeQueue === 'all') {
      return this.conversations;
    }
    return this.conversations.filter(c => c.status === this.activeQueue);
  }
}
