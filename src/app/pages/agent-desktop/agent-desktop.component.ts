import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversationListComponent } from '../../components/conversation-list/conversation-list.component';
import { ConversationViewComponent } from '../../components/conversation-view/conversation-view.component';
import { CasePanelComponent } from '../../components/case-panel/case-panel.component';
import { Conversation } from '../../services/supabase.service';
import { AIConversationsPanelComponent } from '../../components/ai-conversations-panel/ai-conversations-panel.component';
import { AIConversation } from '../../models/ai-conversation.model';

@Component({
  selector: 'app-agent-desktop',
  standalone: true,
  imports: [CommonModule, ConversationListComponent, ConversationViewComponent, CasePanelComponent, AIConversationsPanelComponent],
  templateUrl: './agent-desktop.component.html',
  styleUrls: ['./agent-desktop.component.scss']
})
export class AgentDesktopComponent {
  activeView: 'inbox' | 'ai-conversations' = 'inbox';
  selectedConversation: Conversation | null = null;

  onConversationSelect(conversation: Conversation) {
    this.selectedConversation = conversation;
  }

  setView(view: 'inbox' | 'ai-conversations') {
    this.activeView = view;
  }

  onAIConversationSelected(conversation: AIConversation) {
    // TODO: Load full conversation details in right panel
    console.log('AI Conversation selected:', conversation);
  }
}
