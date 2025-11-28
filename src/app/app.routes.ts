import { Routes } from '@angular/router';
import { AuthPageComponent } from './features/auth/auth-page.component';
import { SuperAdminDashboardComponent } from './features/super-admin/super-admin-dashboard.component';
import { OwnerDashboardComponent } from './features/owner/owner-dashboard.component';
import { PlayerPageComponent } from './features/player/player-page.component';
import { PendingApprovalComponent } from './features/pending-approval/pending-approval.component';
import { authRoleGuard } from './core/guards/auth-role.guard';
import { ownerApprovedGuard } from './core/guards/owner-approved.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', component: AuthPageComponent, canActivate: [authRoleGuard], data: { publicOnly: true } },
  { path: 'super-admin', component: SuperAdminDashboardComponent, canActivate: [authRoleGuard], data: { roles: ['super-admin'] } },
  { path: 'pending-approval', component: PendingApprovalComponent, canActivate: [authRoleGuard], data: { roles: ['owner'] } },
  { path: 'owner', component: OwnerDashboardComponent, canActivate: [authRoleGuard, ownerApprovedGuard], data: { roles: ['owner'] } },
  { path: 'player', component: PlayerPageComponent, canActivate: [authRoleGuard], data: { roles: ['player'] } },
  { path: '**', redirectTo: 'auth' }
];
