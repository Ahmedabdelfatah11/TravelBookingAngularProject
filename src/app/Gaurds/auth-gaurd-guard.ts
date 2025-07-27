import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGaurdGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  var auth = localStorage.getItem('auth');
  if (auth) {
    return true;
  }
  router.navigate(['/login']);
  return false;
};
