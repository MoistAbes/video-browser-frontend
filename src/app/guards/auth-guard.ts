import { AuthService } from './../services/local/auth-service';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  if (authService.isLoggedIn()) {
    return true; // użytkownik zalogowany
  }

  router.navigate(['/login']); // jeśli nie zalogowany → przekierowanie na login
  return false;
};
