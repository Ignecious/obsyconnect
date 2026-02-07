import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { ChatDemoComponent } from './pages/chat-demo/chat-demo.component';
import { AgentDesktopComponent } from './pages/agent-desktop/agent-desktop.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'chat-demo', component: ChatDemoComponent },
  { path: 'agent', component: AgentDesktopComponent },
  { path: 'agent-desktop', component: AgentDesktopComponent },
  { path: '**', redirectTo: '' }
];
