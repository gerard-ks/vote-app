import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../../store/auth/auth.store';

// Garde pour l'espace Membre (Vérifie juste si connecté)
export const authGuard: CanActivateFn = () => {
  const store = inject(AuthStore);
  const router = inject(Router);

  if (store.isAuthenticated()) {
    return true; // Accès autorisé
  }

  // Redirection propre vers le login si non connecté
  return router.createUrlTree(['/auth/login']);
};

// Garde pour l'espace Admin (Vérifie si connecté ET rôle dashboard)
export const adminGuard: CanActivateFn = () => {
  const store = inject(AuthStore);
  const router = inject(Router);

  if (store.isAuthenticated() && store.isAdmin()) {
    return true; // Accès autorisé
  }

  // S'il est connecté mais pas dashboard, on le renvoie au dashboard membre
  if (store.isAuthenticated()) {
    return router.createUrlTree(['/member']);
  }

  return router.createUrlTree(['/auth/login']);
};

export const publicRedirectGuard = () => {
  const store = inject(AuthStore);
  const router = inject(Router);

  if (store.isAuthenticated()) {
    // S'il est dashboard, on l'envoie sur son dashboard, sinon sur l'espace membre
    return store.isAdmin() ? router.parseUrl('/admin/dashboard') : router.parseUrl('/member');
  }

  // S'il n'est pas connecté, on le laisse accéder à la page publique (/)
  return true;
};

// (Optionnel mais recommandé) Garde pour la page de Login
// Empêche un utilisateur déjà connecté de retourner sur /auth/login
export const guestGuard: CanActivateFn = () => {
  const store = inject(AuthStore);
  const router = inject(Router);

  if (!store.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/member']);
};

