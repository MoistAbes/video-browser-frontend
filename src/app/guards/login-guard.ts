import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {JwtService} from '../services/local/jwt-service';

export const loginGuard: CanActivateFn = (route, state) => {
  const jwtService = inject(JwtService);
  const router = inject(Router);

  if (jwtService.isLoggedIn()) {
    return router.parseUrl('/home'); // przekierowanie
  }

  return true; // pozwól wejść niezalogowanemu
};



