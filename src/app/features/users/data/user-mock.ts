import { User } from '../domain/user.entity';

export const MOCK_USERS: User[] = [
  {
    id: 'usr_1',
    name: 'Alice Dupont',
    email: 'alice@example.com',
    role: 'admin',
    emailVerified: true,
    isActive: true,
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'usr_2',
    name: 'Bob Martin',
    email: 'bob@example.com',
    role: 'creator',
    emailVerified: true,
    isActive: true,
    createdAt: '2026-02-01T14:30:00Z',
  },
  {
    id: 'usr_3',
    name: 'Charlie Durand',
    email: 'charlie@example.com',
    role: 'participant',
    emailVerified: false,
    isActive: true,
    createdAt: '2026-03-10T09:15:00Z',
  },
  {
    id: 'usr_4',
    name: 'Diana Prince',
    email: 'diana@example.com',
    role: 'participant',
    emailVerified: true,
    isActive: false,
    createdAt: '2026-02-20T16:45:00Z',
  },
  {
    id: 'usr_5',
    name: 'Eve Leroy',
    email: 'eve@example.com',
    role: 'creator',
    emailVerified: true,
    isActive: true,
    createdAt: '2026-04-05T11:20:00Z',
  },
];
