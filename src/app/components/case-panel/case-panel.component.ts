import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-case-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './case-panel.component.html',
  styleUrls: ['./case-panel.component.scss']
})
export class CasePanelComponent implements OnChanges {
  @Input() conversation: any = null;

  customerInfo: any = null;
  openCases: any[] = [];
  activity: any[] = [];
  aiSuggestions: any[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['conversation'] && this.conversation) {
      this.loadCustomerData();
    }
  }

  loadCustomerData() {
    if (!this.conversation) return;

    // Customer Info
    this.customerInfo = {
      name: this.conversation.customer.name,
      phone: this.conversation.customer.phone,
      email: this.conversation.customer.email,
      accountNumber: 'TIX-9876',
      accountStatus: 'Active',
      memberSince: 'Jan 2025',
      totalOrders: 12,
      lifetimeValue: 'R4,500'
    };

    // Open Cases
    this.openCases = [
      {
        caseId: '#9876',
        title: 'Billing dispute',
        status: 'Open',
        priority: 'High',
        createdAt: '2 hours ago'
      },
      {
        caseId: '#8765',
        title: 'Refund request',
        status: 'Pending',
        priority: 'Medium',
        createdAt: '1 day ago'
      }
    ];

    // Activity Timeline
    this.activity = [
      {
        type: 'ai-response',
        text: 'AI responded to ticket inquiry',
        timestamp: '12:45 PM',
        icon: '🤖'
      },
      {
        type: 'case-created',
        text: 'Case #12456 created',
        timestamp: '12:46 PM',
        icon: '📋'
      },
      {
        type: 'escalation',
        text: 'AI escalated to agent',
        timestamp: '12:47 PM',
        icon: '⬆️'
      },
      {
        type: 'agent-assigned',
        text: 'Assigned to you',
        timestamp: '12:47 PM',
        icon: '👤'
      }
    ];

    // AI Suggestions
    this.aiSuggestions = [
      {
        icon: '💡',
        text: 'Check spam folder',
        action: 'suggest-spam-check'
      },
      {
        icon: '💡',
        text: 'Resend to alternate email',
        action: 'suggest-alt-email'
      },
      {
        icon: '💡',
        text: 'Create priority support case',
        action: 'create-priority-case'
      },
      {
        icon: '💡',
        text: 'Offer phone support callback',
        action: 'suggest-phone-support'
      }
    ];
  }

  handleAction(action: string) {
    console.log('Action triggered:', action);
    // Handle actions here
  }

  getPriorityClass(priority: string): string {
    return `priority-${priority.toLowerCase()}`;
  }
}
