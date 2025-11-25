import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  AdminDataService,
  Feedback,
  NotificationItem,
  PlayerProfile,
  Terrain
} from '../../core/services/admin-data.service';
import { AuthService } from '../../core/services/auth.service';

type OwnerSection = 'overview' | 'terrains' | 'players' | 'feedback' | 'profile';

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './owner-dashboard.component.html',
  styleUrl: './owner-dashboard.component.css'
})
export class OwnerDashboardComponent {
  private readonly dataService = inject(AdminDataService);
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly nfb = inject(NonNullableFormBuilder);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly dayLabels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  readonly sections: { key: OwnerSection; label: string; icon: string }[] = [
    { key: 'overview', label: 'Vue globale', icon: 'activity' },
    { key: 'terrains', label: 'Terrains', icon: 'layers' },
    { key: 'players', label: 'Joueurs', icon: 'users' },
    { key: 'feedback', label: 'Feedback', icon: 'message-circle' },
    { key: 'profile', label: 'Profil', icon: 'settings' }
  ];
  readonly activeSection = signal<OwnerSection>('overview');
  readonly showProfileMenu = signal(false);
  readonly showTerrainModal = signal(false);
  readonly modalMode = signal<'create' | 'edit'>('create');
  readonly authUser = this.authService.authUser;
  readonly notifications = this.dataService.notifications;

  readonly searchQuery = signal('');
  readonly selectedTerrain = signal<Terrain | null>(null);

  readonly terrains = computed(() =>
    this.dataService.terrains().filter(terrain =>
      terrain.name.toLowerCase().includes(this.searchQuery().toLowerCase())
    )
  );

  readonly feedbacks = this.dataService.feedbacks;
  readonly players = this.dataService.players;
  readonly bannedPlayersCount = this.dataService.bannedPlayersCount;
  readonly ownerKpis = computed(() => {
    const terrains = this.dataService.terrains().length;
    const avgRating =
      this.dataService.terrains().reduce((acc, t) => acc + t.rating, 0) / Math.max(terrains, 1);
    return [
      { label: 'Taux occupation', value: '82%', trend: '+6%' },
      { label: 'Revenus (30j)', value: '12.4K TND', trend: '+12%' },
      { label: 'Satisfaction', value: `${avgRating.toFixed(1)} / 5`, trend: '+2%' }
    ];
  });
  readonly trendPath = computed(() => this.buildTrendPath([62, 75, 82, 79, 95, 110, 130]));
  readonly trendArea = computed(() => this.buildTrendArea([62, 75, 82, 79, 95, 110, 130]));
  readonly trendStats = computed(() => this.buildTrendStats([62, 75, 82, 79, 95, 110, 130]));
  readonly trendAxis = computed(() =>
    [62, 75, 82, 79, 95, 110, 130].map((value, index) => ({
      label: this.dayLabels[index] ?? `J${index + 1}`,
      value
    }))
  );
  readonly notificationsDisplay = computed(() => this.notifications().slice(0, 3));

  readonly profileForm = this.fb.group({
    fullName: ['Arena Owner', Validators.required],
    phone: ['+216 22 222 222', Validators.required],
    email: ['owner@arena.com', [Validators.required, Validators.email]],
    bio: ['Toujours prêt à offrir la meilleure expérience sportive.']
  });

  readonly terrainForm = this.nfb.group({
    id: [0],
    name: ['', Validators.required],
    type: ['Football', Validators.required],
    city: ['Tunis', Validators.required],
    lat: [36.8, Validators.required],
    lng: [10.18, Validators.required],
    image: ['', Validators.required],
    price: [90, Validators.required],
    rating: [4.5, Validators.required]
  });

  constructor() {
    this.selectedTerrain.set(this.dataService.terrains()[0] ?? null);
    // Load data from backend on init
    this.dataService.loadDashboardData();
  }

  setSection(section: OwnerSection) {
    this.activeSection.set(section);
  }

