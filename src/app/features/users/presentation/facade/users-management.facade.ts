import { Injectable, signal, computed, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { UserRepository } from '../../domain/user.repository';
import { PaginatedUsers } from '../../domain/user.entity';
import { ViewState } from '@core/models/view-state.model';

@Injectable()
export class UsersManagementFacade {
  private readonly repository = inject(UserRepository);
  private readonly messageService = inject(MessageService); // Remplacement propre de 'sonner'

  // 1. L'état global unifié
  private readonly _state = signal<ViewState<PaginatedUsers>>({ type: 'IDLE' });
  public readonly state = this._state.asReadonly();

  // 2. État d'interface local (Filtres et Pagination)
  private readonly _currentPage = signal<number>(1);
  private readonly _pageSize = signal<number>(10);
  private readonly _searchTerm = signal<string>('');

  // 3. Sélecteurs sécurisés (Computeds)
  public readonly users = computed(() => {
    const current = this.state();
    return current.type === 'SUCCESS' ? current.data.items : [];
  });

  public readonly totalRecords = computed(() => {
    const current = this.state();
    return current.type === 'SUCCESS' ? current.data.totalRecords : 0;
  });

  public readonly errorMessage = computed(() => {
    const current = this.state();
    return current.type === 'ERROR' ? current.message : 'Une erreur inattendue est survenue.';
  });

  // 4. Actions métier
  public loadUsers(): void {
    this._state.set({ type: 'LOADING' });

    this.repository.getUsers(this._currentPage(), this._pageSize(), this._searchTerm()).subscribe({
      next: (data) => {
        // Validation "Zéro Bullshit" : Y a-t-il vraiment des données à afficher ?
        const hasData = data && data.items && data.items.length > 0;

        if (!hasData) {
          this._state.set({ type: 'EMPTY' });
        } else {
          this._state.set({ type: 'SUCCESS', data });
        }
      },
      error: () => {
        this._state.set({
          type: 'ERROR',
          message: 'Impossible de récupérer la liste des utilisateurs pour le moment.',
        });
      },
    });
  }

  public updateSearch(term: string): void {
    this._searchTerm.set(term);
    this._currentPage.set(1); // On reset obligatoirement à la page 1 lors d'une nouvelle recherche
    this.loadUsers();
  }

  public changePage(page: number): void {
    this._currentPage.set(page);
    this.loadUsers();
  }

  public toggleStatus(userId: string, currentStatus: boolean): void {
    const newStatus = !currentStatus;

    this.repository.toggleUserStatus(userId, newStatus).subscribe({
      next: () => {
        // En cas de succès, on recharge la liste depuis le repository pour garantir la cohérence
        this.loadUsers();

        // Notification visuelle
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: newStatus
            ? 'Le compte utilisateur a été réactivé.'
            : 'Le compte utilisateur a été désactivé.',
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de modifier le statut de cet utilisateur.',
        });
      },
    });
  }

  public verifyEmail(userId: string): void {
    this.repository.verifyUserEmail(userId).subscribe({
      next: () => {
        this.loadUsers(); // On recharge pour voir le changement
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: "L'email de l'utilisateur a été marqué comme vérifié.",
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: "Impossible de vérifier l'email.",
        });
      },
    });
  }
}
