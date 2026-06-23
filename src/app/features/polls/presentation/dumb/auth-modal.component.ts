import { Component, model, input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  template: `
    <p-dialog
      [(visible)]="visible"
      [modal]="true"
      [draggable]="false"
      [resizable]="false"
      [style]="{ width: '28rem' }"
      [dismissableMask]="true"
      styleClass="font-sans"
    >
      <ng-template pTemplate="header">
        <div class="flex items-center gap-2 font-bold text-lg text-color m-0">
          <i class="pi pi-sign-in text-primary text-xl"></i>
          <span>Connexion requise</span>
        </div>
      </ng-template>

      <p class="text-sm text-muted-color mb-6 mt-2 font-medium">
        {{ message() }}
      </p>

      <div class="flex flex-col gap-3">
        <p-button
          label="Se connecter"
          severity="primary"
          styleClass="w-full justify-center font-bold"
          (click)="navigate('/auth/login')"
        />
        <p-button
          label="S'inscrire"
          variant="outlined"
          severity="secondary"
          styleClass="w-full justify-center font-bold"
          (click)="navigate('/auth/login', { mode: 'register' })"
        />
      </div>
    </p-dialog>
  `,
})
export class AuthModalComponent {
  // Le model() permet un binding bidirectionnel propre depuis le parent : [(visible)]="isModalOpen"
  public readonly visible = model<boolean>(false);

  public readonly message = input<string>('Vous devez être connecté pour voter.');

  private readonly router = inject(Router);

  protected navigate(path: string, queryParams?: any): void {
    this.visible.set(false);
    void this.router.navigate([path], { queryParams });
  }
}
