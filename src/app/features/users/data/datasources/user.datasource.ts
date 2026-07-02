import { Observable } from 'rxjs';
import { PaginatedUsersModel } from '@features/users/data/models/user.model';

export abstract class UserDataSource {
  abstract getUsers(
    page: number,
    limit: number,
    searchTerm?: string,
  ): Observable<PaginatedUsersModel>;
  abstract toggleUserStatus(userId: string, newStatus: boolean): Observable<void>;
  abstract verifyUserEmail(userId: string): Observable<void>;
}
