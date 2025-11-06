import { AuthService } from './../services/local/auth-service';
import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return router.parseUrl('/home'); // przekierowanie
  }

  return true; // pozwól wejść niezalogowanemu
};



