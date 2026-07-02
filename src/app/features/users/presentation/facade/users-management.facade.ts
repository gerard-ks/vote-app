import { Injectable, signal, computed, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { UserRepository } from '../../domain/user.repository';
import { PaginatedUsers } from '../../domain/user.entity';
import { ViewState } from '@core/models/view-state.model';

export interface UserView {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  // Les ajouts purement UI
  roleLabel: string;
  roleBadgeClass: string;
  statusLabel: string;
  statusClass: string;
}

@Injectable()
export class UsersManagementFacade {
  private readonly repository = inject(UserRepository);
  private readonly messageService = inject(MessageService);

  private readonly _state = signal<ViewState<PaginatedUsers>>({ type: 'IDLE' });
  public readonly state = this._state.asReadonly();

  private readonly _currentPage = signal<number>(1);
  private readonly _pageSize = signal<number>(10);
  private readonly _searchTerm = signal<string>('');

  public readonly currentPage = computed(() => {
    const current = this.state();
    return current.type === 'SUCCESS' ? current.data.currentPage : 1;
  });

  public readonly totalPages = computed(() => {
    const current = this.state();
    if (current.type !== 'SUCCESS') return 1;
    return Math.max(1, Math.ceil(current.data.totalRecords / current.data.pageSize));
  });

  public readonly hasNextPage = computed(() => this.currentPage() < this.totalPages());
  public readonly hasPreviousPage = computed(() => this.currentPage() > 1);

  public readonly usersView = computed<UserView[]>(() => {
    const current = this.state();
    if (current.type !== 'SUCCESS') return [];

    return current.data.items.map((user) => {
      let roleClass = 'bg-gray-100 text-gray-500';
      if (user.role === 'admin') roleClass = 'bg-red-100 text-red-500';
      else if (user.role === 'creator') roleClass = 'bg-indigo-100/70 text-indigo-500';

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        isActive: user.isActive,
        createdAt: user.createdAt,
        roleLabel: user.role === 'creator' ? 'Créateur' : user.role,
        roleBadgeClass: roleClass,
        statusLabel: user.isActive ? 'Actif' : 'Inactif',
        statusClass: user.isActive ? 'bg-green-100/60 text-green-700' : 'bg-gray-100 text-gray-600',
      };
    });
  });


  public loadUsers(): void {
    this._state.set({ type: 'LOADING' });

    this.repository.getUsers(this._currentPage(), this._pageSize(), this._searchTerm()).subscribe({
      next: (data) => {
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
    this._currentPage.set(1);
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
        this.loadUsers();
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
        this.loadUsers();
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
