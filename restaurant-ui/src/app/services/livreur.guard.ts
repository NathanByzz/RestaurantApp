import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const livreurGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getUser();

  if (authService.isLoggedIn() && user?.role === 'Livreur') {
    return true;
  }

  if (authService.isLoggedIn() && user?.role === 'Client') {
    router.navigate(['/restaurants']);
    return false;
  }

  if (authService.isLoggedIn() && user?.role === 'Restaurateur') {
    router.navigate(['/restaurateur']);
    return false;
  }

  router.navigate(['/login']);
  return false;
};