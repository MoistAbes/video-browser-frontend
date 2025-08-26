import { HttpInterceptorFn } from '@angular/common/http';
import {inject} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {catchError, throwError} from 'rxjs';


export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);
  const router = inject(Router);

  return next(req).pipe(
    catchError(error => {
      const status = error.status;
      const backendMessage = error?.error?.message; // <-- Twoje pole z backendu

      switch (status) {
        case 401:
          snackBar.open(
            backendMessage ?? 'Nieautoryzowany dostęp',
            'Zamknij',
            { duration: 3000 }
          );
          router.navigate(['/login']);
          break;

        case 403:
          snackBar.open(
            backendMessage ?? 'Brak uprawnień',
            'Zamknij',
            { duration: 3000 }
          );
          break;

        case 404:
          snackBar.open(
            backendMessage ?? 'Nie znaleziono zasobu',
            'Zamknij',
            { duration: 3000 }
          );
          break;

        case 500:
          snackBar.open(
            backendMessage ?? 'Błąd serwera',
            'Zamknij',
            { duration: 3000 }
          );
          break;

        default:
          snackBar.open(
            backendMessage ?? `Błąd: ${status}`,
            'Zamknij',
            { duration: 3000 }
          );
      }

      return throwError(() => error);
    })
  );
};

