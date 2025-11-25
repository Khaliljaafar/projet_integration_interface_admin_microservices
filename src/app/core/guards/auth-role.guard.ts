import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { getToken, isTokenExpired, roleFromToken } from '../utils/jwt.util';
import { PlatformRole } from '../services/admin-state.service';

function roleHome(role: PlatformRole): string {
  if (role === 'super-admin') return '/super-admin';
  if (role === 'owner') return '/owner';
  return '/player';
}

export const authRoleGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const data = route.data as { roles?: PlatformRole[]; publicOnly?: boolean };
  const token = getToken();

  // If route is marked publicOnly (e.g., auth page) and user already logged in, redirect to their home
  if (data?.publicOnly) {
    if (token && !isTokenExpired(token)) {
      const role = roleFromToken(token);
      return router.parseUrl(roleHome(role));
    }
    return true;
  }

  // For protected routes, ensure token exists and valid
  if (!token || isTokenExpired(token)) {
    // redirect to auth
    return router.parseUrl('/auth');
  }

  const userRole = roleFromToken(token);
  const allowed = data?.roles;

  if (!allowed || allowed.length === 0) {
    // default: any authenticated user allowed
    return true;
  }

  if (allowed.includes(userRole)) {
    return true;
  }

  // Authenticated but wrong role: redirect to their home
  return router.parseUrl(roleHome(userRole));
};
