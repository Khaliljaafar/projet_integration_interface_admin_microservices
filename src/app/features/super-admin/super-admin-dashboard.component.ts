import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, NgClass, NgFor, AsyncPipe } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  AdminDataService,
  Feedback,
  NotificationItem,
  PlayerProfile,
  Terrain,
  PendingStadiumRequest
} from '../../core/services/admin-data.service';
import { AuthService } from '../../core/services/auth.service';

type SuperAdminView = 'dashboard' | 'terrains' | 'admins' | 'feedback' | 'players';

interface AdminRequest {
  id: number;
  name: string;
  club: string;
  email: string;
  status: string;
}

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: true,
  imports: [CommonModule, NgClass, NgFor],
  templateUrl: './super-admin-dashboard.component.html',
  styleUrl: './super-admin-dashboard.component.css'
})
export class SuperAdminDashboardComponent {
  private readonly dataService = inject(AdminDataService);
  private readonly authService = inject(AuthService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly navItems: { key: SuperAdminView; label: string; icon: string }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: 'activity' },
    { key: 'terrains', label: 'Terrains', icon: 'map-pin' },
    { key: 'admins', label: 'Admins', icon: 'shield' },
    { key: 'feedback', label: 'Feedback', icon: 'message-circle' },
    { key: 'players', label: 'Joueurs', icon: 'users' }
  ];
  readonly activeNav = signal<SuperAdminView>('dashboard');
  readonly showNotifications = signal(false);
  readonly showProfileMenu = signal(false);

  readonly notifications = this.dataService.notifications;
  readonly terrains = this.dataService.terrains;
  readonly feedbacks = this.dataService.feedbacks;
  readonly players = this.dataService.players;
  readonly pendingStadiumRequests = this.dataService.pendingStadiumRequests;
  readonly authUser = this.authService.authUser;
  readonly pendingAdmins$ = computed(() => [
    { id: 1, name: 'Ahmed Khaled', club: 'Sport Club Sfax', email: 'ahmed@sportclub.tn', status: 'pending' },
    { id: 2, name: 'Mariem Jalel', club: 'Terrain Elite', email: 'mariem@elite.tn', status: 'pending' }
  ] as AdminRequest[]);

  readonly statCards = computed(() => [
    { label: 'Terrains totaux', value: this.dataService.totalTerrains(), accent: 'violet' },
    { label: 'Top terrain', value: this.dataService.terrains()[0]?.name ?? '—', accent: 'cyan' },
    { label: 'Joueurs bannis', value: this.dataService.bannedPlayersCount(), accent: 'amber' }
  ]);

  readonly trendPath = computed(() => this.buildTrendPath([70, 88, 91, 105, 111, 140, 170]));
  readonly topTerrainDetails = computed(() => {
    const terrain = this.dataService.terrains()[0] ?? null;
    if (!terrain) {
      return null;
    }
    const totalSlots = terrain.availability.length || 1;
    const busySlots = terrain.availability.filter(slot => slot.reserved).length;
    const utilization = Math.round((busySlots / totalSlots) * 100);
    const nextSlot = terrain.availability.find(slot => !slot.reserved)?.label ?? "Complet aujourd hui";
    return {
      terrain,
      totalSlots,
      busySlots,
      utilization,
      available: totalSlots - busySlots,
      nextSlot
    };
  });

  constructor() {
    this.dataService.loadDashboardData();
  }

  setActive(item: SuperAdminView) {
    this.activeNav.set(item);
    this.showProfileMenu.set(false);
  }

  approveAdmin(admin: AdminRequest) {
    // TODO: call backend API for admin approval (part 2)
    console.log('Admin approved:', admin);
  }

  rejectAdmin(admin: AdminRequest) {
    // TODO: call backend API for admin rejection (part 2)
    console.log('Admin rejected:', admin);
  }

  approveTerrain(terrain: Terrain) {
    // Accept the stadium request, which will publish the stadium
    this.dataService.acceptStadiumRequest(terrain.id);
  }

  rejectTerrain(terrain: Terrain) {
    // Reject the stadium request
    this.dataService.rejectStadiumRequest(terrain.id);
  }

  acceptStadiumRequest(request: PendingStadiumRequest) {
    this.dataService.acceptStadiumRequest(request.id).subscribe({
      error: (err) => console.error('Error accepting stadium request:', err)
    });
  }

  rejectStadiumRequest(request: PendingStadiumRequest) {
    this.dataService.rejectStadiumRequest(request.id).subscribe({
      error: (err) => console.error('Error rejecting stadium request:', err)
    });
  }

  togglePlayerBan(player: PlayerProfile) {
    this.dataService.togglePlayerBan(player.id).subscribe({
      error: (err) => console.error('Error toggling ban:', err)
    });
  }

  notificationIcon(notification: NotificationItem) {
    const map: Record<NotificationItem['category'], string> = {
      admin: 'shield',
      terrain: 'map',
      player: 'user-x'
    };
    return map[notification.category];
  }

  navigateFromNotification(target: NotificationItem['target']) {
    this.setActive(target as SuperAdminView);
    this.showNotifications.set(false);
  }

  mapUrl(lat: number, lng: number): SafeResourceUrl {
    const url = `https://maps.google.com/maps?q=${lat},${lng}&z=14&output=embed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  toggleNotifications() {
    this.showNotifications.update(value => !value);
  }

  toggleProfileMenu() {
    this.showProfileMenu.update(value => !value);
  }

  logout() {
    this.authService.clearSession();
  }

  trackById(_: number, item: Terrain | PlayerProfile | Feedback | AdminRequest | PendingStadiumRequest) {
    return item.id;
  }

  private buildTrendPath(series: number[]) {
    if (!series.length) {
      return '';
    }
    const width = 260;
    const height = 90;
    const max = Math.max(...series);
    const min = Math.min(...series);
    const range = max - min || 1;
    return series
      .map((value, index) => {
        const x = (index / (series.length - 1 || 1)) * width;
        const y = height - ((value - min) / range) * height;
        return `${index === 0 ? 'M' : 'L'}${x},${y}`;
      })
      .join(' ');
  }
}
