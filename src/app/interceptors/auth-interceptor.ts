import { HttpInterceptorFn } from '@angular/common/http';
import {inject} from '@angular/core';
import {JwtService} from '../services/local/jwt-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtService: JwtService = inject(JwtService);
  const token: string | null = jwtService.getToken();

  // pomiń dodawanie tokena dla logowania / rejestracji
  if (token && !req.url.includes('/auth/')) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  return next(req);
};

