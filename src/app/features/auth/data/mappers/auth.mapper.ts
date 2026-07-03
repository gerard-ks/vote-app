import { AuthRole, AuthUser } from '@features/auth/domain/entities/auth.entity';
import { AuthUserModel } from '@features/auth/data/models/auth.model';

export class AuthMapper {
  static toDomain(model: AuthUserModel): AuthUser {
    return {
      name: model.full_name,
      email: model.email_address,
      role: model.role_type as AuthRole,
    };
  }
}
