import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../public/header.component';
import { FooterComponent } from '../public/footer.component';

@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <div class="flex min-h-screen flex-col bg-surface font-sans text-color">

      <div class="sticky top-0 z-30 w-full">
        <app-header></app-header>
      </div>

      <main class="flex-1 max-w-7xl w-full mx-auto p-6 md:p-12 box-border">
        <router-outlet></router-outlet>
      </main>

      <app-footer></app-footer>
    </div>
  `,
})
export class PublicLayoutComponent {}
