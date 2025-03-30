import { User, LoginCredentials } from '@/types/auth';

// Mock user data
const users: User[] = [
  {
    id: '1',
    email: 'admin@school.com',
    name: 'Admin User',
    role: 'admin',
  },
  {
    id: '2',
    email: 'teacher@school.com',
    name: 'Teacher User',
    role: 'teacher',
  },
  {
    id: '3',
    email: 'student@school.com',
    name: 'Student User',
    role: 'student',
  },
];

// Default password for all users
const DEFAULT_PASSWORD = 'password123';

export const login = async (credentials: LoginCredentials): Promise<User | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const user = users.find(u => u.email === credentials.email);
  
  if (!user || credentials.password !== DEFAULT_PASSWORD) {
    return null;
  }

  return user;
};

export const logout = async (): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
}; 