// src/types/user.types.ts
export type UserStatus = 'pending' | 'verified' | 'suspended';
export type UserActivityStatus = 'active' | 'inactive';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string; // Optional since not required during registration
  avatar?: string; // If not set, we'll use dicebear API
  status: UserStatus; // For email verification
  isActive: boolean; // For enable/disable user
  lastLoginAt?: string;
  loginCount: number;
  createdAt: string;
  updatedAt: string;
  // Activity tracking
  lastActivity?: string;
  isOnline: boolean;
}

export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  sendWelcomeEmail: boolean;
}

export interface UserFilters {
  search?: string;
  status?: UserStatus;
  isActive?: boolean;
  createdAfter?: string;
  createdBefore?: string;
  lastLoginAfter?: string;
  hasPhone?: boolean;
}

export interface UserStats {
  totalUsers: number;
  verifiedUsers: number;
  pendingUsers: number;
  suspendedUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  onlineUsers: number;
  newUsersThisMonth: number;
  loginActivityToday: number;
}

// Recent Messages
export interface UserMessage {
  id: string;
  userId: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
  subject: string;
  message: string;
  isRead: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  responses: MessageResponse[];
}

export interface MessageResponse {
  id: string;
  messageId: string;
  content: string;
  isFromAdmin: boolean;
  sentAt: string;
  sentBy: string;
  emailSent: boolean;
}

export interface MessageFormData {
  subject: string;
  content: string;
  sendEmail: boolean;
}

// User Reviews
export interface UserReview {
  id: string;
  userId: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
  reservationId?: string;
  roomCode?: string;
  rating: number; // 1-5 stars
  title: string;
  comment: string;
  category: 'room' | 'service' | 'booking' | 'support' | 'general';
  isPublic: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  adminResponse?: {
    content: string;
    respondedBy: string;
    respondedAt: string;
  };
}

// Chat/Support
export interface ChatConversation {
  id: string;
  userId: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
  subject: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  isUnread: boolean;
  lastMessageAt: string;
  createdAt: string;
  messages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  content: string;
  isFromUser: boolean;
  sentAt: string;
  sentBy: string;
  isRead: boolean;
  emailSent?: boolean; // For admin responses
}