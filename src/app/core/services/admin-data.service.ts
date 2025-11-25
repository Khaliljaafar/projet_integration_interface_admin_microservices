import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { StadiumService } from './api/stadium.service';
import { ReservationService } from './api/reservation.service';
import { FeedbackService } from './api/feedback.service';
import { NotificationService } from './api/notification.service';
import { BanService } from './api/ban.service';
import { UserService } from './api/user.service';

import { StadiumResponseDto } from '../models/stadium.model';
import { ReservationResponseDto } from '../models/reservation.model';
import { FeedbackResponseDto } from '../models/feedback.model';
import { NotificationResponseDto } from '../models/notification.model';
import { BanResponseDto } from '../models/ban.model';
import { UserResponseDto } from '../models/user.model';
import { AdminOwnerRequestApiService, AdminOwnerCreateRequestDto } from './api/admin-owner-request.service';
import { AuthService } from './auth.service';

// Local data models (for UI display)
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
  owner?: string;
  submittedAt?: string;
  status?: string;
}

export interface TerrainSlot {
  label: string;
  reserved: boolean;
  reservedBy?: string;
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

export interface NotificationItem {
  id: number;
  label: string;
  category: 'terrain' | 'admin' | 'player';
  time: string;
  target: 'dashboard' | 'terrains' | 'admins' | 'feedback' | 'players';
}

export interface PendingStadiumRequest {
  id: number;
  userId: number;
  stadiumId: number;
  stadiumName: string;
  type: string;
  address: string;
  status: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class AdminDataService {
  private stadiumService = inject(StadiumService);
  private reservationService = inject(ReservationService);
  private feedbackService = inject(FeedbackService);
  private notificationService = inject(NotificationService);
  private banService = inject(BanService);
  private userService = inject(UserService);
  private adminOwnerRequestApi = inject(AdminOwnerRequestApiService);
  private authService = inject(AuthService);

  // Signals
  private readonly _terrains = signal<Terrain[]>([]);
  private readonly _feedbacks = signal<Feedback[]>([]);
  private readonly _players = signal<PlayerProfile[]>([]);
  private readonly _notifications = signal<NotificationItem[]>([]);
  private readonly _pendingStadiumRequests = signal<PendingStadiumRequest[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  // Readonly views
  readonly terrains = this._terrains.asReadonly();
  readonly feedbacks = this._feedbacks.asReadonly();
  readonly players = this._players.asReadonly();
  readonly notifications = this._notifications.asReadonly();
  readonly pendingStadiumRequests = this._pendingStadiumRequests.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  // Computed
  readonly totalTerrains = computed(() => this._terrains().length);
  readonly bannedPlayersCount = computed(() =>
    this._players().filter(p => p.banned).length
  );

  // Load all data from backend
  loadDashboardData(): void {
    this._loading.set(true);
    this._error.set(null);

    this.stadiumService.list()
      .pipe(
        tap(stadiums => {
          this._terrains.set(this.mapStadiumsToTerrains(stadiums));
        }),
        catchError(err => {
          this._error.set(`Failed to load stadiums: ${err?.message || 'unknown error'}`);
          return of([]);
        })
      )
      .subscribe();

    this.feedbackService.list()
      .pipe(
        tap(feedbacks => {
          this._feedbacks.set(this.mapFeedbacksToDisplay(feedbacks));
        }),
        catchError(err => {
          this._error.set(`Failed to load feedbacks: ${err?.message || 'unknown error'}`);
          return of([]);
        })
      )
      .subscribe();

    this.userService.getClients()
      .pipe(
        tap(users => {
          this._players.set(this.mapUsersToPlayers(users));
        }),
        catchError(err => {
          this._error.set(`Failed to load users: ${err?.message || 'unknown error'}`);
          return of([]);
        })
      )
      .subscribe();

    this.notificationService.listAdmin()
      .pipe(
        tap(notifs => {
          this._notifications.set(this.mapNotificationsToDisplay(notifs));
        }),
        catchError(err => {
          this._error.set(`Failed to load notifications: ${err?.message || 'unknown error'}`);
          return of([]);
        })
      )
      .subscribe(() => {
        this._loading.set(false);
      });

    // Load pending stadium requests for super-admin
    this.adminOwnerRequestApi.listPending()
      .pipe(
        tap(requests => {
          this._pendingStadiumRequests.set(this.mapPendingRequests(requests));
        }),
        catchError(err => {
          this._error.set(`Failed to load pending stadium requests: ${err?.message || 'unknown error'}`);
          return of([]);
        })
      )
      .subscribe();
  }

  saveTerrain(payload: Partial<Terrain>): Observable<any> {
    const stadiumPayload = {
      type: payload.type || 'Football',
      name: payload.name || 'Nouveau terrain',
      city: payload.city || 'Tunis',
      longitude: payload.lng || 10.18,
      latitude: payload.lat || 36.8,
      dayReservation: ['non reserver', 'non reserver', 'non reserver', 'non reserver', 'non reserver', 'non reserver']
    };

    // If creating and current user is an owner, submit as owner-request (pending)
    if (!payload.id && this.authService.currentRole() === 'owner') {
      const userId = this.authService.authUser()?.userId ?? 0;
      const adminId = 1; // default admin id - adjust if your app selects an admin dynamically
      const createDto: AdminOwnerCreateRequestDto = {
        userId,
        adminId,
        type: stadiumPayload.type,
        name: stadiumPayload.name,
        size: (payload as any).size,
        address: (payload as any).city,
        longitude: stadiumPayload.longitude,
        latitude: stadiumPayload.latitude,
        dayReservation: stadiumPayload.dayReservation,
        reservationId: undefined
      } as AdminOwnerCreateRequestDto;
      return this.adminOwnerRequestApi.createWithStadium(createDto).pipe(
        tap(() => {
          // stadium is pending; don't add to _terrains until admin accepts
        }),
        catchError(err => {
          this._error.set(`Failed to submit owner stadium request: ${err?.message || 'unknown error'}`);
          throw err;
        })
      );
    }

    const call = payload.id
      ? this.stadiumService.update(payload.id, stadiumPayload)
      : this.stadiumService.create(stadiumPayload);

    return call.pipe(
      tap(stadium => {
        const mapped = this.mapStadiumToTerrain(stadium);
        if (payload.id) {
          this._terrains.update(list =>
            list.map(t => t.id === payload.id ? mapped : t)
          );
        } else {
          this._terrains.update(list => [mapped, ...list]);
        }
      }),
      catchError(err => {
        this._error.set(`Failed to save terrain: ${err?.message || 'unknown error'}`);
        throw err;
      })
    );
  }

  togglePlayerBan(playerId: number): Observable<void> {
    const player = this._players().find(p => p.id === playerId);
    if (!player) {
      return of(void 0);
    }

    const newBannedStatus = !player.banned;

    if (newBannedStatus) {
      // Create ban record
      const banPayload = {
        clientId: playerId,
        durationDays: 30,
        reason: 'Admin ban',
        startDate: new Date().toISOString().split('T')[0]
      };
      return this.banService.create(banPayload).pipe(
        tap(() => {
          this._players.update(players =>
            players.map(p =>
              p.id === playerId ? { ...p, banned: true } : p
            )
          );
        }),
        catchError(() => of(void 0))
      ) as Observable<void>;
    } else {
      // In a real scenario, you'd delete or update the ban record
      // For now, just toggle locally
      this._players.update(players =>
        players.map(p =>
          p.id === playerId ? { ...p, banned: false } : p
        )
      );
      return of(void 0);
    }
  }

  acceptStadiumRequest(requestId: number): Observable<void> {
    return this.adminOwnerRequestApi.updateStatus(requestId, 'ACCEPTED').pipe(
      tap(() => {
        // Remove the request from pending list
        this._pendingStadiumRequests.update(requests =>
          requests.filter(r => r.id !== requestId)
        );
      }),
      map(() => void 0),
      catchError(err => {
        this._error.set(`Failed to accept stadium request: ${err?.message || 'unknown error'}`);
        throw err;
      })
    );
  }

  rejectStadiumRequest(requestId: number): Observable<void> {
    return this.adminOwnerRequestApi.updateStatus(requestId, 'REJECTED').pipe(
      tap(() => {
        // Remove the request from pending list
        this._pendingStadiumRequests.update(requests =>
          requests.filter(r => r.id !== requestId)
        );
      }),
      map(() => void 0),
      catchError(err => {
        this._error.set(`Failed to reject stadium request: ${err?.message || 'unknown error'}`);
        throw err;
      })
    );
  }

  private mapStadiumsToTerrains(stadiums: StadiumResponseDto[]): Terrain[] {
    return stadiums.map(s => this.mapStadiumToTerrain(s));
  }

  private mapStadiumToTerrain(stadium: StadiumResponseDto): Terrain {
    return {
      id: stadium.id || 0,
      name: stadium.name || 'Unknown',
      type: (stadium.type as 'Football' | 'Volleyball' | 'Basketball') || 'Football',
      city: stadium.address || 'Tunis',
      lat: stadium.latitude || 36.8,
      lng: stadium.longitude || 10.18,
      price: 90, // Not in backend DTO
      rating: 4.5, // Not in backend DTO
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=60',
      availability: [
        { label: '08h - 10h', reserved: false },
        { label: '10h - 12h', reserved: true, reservedBy: 'Team A' },
        { label: '12h - 14h', reserved: false },
        { label: '14h - 16h', reserved: true, reservedBy: 'Team B' },
        { label: '16h - 18h', reserved: false }
      ]
    };
  }

  private mapFeedbacksToDisplay(feedbacks: FeedbackResponseDto[]): Feedback[] {
    return feedbacks.map(f => ({
      id: f.id || 0,
      player: `Player_${f.clientId}`,
      comment: f.message || '',
      rating: f.note || 0,
      date: f.createdAt ? new Date(f.createdAt).toLocaleDateString() : 'Unknown'
    }));
  }

  private mapUsersToPlayers(users: UserResponseDto[]): PlayerProfile[] {
    return users
      .filter(u => u.roleId === 3) // Ensure we only get clients/joueurs
      .map(u => ({
        id: u.id || 0,
        name: `${u.firstName || ''} ${u.secondName || ''}`.trim() || u.username || 'Unknown',
        age: u.age || 0,
        phone: u.phoneNumber || '',
        gender: (u.firstName?.toLowerCase().includes('e') || u.username?.includes('_F') ? 'F' : 'H') as 'H' | 'F',
        banned: u.banned || false
      }));
  }

  private mapNotificationsToDisplay(notifs: NotificationResponseDto[]): NotificationItem[] {
    return notifs.map((n, idx) => ({
      id: n.id || idx,
      label: n.message || 'Notification',
      category: (idx % 3 === 0 ? 'terrain' : idx % 3 === 1 ? 'admin' : 'player') as any,
      time: n.createdAt ? new Date(n.createdAt).toLocaleTimeString() : 'Now',
      target: (idx % 3 === 0 ? 'terrains' : idx % 3 === 1 ? 'admins' : 'players') as any
    }));
  }

  private mapPendingRequests(requests: any[]): PendingStadiumRequest[] {
    return requests.map(r => ({
      id: r.id || 0,
      userId: r.userId || 0,
      stadiumId: r.stadiumId || 0,
      stadiumName: r.stadiumId ? `Stadium ${r.stadiumId}` : 'Unknown',
      type: 'Unknown',
      address: 'Unknown',
      status: r.status || 'PENDING',
      createdAt: r.createdAt || new Date().toISOString()
    }));
  }
}
