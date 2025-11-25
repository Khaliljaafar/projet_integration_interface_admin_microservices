import { PlatformRole } from '../services/admin-state.service';

export function getToken(): string | null {
  return localStorage.getItem('accessToken');
}

export function decodeJwtPayload(token: string): any | null {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload || !payload.exp) return true;
  const nowSec = Math.floor(Date.now() / 1000);
  return payload.exp <= nowSec;
}

export function roleFromToken(token: string): PlatformRole {
  const payload = decodeJwtPayload(token);
  const label = (payload?.role ?? '').toLowerCase();
  if (label.includes('super')) return 'super-admin';
  if (label.includes('admin') || label.includes('owner')) return 'owner';
  return 'player';
}
