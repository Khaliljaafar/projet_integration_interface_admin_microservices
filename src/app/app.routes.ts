import { Routes } from '@angular/router';
import { AuthPageComponent } from './features/auth/auth-page.component';
import { SuperAdminDashboardComponent } from './features/super-admin/super-admin-dashboard.component';
import { OwnerDashboardComponent } from './features/owner/owner-dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', component: AuthPageComponent },
  { path: 'super-admin', component: SuperAdminDashboardComponent },
  { path: 'owner', component: OwnerDashboardComponent },
  { path: '**', redirectTo: 'auth' }
];
