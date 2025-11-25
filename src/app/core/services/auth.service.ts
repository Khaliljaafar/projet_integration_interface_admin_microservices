import { Injectable, signal } from '@angular/core';
import { PlatformRole } from './admin-state.service';
import { Observable, map, tap } from 'rxjs';
import { AuthApiService } from './api/auth-api.service';
import { LoginRequestDto, LoginResponseDto } from '../models/auth.model';

export interface AuthUser {
  username: string;
  role: PlatformRole;
  userId?: number;
  roleId?: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private readonly authApi: AuthApiService) {}
  private readonly _authUser = signal<AuthUser | null>(null);
  private readonly _currentRole = signal<PlatformRole>('guest');

  readonly authUser = this._authUser.asReadonly();
  readonly currentRole = this._currentRole.asReadonly();

  loginWithResponse(username: string, password: string): Observable<LoginResponseDto> {
    const payload: LoginRequestDto = { username, password };
    return this.authApi.login(payload).pipe(
      tap((res: LoginResponseDto) => {
        if (res.authenticated) {
          const role = this.mapRole(res.roleLabel);
          this._authUser.set({ username, role, userId: res.userId, roleId: res.roleId });
          this._currentRole.set(role);
          if (res.accessToken) {
            localStorage.setItem('accessToken', res.accessToken);
          }
        }
      })
    );
  }

  login(username: string, password: string): Observable<boolean> {
    return this.loginWithResponse(username, password).pipe(map((res) => !!res.authenticated));
  }

  private mapRole(label?: string): PlatformRole {
    const norm = (label || '').toLowerCase();
    if (norm.includes('super')) return 'super-admin';
    if (norm.includes('owner') || norm.includes('admin')) return 'owner';
    if (norm.includes('player') || norm.includes('client') || norm.includes('joueur')) return 'player';
    return 'owner';
  }

  signup(payload: Record<string, string | number>): void {
    // Static/mock signup (e.g., submit owner request)
    // In Part 2, this would call UserService.register() or submit admin request to backend
    console.log('Signup submitted:', payload);
  }

  clearSession(): void {
    this._authUser.set(null);
    this._currentRole.set('guest');
    localStorage.removeItem('accessToken');
  }
}
