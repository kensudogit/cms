export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  userId: number;
  email: string;
  name: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface Content {
  id: number;
  title: string;
  body: string;
  slug: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  authorId: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export interface ContentRequest {
  title: string;
  body: string;
  slug: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}



