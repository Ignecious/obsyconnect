import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { ChatDemoComponent } from './pages/chat-demo/chat-demo.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'chat-demo', component: ChatDemoComponent },
  { path: '**', redirectTo: '' }
];
