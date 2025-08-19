import {CanActivateFn, Router, UrlTree} from '@angular/router';
import {JwtService} from '../services/local/jwt-service';
import {inject} from '@angular/core';

export const redirectGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const jwtService = inject(JwtService);
  const router = inject(Router);

  if (jwtService.isLoggedIn()) {
    return router.parseUrl('/home');
  } else {
    return router.parseUrl('/login');
  }
};
