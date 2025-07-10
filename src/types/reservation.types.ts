// src/types/reservation.types.ts
export type ReservationStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'biweekly' | 'monthly';
export type ReservationPriority = 'low' | 'normal' | 'high' | 'urgent';
export type BookingSource = 'web' | 'mobile' | 'admin' | 'api';

// Main Reservation Interface
export interface Reservation {
  id: string;
  title: string;
  description?: string;
  roomId: string;
  userId: string;
  attendees: ReservationAttendee[];
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  duration: number; // minutes
  status: ReservationStatus;
  priority: ReservationPriority;
  isRecurring: boolean;
  recurrence?: RecurrencePattern;
  parentReservationId?: string; // for recurring reservations
  equipment: EquipmentReservation[];
  services: ServiceRequest[];
  setup: RoomSetup;
  catering?: CateringRequest;
  specialRequests?: string;
  internalNotes?: string;
  source: BookingSource;
  checkInTime?: string;
  checkOutTime?: string;
  actualAttendeeCount?: number;
  feedback?: ReservationFeedback;
  billing?: BillingInfo;
  approvals: ReservationApproval[];
  notifications: ReservationNotification[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
}

// Reservation Attendee
export interface ReservationAttendee {
  id: string;
  email: string;
  name: string;
  role: 'organizer' | 'presenter' | 'attendee' | 'optional';
  isInternal: boolean; // employee vs external guest
  hasConfirmed: boolean;
  checkInTime?: string;
  department?: string;
}

// Recurrence Pattern
export interface RecurrencePattern {
  type: RecurrenceType;
  interval: number; // every X days/weeks/months
  daysOfWeek?: number[]; // 0=Sunday, 1=Monday, etc.
  endDate?: string;
  maxOccurrences?: number;
  exceptions: string[]; // dates to skip
}

// Equipment Reservation
export interface EquipmentReservation {
  equipmentId: string;
  quantity: number;
  startTime?: string; // if different from room reservation
  endTime?: string;
  deliveryLocation?: string;
  setupRequired: boolean;
  notes?: string;
}

// Room Setup Configuration
export interface RoomSetup {
  layout: 'theater' | 'classroom' | 'boardroom' | 'u_shape' | 'banquet' | 'cocktail' | 'custom';
  chairs: number;
  tables: number;
  podium: boolean;
  microphone: boolean;
  stage: boolean;
  lighting: 'normal' | 'dimmed' | 'bright' | 'presentation';
  temperature: number; // Celsius
  specialInstructions?: string;
}

// Catering Request
export interface CateringRequest {
  provider: string;
  menu: string;
  attendeeCount: number;
  dietaryRestrictions: string[];
  servingTime: string;
  specialRequests?: string;
  cost?: number;
  contactPerson?: string;
}

// Service Request
export interface ServiceRequest {
  id: string;
  type: 'it_support' | 'catering' | 'cleaning' | 'security' | 'maintenance' | 'decoration' | 'other';
  description: string;
  priority: 'low' | 'normal' | 'high';
  requestedTime?: string;
  estimatedDuration?: number; // minutes
  assignedTo?: string;
  status: 'requested' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  cost?: number;
  notes?: string;
}

// Reservation Approval
export interface ReservationApproval {
  id: string;
  reservationId: string;
  approverId: string;
  approverName: string;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  requestedAt: string;
  respondedAt?: string;
  level: number; // approval hierarchy level
}

// Reservation Notification
export interface ReservationNotification {
  id: string;
  type: 'reminder' | 'confirmation' | 'cancellation' | 'approval_request' | 'approval_response' | 'check_in_reminder';
  recipientId: string;
  recipientType: 'user' | 'attendee' | 'approver';
  scheduledTime: string;
  sentAt?: string;
  status: 'scheduled' | 'sent' | 'failed' | 'cancelled';
  subject: string;
  message: string;
  channel: 'email' | 'sms' | 'push' | 'in_app';
}

// Reservation Feedback
export interface ReservationFeedback {
  rating: number; // 1-5 stars
  roomRating: number;
  serviceRating: number;
  equipmentRating: number;
  comments?: string;
  issues: string[];
  suggestions?: string;
  wouldRecommend: boolean;
  submittedAt: string;
}

// Billing Information
export interface BillingInfo {
  department: string;
  costCenter?: string;
  projectCode?: string;
  roomCost: number;
  equipmentCost: number;
  serviceCost: number;
  totalCost: number;
  currency: string;
  billingDate?: string;
  invoiceId?: string;
  approvedBy?: string;
}

// Time Slot
export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  reservationId?: string;
  reason?: string; // if not available
}

// Booking Request
export interface BookingRequest {
  roomId: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  attendees: Omit<ReservationAttendee, 'id' | 'checkInTime'>[];
  equipment: Omit<EquipmentReservation, 'deliveryLocation'>[];
  setup: RoomSetup;
  isRecurring: boolean;
  recurrence?: RecurrencePattern;
  specialRequests?: string;
  priority: ReservationPriority;
  catering?: Omit<CateringRequest, 'cost' | 'contactPerson'>;
  services: Omit<ServiceRequest, 'id' | 'assignedTo' | 'status' | 'cost'>[];
}

// Reservation Filters
export interface ReservationFilters {
  status?: ReservationStatus;
  roomId?: string;
  userId?: string;
  date?: {
    start: string;
    end: string;
  };
  priority?: ReservationPriority;
  search?: string;
  department?: string;
  hasEquipment?: boolean;
  isRecurring?: boolean;
}

// Reservation Statistics
export interface ReservationStats {
  totalReservations: number;
  confirmedReservations: number;
  pendingApprovals: number;
  cancelledReservations: number;
  noShowRate: number;
  averageDuration: number; // minutes
  peakHours: PeakHour[];
  departmentUsage: Record<string, number>;
  roomUtilization: Record<string, number>;
}

// Peak Hour
export interface PeakHour {
  hour: number; // 0-23
  reservationCount: number;
  utilization: number; // percentage
}