# Architecture du Projet Vote App (Angular)

Ce document décrit l'architecture et les choix techniques de l'application Angular. Il sert de référence pour maintenir la cohérence du code lors des futurs développements.

## 🛠️ Stack Technologique

*   **Framework** : Angular 21+ (Standalone Components, Zoneless ready).
*   **Gestion d'état** : Angular Signals (`signal`, `computed`) via des services `@Injectable`.
*   **UI & Styles** : Tailwind CSS v4 + PrimeNG / PrimeUI (Iconographie: PrimeIcons).
*   **Validation** : Zod (pour les schémas et la validation de données).

## 📂 Structure du Projet (Feature-Driven Architecture)

L'application suit une structure stricte basée sur les domaines métiers (Domain-Driven) située dans `src/app/` :

```text
src/app/
├── core/         # Cœur de l'application (Singletons). Interceptors, guards, modèles globaux, constantes. Aucun composant UI.
├── features/     # Logique métier divisée par domaine (admin, auth, polls). Contient les "Smart Components".
├── layout/       # Coquilles structurelles de l'application (auth, dashboard, public). Gère les menus, headers, footers.
├── pages/        # Composants routables (Vues principales). Ils assemblent les layouts, features et shared.
├── shared/       # Composants UI réutilisables (Dumb components), directives et pipes. Aucune logique métier.
└── store/        # Gestion de l'état global avec Angular Signals (ex: auth.store.ts).
```

## 📐 Règles Architecturales & Bonnes Pratiques

1.  **Standalone Components** : L'application n'utilise pas de `NgModules`. Chaque composant gère ses propres dépendances via son tableau `imports`.
2.  **Gestion de l'état (Signals)** : 
    *   Privilégier les Signals (`signal`, `computed`) pour la réactivité.
    *   Les stores globaux (dans `/store`) gèrent l'état transverse (ex: session utilisateur).
    *   Les états locaux complexes peuvent être gérés dans des stores dédiés aux features.
3.  **Frontières Strictes (Strict Boundaries)** :
    *   Une feature A ne doit pas importer directement le code d'une feature B.
    *   La communication entre features se fait via le Store ou via le routing.
4.  **Dumb vs Smart Components** :
    *   **Shared (`/shared`)** : Composants "Dumb". Ne font pas d'appels API, n'injectent pas de Store. Communiquent uniquement via `@Input()` et `@Output()`.
    *   **Features (`/features`)** : Composants "Smart". Peuvent injecter des services, interagir avec le Store et contenir la logique métier.
5.  **Routing et Lazy Loading** :
    *   Toutes les routes principales doivent utiliser le lazy-loading (`loadComponent` ou `loadChildren`).
    *   Le routage est basé sur les Layouts (ex: les routes protégées sont enfants du layout Dashboard).

## 🚀 Lancement & Scripts

*   `npm start` : Lance le serveur de développement.
*   `npm run build` : Construit l'application pour la production.
*   `npm test` : Lance les tests avec Vitest.
