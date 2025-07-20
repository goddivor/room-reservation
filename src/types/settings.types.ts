// src/types/settings.types.ts
// src/types/settings.types.ts
import type { ReactNode } from 'react';

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: ReactNode; // Changé de string à ReactNode pour accepter les composants icônes
  isActive: boolean;
  order: number;
}

export interface ContactSettings {
  phone: string;
  email: string;
  address: string;
  mapUrl: string;
  socialLinks: SocialLink[];
}

export interface MaintenanceSettings {
  isEnabled: boolean;
  message: string;
  startDate?: string;
  endDate?: string;
  allowedEmails: string[]; // Admin emails that can access during maintenance
}

export interface EmailSettings {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
  isEnabled: boolean;
  templates: {
    confirmation: string;
    cancellation: string;
    reminder: string;
  };
}

export interface LandingPageSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  featuredRooms: string[]; // Room IDs
  testimonials: {
    id: string;
    name: string;
    avatar: string;
    content: string;
    rating: number;
  }[];
}

export interface SystemSettings {
  contact: ContactSettings;
  maintenance: MaintenanceSettings;
  email: EmailSettings;
  landingPage: LandingPageSettings;
  lastUpdated: string;
  updatedBy: string;
}

export interface SettingsFormData {
  contact: Partial<ContactSettings>;
  maintenance: Partial<MaintenanceSettings>;
  email: Partial<EmailSettings>;
  landingPage: Partial<LandingPageSettings>;
}