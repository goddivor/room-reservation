// src/types/room.types.ts
export type RoomType = 'studio' | 'simple' | 'salon' | '2_bedrooms_salon' | '3_bedrooms_salon';
export type RoomStatus = 'available' | 'reserved' | 'occupied' | 'maintenance' | 'inactive';
export type RoomFloor = 'ground' | 'first' | 'second' | 'third' | 'fourth' | 'fifth';

// Room Type Configuration
export interface RoomTypeConfig {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

// Equipment
export interface Equipment {
  id: string;
  name: string;
  description?: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

// Main Room Interface
export interface Room {
  name: string;
  id: string;
  code: string; // Room number/code (e.g., "A101", "B205")
  typeId: string; // Reference to RoomTypeConfig
  type?: RoomTypeConfig; // Populated type details
  status: RoomStatus;
  floor: RoomFloor;
  capacity: number;
  area: number; // in square meters
  equipmentIds: string[]; // Array of equipment IDs
  equipment?: Equipment[]; // Populated equipment details
  dailyRate: number; // Daily rental rate
  monthlyRate?: number; // Optional monthly rate
  description?: string;
  images: string[];
  isActive: boolean;
  // Location details
  building?: string;
  section?: string; // Section of building (A, B, C, etc.)
  // Features
  hasBalcony: boolean;
  hasKitchen: boolean;
  hasBathroom: boolean;
  hasAirConditioning: boolean;
  hasWifi: boolean;
  // Metadata
  createdAt: string;
  updatedAt: string;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
}

// Room Filters
export interface RoomFilters {
  search?: string;
  typeId?: string;
  status?: RoomStatus;
  floor?: RoomFloor;
  minCapacity?: number;
  maxCapacity?: number;
  minRate?: number;
  maxRate?: number;
  equipmentIds?: string[];
  hasBalcony?: boolean;
  hasKitchen?: boolean;
  hasBathroom?: boolean;
  hasAirConditioning?: boolean;
  hasWifi?: boolean;
  isActive?: boolean;
  building?: string;
  section?: string;
}

// Room Statistics
export interface RoomStats {
  totalRooms: number;
  availableRooms: number;
  reservedRooms: number;
  occupiedRooms: number;
  maintenanceRooms: number;
  inactiveRooms: number;
  utilizationRate: number; // percentage
  averageRate: number;
  typeDistribution: Record<string, number>;
  floorDistribution: Record<RoomFloor, number>;
}

// Form Data for Room Creation/Editing
export interface RoomFormData {
  code: string;
  typeId: string;
  status: RoomStatus;
  floor: RoomFloor;
  capacity: number;
  area: number;
  equipmentIds: string[];
  dailyRate: number;
  monthlyRate?: number;
  description?: string;
  building?: string;
  section?: string;
  hasBalcony: boolean;
  hasKitchen: boolean;
  hasBathroom: boolean;
  hasAirConditioning: boolean;
  hasWifi: boolean;
  isActive: boolean;
}