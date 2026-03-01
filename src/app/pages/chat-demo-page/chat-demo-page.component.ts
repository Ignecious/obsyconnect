import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatDemoComponent } from '../chat-demo/chat-demo.component';

@Component({
  selector: 'app-chat-demo-page',
  standalone: true,
  imports: [CommonModule, ChatDemoComponent],
  templateUrl: './chat-demo-page.component.html',
  styleUrls: ['./chat-demo-page.component.scss']
})
export class ChatDemoPageComponent {
  chatOpen = false;

  toggleChat(): void {
    this.chatOpen = !this.chatOpen;
  }

  closeChat(): void {
    this.chatOpen = false;
  }
}
