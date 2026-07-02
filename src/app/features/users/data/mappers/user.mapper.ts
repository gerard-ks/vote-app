import { User, PaginatedUsers, UserRole } from '../../domain/user.entity';
import { PaginatedUsersModel, UserModel } from '@features/users/data/models/user.model';

export class UserMapper {
  static toDomain(dto: UserModel): User {
    return {
      id: dto.user_id,
      name: dto.full_name,
      email: dto.email_address,
      role: dto.role_type as UserRole,
      emailVerified: dto.is_email_verified,
      isActive: dto.is_active_account,
      createdAt: dto.created_at_timestamp, // On garde l'ISO string
    };
  }

  static toPaginatedDomain(dto: PaginatedUsersModel): PaginatedUsers {
    return {
      items: dto.content.map((u) => this.toDomain(u)),
      totalRecords: dto.total_elements,
      currentPage: dto.current_page_number,
      pageSize: dto.page_size,
    };
  }
}
