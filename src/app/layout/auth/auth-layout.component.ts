import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="min-h-screen w-full bg-surface font-sans text-color antialiased box-border">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AuthLayoutComponent {}
