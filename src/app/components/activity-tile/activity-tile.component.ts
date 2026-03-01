import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ActivityMessage {
  id: number;
  channel: 'web' | 'whatsapp' | 'email';
  timestamp: Date;
  question: string;
  answer: string;
  confidence: number;
  isEscalated: boolean;
}

@Component({
  selector: 'app-activity-tile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activity-tile.component.html',
  styleUrls: ['./activity-tile.component.scss']
})
export class ActivityTileComponent implements OnInit, OnChanges {
  @Input() customerId?: string;

  activities: ActivityMessage[] = [];
  expandedActivityId: number | null = null;

  ngOnInit() {
    this.loadActivities();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['customerId']) {
      this.loadActivities();
    }
  }

  loadActivities() {
    // TODO: Replace with actual service call to fetch AI conversation history
    // For now, use mock data based on customerId
    if (this.customerId === 'test') {
      this.activities = [
        {
          id: 1,
          channel: 'web',
          timestamp: new Date(Date.now() - 2 * 60 * 1000),
          question: "What's your refund policy?",
          answer: "Full refunds up to 14 days before the event. After that, refunds are subject to event organizer approval.",
          confidence: 95,
          isEscalated: false
        },
        {
          id: 2,
          channel: 'web',
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          question: "What are your business hours?",
          answer: "We're open Monday to Friday, 9:00 AM - 5:00 PM SAST. Closed on weekends and public holidays.",
          confidence: 90,
          isEscalated: false
        },
        {
          id: 3,
          channel: 'web',
          timestamp: new Date(Date.now() - 8 * 60 * 1000),
          question: "Can I pay with Bitcoin?",
          answer: "That's a great question! Let me connect you with a team member who can help with that specific request.",
          confidence: 20,
          isEscalated: true
        }
      ];
    } else if (this.customerId === 'anonymous') {
      this.activities = [
        {
          id: 4,
          channel: 'web',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          question: "How do I contact support?",
          answer: "Email support@tixxets.com or call +27 82 555 0123. We respond within 24 hours.",
          confidence: 92,
          isEscalated: false
        }
      ];
    } else {
      this.activities = [];
    }
  }

  getChannelIcon(channel: string): string {
    const icons: { [key: string]: string } = {
      'web': '🌐',
      'whatsapp': '📱',
      'email': '📧'
    };
    return icons[channel] || '💬';
  }

  getChannelName(channel: string): string {
    const names: { [key: string]: string } = {
      'web': 'Web',
      'whatsapp': 'WhatsApp',
      'email': 'Email'
    };
    return names[channel] || 'Unknown';
  }

  getRelativeTime(timestamp: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }

  getConfidenceBadgeClass(confidence: number): string {
    if (confidence >= 85) return 'high';
    if (confidence >= 50) return 'medium';
    return 'low';
  }

  truncateText(text: string, maxLength: number = 80): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  toggleExpand(activityId: number) {
    this.expandedActivityId = this.expandedActivityId === activityId ? null : activityId;
  }

  isExpanded(activityId: number): boolean {
    return this.expandedActivityId === activityId;
  }
}
