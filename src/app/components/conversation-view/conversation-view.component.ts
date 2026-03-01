import { Component, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService, Conversation, Message } from '../../services/supabase.service';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';

@Component({
  selector: 'app-conversation-view',
  standalone: true,
  imports: [CommonModule, FormsModule, TimeAgoPipe],
  templateUrl: './conversation-view.component.html',
  styleUrls: ['./conversation-view.component.scss']
})
export class ConversationViewComponent implements OnChanges, OnDestroy {
  @Input() conversation: Conversation | null = null;

  agentMessage: string = '';
  messages: Message[] = [];

  constructor(private supabase: SupabaseService) {}

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['conversation'] && this.conversation) {
      await this.loadMessages();
      
      // Subscribe to new messages for this conversation
      this.supabase.subscribeToMessages((message) => {
        if (message.conversation_id === this.conversation?.id) {
          this.messages.push(message);
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.supabase.unsubscribe();
  }

  async loadMessages(): Promise<void> {
    if (!this.conversation) return;

    if (this.conversation.messages) {
      this.messages = this.conversation.messages;
    } else {
      this.messages = await this.supabase.getMessages(this.conversation.id);
    }
  }

  async sendMessage(): Promise<void> {
    if (!this.agentMessage.trim() || !this.conversation) return;

    const messageText = this.agentMessage;
    this.agentMessage = '';

    await this.supabase.sendMessage(
      this.conversation.id,
      'agent',
      messageText
    );
  }

  async updateStatus(newStatus: 'open' | 'pending' | 'closed'): Promise<void> {
    if (!this.conversation) return;

    await this.supabase.updateConversationStatus(this.conversation.id, newStatus);
    this.conversation.status = newStatus;
  }

  getCurrentTime(): string {
    return new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  scrollToBottom(): void {
    // Implement scroll to bottom if needed
  }

  // Keep these methods for template compatibility
  takeOverFromAI(): void {
    // Not needed for now, but kept for template compatibility
  }

  get agentTookOver(): boolean {
    return true; // Agent is always active in this version
  }

  get showAISuggestions(): boolean {
    return false; // No AI suggestions yet
  }
}
