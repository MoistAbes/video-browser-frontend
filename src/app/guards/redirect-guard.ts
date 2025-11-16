import { AuthService } from './../services/local/auth-service';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';

export const redirectGuard: CanActivateFn = (
  route,
  state
): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return router.parseUrl('/home');
  } else {
    return router.parseUrl('/login');
  }
};
