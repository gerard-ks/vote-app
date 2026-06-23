import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { throwError, from, Observable } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINTS } from '@core/constants/api-endpoint';

// L'unique source de synchronisation : Une promesse en lecture seule (ou null)
let refreshPromise: Promise<void> | null = null;

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const http = inject(HttpClient);

  return next(req).pipe(
    catchError((error) => {
      // On intercepte uniquement les pannes de session 401
      if (error instanceof HttpErrorResponse && error.status === 401) {
        // Sécurité contre la boucle infinie si la route de refresh elle-même crash
        if (req.url.includes(API_ENDPOINTS.AUTH.REFRESH)) {
          return handleExpulsion();
        }

        // LE COEUR DE LA SYNCHRONISATION ANGULAR 21
        if (!refreshPromise) {
          // La première requête initialise le rafraîchissement sous forme de promesse
          refreshPromise = new Promise<void>((resolve, reject) => {
            // Le navigateur envoie le cookie HttpOnly automatiquement via withCredentials
            http
              .post(
                `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
                {},
                { withCredentials: true },
              )
              .subscribe({
                next: () => {
                  refreshPromise = null;
                  resolve();
                }, // Succès : Libère le verrou
                error: (err) => {
                  refreshPromise = null;
                  reject(err);
                }, // Échec : Libère et rejette
              });
          });
        }

        // Toutes les requêtes en parallèle attendent la résolution de cette promesse unique
        return from(refreshPromise).pipe(
          switchMap(() => next(req)), // Rejoue la requête initiale de manière transparente
          catchError(() => handleExpulsion()),
        );
      }

      return throwError(() => error);
    }),
  );
};

function handleExpulsion(): Observable<never> {
  console.warn('Session définitivement expirée. Redirection...');
  window.location.href = '/auth/login';
  return throwError(() => new Error('Session expirée'));
}
