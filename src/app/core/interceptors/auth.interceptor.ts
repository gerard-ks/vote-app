import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const secureReq = req.clone({
    withCredentials: true, // Obligation pour l'authentification HttpOnly sécurisée inter-domaines
  });
  return next(secureReq);
};
