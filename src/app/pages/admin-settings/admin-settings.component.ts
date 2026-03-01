import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AIService, AIResponse } from '../../services/ai.service';

interface UploadedFile {
  id: number;
  name: string;
  type: 'pdf' | 'docx' | 'txt';
  size: string;
  icon: string;
}

interface CustomQA {
  id: number;
  question: string;
  answer: string;
}

interface TeamMember {
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Agent' | 'Owner';
  status: 'Online' | 'Away' | 'Offline';
  statusColor: string;
  avatar: string;
  activeConversations: number;
  queues: string;
}

interface Queue {
  name: string;
  icon: string;
  agents: string;
  cases: number;
  avgWait: string;
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
}

interface RoutingRule {
  id: number;
  name: string;
  condition: string;
  action: string;
  enabled: boolean;
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
  
  // Modal states
  showAddQAModal: boolean = false;
  showTestAIModal: boolean = false;
  showAddUserModal: boolean = false;
  editingQA: CustomQA | null = null;
  
  // Test AI Chat
  testMessages: Array<{sender: 'user' | 'ai', message: string, source?: string, confidence?: number}> = [];
  testUserInput: string = '';
  isTestingAI: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private aiService: AIService
  ) {}
  
  ngOnInit() {
    // Check URL query params for tab state
    this.route.queryParams.subscribe(params => {
      if (params['tab']) {
        this.activeTab = params['tab'];
      }
    });
  }
  
  // AI Agent Tab Data
  agentName: string = 'Tixxets Support Assistant';
  agentGreeting: string = 'Hi! 👋 I\'m the Tixxets AI assistant. How can I help you today?';
  aiModel: string = 'gpt-4o-mini';
  temperature: number = 0.3;
  maxResponseLength: string = '200';
  autoEscalateAttempts: number = 3;
  
  // Knowledge Base - Mock uploaded files (2 items)
  uploadedFiles: UploadedFile[] = [
    { id: 1, name: 'tixxets-faq.pdf', type: 'pdf', size: '1.2 MB', icon: '📄' },
    { id: 2, name: 'refund-policy.pdf', type: 'pdf', size: '890 KB', icon: '📄' }
  ];
  
  // Custom Q&A (18 entries)
  customQAs: CustomQA[] = [
    { id: 1, question: 'What are your business hours?', answer: 'We\'re open Monday to Friday, 9:00 AM - 5:00 PM SAST. Closed on weekends and public holidays.' },
    { id: 2, question: 'What payment methods do you accept?', answer: 'We accept Visa, Mastercard, EFT, and SnapScan. All payments are secure and encrypted.' },
    { id: 3, question: 'How long does delivery take?', answer: 'Digital tickets are delivered instantly via email. Physical tickets take 3-5 business days.' },
    { id: 4, question: 'What is your refund policy?', answer: 'Full refunds up to 14 days before the event. After that, refunds are subject to event organizer approval.' },
    { id: 5, question: 'Can I change my ticket after purchase?', answer: 'Yes, tickets can be transferred up to 24 hours before the event start time.' },
    { id: 6, question: 'Do you offer group discounts?', answer: 'Yes, groups of 10+ receive 15% off. Contact our group sales team for larger bookings.' },
    { id: 7, question: 'Are there age restrictions?', answer: 'Age restrictions vary by event. Check event details for specific requirements.' },
    { id: 8, question: 'Where can I park?', answer: 'Most venues have on-site parking or nearby garages. Check venue details for parking information.' },
    { id: 9, question: 'Do you have wheelchair access?', answer: 'All our venues are wheelchair accessible. Contact us for specific accessibility needs.' },
    { id: 10, question: 'Can I cancel my order?', answer: 'Orders can be cancelled up to 48 hours before the event for a full refund minus booking fee.' },
    { id: 11, question: 'How do I contact support?', answer: 'Email support@tixxets.com or call +27 82 555 0123. We respond within 24 hours.' },
    { id: 12, question: 'What if the event is cancelled?', answer: 'You\'ll receive a full automatic refund within 5 business days if an event is cancelled.' },
    { id: 13, question: 'Can I buy tickets at the door?', answer: 'Subject to availability. Online booking recommended to guarantee entry.' },
    { id: 14, question: 'Do you charge booking fees?', answer: 'A small R15 booking fee applies per transaction to cover processing costs.' },
    { id: 15, question: 'How do I receive my tickets?', answer: 'Tickets are emailed within 5 minutes of purchase. Check spam folder if not received.' },
    { id: 16, question: 'What if I don\'t receive my email?', answer: 'Check spam folder or contact support with your order number for immediate assistance.' },
    { id: 17, question: 'Can I get a receipt?', answer: 'Yes, receipts are included with your confirmation email and available in your account.' },
    { id: 18, question: 'Do you offer VIP packages?', answer: 'Yes! VIP packages include premium seating, backstage access, and exclusive perks. Visit our VIP page for details.' }
  ];
  
  newQA: CustomQA = { id: 0, question: '', answer: '' };
  
  // Channels Tab Data
  whatsappPhone: string = '+27 82 555 0123';
  whatsappConversations: number = 245;
  whatsappBusinessId: string = '1234567890';
  whatsappAccessToken: string = '••••••••••••••';
  whatsappPhoneId: string = '9876543210';
  
  webchatConversations: number = 189;
  webchatColor: string = '#A855F7';
  webchatPosition: string = 'bottom-right';
  webchatWelcome: string = 'Hi! 👋 How can we help?';
  webchatDomains: string[] = ['tixxets.com', 'www.tixxets.com'];
  newDomain: string = '';
  embedCode: string = `<script src="https://cdn.obsyconnect.com/widget.js"
  data-tenant="tixxets"
  data-color="#A855F7">
</script>`;
  
  // Users Tab Data
  seatsUsed: number = 5;
  seatsTotal: number = 10;
  basePlanCost: number = 299;
  seatCost: number = 60;
  get monthlyTotal(): number {
    return this.basePlanCost + (this.seatsUsed * this.seatCost);
  }
  
  teamMembers: TeamMember[] = [
    { 
      name: 'Sarah Chen', 
      email: 'sarah@tixxets.com', 
      role: 'Admin', 
      status: 'Online', 
      statusColor: '🟢',
      avatar: '👤', 
      activeConversations: 3,
      queues: 'All'
    },
    { 
      name: 'John Smith', 
      email: 'john@tixxets.com', 
      role: 'Agent', 
      status: 'Online', 
      statusColor: '🟢',
      avatar: '👤', 
      activeConversations: 2,
      queues: 'Billing'
    },
    { 
      name: 'Rose Williams', 
      email: 'rose@tixxets.com', 
      role: 'Agent', 
      status: 'Away', 
      statusColor: '🟡',
      avatar: '👤', 
      activeConversations: 0,
      queues: 'General'
    },
    { 
      name: 'Michael Brown', 
      email: 'michael@tixxets.com', 
      role: 'Manager', 
      status: 'Online', 
      statusColor: '🟢',
      avatar: '👤', 
      activeConversations: 0,
      queues: 'All'
    },
    { 
      name: 'Admin User', 
      email: 'admin@tixxets.com', 
      role: 'Owner', 
      status: 'Online', 
      statusColor: '🟢',
      avatar: '👤', 
      activeConversations: 0,
      queues: '-'
    }
  ];
  
  newUser = { 
    name: '', 
    email: '', 
    role: 'Agent',
    queues: [] as string[]
  };
  
  availableQueues = ['New Cases', 'Billing', 'Technical', 'VIP'];
  
  // Queues Tab Data
  queues: Queue[] = [
    { name: 'New Cases', icon: '🔵', agents: 'All(5)', cases: 12, avgWait: '3 min', priority: 'High' },
    { name: 'Billing', icon: '💰', agents: '2', cases: 5, avgWait: '8 min', priority: 'Medium' },
    { name: 'Technical', icon: '🔧', agents: '2', cases: 3, avgWait: '5 min', priority: 'High' },
    { name: 'VIP', icon: '⭐', agents: 'All(5)', cases: 1, avgWait: '2 min', priority: 'Urgent' },
    { name: 'General', icon: '📧', agents: '3', cases: 8, avgWait: '12 min', priority: 'Low' }
  ];
  
  routingRules: RoutingRule[] = [
    { 
      id: 1, 
      name: 'Keyword-based routing', 
      condition: 'If message contains: "refund", "payment", "bill"', 
      action: 'Route to: Billing queue',
      enabled: true
    },
    { 
      id: 2, 
      name: 'VIP customer routing', 
      condition: 'If customer status = "VIP"', 
      action: 'Route to: VIP queue (priority)',
      enabled: true
    },
    { 
      id: 3, 
      name: 'AI escalation routing', 
      condition: 'If AI escalates after 3 attempts', 
      action: 'Route to: Technical queue',
      enabled: true
    },
    { 
      id: 4, 
      name: 'Business hours routing', 
      condition: 'If outside business hours (8am-6pm)', 
      action: 'Show message: "We\'ll respond in 24hrs"',
      enabled: true
    }
  ];
  
  slaSettings = {
    firstResponse: '15 minutes',
    resolution: '24 hours',
    businessHours: 'Monday - Friday: 8:00 AM - 6:00 PM',
    timezone: 'Africa/Johannesburg',
    autoEscalate: true,
    notifyManager: true
  };
  
  setActiveTab(tab: string) {
    this.activeTab = tab;
    // Update URL query param
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tab },
      queryParamsHandling: 'merge'
    });
  }
  
  // Knowledge Base methods
  onFileSelect(event: any) {
    // Mock file upload - in real app would handle file upload
    const files = event.target.files;
    console.log('Files selected:', files);
    alert('File upload functionality would be implemented here');
  }
  
  deleteFile(fileId: number) {
    if (confirm('Are you sure you want to delete this file?')) {
      this.uploadedFiles = this.uploadedFiles.filter(f => f.id !== fileId);
    }
  }
  
  // Custom Q&A methods
  openAddQAModal() {
    this.editingQA = null;
    this.newQA = { id: 0, question: '', answer: '' };
    this.showAddQAModal = true;
  }
  
  openEditQAModal(qa: CustomQA) {
    this.editingQA = qa;
    this.newQA = { ...qa };
    this.showAddQAModal = true;
  }
  
  saveQA() {
    if (!this.newQA.question || !this.newQA.answer) {
      alert('Please fill in both question and answer fields.');
      return;
    }
    
    if (this.editingQA) {
      // Update existing
      const index = this.customQAs.findIndex(q => q.id === this.editingQA!.id);
      if (index !== -1) {
        this.customQAs[index] = { ...this.newQA };
      }
    } else {
      // Add new
      const newId = Math.max(...this.customQAs.map(q => q.id), 0) + 1;
      this.customQAs.push({ ...this.newQA, id: newId });
    }
    
    this.closeAddQAModal();
  }
  
  closeAddQAModal() {
    this.showAddQAModal = false;
    this.editingQA = null;
    this.newQA = { id: 0, question: '', answer: '' };
  }
  
  deleteQA(qaId: number) {
    if (confirm('Are you sure you want to delete this Q&A?')) {
      this.customQAs = this.customQAs.filter(q => q.id !== qaId);
    }
  }
  
  // Test AI methods
  openTestAIModal() {
    this.showTestAIModal = true;
    this.testMessages = [];
    this.testUserInput = '';
  }
  
  closeTestAIModal() {
    this.showTestAIModal = false;
    this.testMessages = [];
    this.testUserInput = '';
  }
  
  async sendTestMessage() {
    if (!this.testUserInput.trim() || this.isTestingAI) return;

    const userMessage = this.testUserInput.trim();
    this.testUserInput = '';

    // Add user message to chat
    this.testMessages.push({
      sender: 'user',
      message: userMessage
    });

    this.isTestingAI = true;

    try {
      // Get AI response
      const aiResponse: AIResponse = await this.aiService.getResponse(userMessage, this.testMessages);

      // Add AI response to chat
      this.testMessages.push({
        sender: 'ai',
        message: aiResponse.text,
        source: aiResponse.reasoning,
        confidence: aiResponse.confidence
      });

    } catch (error) {
      console.error('Test AI error:', error);
      this.testMessages.push({
        sender: 'ai',
        message: 'Error testing AI. Please check console for details.',
        confidence: 0
      });
    } finally {
      this.isTestingAI = false;
    }
  }

  clearTestChat() {
    this.testMessages = [];
    this.testUserInput = '';
  }
  
  // Channels methods
  copyEmbedCode() {
    navigator.clipboard.writeText(this.embedCode).then(
      () => alert('Embed code copied to clipboard!'),
      () => alert('Failed to copy embed code. Please copy manually.')
    );
  }
  
  addDomain() {
    if (this.newDomain && !this.webchatDomains.includes(this.newDomain)) {
      this.webchatDomains.push(this.newDomain);
      this.newDomain = '';
    }
  }
  
  removeDomain(domain: string) {
    this.webchatDomains = this.webchatDomains.filter(d => d !== domain);
  }
  
  previewWidget() {
    alert('Widget preview functionality would open a modal with the webchat widget');
  }
  
  testWhatsApp() {
    alert('Test message sent to ' + this.whatsappPhone);
  }
  
  configureWhatsApp() {
    alert('WhatsApp configuration modal would open here');
  }
  
  disconnectWhatsApp() {
    if (confirm('Are you sure you want to disconnect WhatsApp?')) {
      alert('WhatsApp disconnected');
    }
  }
  
  setupEmail() {
    alert('Email setup wizard would open here');
  }
  
  // Users methods
  openAddUserModal() {
    this.showAddUserModal = true;
    this.newUser = { name: '', email: '', role: 'Agent', queues: [] };
  }
  
  closeAddUserModal() {
    this.showAddUserModal = false;
  }
  
  toggleQueue(queue: string) {
    const index = this.newUser.queues.indexOf(queue);
    if (index > -1) {
      this.newUser.queues.splice(index, 1);
    } else {
      this.newUser.queues.push(queue);
    }
  }
  
  isQueueSelected(queue: string): boolean {
    return this.newUser.queues.includes(queue);
  }
  
  addUser() {
    if (!this.newUser.name || !this.newUser.email) {
      alert('Please fill in name and email fields.');
      return;
    }
    
    if (this.seatsUsed >= this.seatsTotal) {
      alert('All seats are occupied. Please upgrade your plan to add more users.');
      return;
    }
    
    this.teamMembers.push({
      name: this.newUser.name,
      email: this.newUser.email,
      role: this.newUser.role as any,
      status: 'Online',
      statusColor: '🟢',
      avatar: '👤',
      activeConversations: 0,
      queues: this.newUser.queues.join(', ') || 'All'
    });
    this.seatsUsed++;
    this.closeAddUserModal();
    alert('Invitation sent to ' + this.newUser.email);
  }
  
  editUser(member: TeamMember) {
    alert('Edit user modal would open for ' + member.name);
  }
  
  addMoreSeats() {
    alert('Add more seats functionality would open billing modal');
  }
  
  upgradePlan() {
    alert('Upgrade plan functionality would open pricing page');
  }
  
  // Queues methods
  viewQueueCases(queueName: string) {
    alert('Viewing cases for queue: ' + queueName);
  }
  
  editQueue(queue: Queue) {
    alert('Edit queue modal would open for ' + queue.name);
  }
  
  deleteQueue(queue: Queue) {
    if (confirm('Are you sure you want to delete queue: ' + queue.name + '?')) {
      this.queues = this.queues.filter(q => q.name !== queue.name);
    }
  }
  
  createQueue() {
    alert('Create queue modal would open here');
  }
  
  addRoutingRule() {
    alert('Add routing rule modal would open here');
  }
  
  editRule(rule: RoutingRule) {
    alert('Edit rule modal would open for ' + rule.name);
  }
  
  deleteRule(ruleId: number) {
    if (confirm('Are you sure you want to delete this rule?')) {
      this.routingRules = this.routingRules.filter(r => r.id !== ruleId);
    }
  }
  
  toggleRule(rule: RoutingRule) {
    rule.enabled = !rule.enabled;
  }
  
  configureBusinessHours() {
    alert('Business hours configuration modal would open here');
  }
}
