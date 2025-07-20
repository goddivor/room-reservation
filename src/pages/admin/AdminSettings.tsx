/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/admin/AdminSettings.tsx
import React, { useState, useEffect } from 'react';
import { Setting2, Save2, Refresh, Call, Warning2, Sms, Home, Facebook, Instagram } from 'iconsax-react';
import Button from '../../components/Button';
import { useToast } from '../../context/toast-context';
import ContactSettingsSection from '../../components/settings/ContactSettingsSection';
import MaintenanceSettingsSection from '../../components/settings/MaintenanceSettingsSection';
import EmailSettingsSection from '../../components/settings/EmailSettingsSection';
import LandingPageSettingsSection from '../../components/settings/LandingPageSettingsSection';
import type { SystemSettings } from '../../types/settings.types';

const AdminSettings: React.FC = () => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'contact' | 'maintenance' | 'email' | 'landing'>('contact');
  const [settings, setSettings] = useState<SystemSettings>({
    contact: {
      phone: '+33 1 23 45 67 89',
      email: 'contact@example.com',
      address: '123 Street Name, City, Country',
      mapUrl: 'https://maps.google.com/embed?...',
      socialLinks: [
        {
          id: '1',
          platform: 'facebook',
          url: 'https://facebook.com/yourpage',
          icon: <Facebook size={24} color="#1877F2" variant="Bold" />,
          isActive: true,
          order: 0
        },
        {
          id: '2',
          platform: 'instagram',
          url: 'https://instagram.com/yourpage',
          icon: <Instagram size={24} color="#E4405F" variant="Bold" />,
          isActive: true,
          order: 1
        }
      ]
    },
    maintenance: {
      isEnabled: false,
      message: 'We are currently performing scheduled maintenance. Please check back soon!',
      startDate: undefined,
      endDate: undefined,
      allowedEmails: ['admin@example.com']
    },
    email: {
      smtpHost: '',
      smtpPort: 587,
      smtpUser: '',
      smtpPassword: '',
      fromEmail: '',
      fromName: '',
      isEnabled: false,
      templates: {
        confirmation: `Dear {{customerName}},

Your reservation has been confirmed!

Reservation Details:
- Room: {{roomName}}
- Check-in: {{checkInDate}}
- Check-out: {{checkOutDate}}
- Total: {{totalAmount}}

Reference: {{reservationId}}

We look forward to welcoming you!

Best regards,
{{businessName}}`,
        cancellation: `Dear {{customerName}},

Your reservation has been cancelled.

Cancelled Reservation:
- Room: {{roomName}}
- Check-in: {{checkInDate}}
- Check-out: {{checkOutDate}}
- Reference: {{reservationId}}

If you have any questions, please contact us.

Best regards,
{{businessName}}`,
        reminder: `Dear {{customerName}},

This is a reminder about your upcoming reservation.

Reservation Details:
- Room: {{roomName}}
- Check-in: {{checkInDate}} (in {{daysUntilCheckIn}} days)
- Check-out: {{checkOutDate}}

We look forward to welcoming you!

Best regards,
{{businessName}}`
      }
    },
    landingPage: {
      heroTitle: 'Welcome to Our Amazing Rooms',
      heroSubtitle: 'Discover comfort and luxury in our carefully designed spaces. Book your perfect stay today.',
      heroImage: '',
      featuredRooms: [],
      testimonials: [
        {
          id: '1',
          name: 'Sarah Johnson',
          avatar: '',
          content: 'Amazing experience! The room was perfect and the service was outstanding. Will definitely come back!',
          rating: 5
        }
      ]
    },
    lastUpdated: new Date().toISOString(),
    updatedBy: 'admin'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Tab configuration
  const tabs = [
    {
      id: 'contact' as const,
      label: 'Contact Settings',
      icon: <Call size={16} color="currentColor" />,
      description: 'Manage contact information and social links'
    },
    {
      id: 'maintenance' as const,
      label: 'Maintenance Mode',
      icon: <Warning2 size={16} color="currentColor" />,
      description: 'Configure site maintenance settings'
    },
    {
      id: 'email' as const,
      label: 'Email Settings',
      icon: <Sms size={16} color="currentColor" />,
      description: 'SMTP configuration and email templates'
    },
    {
      id: 'landing' as const,
      label: 'Landing Page',
      icon: <Home size={16} color="currentColor" />,
      description: 'Homepage content and testimonials'
    }
  ];

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  // Load settings from storage/API
  const loadSettings = async () => {
    setIsLoading(true);
    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Load from localStorage as fallback
      const savedSettings = localStorage.getItem('adminSettings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Error loading settings');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle settings update for specific section
  const handleSectionUpdate = (section: keyof SystemSettings, updates: any) => {
    if (section === 'contact' || section === 'maintenance' || section === 'email' || section === 'landingPage') {
      setSettings(prev => ({
        ...prev,
        [section]: updates,
        lastUpdated: new Date().toISOString()
      }));
      setHasUnsavedChanges(true);
    }
  };

  // Save all settings
  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save to localStorage as fallback
      localStorage.setItem('adminSettings', JSON.stringify(settings));
      
      setHasUnsavedChanges(false);
      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Error saving settings');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset settings to default
  const handleResetSettings = async () => {
    if (!confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    try {
      // Clear localStorage
      localStorage.removeItem('adminSettings');
      // Reset to initial state
      await loadSettings();
      setHasUnsavedChanges(false);
      toast.success('Settings reset to default');
    } catch (error) {
      console.error('Error resetting settings:', error);
      toast.error('Error resetting settings');
    } finally {
      setIsLoading(false);
    }
  };

  // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'contact':
        return (
          <ContactSettingsSection
            settings={settings.contact}
            onUpdate={(updates) => handleSectionUpdate('contact', updates)}
          />
        );
      case 'maintenance':
        return (
          <MaintenanceSettingsSection
            settings={settings.maintenance}
            onUpdate={(updates) => handleSectionUpdate('maintenance', updates)}
          />
        );
      case 'email':
        return (
          <EmailSettingsSection
            settings={settings.email}
            onUpdate={(updates) => handleSectionUpdate('email', updates)}
          />
        );
      case 'landing':
        return (
          <LandingPageSettingsSection
            settings={settings.landingPage}
            onUpdate={(updates) => handleSectionUpdate('landingPage', updates)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Setting2 size={24} color="#2563EB" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
              <p className="text-sm text-gray-600">
                Configure contact information, maintenance mode, and system preferences
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {hasUnsavedChanges && (
              <span className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                Unsaved changes
              </span>
            )}
            
            <Button
              onClick={handleResetSettings}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center space-x-2"
            >
              <Refresh size={16} color="currentColor" />
              <span>Reset</span>
            </Button>

            <Button
              onClick={handleSaveSettings}
              disabled={isLoading || !hasUnsavedChanges}
              className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save2 size={16} color="white" />
                  <span>Save Changes</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="w-80 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Configuration</h2>
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 border border-blue-200 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {tab.icon}
                    <div>
                      <div className="font-medium">{tab.label}</div>
                      <div className="text-xs text-gray-500">{tab.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* Settings Info */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Last Updated</h3>
              <p className="text-xs text-gray-600">
                {new Date(settings.lastUpdated).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                by {settings.updatedBy}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {isLoading && !hasUnsavedChanges ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading settings...</p>
              </div>
            </div>
          ) : (
            <div>
              {/* Tab Header */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {tabs.find(tab => tab.id === activeTab)?.label}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {tabs.find(tab => tab.id === activeTab)?.description}
                </p>
              </div>

              {/* Tab Content */}
              {renderTabContent()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;