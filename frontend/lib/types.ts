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
  universityId?: number;
  categoryId?: number;
  contentType?: string;
  metaDescription?: string;
  metaKeywords?: string;
  scheduledPublishAt?: string | null;
  scheduledUnpublishAt?: string | null;
  versionNumber?: number;
  templateId?: number;
  customFields?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export interface ContentRequest {
  title: string;
  body: string;
  slug: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  universityId: number;
  categoryId?: number;
  contentType?: string;
  metaDescription?: string;
  metaKeywords?: string;
  scheduledPublishAt?: string | null;
  scheduledUnpublishAt?: string | null;
  templateId?: number;
  customFields?: string;
}

export interface University {
  id: number;
  code: string;
  name: string;
  description?: string;
  domain?: string;
  settings?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UniversityRequest {
  code: string;
  name: string;
  description?: string;
  domain?: string;
  settings?: string;
  active?: boolean;
}

export interface ContentCategory {
  id: number;
  universityId: number;
  name: string;
  description?: string;
  slug: string;
  displayOrder?: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContentCategoryRequest {
  universityId: number;
  name: string;
  description?: string;
  slug: string;
  displayOrder?: number;
  active?: boolean;
}

export interface ContentTemplate {
  id: number;
  universityId: number;
  name: string;
  content?: string;
  categoryId?: number;
  type: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContentTemplateRequest {
  universityId: number;
  name: string;
  content?: string;
  categoryId?: number;
  type: string;
  active?: boolean;
}

export interface ContentVersion {
  id: number;
  contentId: number;
  versionNumber: number;
  title: string;
  body: string;
  slug: string;
  authorId: number;
  changeNote?: string;
  createdAt: string;
}



