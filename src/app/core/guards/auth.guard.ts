import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  if (authService.currentUser()) {
    return true;
  }

  // Refresca la sesión (p. ej. tras recargar la página) validando el token contra /me.
  return authService.me().pipe(
    map(() => true),
    catchError(() => {
      authService.clearSession();

      return of(router.createUrlTree(['/login']));
    }),
  );
};
