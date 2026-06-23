
export type UserRole = 'participant' | 'creator' | 'admin';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
}
