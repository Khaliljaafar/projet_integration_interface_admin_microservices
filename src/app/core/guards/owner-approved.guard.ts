import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { map, catchError, of, switchMap } from 'rxjs';
import { AdminOwnerRequestApiService } from '../services/api/admin-owner-request.service';
import { AuthService } from '../services/auth.service';
import { getToken, roleFromToken, userIdFromToken } from '../utils/jwt.util';

export const ownerApprovedGuard: CanActivateFn = () => {
  const router = inject(Router);
  const requestApi = inject(AdminOwnerRequestApiService);
  const auth = inject(AuthService);

  // Must be owner in JWT; otherwise authRoleGuard would have filtered, but double-check
  const token = getToken();
  const role = roleFromToken(token || '');
  if (role !== 'owner') {
    return router.parseUrl('/auth');
  }

  const knownId = auth.authUser()?.userId;
  const candidate$ = knownId ? of(knownId) : of(getToken()).pipe(
    map(t => userIdFromToken(t || '') as number | null)
  );

  return candidate$.pipe(
    switchMap(uid => {
      if (!uid) return of(router.parseUrl('/pending-approval') as UrlTree);
      // Query by userId and verify ACCEPTED locally to handle servers that ignore status filter
      return requestApi.list({ userId: uid }).pipe(
        map(items => (items || []).some(it => String(it.status).toUpperCase() === 'ACCEPTED')
          ? true
          : (router.parseUrl('/pending-approval') as UrlTree)
        ),
        catchError(() => of(router.parseUrl('/pending-approval') as UrlTree))
      );
    })
  );
};
