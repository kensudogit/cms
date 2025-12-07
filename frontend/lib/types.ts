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

export interface ProcedureFlow {
  id: number;
  universityId: number;
  name: string;
  description?: string;
  flowType: string;
  displayOrder?: number;
  active: boolean;
  steps?: ProcedureStep[];
  createdAt: string;
  updatedAt: string;
}

export interface ProcedureFlowRequest {
  universityId: number;
  name: string;
  description?: string;
  flowType: string;
  displayOrder?: number;
  active?: boolean;
}

export interface ProcedureStep {
  id: number;
  flowId: number;
  contentId: number;
  name: string;
  description?: string;
  stepOrder: number;
  requiredRole?: string;
  isRequired?: boolean;
  dependsOnStepIds?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProcedureStepRequest {
  flowId: number;
  contentId: number;
  name: string;
  description?: string;
  stepOrder: number;
  requiredRole?: string;
  isRequired?: boolean;
  dependsOnStepIds?: string;
  active?: boolean;
}

export interface ProcedureProgress {
  id: number;
  userId: number;
  stepId: number;
  flowId: number;
  universityId: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED' | 'BLOCKED';
  startedAt?: string;
  completedAt?: string;
  notes?: string;
  step?: ProcedureStep;
  createdAt: string;
  updatedAt: string;
}

export interface ProcedureProgressRequest {
  userId: number;
  stepId: number;
  flowId: number;
  universityId: number;
  status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED' | 'BLOCKED';
  notes?: string;
}

export interface ProcedureFlowDetail {
  id: number;
  universityId: number;
  name: string;
  description?: string;
  flowType: string;
  displayOrder?: number;
  active: boolean;
  steps: ProcedureStepWithProgress[];
  totalSteps: number;
  completedSteps: number;
  inProgressSteps: number;
  notStartedSteps: number;
  completionRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProcedureStepWithProgress {
  id: number;
  flowId: number;
  contentId: number;
  name: string;
  description?: string;
  stepOrder: number;
  requiredRole?: string;
  isRequired?: boolean;
  dependsOnStepIds?: string;
  active: boolean;
  progressStatus?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED' | 'BLOCKED';
  progressStartedAt?: string;
  progressCompletedAt?: string;
  progressNotes?: string;
  canStart?: boolean;
  createdAt: string;
  updatedAt: string;
}



