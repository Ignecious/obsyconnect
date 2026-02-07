import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

interface KnowledgeArticle {
  id: number;
  title: string;
  category: string;
  fileType: string;
  size: string;
  uploadDate: string;
  uploading?: boolean;
  uploadProgress?: number;
}

interface FAQ {
  id: number;
  question: string;
  answer: string;
  editing?: boolean;
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
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin-settings.component.html',
  styleUrl: './admin-settings.component.scss'
})
export class AdminSettingsComponent implements OnInit {
  activeTab: string = 'ai-agent';
  isDragging: boolean = false;
  showFaqModal: boolean = false;
  showTestPanel: boolean = false;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}
  
  // AI Agent Tab Data
  agentName: string = 'ObsyBot';
  agentGreeting: string = 'Hello! I\'m ObsyBot, your AI assistant. How can I help you today?';
  aiModel: string = 'claude-3.5';
  temperature: number = 0.7;
  maxTokens: number = 2048;
  autoEscalation: boolean = true;
  escalationKeywords: string = 'refund, complaint, urgent, cancel subscription';
  
  // FAQ Form Data
  currentFaq: FAQ = { id: 0, question: '', answer: '' };
  testMessage: string = '';
  testResponse: string = '';
  referencedSource: string = '';
  
  knowledgeArticles: KnowledgeArticle[] = [
    { id: 1, title: 'Getting Started Guide', category: 'Onboarding', fileType: 'pdf', size: '2.4 MB', uploadDate: '2024-01-15' },
    { id: 2, title: 'Account Setup Instructions', category: 'Onboarding', fileType: 'docx', size: '1.8 MB', uploadDate: '2024-01-16' },
    { id: 3, title: 'Billing & Payments FAQ', category: 'Billing', fileType: 'pdf', size: '1.2 MB', uploadDate: '2024-01-18' },
    { id: 4, title: 'Subscription Plans Overview', category: 'Billing', fileType: 'pdf', size: '3.1 MB', uploadDate: '2024-01-20' },
    { id: 5, title: 'Troubleshooting Login Issues', category: 'Technical', fileType: 'txt', size: '456 KB', uploadDate: '2024-01-22' },
    { id: 6, title: 'API Integration Guide', category: 'Technical', fileType: 'pdf', size: '4.2 MB', uploadDate: '2024-01-25' },
    { id: 7, title: 'WhatsApp Setup Tutorial', category: 'Channels', fileType: 'docx', size: '2.1 MB', uploadDate: '2024-01-27' },
    { id: 8, title: 'Webchat Widget Configuration', category: 'Channels', fileType: 'pdf', size: '1.5 MB', uploadDate: '2024-01-28' },
    { id: 9, title: 'Data Security & Privacy', category: 'Security', fileType: 'pdf', size: '3.8 MB', uploadDate: '2024-02-01' },
    { id: 10, title: 'GDPR Compliance Information', category: 'Security', fileType: 'txt', size: '890 KB', uploadDate: '2024-02-03' },
    { id: 11, title: 'Team Management Best Practices', category: 'Admin', fileType: 'docx', size: '1.9 MB', uploadDate: '2024-02-05' },
    { id: 12, title: 'Advanced Routing Rules', category: 'Admin', fileType: 'pdf', size: '2.7 MB', uploadDate: '2024-02-06' }
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
  
  ngOnInit() {
    // Check for tab query parameter
    this.route.queryParams.subscribe(params => {
      if (params['tab']) {
        this.activeTab = params['tab'];
      }
    });
  }
  
  setActiveTab(tab: string) {
    this.activeTab = tab;
    // Update URL with query param
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tab },
      queryParamsHandling: 'merge'
    });
  }
  
  // File Upload Methods
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }
  
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }
  
  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(files);
    }
  }
  
  onFileSelect(event: any) {
    const files = event.target.files;
    if (files) {
      this.handleFiles(files);
    }
  }
  
  handleFiles(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
      
      // Validate file type
      if (!['pdf', 'docx', 'txt', 'doc'].includes(fileExtension)) {
        alert(`Invalid file type: ${file.name}. Only PDF, DOCX, DOC, and TXT files are supported.`);
        continue;
      }
      
      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        alert(`File too large: ${file.name}. Maximum file size is 10MB.`);
        continue;
      }
      
      // Create new article with upload progress
      const newArticle: KnowledgeArticle = {
        id: Date.now() * 1000 + i,
        title: file.name.replace(/\.[^/.]+$/, ''),
        category: 'Uploaded',
        fileType: fileExtension,
        size: this.formatFileSize(file.size),
        uploadDate: new Date().toISOString().split('T')[0],
        uploading: true,
        uploadProgress: 0
      };
      
      this.knowledgeArticles.unshift(newArticle);
      
      // Simulate upload progress
      this.simulateUpload(newArticle);
    }
  }
  
  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
  
  simulateUpload(article: KnowledgeArticle) {
    const interval = setInterval(() => {
      if (article.uploadProgress! < 100) {
        article.uploadProgress = article.uploadProgress! + 10;
      } else {
        article.uploading = false;
        clearInterval(interval);
      }
    }, 200);
  }
  
  deleteArticle(id: number) {
    if (confirm('Are you sure you want to delete this article?')) {
      this.knowledgeArticles = this.knowledgeArticles.filter(a => a.id !== id);
    }
  }
  
  getFileIcon(fileType: string): string {
    switch (fileType) {
      case 'pdf': return '📕';
      case 'docx':
      case 'doc': return '📘';
      case 'txt': return '📄';
      default: return '📄';
    }
  }
  
  // FAQ Methods
  openFaqModal() {
    this.currentFaq = { id: 0, question: '', answer: '' };
    this.showFaqModal = true;
  }
  
  editFaq(faq: FAQ) {
    this.currentFaq = { ...faq };
    this.showFaqModal = true;
  }
  
  deleteFaq(id: number) {
    if (confirm('Are you sure you want to delete this FAQ?')) {
      this.faqs = this.faqs.filter(f => f.id !== id);
    }
  }
  
  saveFaq() {
    if (!this.currentFaq.question || !this.currentFaq.answer) {
      alert('Please fill in both question and answer fields.');
      return;
    }
    
    if (this.currentFaq.id === 0) {
      // Add new FAQ with unique ID
      this.currentFaq.id = Date.now() + Math.floor(Math.random() * 1000);
      this.faqs.unshift(this.currentFaq);
    } else {
      // Update existing FAQ
      const index = this.faqs.findIndex(f => f.id === this.currentFaq.id);
      if (index !== -1) {
        this.faqs[index] = { ...this.currentFaq };
      }
    }
    
    this.closeFaqModal();
  }
  
  closeFaqModal() {
    this.showFaqModal = false;
    this.currentFaq = { id: 0, question: '', answer: '' };
  }
  
  testAI() {
    this.showTestPanel = !this.showTestPanel;
    if (this.showTestPanel) {
      this.testMessage = '';
      this.testResponse = '';
      this.referencedSource = '';
    }
  }
  
  sendTestMessage() {
    if (!this.testMessage.trim()) {
      return;
    }
    
    // Simulate AI response with reference to knowledge base
    const keywords = this.testMessage.toLowerCase();
    let response = '';
    let source = '';
    
    // Match against FAQs - improved matching logic
    const matchedFaq = this.faqs.find(f => {
      const faqQuestion = f.question.toLowerCase();
      const messageWords = keywords.split(' ').filter(w => w.length > 3);
      // Check if at least 2 significant words from the FAQ question appear in the user message
      const matchingWords = messageWords.filter(word => faqQuestion.includes(word));
      return matchingWords.length >= 2 || faqQuestion.includes(keywords.slice(0, 20));
    });
    
    if (matchedFaq) {
      response = matchedFaq.answer;
      source = `Referenced from FAQ: "${matchedFaq.question}"`;
    } else {
      // Match against knowledge articles
      const matchedArticle = this.knowledgeArticles.find(a => 
        keywords.includes(a.category.toLowerCase()) || 
        keywords.includes(a.title.toLowerCase().split(' ')[0].toLowerCase())
      );
      
      if (matchedArticle) {
        response = `Based on our ${matchedArticle.category} documentation, I can help you with that. The information is detailed in our "${matchedArticle.title}" guide.`;
        source = `Referenced from Knowledge Base: "${matchedArticle.title}" (${matchedArticle.category})`;
      } else {
        response = this.agentGreeting + ' I don\'t have specific information about that in my knowledge base. Would you like me to escalate this to a human agent?';
        source = 'No specific knowledge base match found - using default greeting';
      }
    }
    
    this.testResponse = response;
    this.referencedSource = source;
  }
  
  copyEmbedCode() {
    navigator.clipboard.writeText(this.embedCode).then(
      () => alert('Embed code copied to clipboard!'),
      () => alert('Failed to copy embed code. Please copy manually.')
    );
  }
  
  addUser() {
    if (!this.newUser.name || !this.newUser.email) {
      alert('Please fill in both name and email fields.');
      return;
    }
    
    if (this.seatsUsed >= this.seatsTotal) {
      alert('All seats are occupied. Please upgrade your plan to add more users.');
      return;
    }
    
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
