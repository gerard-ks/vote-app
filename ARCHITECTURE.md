# 🏗️ Architecture Front-End : Feature-First & Clean Architecture Pragmatique

## 🎯 Philosophie du projet

Cette application Angular adopte une architecture **Feature-First** propulsée par une **Clean Architecture pragmatique**.

Le projet est divisé en deux grandes strates :
1. **L'écosystème global :** L'infrastructure transversale, les composants UI génériques et la mise en page (Layout).
2. **Les fonctionnalités métier autonomes (Features) :** Le cœur de l'application (`auth`, `polls`, `users`, `analytics`), isolé en *Bounded Contexts*. Au sein de chaque module, l'architecture garantit un découplage strict entre l'UI et la logique de données (Ports & Adapters).

**État actuel du projet :** L'application est totalement fonctionnelle en mode "hors ligne". La couche de données est actuellement alimentée par des **Mocks en mémoire** (`FakeDataSourceImpl`). L'architecture mise en place garantit que le jour où une API REST sera connectée, aucune ligne de code de la présentation ou du domaine ne sera modifiée.

---

## 🌍 1. Architecture Globale (Macro-niveau)

À la racine de `src/app/`, le code est organisé pour séparer strictement ce qui est générique de ce qui est spécifique à un métier :

```text
src/app/
├── core/                  # ⚙️ MOTEUR & CONFIGURATION GLOBALE
│   ├── guards/            # Protections des routes (ex: auth.guard.ts)
│   └── models/            # Modèles purement techniques et transversaux (ex: view-state.model.ts)
│
├── shared/                # 🧩 BOÎTE À OUTILS UI (Agnostique du métier)
│   ├── components/        # Composants "Dumb" réutilisables (ex: badge)
│   └── models/            # Types UI transversaux (ex: ui.models.ts pour les ThemeColor)
│
├── layout/                # 🏗️ SQUELETTE DE L'APPLICATION
│   ├── auth/              # Layout pour les pages de connexion
│   ├── dashboard/         # Layout applicatif (Sidebar, Topbar)
│   └── public/            # Layout pour les pages publiques (Header, Footer)
│
├── store/                 # 💾 ÉTAT GLOBAL STRICT
│   └── auth/              # (ex: AuthStore) L'état qui doit survivre à la navigation inter-features.
│
├── features/              # 🚀 CŒUR MÉTIER (Voir Architecture Micro-niveau)
│   ├── analytics/
│   ├── auth/
│   ├── polls/
│   └── users/
│
├── app.routes.ts          # Orchestration des lazy-loads vers les features
└── app.config.ts          # Configuration Angular globale (Providers)

```

**Règle absolue du Macro-niveau :**
Les répertoires `shared`, `core` et `layout` ne doivent **jamais** importer un élément provenant du répertoire `features`. Les dépendances pointent toujours vers l'extérieur du métier, jamais l'inverse.

---

## 🔬 2. Architecture d'une Feature (Micro-niveau)

Chaque fonctionnalité dans `features/` vit en totale autarcie. Nous appliquons une Clean Architecture "pragmatique" : la couche d'orchestration (`Application`) est fusionnée directement dans le `Domain` pour éviter la sur-ingénierie (over-engineering), tout en préservant le découplage via les contrats (Interfaces / Abstract Classes).

```text
@features/nom-de-la-feature/
├── domain/                # 🧠 CŒUR MÉTIER (Indépendant de tout framework)
│   ├── entities/          # Modèles de données purs (Front-end)
│   ├── usecases/          # Contrats et implémentations des actions utilisateurs (Ports In)
│   └── repositories/      # Contrats d'accès aux données (Ports Out)
│
├── data/                  # 🔌 INFRASTRUCTURE (Adapters Out)
│   ├── datasources/       # Implémentations techniques (Actuellement : Fake/Mocks en mémoire)
│   ├── models/            # DTOs techniques (Format brut des données mockées/API)
│   ├── mappers/           # Fonctions de transformation (Model Data <-> Entity Métier)
│   └── repositories/      # Implémentations concrètes des contrats du Domaine
│
├── presentation/          # 🎨 INTERFACE UTILISATEUR (Adapters In)
│   ├── components/        # Composants "Dumb" spécifiques à la feature (purement visuels)
│   ├── containers/        # Composants "Smart" (pages ou vues liées à la Façade)
│   ├── facade/            # Gestionnaire d'état local et pont exclusif vers les Use Cases (Signals)
│   └── store/             # ⚠️ CONDITIONNEL : Voir règle d'or de l'état.
│
├── nom.providers.ts       # 🔗 INJECTION (Câblage IoC local de la feature)
└── nom.routes.ts          # 🛣️ ROUTING (Définition des sous-routes)

```

---

## ⚖️ Règle d'Or de l'État (Facade vs Store)

L'état de l'application est géré de manière minimaliste et justifiée, en s'appuyant massivement sur les **Signals** d'Angular.

* **La Facade (Le standard) :** Gère l'état *local* lié à une vue ou un workflow précis (ex: `PollDetailFacade`). Elle ne doit jamais être fournie à la racine (pas de `providedIn: 'root'`). Elle stocke les données temporaires, gère le cycle de vie via le pattern `ViewState` (`IDLE`, `LOADING`, `SUCCESS`, `ERROR`) et expose des données prêtes pour l'UI via des `computed()`.
* **Le Store (L'exception) :** Un Store (ex: `AuthStore`) n'est créé **que si, et seulement si**, la donnée doit être partagée de manière asynchrone entre plusieurs vues indépendantes, ou doit survivre à la navigation globale de l'utilisateur. On ne crée jamais un Store de manière préventive.

---

## 🔄 Le Flux de Données et l'Isolation

Le cheminement respecte un flux unidirectionnel strict :

1. **L'UI (Container)** capte une action utilisateur et appelle la **Facade**.
2. **La Facade** met à jour son état interne (`LOADING`), prépare les paramètres et appelle le **Use Case**.
3. **Le Use Case** (dans `domain/usecases/`) exécute la règle métier et interroge le **Repository** via son abstraction.
4. **Le Repository Impl** (dans `data/repositories/`) délègue l'appel à la **DataSource**.
5. **La DataSource** (ex: `PollFakeDataSourceImpl`) simule une requête et retourne un **Model** (DTO).
6. **Le Repository Impl** utilise un **Mapper** pour convertir le `Model` technique en `Entity` pure compréhensible par le reste de l'application.
7. L'Entity redescend vers la Façade qui met à jour ses Signals (`SUCCESS`), déclenchant ainsi le rendu final dans le composant UI.

---

## 💉 Injection de Dépendances (IoC) Sécurisée

Pour garantir l'étanchéité absolue des *Bounded Contexts*, le décorateur `@Injectable({ providedIn: 'root' })` est **strictement banni** pour la logique métier et l'accès aux données.

L'Inversion de Contrôle est gérée localement dans le fichier `.providers.ts` de chaque fonctionnalité. C'est l'unique endroit où les contrats abstraits sont liés à leurs implémentations réelles :

```typescript
export const providePollsFeature = (): Provider[] => {
  return [
    // Liaison du Port In (Interface) à l'Adapter In (Implémentation)
    { provide: GetAllPollsUseCase, useClass: GetAllPollsUseCaseImpl },
    
    // Liaison du Port Out (Interface) à l'Adapter Out (Implémentation)
    { provide: PollRepository, useClass: PollRepositoryImpl },
    
    // Déclaration de la DataSource (Actuellement mockée en mémoire)
    { provide: PollDataSource, useClass: PollFakeDataSourceImpl },
  ];
};

```
