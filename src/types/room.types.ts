import type { Equipment } from "./equipment.types";
import type { RecurrencePattern } from "./reservation.types";
import type { UserRole } from "./user.types";

// src/types/room.types.ts
export type RoomType = 'meeting' | 'conference' | 'training' | 'office' | 'coworking' | 'presentation' | 'phone_booth';
export type RoomStatus = 'available' | 'occupied' | 'maintenance' | 'reserved' | 'out_of_service';
export type RoomCapacityType = 'small' | 'medium' | 'large' | 'extra_large';

// Base Room Interface
export interface Room {
  id: string;
  name: string;
  code: string; // Room identifier like "A-101"
  type: RoomType;
  description?: string;
  capacity: number;
  capacityType: RoomCapacityType;
  floor: Floor;
  building: Building;
  area: number; // in square meters
  status: RoomStatus;
  amenities: RoomAmenity[];
  equipment: Equipment[];
  images: string[];
  isAccessible: boolean; // wheelchair accessible
  hasWindows: boolean;
  hasProjector: boolean;
  hasWhiteboard: boolean;
  hasVideoConference: boolean;
  hourlyRate?: number; // for billing if applicable
  bookingPolicy: BookingPolicy;
  availability: RoomAvailability;
  maintenanceSchedule: MaintenanceSchedule[];
  createdAt: string;
  updatedAt: string;
}

// Building Information
export interface Building {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  totalFloors: number;
  hasElevator: boolean;
  hasParking: boolean;
  securityLevel: 'low' | 'medium' | 'high';
  accessHours: OperatingHours;
}

// Floor Information
export interface Floor {
  id: string;
  buildingId: string;
  floorNumber: number;
  name: string; // "Ground Floor", "1st Floor", etc.
  totalRooms: number;
  layout?: string; // URL to floor plan image
  emergencyExits: string[];
  restrooms: boolean;
  kitchenette: boolean;
  isAccessible: boolean;
}

// Room Amenities
export interface RoomAmenity {
  id: string;
  name: string;
  icon: string;
  description?: string;
  isEssential: boolean; // true for basic amenities like chairs, tables
  category: 'furniture' | 'technology' | 'comfort' | 'accessibility' | 'security';
}

// Room Availability
export interface RoomAvailability {
  monday: DayAvailability;
  tuesday: DayAvailability;
  wednesday: DayAvailability;
  thursday: DayAvailability;
  friday: DayAvailability;
  saturday: DayAvailability;
  sunday: DayAvailability;
  holidays: HolidaySchedule[];
  specialDates: SpecialDateSchedule[];
}

// Day Availability
export interface DayAvailability {
  isAvailable: boolean;
  openTime: string; // "08:00"
  closeTime: string; // "18:00"
  breaks: TimeBreak[];
  bookingSlots: number; // minutes per slot (15, 30, 60)
}

// Time Break (lunch break, cleaning, etc.)
export interface TimeBreak {
  startTime: string;
  endTime: string;
  reason: string;
  isRecurring: boolean;
}

// Holiday Schedule
export interface HolidaySchedule {
  date: string;
  name: string;
  isFullDayClosed: boolean;
  customHours?: {
    openTime: string;
    closeTime: string;
  };
}

// Special Date Schedule
export interface SpecialDateSchedule {
  date: string;
  reason: string;
  availability: DayAvailability;
}

// Operating Hours
export interface OperatingHours {
  monday: { open: string; close: string; closed?: boolean };
  tuesday: { open: string; close: string; closed?: boolean };
  wednesday: { open: string; close: string; closed?: boolean };
  thursday: { open: string; close: string; closed?: boolean };
  friday: { open: string; close: string; closed?: boolean };
  saturday: { open: string; close: string; closed?: boolean };
  sunday: { open: string; close: string; closed?: boolean };
}

// Booking Policy
export interface BookingPolicy {
  maxAdvanceBookingDays: number;
  minBookingDuration: number; // minutes
  maxBookingDuration: number; // minutes
  requiresApproval: boolean;
  approverRoles: UserRole[];
  cancelationPolicy: CancelationPolicy;
  noShowPolicy: NoShowPolicy;
  restrictions: BookingRestriction[];
}

// Cancelation Policy
export interface CancelationPolicy {
  allowCancelation: boolean;
  maxCancelationHours: number; // hours before meeting
  penaltyAfterHours?: number;
  requiresReason: boolean;
}

// No Show Policy
export interface NoShowPolicy {
  trackNoShows: boolean;
  maxNoShowsPerMonth: number;
  penaltyAfterNoShows: 'warning' | 'temporary_ban' | 'permanent_ban';
  banDurationDays?: number;
}

// Booking Restrictions
export interface BookingRestriction {
  type: 'role' | 'department' | 'time' | 'duration' | 'frequency';
  condition: string;
  value: string | number;
  message: string;
}

// Maintenance Schedule
export interface MaintenanceSchedule {
  id: string;
  roomId: string;
  title: string;
  description?: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  type: 'routine' | 'repair' | 'upgrade' | 'cleaning';
  technician?: string;
  isRecurring: boolean;
  recurrencePattern?: RecurrencePattern;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  cost?: number;
  notes?: string;
}

// Room Filters
export interface RoomFilters {
  type?: RoomType;
  status?: RoomStatus;
  building?: string;
  floor?: number;
  capacity?: {
    min?: number;
    max?: number;
  };
  amenities?: string[];
  hasProjector?: boolean;
  hasWhiteboard?: boolean;
  hasVideoConference?: boolean;
  isAccessible?: boolean;
  search?: string;
}

// Room Statistics
export interface RoomStats {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  maintenanceRooms: number;
  utilizationRate: number; // percentage
  popularRooms: PopularRoom[];
  typeDistribution: Record<RoomType, number>;
}

// Popular Room
export interface PopularRoom {
  roomId: string;
  roomName: string;
  reservationCount: number;
  utilizationRate: number;
}