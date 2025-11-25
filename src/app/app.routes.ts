import { Routes } from '@angular/router';
import { AuthPageComponent } from './features/auth/auth-page.component';
import { SuperAdminDashboardComponent } from './features/super-admin/super-admin-dashboard.component';
import { OwnerDashboardComponent } from './features/owner/owner-dashboard.component';
import { PlayerPageComponent } from './features/player/player-page.component';
import { authRoleGuard } from './core/guards/auth-role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', component: AuthPageComponent, canActivate: [authRoleGuard], data: { publicOnly: true } },
  { path: 'super-admin', component: SuperAdminDashboardComponent, canActivate: [authRoleGuard], data: { roles: ['super-admin'] } },
  { path: 'owner', component: OwnerDashboardComponent, canActivate: [authRoleGuard], data: { roles: ['owner'] } },
  { path: 'player', component: PlayerPageComponent, canActivate: [authRoleGuard], data: { roles: ['player'] } },
  { path: '**', redirectTo: 'auth' }
];
