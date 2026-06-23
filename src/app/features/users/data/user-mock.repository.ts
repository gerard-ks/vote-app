import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { UserRepository } from '../domain/user.repository';
import { PaginatedUsers } from '../domain/user.entity';
import { MOCK_USERS } from '@features/users/data/user-mock';

@Injectable()
export class UserMockRepository implements UserRepository {
  // Notre base de données simulée en mémoire
  private mockUsers = [...MOCK_USERS];

  public getUsers(
    page: number,
    limit: number,
    searchTerm: string = '',
  ): Observable<PaginatedUsers> {
    let filtered = this.mockUsers;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (u) => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term),
      );
    }

    const start = (page - 1) * limit;
    const paginatedItems = filtered.slice(start, start + limit);

    const response: PaginatedUsers = {
      items: paginatedItems,
      totalRecords: filtered.length,
      currentPage: page,
      pageSize: limit,
    };

    return of(response).pipe(delay(600)); // Simulation réseau
  }

  public toggleUserStatus(userId: string, newStatus: boolean): Observable<void> {
    const userIndex = this.mockUsers.findIndex((u) => u.id === userId);
    if (userIndex > -1) {
      this.mockUsers[userIndex] = { ...this.mockUsers[userIndex], isActive: newStatus };
    }
    return of(void 0).pipe(delay(400));
  }

  public verifyUserEmail(userId: string): Observable<void> {
    const userIndex = this.mockUsers.findIndex((u) => u.id === userId);
    if (userIndex > -1) {
      this.mockUsers[userIndex] = { ...this.mockUsers[userIndex], emailVerified: true };
    }
    return of(void 0); // Succès immédiat
  }
}
