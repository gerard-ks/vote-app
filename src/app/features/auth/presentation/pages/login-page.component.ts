import { Component } from '@angular/core';
import { AuthBoxComponent } from '@features/auth/presentation/components/auth-box/auth-box.component';

@Component({
  selector: 'app-login-page',
  imports: [AuthBoxComponent],
  template: `
    <app-auth-box mode="login"></app-auth-box>
  `,
})
export class LoginPageComponent {}
