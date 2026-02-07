import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface PricingTier {
  name: string;
  features: string[];
  highlighted?: boolean;
}

interface WorkStep {
  number: number;
  title: string;
  description: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  mobileMenuOpen = false;

  features: Feature[] = [
    {
      icon: '🤖',
      title: 'AI-Powered Support',
      description: 'AI responds instantly, escalates when needed'
    },
    {
      icon: '💬',
      title: 'WhatsApp-First',
      description: 'Meet customers on their favorite channel'
    },
    {
      icon: '📊',
      title: 'Simple CRM',
      description: 'Manage cases, customers, and conversations in one place'
    }
  ];

  workSteps: WorkStep[] = [
    {
      number: 1,
      title: 'Customer Messages',
      description: 'Customers reach out via WhatsApp or Webchat'
    },
    {
      number: 2,
      title: 'AI Responds Instantly',
      description: 'Our AI analyzes and responds in real-time'
    },
    {
      number: 3,
      title: 'Agent Takes Over',
      description: 'Human agent steps in when needed for complex cases'
    }
  ];

  pricingTiers: PricingTier[] = [
    {
      name: 'Starter',
      features: [
        'WhatsApp + Webchat',
        'AI Suggested Replies',
        'Case management',
        'Basic dashboards'
      ]
    },
    {
      name: 'Professional',
      features: [
        'Everything in Starter',
        'Automations',
        'AI Summaries',
        'Workflows',
        'Knowledge Base',
        'SLA monitoring'
      ],
      highlighted: true
    },
    {
      name: 'Enterprise',
      features: [
        'Everything in Professional',
        'Integrations',
        'Single Sign-On',
        'Dedicated tenant',
        'Unlimited automations',
        'Premium support'
      ]
    }
  ];

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  scrollToSection(sectionId: string): void {
    this.mobileMenuOpen = false;
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
