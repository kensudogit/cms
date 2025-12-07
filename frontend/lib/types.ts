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

export interface Payment {
  id: number;
  userId: number;
  universityId: number;
  flowId?: number;
  contentId?: number; // セミナー・シンポジウムのID
  paymentType: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'CANCELLED';
  paymentMethod?: string;
  transactionId?: string;
  paidAt?: string;
  notes?: string;
  reconciliation?: PaymentReconciliation;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRequest {
  userId: number;
  universityId: number;
  flowId?: number;
  contentId?: number;
  paymentType: string;
  amount: number;
  currency?: string;
  status?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'CANCELLED';
  paymentMethod?: string;
  transactionId?: string;
  notes?: string;
}

export interface PaymentReconciliation {
  id: number;
  paymentId: number;
  userId: number;
  universityId: number;
  reconciledAmount: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  reconciliationMethod?: string;
  reconciledAt?: string;
  reconciledBy?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentReconciliationRequest {
  paymentId: number;
  userId: number;
  universityId: number;
  reconciledAmount: number;
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  reconciliationMethod?: string;
  reconciledBy?: number;
  notes?: string;
}

// セミナー・シンポジウムの申し込み
export interface SeminarRegistration {
  id: number;
  userId: number;
  contentId: number; // セミナー・シンポジウムのコンテンツID
  universityId: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  registrationDate: string;
  attendanceStatus?: 'ATTENDED' | 'ABSENT' | 'PENDING';
  notes?: string;
  payment?: Payment;
  createdAt: string;
  updatedAt: string;
}

export interface SeminarRegistrationRequest {
  userId: number;
  contentId: number;
  universityId: number;
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  notes?: string;
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
  createdAt: string;
  updatedAt: string;
}
