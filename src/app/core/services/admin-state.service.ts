import { Injectable, computed, signal, inject } from '@angular/core';
import { delay, map } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { AdminOwnerRequestApiService, AdminOwnerResponseDto } from './api/admin-owner-request.service';
import { UserService } from './api/user.service';

export type PlatformRole = 'guest' | 'super-admin' | 'owner' | 'player';

export interface TerrainSlot {
  label: string;
  reserved: boolean;
  reservedBy?: string;
}

export interface Terrain {
  id: number;
  name: string;
  type: 'Football' | 'Volleyball' | 'Basketball';
  city: string;
  lat: number;
  lng: number;
  price: number;
  rating: number;
  image: string;
  availability: TerrainSlot[];
}

export interface Feedback {
  id: number;
  player: string;
  comment: string;
  rating: number;
  date: string;
}

export interface PlayerProfile {
  id: number;
  name: string;
  age: number;
  phone: string;
  gender: 'H' | 'F';
  banned: boolean;
}

export interface AdminRequest {
  id: number;
  name: string;
  club: string;
  email: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface TerrainRequest {
  id: number;
  name: string;
  owner: string;
  type: Terrain['type'];
  lat: number;
  lng: number;
  city: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface NotificationItem {
  id: number;
  label: string;
  category: 'terrain' | 'admin' | 'player';
  time: string;
  target: 'dashboard' | 'terrains' | 'admins' | 'feedback' | 'players';
}

export interface AuthUser {
  username: string;
  role: PlatformRole;
}

@Injectable({ providedIn: 'root' })
export class AdminStateService {
  private readonly adminOwnerRequestApi = inject(AdminOwnerRequestApiService);
  private readonly usersApi = inject(UserService);
  private readonly slotTemplate: TerrainSlot[] = [
    { label: '08h - 10h', reserved: false },
    { label: '10h - 12h', reserved: true, reservedBy: 'Team Atlas' },
    { label: '12h - 14h', reserved: false },
    { label: '14h - 16h', reserved: true, reservedBy: 'Street Legends' },
    { label: '16h - 18h', reserved: false }
  ];

  private readonly _currentRole = signal<PlatformRole>('guest');
  private readonly _authUser = signal<AuthUser | null>(null);
  private readonly _pendingAdmins = signal<AdminRequest[]>([]);
  private readonly _terrainRequests = signal<TerrainRequest[]>([
    {
      id: 11,
      name: 'Green Park Arena',
      owner: 'Salma Othmani',
      type: 'Football',
      lat: 36.8065,
      lng: 10.1815,
      city: 'Tunis',
      submittedAt: 'Il y a 30min',
      status: 'pending'
    },
    {
      id: 12,
      name: 'Blue Court',
      owner: 'Youssef K.',
      type: 'Basketball',
      lat: 36.845,
      lng: 10.273,
      city: 'Ariana',
      submittedAt: 'Hier',
      status: 'pending'
    }
  ]);
  private readonly _notifications = signal<NotificationItem[]>([
    { id: 100, label: 'Nouvelle demande admin - Arena Center', category: 'admin', time: 'Il y a 5 min', target: 'admins' },
    { id: 101, label: 'Terrain ajouté - Green Park Arena', category: 'terrain', time: 'Il y a 18 min', target: 'terrains' },
    { id: 102, label: 'Joueur banni - user_33', category: 'player', time: 'Hier', target: 'players' }
  ]);
  private readonly _adminTerrains = signal<Terrain[]>([
    {
      id: 201,
      name: 'Arena Downtown',
      type: 'Football',
      city: 'Tunis',
      lat: 36.8,
      lng: 10.18,
      price: 95,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=60',
      availability: this.slotTemplate
    },
    {
      id: 202,
      name: 'Sky Volley Club',
      type: 'Volleyball',
      city: 'La Marsa',
      lat: 36.89,
      lng: 10.32,
      price: 70,
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?auto=format&fit=crop&w=900&q=60',
      availability: this.slotTemplate
    },
    {
      id: 203,
      name: 'Court Eleven',
      type: 'Basketball',
      city: 'Ben Arous',
      lat: 36.74,
      lng: 10.23,
      price: 80,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=900&q=60',
      availability: this.slotTemplate
    }
  ]);
  private readonly _feedbacks = signal<Feedback[]>([
    { id: 1, player: 'Nour B.', comment: 'Terrain impeccable, éclairage premium.', rating: 5, date: 'Aujourd’hui' },
    { id: 2, player: 'Mehdi L.', comment: 'Service rapide, staff top.', rating: 4, date: 'Hier' },
    { id: 3, player: 'Lina S.', comment: 'Vestiaires à rafraichir.', rating: 3, date: 'Hier' }
  ]);
  private readonly _players = signal<PlayerProfile[]>([
    { id: 1, name: 'Player_01', age: 24, phone: '+216 22 333 444', gender: 'H', banned: false },
    { id: 2, name: 'Player_02', age: 21, phone: '+216 26 222 444', gender: 'F', banned: false },
    { id: 3, name: 'Player_03', age: 27, phone: '+216 50 111 444', gender: 'H', banned: true },
    { id: 4, name: 'Player_04', age: 29, phone: '+216 20 400 111', gender: 'H', banned: false }
  ]);
  private readonly _ownerTrend = signal<number[]>([62, 75, 82, 79, 95, 110, 130]);
  private readonly _superAdminTrend = signal<number[]>([70, 88, 91, 105, 111, 140, 170]);

  readonly currentRole = this._currentRole.asReadonly();
  readonly authUser = this._authUser.asReadonly();
  readonly pendingAdmins = this._pendingAdmins.asReadonly();
  readonly terrainRequests = this._terrainRequests.asReadonly();
  readonly adminTerrains = this._adminTerrains.asReadonly();
  readonly feedbacks = this._feedbacks.asReadonly();
  readonly players = this._players.asReadonly();
  readonly notifications = this._notifications.asReadonly();
  readonly ownerTrend = this._ownerTrend.asReadonly();
  readonly superAdminTrend = this._superAdminTrend.asReadonly();

  readonly pendingAdmins$ = toObservable(this._pendingAdmins).pipe(delay(300));
  readonly adminTerrains$ = toObservable(this._adminTerrains).pipe(delay(300));

  readonly totalTerrain = computed(() => this._adminTerrains().length);
  readonly mostReservedTerrain = computed(() => this._adminTerrains()[0]?.name ?? '—');
  readonly bannedPlayers = computed(() => this._players().filter(p => p.banned).length);
  readonly ownerKpis = computed(() => {
    const terrains = this._adminTerrains().length;
    const avgRating =
      this._adminTerrains().reduce((acc, t) => acc + t.rating, 0) / Math.max(terrains, 1);
    return [
      { label: 'Taux occupation', value: '82%', trend: '+6%' },
      { label: 'Revenus (30j)', value: '12.4K TND', trend: '+12%' },
      { label: 'Satisfaction', value: `${avgRating.toFixed(1)} / 5`, trend: '+2%' }
    ];
  });

  login(username: string, password: string, role: PlatformRole) {
    if (role === 'super-admin' && username === 'admin' && password === 'admin123') {
      this._authUser.set({ username, role });
      this._currentRole.set(role);
      return true;
    }

    if (role === 'owner' && password.length >= 4) {
      this._authUser.set({ username, role });
      this._currentRole.set(role);
      return true;
    }

    if (role === 'player') {
      this._authUser.set({ username, role });
      this._currentRole.set(role);
      return true;
    }

    return false;
  }

  signup(payload: Record<string, string | number>) {
    // no-op: real signup handled elsewhere; do not inject fake pending admin requests
  }

  loadPendingAdmins() {
    // If a backend provides pending list, load it; otherwise keep seed
    this.adminOwnerRequestApi
      .list({ status: 'PENDING', adminId: 1 })
      .subscribe({
        next: (items: AdminOwnerResponseDto[]) => {
          const userIds = Array.from(new Set(items.map(i => i.userId).filter(Boolean)));
          this.usersApi.list().subscribe({
            next: users => {
              const byId = new Map(users.map(u => [u.id, u] as const));
              const mapped = items.map(i => {
                const u = byId.get(i.userId);
                const fullName = u ? `${u.firstName} ${u.secondName}`.trim() : `User ${i.userId}`;
                return {
                  id: i.id,
                  name: fullName || `User ${i.userId}`,
                  club: u?.address || '—',
                  email: u?.username || '—',
                  submittedAt: new Date(i.createdAt || '').toLocaleString() || '',
                  status: 'pending' as const
                };
              });
              this._pendingAdmins.set(mapped);
            },
            error: () => {
              const fallback = items.map(i => ({
                id: i.id,
                name: i.userId ? `User ${i.userId}` : '—',
                club: '—',
                email: '—',
                submittedAt: new Date(i.createdAt || '').toLocaleString() || '',
                status: 'pending' as const
              }));
              this._pendingAdmins.set(fallback);
            }
          });
        },
        error: () => {
          // keep seed data on error
        }
      });
  }

  approveAdmin(id: number) {
    this.adminOwnerRequestApi.updateStatus(id, 'ACCEPTED').subscribe({
      next: () => {
        this._pendingAdmins.update(list =>
          list.map(admin => (admin.id === id ? { ...admin, status: 'approved' } : admin))
        );
      }
    });
  }

  rejectAdmin(id: number) {
    this.adminOwnerRequestApi.updateStatus(id, 'REJECTED').subscribe({
      next: () => {
        this._pendingAdmins.update(list =>
          list.map(admin => (admin.id === id ? { ...admin, status: 'rejected' } : admin))
        );
      }
    });
  }

  approveTerrain(id: number) {
    this._terrainRequests.update(list =>
      list.map(t => (t.id === id ? { ...t, status: 'approved' } : t))
    );
  }

  rejectTerrain(id: number) {
    this._terrainRequests.update(list =>
      list.map(t => (t.id === id ? { ...t, status: 'rejected' } : t))
    );
  }

  toggleBan(playerId: number) {
    this._players.update(players =>
      players.map(p => (p.id === playerId ? { ...p, banned: !p.banned } : p))
    );
  }

  filteredTerrains(searchTerm: string) {
    const term = searchTerm.toLowerCase();
    return toObservable(this._adminTerrains).pipe(
      delay(150),
      map(list => list.filter(terrain => terrain.name.toLowerCase().includes(term)))
    );
  }

  addTerrainDraft(terrain: Omit<Terrain, 'id'>) {
    this._adminTerrains.update(list => [{ ...terrain, id: Date.now() }, ...list]);
  }

  saveTerrain(payload: Partial<Terrain> & { id?: number }) {
    if (payload.id) {
      this._adminTerrains.update(list =>
        list.map(item => (item.id === payload.id ? { ...item, ...payload } as Terrain : item))
      );
      return;
    }
    const template: Terrain = {
      id: Date.now(),
      name: payload.name ?? 'Nouveau terrain',
      type: (payload.type as Terrain['type']) ?? 'Football',
      city: payload.city ?? 'Tunis',
      lat: payload.lat ?? 36.8,
      lng: payload.lng ?? 10.18,
      price: payload.price ?? 80,
      rating: payload.rating ?? 4.5,
      image:
        payload.image ??
        'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=60',
      availability: payload.availability ?? this.slotTemplate
    };
    this._adminTerrains.update(list => [template, ...list]);
  }

  clearSession() {
    this._authUser.set(null);
    this._currentRole.set('guest');
  }
}
