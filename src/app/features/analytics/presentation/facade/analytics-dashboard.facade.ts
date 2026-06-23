import { Injectable, signal, computed, inject } from '@angular/core';
import { AnalyticsRepository } from '../../domain/analytics.repository';
import { DashboardSummary } from '../../domain/analytics.entity';
import { ViewState } from '@core/models/view-state.model';

@Injectable()
export class AnalyticsDashboardFacade {
  // Injection propre du contrat de son propre domaine
  private readonly repository = inject(AnalyticsRepository);

  // 1. L'état global unifié
  private readonly _state = signal<ViewState<DashboardSummary>>({ type: 'IDLE' });
  public readonly state = this._state.asReadonly();

  // 2. Sélecteurs (Computeds) sécurisés pour la vue (Évite les erreurs TypeScript dans le HTML)
  public readonly metrics = computed(() => {
    const current = this.state();
    return current.type === 'SUCCESS' ? current.data.metrics : [];
  });

  public readonly alerts = computed(() => {
    const current = this.state();
    return current.type === 'SUCCESS' ? current.data.alerts : [];
  });

  public readonly errorMessage = computed(() => {
    const current = this.state();
    return current.type === 'ERROR' ? current.message : 'Une erreur inattendue est survenue.';
  });

  // 3. Propriétés statiques (Navigation)
  public readonly quickLinks = [
    { label: 'Gestion des utilisateurs', href: '/admin/users', icon: 'pi pi-users' },
    { label: 'Modération des sondages', href: '/admin/polls', icon: 'pi pi-list-check' },
    { label: 'Analytics & Exports', href: '/admin/analytics', icon: 'pi pi-chart-line' },
  ];

  // 4. L'Action avec transition d'état stricte
  public loadDashboard(): void {
    // On notifie la vue que le chargement commence
    this._state.set({ type: 'LOADING' });

    this.repository.getDashboardSummary().subscribe({
      next: (data) => {
        // Validation des données : a-t-on vraiment quelque chose à afficher ?
        const hasData = data && data.metrics && data.metrics.length > 0;

        if (!hasData) {
          // La donnée est valide (200 OK) mais la plateforme est vierge
          this._state.set({ type: 'EMPTY' });
        } else {
          // Tout est parfait
          this._state.set({ type: 'SUCCESS', data });
        }
      },
      error: () => {
        // En cas d'échec HTTP ou d'erreur serveur
        this._state.set({
          type: 'ERROR',
          message: 'Impossible de récupérer les indicateurs de la plateforme pour le moment.',
        });
      },
    });
  }
}
