// src/types/equipment.types.ts
export type EquipmentType = 'audiovisual' | 'computing' | 'furniture' | 'communication' | 'presentation' | 'recording' | 'other';
export type EquipmentStatus = 'available' | 'in_use' | 'maintenance' | 'reserved' | 'out_of_service' | 'lost' | 'damaged';
export type EquipmentCondition = 'new' | 'excellent' | 'good' | 'fair' | 'poor' | 'damaged';

// Main Equipment Interface
export interface Equipment {
  id: string;
  name: string;
  model: string;
  brand: string;
  serialNumber?: string;
  type: EquipmentType;
  category: string; // subcategory within type
  description?: string;
  status: EquipmentStatus;
  condition: EquipmentCondition;
  isPortable: boolean;
  requiresSetup: boolean;
  setupTime: number; // minutes
  defaultLocation?: string; // room ID or storage location
  currentLocation?: string;
  purchaseDate?: string;
  warrantyExpiry?: string;
  purchasePrice?: number;
  currentValue?: number;
  vendor?: string;
  specifications: EquipmentSpecification[];
  accessories: EquipmentAccessory[];
  manuals: EquipmentManual[];
  maintenanceSchedule: EquipmentMaintenance[];
  reservationHistory: EquipmentReservationHistory[];
  restrictions: EquipmentRestriction[];
  images: string[];
  qrCode?: string;
  barcode?: string;
  createdAt: string;
  updatedAt: string;
  lastInspection?: string;
  nextMaintenance?: string;
}

// Equipment Specification
export interface EquipmentSpecification {
  name: string;
  value: string;
  unit?: string;
  category: 'technical' | 'physical' | 'performance' | 'connectivity';
}

// Equipment Accessory
export interface EquipmentAccessory {
  id: string;
  name: string;
  isRequired: boolean;
  isIncluded: boolean;
  serialNumber?: string;
  condition: EquipmentCondition;
  status: EquipmentStatus;
}

// Equipment Manual
export interface EquipmentManual {
  title: string;
  type: 'user_manual' | 'quick_start' | 'troubleshooting' | 'maintenance';
  url?: string;
  language: string;
  version?: string;
}

// Equipment Maintenance
export interface EquipmentMaintenance {
  id: string;
  equipmentId: string;
  type: 'routine' | 'repair' | 'calibration' | 'replacement' | 'inspection';
  description: string;
  scheduledDate: string;
  completedDate?: string;
  technician?: string;
  cost?: number;
  notes?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  nextMaintenanceDate?: string;
  partsReplaced?: string[];
}

// Equipment Reservation History
export interface EquipmentReservationHistory {
  reservationId: string;
  userId: string;
  roomId: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose?: string;
  returnCondition: EquipmentCondition;
  issuesReported?: string[];
  returnedLate: boolean;
  returnedBy?: string;
}

// Equipment Restriction
export interface EquipmentRestriction {
  type: 'role' | 'department' | 'training' | 'location' | 'time';
  condition: string;
  value: string;
  message: string;
  isActive: boolean;
}

// Equipment Filters
export interface EquipmentFilters {
  type?: EquipmentType;
  status?: EquipmentStatus;
  condition?: EquipmentCondition;
  location?: string;
  isPortable?: boolean;
  brand?: string;
  search?: string;
  availableOn?: string; // date
}

// Equipment Statistics
export interface EquipmentStats {
  totalEquipment: number;
  availableEquipment: number;
  inUseEquipment: number;
  maintenanceEquipment: number;
  utilizationRate: number;
  typeDistribution: Record<EquipmentType, number>;
  topRequested: PopularEquipment[];
  maintenanceCosts: number;
  replacementNeeded: Equipment[];
}

// Popular Equipment
export interface PopularEquipment {
  equipmentId: string;
  equipmentName: string;
  reservationCount: number;
  utilizationRate: number;
}