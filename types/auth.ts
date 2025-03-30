export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'teacher' | 'student';
}

export interface LoginCredentials {
  email: string;
  password: string;
} 