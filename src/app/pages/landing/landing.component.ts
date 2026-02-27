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
      icon: '💬',
      title: 'WhatsApp Shared Inbox',
      description: 'One place for your team to reply, assign, and track customer conversations — without missed messages.'
    },
    {
      icon: '🤖',
      title: 'Safe AI Copilot',
      description: 'Draft replies, tag intent, and answer FAQs from your approved knowledge — and escalate to a human when uncertain.'
    },
    {
      icon: '⚙️',
      title: 'Workflows & Automations',
      description: 'Rules, templates, and quick actions for repetitive questions — so you handle more support without hiring.'
    }
  ];

  workSteps: WorkStep[] = [
    {
      number: 1,
      title: 'Customer Messages',
      description: 'Customers message you on WhatsApp or web chat — no airtime required.'
    },
    {
      number: 2,
      title: 'AI drafts and answers FAQs',
      description: 'AI responds from your approved FAQs and suggests replies for your team to review.'
    },
    {
      number: 3,
      title: 'Agent Takes Over',
      description: "When a message is sensitive or uncertain, it's handed to a human — with a clear summary and context."
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
