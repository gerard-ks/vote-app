import { UserDataSource } from '@features/users/data/datasources/user.datasource';
import { Injectable } from '@angular/core';
import { PaginatedUsersModel, UserModel } from '@features/users/data/models/user.model';
import { delay, Observable, of } from 'rxjs';

@Injectable()
export class UserFakeDataSourceImpl implements UserDataSource {
  private mockUsersDb: UserModel[] = [
    {
      user_id: 'usr_1',
      full_name: 'Alice Dupont',
      email_address: 'alice@example.com',
      role_type: 'admin',
      is_email_verified: true,
      is_active_account: true,
      created_at_timestamp: '2026-01-15T10:00:00Z',
    },
    {
      user_id: 'usr_2',
      full_name: 'Bob Martin',
      email_address: 'bob@example.com',
      role_type: 'creator',
      is_email_verified: true,
      is_active_account: true,
      created_at_timestamp: '2026-02-01T14:30:00Z',
    },
    {
      user_id: 'usr_3',
      full_name: 'Charlie Durand',
      email_address: 'charlie@example.com',
      role_type: 'participant',
      is_email_verified: false,
      is_active_account: true,
      created_at_timestamp: '2026-03-10T09:15:00Z',
    },
    {
      user_id: 'usr_4',
      full_name: 'Diana Prince',
      email_address: 'diana@example.com',
      role_type: 'participant',
      is_email_verified: true,
      is_active_account: false,
      created_at_timestamp: '2026-02-20T16:45:00Z',
    },
    {
      user_id: 'usr_5',
      full_name: 'Eve Leroy',
      email_address: 'eve@example.com',
      role_type: 'creator',
      is_email_verified: true,
      is_active_account: true,
      created_at_timestamp: '2026-04-05T11:20:00Z',
    },
  ];

  public getUsers(
    page: number,
    limit: number,
    searchTerm: string = '',
  ): Observable<PaginatedUsersModel> {
    let filtered = this.mockUsersDb;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.full_name.toLowerCase().includes(term) || u.email_address.toLowerCase().includes(term),
      );
    }

    const start = (page - 1) * limit;
    const paginatedItems = filtered.slice(start, start + limit);

    const responseDto: PaginatedUsersModel = {
      content: paginatedItems,
      total_elements: filtered.length,
      current_page_number: page,
      page_size: limit,
    };

    return of(responseDto).pipe(delay(600));
  }

  public toggleUserStatus(userId: string, newStatus: boolean): Observable<void> {
    const userIndex = this.mockUsersDb.findIndex((u) => u.user_id === userId);
    if (userIndex > -1) {
      this.mockUsersDb[userIndex] = {
        ...this.mockUsersDb[userIndex],
        is_active_account: newStatus,
      };
    }
    return of(void 0).pipe(delay(400));
  }

  public verifyUserEmail(userId: string): Observable<void> {
    const userIndex = this.mockUsersDb.findIndex((u) => u.user_id === userId);
    if (userIndex > -1) {
      this.mockUsersDb[userIndex] = { ...this.mockUsersDb[userIndex], is_email_verified: true };
    }
    return of(void 0);
  }
}
