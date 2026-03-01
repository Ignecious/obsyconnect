import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversationListComponent } from '../../components/conversation-list/conversation-list.component';
import { ConversationViewComponent } from '../../components/conversation-view/conversation-view.component';
import { CasePanelComponent } from '../../components/case-panel/case-panel.component';
import { Conversation } from '../../services/supabase.service';
import { AIConversationsPanelComponent } from '../../components/ai-conversations-panel/ai-conversations-panel.component';
import { AIConversation } from '../../models/ai-conversation.model';
import { ConversationPanelComponent } from '../../components/conversation-panel/conversation-panel.component';
import { ConversationService } from '../../services/conversation.service';

@Component({
  selector: 'app-agent-desktop',
  standalone: true,
  imports: [CommonModule, ConversationListComponent, ConversationViewComponent, CasePanelComponent, AIConversationsPanelComponent, ConversationPanelComponent],
  templateUrl: './agent-desktop.component.html',
  styleUrls: ['./agent-desktop.component.scss']
})
export class AgentDesktopComponent {
  activeView: 'inbox' | 'ai-conversations' = 'inbox';
  selectedConversation: Conversation | null = null;
  selectedAIConversationId: string | null = null;

  constructor(private conversationService: ConversationService) {}

  onConversationSelect(conversation: Conversation) {
    this.selectedConversation = conversation;
    this.selectedAIConversationId = null;
  }

  setView(view: 'inbox' | 'ai-conversations') {
    this.activeView = view;
  }

  onAIConversationSelected(aiConversation: AIConversation) {
    console.log('🤖 AI Conversation selected:', aiConversation);
    this.selectedAIConversationId = aiConversation.id;
    this.selectedConversation = null;
  }
}
