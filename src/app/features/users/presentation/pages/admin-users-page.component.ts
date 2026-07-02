import { Component, inject, OnInit } from '@angular/core';
import { UsersManagementViewComponent } from '@features/users/presentation/containers/users-management-view.component';
import { UsersManagementFacade } from '@features/users/presentation/facade/users-management.facade';

@Component({
  selector: 'app-admin-users-page',
  imports: [UsersManagementViewComponent],
  providers: [UsersManagementFacade],
  template: `
    <div class="container py-8 md:py-12">
      <app-users-management-view></app-users-management-view>
    </div>
  `,
})
export class AdminUsersPageComponent implements OnInit {
  protected readonly facade = inject(UsersManagementFacade);
  ngOnInit(): void {
    this.facade.loadUsers();
  }
}
