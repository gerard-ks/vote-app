import { Component } from '@angular/core';
import { UsersManagementViewComponent } from '@features/users/presentation/smart/users-management-view.component';

@Component({
  selector: 'app-admin-users-page',
  standalone: true,
  imports: [UsersManagementViewComponent],
  template: `
    <div class="container py-8 md:py-12">
      <app-users-management-view></app-users-management-view>
    </div>
  `,
})
export class AdminUsersPageComponent {}
