import { Component } from '@angular/core';
import { AuthBoxComponent } from '@features/auth/presentation/components/auth-box/auth-box.component';

@Component({
  selector: 'app-register-page',
  imports: [AuthBoxComponent],
  template: `
    <app-auth-box mode="register"></app-auth-box>
  `,
})
export class RegisterPageComponent {}
