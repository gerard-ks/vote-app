export type AuthRole = 'participant' | 'creator' | 'admin';

export interface AuthUser {
  name: string;
  email: string;
  role: AuthRole;
}
