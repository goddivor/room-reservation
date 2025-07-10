import type { ReservationStatus } from "./reservation.types";
import type { RoomType } from "./room.types";

// src/types/user.types.ts
export type UserRole = 'admin' | 'employee' | 'manager' | 'guest';
export type UserStatus = 'active' | 'inactive' | 'suspended';
export type AccountStatus = 'pending' | 'verified' | 'disabled';

// User Base Interface
export interface BaseUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  phone?: string;
  department?: string;
  employeeId?: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

// Admin User
export interface AdminUser extends BaseUser {
  role: 'admin';
  permissions: Permission[];
  canManageUsers: boolean;
  canManageRooms: boolean;
  canViewAllReservations: boolean;
  canGenerateReports: boolean;
}

// Employee User
export interface EmployeeUser extends BaseUser {
  role: 'employee';
  department: string;
  position?: string;
  manager?: string; // Manager user ID
  maxReservationDuration: number; // in hours
  canReserveEquipment: boolean;
}

// Manager User
export interface ManagerUser extends BaseUser {
  role: 'manager';
  department: string;
  teamMembers: string[]; // Employee IDs
  canApproveReservations: boolean;
  approvalRequired: boolean;
  maxTeamReservationDuration: number;
}

// Guest User
export interface GuestUser extends BaseUser {
  role: 'guest';
  sponsorId: string; // Employee who sponsors the guest
  validUntil: string;
  accessLevel: 'limited' | 'standard';
  allowedRoomTypes: RoomType[];
}

// User Statistics
export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  adminCount: number;
  employeeCount: number;
  managerCount: number;
  guestCount: number;
  newUsersThisMonth: number;
  inactiveUsers: number;
}

// User Filters
export interface UserFilters {
  role?: UserRole;
  status?: UserStatus;
  search?: string;
  department?: string;
  createdAfter?: string;
  createdBefore?: string;
}

// Permission System
export type Permission = 
  | 'manage_users'
  | 'manage_rooms'
  | 'manage_equipment'
  | 'view_all_reservations'
  | 'approve_reservations'
  | 'generate_reports'
  | 'export_data'
  | 'manage_system_settings'
  | 'manage_departments'
  | 'access_analytics';

// User Actions
export interface UserAction {
  id: string;
  type: 'create' | 'update' | 'delete' | 'activate' | 'deactivate' | 'assign';
  targetUserId: string;
  performedBy: string;
  timestamp: string;
  details: string;
}

// Emergency Contact
export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
  email?: string;
}

// User Profile
export interface UserProfile extends BaseUser {
  bio?: string;
  emergencyContact?: EmergencyContact;
  preferences: UserPreferences;
  reservationHistory: ReservationSummary[];
}

// User Preferences
export interface UserPreferences {
  language: 'fr' | 'en';
  timezone: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  reminderTime: number; // minutes before reservation
  defaultReservationDuration: number; // hours
  favoriteRooms: string[]; // Room IDs
}

// Reservation Summary for user profile
export interface ReservationSummary {
  id: string;
  roomName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: ReservationStatus;
}