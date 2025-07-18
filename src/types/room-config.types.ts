// src/types/room-config.types.ts

// Room Type Configuration
export interface RoomTypeConfig {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Location Configuration
export interface LocationConfig {
  id: string;
  type: 'floor' | 'building' | 'section';
  name: string;
  label: string;
  description?: string;
  order: number;
  isActive: boolean;
  parentId?: string; // For hierarchical locations (section belongs to building)
  createdAt: string;
  updatedAt: string;
}

// Room Feature
export interface RoomFeature {
  id: string;
  name: string;
  description?: string;
  icon: string;
  category: 'basic' | 'comfort' | 'technology' | 'safety' | 'accessibility';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Equipment (extended from existing)
export interface Equipment {
  id: string;
  name: string;
  description?: string;
  icon: string;
  category: 'electronics' | 'furniture' | 'appliances' | 'comfort' | 'safety';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Form data interfaces
export interface RoomTypeFormData {
  name: string;
  description: string;
  color: string;
  icon: string;
  isActive: boolean;
}

export interface LocationFormData {
  type: 'floor' | 'building' | 'section';
  name: string;
  label: string;
  description?: string;
  order: number;
  isActive: boolean;
  parentId?: string;
}

export interface FeatureFormData {
  name: string;
  description?: string;
  icon: string;
  category: 'basic' | 'comfort' | 'technology' | 'safety' | 'accessibility';
  isActive: boolean;
}

export interface EquipmentFormData {
  name: string;
  description?: string;
  icon: string;
  category: 'electronics' | 'furniture' | 'appliances' | 'comfort' | 'safety';
  isActive: boolean;
}