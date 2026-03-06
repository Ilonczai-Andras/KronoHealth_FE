import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  // TODO: replace with NgRx auth state selector
  const isAuthenticated = !!localStorage.getItem('kh_token');
  if (!isAuthenticated) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};
