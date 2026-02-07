import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface KnowledgeArticle {
  id: number;
  title: string;
  category: string;
}

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

interface Channel {
  name: string;
  status: 'connected' | 'configured' | 'not-configured' | 'coming-soon';
  icon: string;
}

interface TeamMember {
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Offline';
  avatar: string;
}

interface Queue {
  name: string;
  count: number;
  color: string;
}

interface RoutingRule {
  name: string;
  condition: string;
  queue: string;
}

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-settings.component.html',
  styleUrl: './admin-settings.component.scss'
})
export class AdminSettingsComponent {
  activeTab: string = 'ai-agent';
  
  // AI Agent Tab Data
  agentName: string = 'ObsyBot';
  agentGreeting: string = 'Hello! I\'m ObsyBot, your AI assistant. How can I help you today?';
  aiModel: string = 'claude-3.5';
  temperature: number = 0.7;
  autoEscalation: boolean = true;
  
  knowledgeArticles: KnowledgeArticle[] = [
    { id: 1, title: 'Getting Started Guide', category: 'Onboarding' },
    { id: 2, title: 'Account Setup Instructions', category: 'Onboarding' },
    { id: 3, title: 'Billing & Payments FAQ', category: 'Billing' },
    { id: 4, title: 'Subscription Plans Overview', category: 'Billing' },
    { id: 5, title: 'Troubleshooting Login Issues', category: 'Technical' },
    { id: 6, title: 'API Integration Guide', category: 'Technical' },
    { id: 7, title: 'WhatsApp Setup Tutorial', category: 'Channels' },
    { id: 8, title: 'Webchat Widget Configuration', category: 'Channels' },
    { id: 9, title: 'Data Security & Privacy', category: 'Security' },
    { id: 10, title: 'GDPR Compliance Information', category: 'Security' },
    { id: 11, title: 'Team Management Best Practices', category: 'Admin' },
    { id: 12, title: 'Advanced Routing Rules', category: 'Admin' }
  ];
  
  faqs: FAQ[] = [
    { id: 1, question: 'How do I reset my password?', answer: 'Click on "Forgot Password" on the login page.' },
    { id: 2, question: 'What payment methods do you accept?', answer: 'We accept credit cards, debit cards, and bank transfers.' },
    { id: 3, question: 'Can I upgrade my plan?', answer: 'Yes, you can upgrade anytime from the Settings page.' },
    { id: 4, question: 'How do I add team members?', answer: 'Go to Settings > Users and click "Add User".' },
    { id: 5, question: 'Is there a mobile app?', answer: 'Yes, our mobile app is available on iOS and Android.' },
    { id: 6, question: 'How do I connect WhatsApp?', answer: 'Navigate to Settings > Channels and follow the WhatsApp setup wizard.' },
    { id: 7, question: 'What is the response time SLA?', answer: 'Our standard SLA is 4 hours for regular tickets and 1 hour for VIP.' },
    { id: 8, question: 'Can I export conversation data?', answer: 'Yes, you can export data from the Reports section.' },
    { id: 9, question: 'How does AI escalation work?', answer: 'AI automatically transfers to human agents when confidence is low.' },
    { id: 10, question: 'What languages are supported?', answer: 'We support English, Afrikaans, isiZulu, and isiXhosa.' },
    { id: 11, question: 'How secure is the platform?', answer: 'We use bank-level encryption and comply with GDPR and POPIA.' },
    { id: 12, question: 'Can I customize the webchat widget?', answer: 'Yes, you can change colors, position, and branding.' },
    { id: 13, question: 'What is included in the free trial?', answer: 'Full platform access for 14 days with up to 5 agents.' },
    { id: 14, question: 'How do I cancel my subscription?', answer: 'Contact support or cancel from the Billing section.' },
    { id: 15, question: 'Can I integrate with my CRM?', answer: 'Yes, we offer integrations with popular CRMs via API.' },
    { id: 16, question: 'What happens if I exceed my seat limit?', answer: 'You\'ll be prompted to upgrade to add more seats.' },
    { id: 17, question: 'How does queue routing work?', answer: 'Cases are automatically routed based on predefined rules.' },
    { id: 18, question: 'Can I track agent performance?', answer: 'Yes, detailed analytics are available in the Reports dashboard.' }
  ];
  
  // Channels Tab Data
  channels: Channel[] = [
    { name: 'WhatsApp Business', status: 'connected', icon: '📱' },
    { name: 'Webchat Widget', status: 'configured', icon: '💬' },
    { name: 'Email', status: 'not-configured', icon: '📧' },
    { name: 'SMS', status: 'coming-soon', icon: '💌' }
  ];
  
  webchatColor: string = '#A855F7';
  embedCode: string = '<script src="https://obsyconnect.com/widget.js" data-id="your-company-id"></script>';
  whatsappNumber: string = '+27 81 234 5678';
  
  // Users Tab Data
  seatsUsed: number = 5;
  seatsTotal: number = 10;
  monthlyPrice: number = 599;
  
  teamMembers: TeamMember[] = [
    { name: 'Sarah Chen', email: 'sarah@company.com', role: 'Senior Agent', status: 'Active', avatar: '👩' },
    { name: 'John Botha', email: 'john@company.com', role: 'Agent', status: 'Active', avatar: '👨' },
    { name: 'Rose Nkosi', email: 'rose@company.com', role: 'Team Lead', status: 'Active', avatar: '👩' },
    { name: 'Michael van der Merwe', email: 'michael@company.com', role: 'Agent', status: 'Offline', avatar: '👨' },
    { name: 'Admin User', email: 'admin@company.com', role: 'Administrator', status: 'Active', avatar: '👤' }
  ];
  
  newUser = { name: '', email: '', role: 'Agent' };
  
  // Queues Tab Data
  queues: Queue[] = [
    { name: 'New', count: 12, color: '#3B82F6' },
    { name: 'Billing', count: 8, color: '#F59E0B' },
    { name: 'Technical', count: 15, color: '#EF4444' },
    { name: 'VIP', count: 3, color: '#A855F7' },
    { name: 'General', count: 24, color: '#10B981' }
  ];
  
  routingRules: RoutingRule[] = [
    { name: 'VIP Customers', condition: 'Customer tier = VIP', queue: 'VIP' },
    { name: 'Billing Keywords', condition: 'Message contains "invoice" or "payment"', queue: 'Billing' },
    { name: 'Technical Keywords', condition: 'Message contains "bug" or "error"', queue: 'Technical' },
    { name: 'Default Rule', condition: 'All other cases', queue: 'General' }
  ];
  
  slaSettings = {
    standard: '4 hours',
    vip: '1 hour',
    businessHours: '08:00 - 17:00 SAST'
  };
  
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
  
  testAI() {
    alert('AI Test: "Hello! I\'m ObsyBot, your AI assistant. How can I help you today?"');
  }
  
  copyEmbedCode() {
    navigator.clipboard.writeText(this.embedCode);
    alert('Embed code copied to clipboard!');
  }
  
  addUser() {
    if (this.newUser.name && this.newUser.email) {
      this.teamMembers.push({
        name: this.newUser.name,
        email: this.newUser.email,
        role: this.newUser.role,
        status: 'Active',
        avatar: '👤'
      });
      this.seatsUsed++;
      this.newUser = { name: '', email: '', role: 'Agent' };
      alert('User added successfully!');
    }
  }
}
