/* eslint-disable @typescript-eslint/no-explicit-any */
// src/types/system.types.ts

import type { Equipment } from "./equipment.types";
import type { Reservation } from "./reservation.types";
import type { OperatingHours, Room } from "./room.types";
import type { BaseUser, EmergencyContact, UserRole } from "./user.types";

// System Configuration
export interface SystemSettings {
  id: string;
  organizationName: string;
  organizationCode: string;
  address: Address;
  contact: ContactInfo;
  timezone: string;
  language: 'fr' | 'en';
  currency: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  workingHours: OperatingHours;
  holidays: Holiday[];
  bookingSettings: BookingSettings;
  notificationSettings: NotificationSettings;
  securitySettings: SecuritySettings;
  integrationSettings: IntegrationSettings;
  updatedAt: string;
  updatedBy: string;
}

// Address
export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  region?: string;
}

// Contact Information
export interface ContactInfo {
  phone: string;
  email: string;
  website?: string;
  fax?: string;
  supportEmail?: string;
  emergencyContact?: EmergencyContact;
}

// Holiday
export interface Holiday {
  id: string;
  name: string;
  date: string;
  isRecurring: boolean;
  type: 'national' | 'religious' | 'company' | 'local';
  description?: string;
}

// Booking Settings
export interface BookingSettings {
  defaultDuration: number; // minutes
  maxAdvanceBooking: number; // days
  minAdvanceBooking: number; // hours
  slotDuration: number; // minutes
  bufferTime: number; // minutes between bookings
  autoApprove: boolean;
  requireApprovalFor: string[]; // room types or specific rooms
  allowRecurring: boolean;
  maxRecurringOccurrences: number;
  allowEquipmentReservation: boolean;
  allowGuestReservations: boolean;
  checkInGracePeriod: number; // minutes
  autoReleaseTime: number; // minutes after start time
}

// Notification Settings
export interface NotificationSettings {
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  reminderTimes: number[]; // minutes before meeting
  sendConfirmation: boolean;
  sendReminders: boolean;
  sendCancellation: boolean;
  sendApprovalRequests: boolean;
  adminNotifications: AdminNotificationSettings;
  templates: NotificationTemplate[];
}

// Admin Notification Settings
export interface AdminNotificationSettings {
  newReservations: boolean;
  cancellations: boolean;
  noShows: boolean;
  equipmentIssues: boolean;
  maintenanceAlerts: boolean;
  systemErrors: boolean;
}

// Notification Template
export interface NotificationTemplate {
  id: string;
  type: 'email' | 'sms' | 'push';
  event: 'confirmation' | 'reminder' | 'cancellation' | 'approval_request' | 'approval_response';
  subject: string;
  template: string;
  isActive: boolean;
  language: string;
}

// Security Settings
export interface SecuritySettings {
  sessionTimeout: number; // minutes
  passwordPolicy: PasswordPolicy;
  twoFactorEnabled: boolean;
  ipWhitelist: string[];
  maxLoginAttempts: number;
  lockoutDuration: number; // minutes
  auditLogging: boolean;
  dataRetentionDays: number;
}

// Password Policy
export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  maxAge: number; // days
  historyCount: number; // previous passwords to remember
}

// Integration Settings
export interface IntegrationSettings {
  calendarSync: CalendarIntegration;
  emailProvider: EmailProvider;
  smsProvider: SMSProvider;
  ssoProvider?: SSOProvider;
  apiKeys: APIKey[];
  webhooks: Webhook[];
}

// Calendar Integration
export interface CalendarIntegration {
  enabled: boolean;
  provider: 'outlook' | 'google' | 'exchange';
  autoSync: boolean;
  syncInterval: number; // minutes
  createCalendarEvents: boolean;
  includeAttendeesInCalendar: boolean;
}

// Email Provider
export interface EmailProvider {
  provider: 'smtp' | 'sendgrid' | 'mailgun' | 'ses';
  configuration: Record<string, string>;
  fromEmail: string;
  fromName: string;
}

// SMS Provider
export interface SMSProvider {
  enabled: boolean;
  provider: 'twilio' | 'nexmo' | 'aws_sns';
  configuration: Record<string, string>;
}

// SSO Provider
export interface SSOProvider {
  enabled: boolean;
  provider: 'azure_ad' | 'google_workspace' | 'okta' | 'saml';
  configuration: Record<string, string>;
  autoProvision: boolean;
  defaultRole: UserRole;
}

// API Key
export interface APIKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
  lastUsed?: string;
}

// Webhook
export interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  isActive: boolean;
  secret?: string;
  retryPolicy: {
    maxRetries: number;
    retryDelay: number; // seconds
  };
}

// Analytics & Reporting
export interface AnalyticsData {
  period: 'day' | 'week' | 'month' | 'quarter' | 'year';
  startDate: string;
  endDate: string;
  metrics: AnalyticsMetric[];
}

// Analytics Metric
export interface AnalyticsMetric {
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number; // percentage change from previous period
  chartData?: ChartDataPoint[];
}

// Chart Data Point
export interface ChartDataPoint {
  label: string;
  value: number;
  date?: string;
}

// System Health
export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number; // hours
  version: string;
  lastBackup?: string;
  databaseStatus: 'connected' | 'disconnected' | 'slow';
  storageUsage: number; // percentage
  memoryUsage: number; // percentage
  cpuUsage: number; // percentage
  errorCount: number;
  checks: HealthCheck[];
}

// Health Check
export interface HealthCheck {
  component: string;
  status: 'pass' | 'fail' | 'warn';
  message?: string;
  lastChecked: string;
  responseTime?: number; // milliseconds
}

// Export/Import Types
export interface SystemExport {
  exportDate: string;
  version: string;
  settings: SystemSettings;
  rooms: Room[];
  equipment: Equipment[];
  users: BaseUser[];
  reservations: Reservation[];
}

// System Statistics
export interface SystemStats {
  totalUsers: number;
  totalRooms: number;
  totalEquipment: number;
  totalReservations: number;
  activeReservations: number;
  systemUptime: number;
  storageUsed: number;
  lastBackup: string;
  errorRate: number;
}

// Audit Log
export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  result: 'success' | 'failure' | 'error';
}

// Error Log
export interface ErrorLog {
  id: string;
  level: 'info' | 'warn' | 'error' | 'fatal';
  message: string;
  stack?: string;
  userId?: string;
  path?: string;
  method?: string;
  statusCode?: number;
  timestamp: string;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
}

// Backup Information
export interface BackupInfo {
  id: string;
  type: 'full' | 'incremental' | 'differential';
  status: 'in_progress' | 'completed' | 'failed';
  startTime: string;
  endTime?: string;
  size: number; // bytes
  location: string;
  retentionDate: string;
  createdBy: 'system' | 'manual';
  verified: boolean;
}

// Feature Flags
export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  rolloutPercentage: number; // 0-100
  targetRoles?: UserRole[];
  targetDepartments?: string[];
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

// System Maintenance
export interface SystemMaintenance {
  id: string;
  title: string;
  description: string;
  type: 'scheduled' | 'emergency' | 'update' | 'patch';
  scheduledStart: string;
  scheduledEnd: string;
  actualStart?: string;
  actualEnd?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  affectedServices: string[];
  impactLevel: 'low' | 'medium' | 'high' | 'critical';
  notificationSent: boolean;
  createdBy: string;
  notes?: string;
}
