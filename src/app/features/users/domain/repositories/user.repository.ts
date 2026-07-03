import { Observable } from 'rxjs';
import { PaginatedUsers } from '../entities/user.entity';

export abstract class UserRepository {
  // Récupérer la liste avec pagination et recherche
  abstract getUsers(page: number, limit: number, searchTerm?: string): Observable<PaginatedUsers>;

  // Action de modération : Bloquer / Débloquer
  abstract toggleUserStatus(userId: string, newStatus: boolean): Observable<void>;

  abstract verifyUserEmail(userId: string): Observable<void>;
}