  toggleProfileMenu() {
    this.showProfileMenu.update(value => !value);
  }

  updateSearch(term: string) {
    this.searchQuery.set(term);
  }

  selectTerrain(terrain: Terrain) {
    this.selectedTerrain.set(terrain);
  }

  toggleBan(player: PlayerProfile) {
    this.dataService.togglePlayerBan(player.id).subscribe({
      error: (err) => console.error('Error toggling ban:', err)
    });
  }

  slotClass(reserved: boolean) {
    return reserved ? 'reserved' : 'available';
  }

  openTerrainModal(mode: 'create' | 'edit', terrain?: Terrain) {
    this.modalMode.set(mode);
    const preset: Terrain = terrain ?? {
      id: 0,
      name: '',
      type: 'Football',
      city: 'Tunis',
      lat: 36.8,
      lng: 10.18,
      image: '',
      price: 90,
      rating: 4.5,
      availability: []
    };
    this.terrainForm.setValue({
      id: preset.id ?? 0,
      name: preset.name ?? '',
      type: preset.type ?? 'Football',
      city: preset.city ?? 'Tunis',
      lat: preset.lat ?? 36.8,
      lng: preset.lng ?? 10.18,
      image: preset.image ?? '',
      price: preset.price ?? 90,
      rating: preset.rating ?? 4.5
    });
    this.showTerrainModal.set(true);
  }

  submitTerrain() {
    if (this.terrainForm.invalid) {
      this.terrainForm.markAllAsTouched();
      return;
    }
    const { id, ...rest } = this.terrainForm.getRawValue();
    const payload = { ...(rest as Partial<Terrain>), id: id || undefined };
    this.dataService.saveTerrain(payload).subscribe({
      next: () => this.showTerrainModal.set(false),
      error: (err) => console.error('Error saving terrain:', err)
    });
  }

  closeTerrainModal() {
    this.showTerrainModal.set(false);
  }

  logout() {
    this.authService.clearSession();
  }

  mapUrl(terrain: Terrain): SafeResourceUrl {
    const url = `https://maps.google.com/maps?q=${terrain.lat},${terrain.lng}&z=14&output=embed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  availableSlots(terrain: Terrain) {
    return terrain.availability.filter(slot => !slot.reserved).length;
  }

  nextFreeSlot(terrain: Terrain) {
    return terrain.availability.find(slot => !slot.reserved)?.label ?? 'Complet aujourd’hui';
  }

  trackById(_: number, item: Terrain | Feedback | PlayerProfile) {
    return item.id;
  }

  notificationIcon(item: NotificationItem) {
    const map: Record<NotificationItem['category'], string> = {
      admin: 'shield',
      terrain: 'map-pin',
      player: 'user-x'
    };
    return map[item.category];
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

  private buildTrendArea(series: number[]) {
    if (!series.length) {
      return '';
    }
    const width = 260;
    const height = 90;
    const max = Math.max(...series);
    const min = Math.min(...series);
    const range = max - min || 1;
    const coords = series.map((value, index) => {
      const x = (index / (series.length - 1 || 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    });
    return ['M0,' + height, `L${coords[0]}`, ...coords.slice(1).map(point => `L${point}`), `L${width},${height}`, 'Z'].join(' ');
  }

  private buildTrendStats(series: number[]) {
    if (!series.length) {
      return { avg: 0, variation: 0, variationPercent: 0, peakValue: 0, peakDay: '—' };
    }
    const avg = series.reduce((acc, value) => acc + value, 0) / series.length;
    const variation = series[series.length - 1] - series[0];
    const base = series[0] || 1;
    const variationPercent = (variation / base) * 100;
    const peakIndex = series.indexOf(Math.max(...series));
    const peakValue = series[peakIndex];
    const peakDay = this.dayLabels[peakIndex] ?? `J${peakIndex + 1}`;
    return {
      avg: Math.round(avg),
      variation,
      variationPercent: Math.round(variationPercent),
      peakValue,
      peakDay
    };
  }
}
