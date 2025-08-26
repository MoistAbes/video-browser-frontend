import {CanActivateChildFn, CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {JwtService} from '../services/local/jwt-service';

export const authGuard: CanActivateFn = (route, state) => {
  const jwtService: JwtService = inject(JwtService);
  const router: Router = inject(Router);

  if (jwtService.isLoggedIn()) {
    return true; // użytkownik zalogowany
  }

  router.navigate(['/login']); // jeśli nie zalogowany → przekierowanie na login
  return false;
};
