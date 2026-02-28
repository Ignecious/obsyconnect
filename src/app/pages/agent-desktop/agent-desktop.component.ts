import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversationListComponent } from '../../components/conversation-list/conversation-list.component';
import { ConversationViewComponent } from '../../components/conversation-view/conversation-view.component';
import { CasePanelComponent } from '../../components/case-panel/case-panel.component';
import { Conversation } from '../../services/supabase.service';

@Component({
  selector: 'app-agent-desktop',
  standalone: true,
  imports: [CommonModule, ConversationListComponent, ConversationViewComponent, CasePanelComponent],
  templateUrl: './agent-desktop.component.html',
  styleUrls: ['./agent-desktop.component.scss']
})
export class AgentDesktopComponent {
  selectedConversation: Conversation | null = null;
  
  onConversationSelect(conversation: Conversation) {
    this.selectedConversation = conversation;
  }
}
