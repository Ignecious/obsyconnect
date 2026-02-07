import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebchatWidgetComponent } from '../../components/webchat-widget/webchat-widget.component';

@Component({
  selector: 'app-chat-demo',
  standalone: true,
  imports: [CommonModule, WebchatWidgetComponent],
  templateUrl: './chat-demo.component.html',
  styleUrls: ['./chat-demo.component.scss']
})
export class ChatDemoComponent {
}
