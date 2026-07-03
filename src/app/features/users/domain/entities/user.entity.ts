export type UserRole = 'admin' | 'creator' | 'participant';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
  isActive: boolean; // Équivalent de ton 'active' en React
  createdAt: string; // Format ISO recommandé pour le front
}

export interface PaginatedUsers {
  items: User[];
  totalRecords: number;
  currentPage: number;
  pageSize: number;
}
