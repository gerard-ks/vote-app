import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { UsersManagementFacade, UserView } from '../facade/users-management.facade';

@Component({
  selector: 'app-users-management-view',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ConfirmDialogModule,
    ToastModule,
    InputTextModule,
  ],
  providers: [ConfirmationService],
  template: `
    <div class="container py-8 mx-auto max-w-300">
      <p-toast></p-toast>
      <p-confirmDialog
        [style]="{ width: '450px' }"
        acceptButtonStyleClass="bg-red-600 hover:bg-red-700 text-white border-none px-4 py-2 rounded-md font-medium"
        rejectButtonStyleClass="text-gray-600 hover:bg-gray-100 bg-transparent border-none px-4 py-2 rounded-md font-medium"
      >
      </p-confirmDialog>

      <a
        routerLink="/admin/dashboard"
        class="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6 no-underline cursor-pointer"
      >
        <i class="pi pi-arrow-left text-xs"></i>
        Retour au dashboard
      </a>

      <h1 class="text-2xl font-bold text-gray-900 mb-6 m-0">Gestion des utilisateurs</h1>

      <div class="relative mb-6">
        <i
          class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none"
        ></i>
        <input
          pInputText
          type="text"
          placeholder="Rechercher par nom ou email..."
          (input)="onSearch($event)"
          class="w-full rounded-md border border-gray-200 bg-white pl-10! pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-all"
        />
      </div>

      @let currentState = facade.state();

      @if (currentState.type === 'ERROR') {
        <div class="p-4 rounded-md bg-red-50 text-red-600 border border-red-100 text-sm">
          {{ currentState.message }}
        </div>
      } @else if (currentState.type === 'EMPTY') {
        <div class="py-12 text-center border border-dashed border-gray-200 rounded-lg bg-gray-50">
          <p class="text-gray-500 m-0">Aucun utilisateur trouvé.</p>
        </div>
      } @else {
        @if (currentState.type === 'LOADING' || currentState.type === 'IDLE') {
          <div class="flex justify-center py-10">
            <i class="pi pi-spinner pi-spin text-2xl text-primary"></i>
          </div>
        }

        <div [class.hidden]="currentState.type !== 'SUCCESS'">
          <div
            class="hidden md:block rounded-lg border border-gray-200 overflow-hidden bg-white shadow-sm"
          >
            <table class="w-full border-collapse text-left">
              <thead class="bg-gray-50/50 border-b border-gray-200">
                <tr>
                  <th
                    class="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Utilisateur
                  </th>
                  <th
                    class="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Rôle
                  </th>
                  <th
                    class="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Email vérifié
                  </th>
                  <th
                    class="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Statut
                  </th>
                  <th
                    class="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Inscription
                  </th>
                  <th
                    class="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                @for (user of facade.usersView(); track user.id) {
                  <tr
                    [class.opacity-50]="!user.isActive"
                    class="transition-opacity hover:bg-gray-50/50"
                  >
                    <td class="px-6 py-4">
                      <p class="text-[14px] font-medium text-gray-900 m-0 leading-tight">
                        {{ user.name }}
                      </p>
                      <p class="text-[13px] text-gray-500 m-0 mt-0.5">{{ user.email }}</p>
                    </td>
                    <td class="px-6 py-4">
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium uppercase tracking-wide"
                        [ngClass]="user.roleBadgeClass"
                      >
                        {{ user.roleLabel }}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      @if (user.emailVerified) {
                        <i class="pi pi-check-circle text-green-500 text-lg"></i>
                      } @else {
                        <button
                          (click)="facade.verifyEmail(user.id)"
                          class="text-[13px] text-primary bg-transparent border-none p-0 cursor-pointer hover:underline"
                        >
                          Vérifier
                        </button>
                      }
                    </td>
                    <td class="px-6 py-4">
                      <span
                        class="inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-medium"
                        [ngClass]="
                          user.isActive
                            ? 'bg-green-100/60 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        "
                      >
                        {{ user.isActive ? 'Actif' : 'Inactif' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-[13px] text-gray-500">
                      {{ user.createdAt | date: 'dd/MM/yyyy' }}
                    </td>
                    <td class="px-6 py-4 text-right">
                      @if (user.roleLabel !== 'admin') {
                        <button
                          (click)="confirmToggleStatus(user)"
                          class="text-[13px] font-medium bg-transparent border-none p-0 cursor-pointer transition-colors"
                          [ngClass]="
                            user.isActive
                              ? 'text-red-500 hover:text-red-700'
                              : 'text-primary hover:opacity-80'
                          "
                        >
                          {{ user.isActive ? 'Désactiver' : 'Réactiver' }}
                        </button>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <div class="md:hidden space-y-3">
            @for (user of facade.usersView(); track user.id) {
              <div
                class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                [class.opacity-50]="!user.isActive"
              >
                <div class="flex items-start justify-between mb-3">
                  <div>
                    <p class="font-medium text-gray-900 m-0">{{ user.name }}</p>
                    <p class="text-xs text-gray-500 m-0 mt-0.5">{{ user.email }}</p>
                  </div>
                  <span
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide"
                    [ngClass]="user.roleBadgeClass"
                  >
                    {{ user.roleLabel }}
                  </span>
                </div>
                <div
                  class="flex items-center gap-4 text-xs text-gray-500 pt-3 border-t border-gray-50"
                >
                  <span class="flex items-center gap-1">
                    @if (user.emailVerified) {
                      <i class="pi pi-check-circle text-green-500"></i> Vérifié
                    } @else {
                      <button
                        (click)="facade.verifyEmail(user.id)"
                        class="text-primary bg-transparent border-none p-0 cursor-pointer hover:underline"
                      >
                        Vérifier
                      </button>
                    }
                  </span>
                  <span class="flex items-center gap-1">
                    <span class="w-2 h-2 rounded-full" [ngClass]="user.statusClass"></span>
                    {{ user.statusLabel }}
                  </span>
                </div>
                @if (user.roleLabel !== 'admin') {
                  <div class="mt-4 flex justify-end">
                    <button
                      (click)="confirmToggleStatus(user)"
                      class="text-xs font-medium bg-transparent border-none p-0 cursor-pointer"
                      [ngClass]="user.isActive ? 'text-red-500' : 'text-primary'"
                    >
                      {{ user.isActive ? 'Désactiver le compte' : 'Réactiver le compte' }}
                    </button>
                  </div>
                }
              </div>
            }
          </div>

          <div class="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
            <p class="text-[13px] text-gray-500 m-0">
              Page <span class="font-medium text-gray-900">{{ facade.currentPage() }}</span> sur
              <span class="font-medium text-gray-900">{{ facade.totalPages() }}</span>
            </p>
            <div class="flex gap-2">
              <button
                [disabled]="!facade.hasPreviousPage()"
                (click)="facade.changePage(facade.currentPage() - 1)"
                class="px-3 py-1.5 text-[13px] font-medium rounded border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Précédent
              </button>
              <button
                [disabled]="!facade.hasNextPage()"
                (click)="facade.changePage(facade.currentPage() + 1)"
                class="px-3 py-1.5 text-[13px] font-medium rounded border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class UsersManagementViewComponent {
  protected readonly facade = inject(UsersManagementFacade);
  private readonly confirmationService = inject(ConfirmationService);

  onSearch(event: Event): void {
    const element = event.target as HTMLInputElement;
    this.facade.updateSearch(element.value);
  }

  confirmToggleStatus(user: UserView): void {
    if (!user.isActive) {
      this.facade.toggleStatus(user.id, user.isActive);
      return;
    }

    this.confirmationService.confirm({
      message: `L'utilisateur "${user.name}" ne pourra plus se connecter ni participer aux votes. Cette action est réversible.`,
      header: 'Désactiver cet utilisateur ?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Désactiver',
      rejectLabel: 'Annuler',
      accept: () => {
        this.facade.toggleStatus(user.id, user.isActive);
      },
    });
  }
}
