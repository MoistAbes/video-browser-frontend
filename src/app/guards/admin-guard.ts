import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {JwtService} from '../services/local/jwt-service';

export const adminGuard: CanActivateFn = (route, state) => {
  const jwtService: JwtService = inject(JwtService);
  const router: Router = inject(Router);

  if (jwtService.hasAdminRole()) {
    return true;
  }

  // przekierowanie jak nie ma roli ADMIN
  router.navigate(['/home']);
  return false;
};
