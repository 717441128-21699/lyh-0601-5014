export type UserRole = 'employee' | 'hr';

export type TaskStatus = 'pending' | 'processing' | 'completed' | 'rejected';

export type TaskCategory = 'document' | 'process' | 'system' | 'training';

export interface Position {
  id: string;
  name: string;
  department: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  status: TaskStatus;
  deadline?: string;
  completedAt?: string;
  rejectReason?: string;
  assignee?: string;
  positionId?: string;
}

export interface ChecklistGroup {
  category: TaskCategory;
  categoryName: string;
  items: ChecklistItem[];
}

export interface ChecklistTemplateItem {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
}

export interface PositionChecklistTemplate {
  positionId: string;
  positionName: string;
  items: ChecklistTemplateItem[];
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface PersonalInfo {
  idCardUploaded: boolean;
  idCardUrl?: string;
  avatarUploaded: boolean;
  avatarUrl?: string;
  diplomaUploaded: boolean;
  diplomaUrl?: string;
  emergencyContact: EmergencyContact;
  arrivalDate: string;
  bankCard: string;
  address: string;
  auditStatus: TaskStatus;
  auditRejectReason?: string;
  submittedAt?: string;
  auditedAt?: string;
}

export interface Contract {
  id: string;
  title: string;
  content: string;
  version: string;
  publishedAt: string;
  signed: boolean;
  signedAt?: string;
  signatureUrl?: string;
}

export interface ProgressStep {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  expectedDate?: string;
  actualDate?: string;
  assignee?: string;
  taskType?: string;
  scheduledAt?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participantName: string;
  participantRole: UserRole;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface HrTask {
  id: string;
  title: string;
  employeeName: string;
  position: string;
  taskType: string;
  status: TaskStatus;
  deadline: string;
  assignee?: string;
  scheduledAt?: string;
  completedAt?: string;
}

export interface EmployeeProfile {
  id: string;
  name: string;
  position: string;
  positionId: string;
  department: string;
  avatar: string;
  phone: string;
  email: string;
  overallProgress: number;
  infoStatus: TaskStatus;
  contractStatus: TaskStatus;
  arrivalStatus: TaskStatus;
  arrivedAt?: string;
}
