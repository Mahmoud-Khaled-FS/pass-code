export interface UserResponse {
  id: number;
  userName: string;
  email?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth: {
    month: number;
    day: number;
    year: number;
    timestamp: string;
  };
  imageUrl: string;
  verfied: boolean;
}

export type PasswordUserProvider = 'email' | 'username' | 'phone' | 'none';

export interface PasswordResponse {
  id: number;
  userId: number;
  title: string;
  password: string;
  hasUrl: boolean;
  passwordFor: PasswordUserProvider[];
  email?: string | null;
  userName?: string | null;
  phone?: string | null;
  url?: string | null;
  createdAt: Date;
  website?: {
    id: number;
    name: string;
    icon: string;
    url: string;
  };
}

export interface PasswordInPasswords {
  id: number;
  userId: number;
  title: string;
  hasUrl: boolean;
  passwordFor: PasswordUserProvider[];
  websiteId: number | undefined;
  hasWebsite: boolean;
}

export interface PasswordsResponse {
  data: PasswordInPasswords[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}
