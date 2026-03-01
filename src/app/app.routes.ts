import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { ChatDemoPageComponent } from './pages/chat-demo-page/chat-demo-page.component';
import { AgentDesktopComponent } from './pages/agent-desktop/agent-desktop.component';
import { AdminSettingsComponent } from './pages/admin-settings/admin-settings.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'chat-demo', component: ChatDemoPageComponent },
  { path: 'agent', component: AgentDesktopComponent },
  { path: 'agent-desktop', component: AgentDesktopComponent },
  { path: 'admin/settings', component: AdminSettingsComponent },
  { path: '**', redirectTo: '' }
];
