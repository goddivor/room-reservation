// src/components/settings/MaintenanceSettingsSection.tsx
import React, { useState } from 'react';
import { Warning2, Setting2, Add, Trash } from 'iconsax-react';
import Button from '../Button';
import { Input } from '../Input';
import { Textarea } from '../forms/Textarea';
import type { MaintenanceSettings } from '../../types/settings.types';
import { Switch } from '../actions/switch';
// import Switch from '../actions/switch';

interface MaintenanceSettingsSectionProps {
  settings: MaintenanceSettings;
  onUpdate: (settings: Partial<MaintenanceSettings>) => void;
}

const MaintenanceSettingsSection: React.FC<MaintenanceSettingsSectionProps> = ({
  settings,
  onUpdate
}) => {
  const [newEmail, setNewEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  // Handle maintenance toggle
  const handleMaintenanceToggle = (enabled: boolean) => {
    onUpdate({
      ...settings,
      isEnabled: enabled
    });
  };

  // Handle field update
  const handleFieldUpdate = (field: keyof MaintenanceSettings, value: string) => {
    onUpdate({
      ...settings,
      [field]: value
    });
  };

  // Handle allowed email addition
  const handleAddAllowedEmail = () => {
    if (!newEmail) {
      setEmailError('Email is required');
      return;
    }

    if (!isValidEmail(newEmail)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    if (settings.allowedEmails.includes(newEmail)) {
      setEmailError('This email is already in the list');
      return;
    }

    const updatedEmails = [...settings.allowedEmails, newEmail];
    onUpdate({
      ...settings,
      allowedEmails: updatedEmails
    });

    setNewEmail('');
    setEmailError('');
  };

  // Handle allowed email removal
  const handleRemoveAllowedEmail = (email: string) => {
    const updatedEmails = settings.allowedEmails.filter(e => e !== email);
    onUpdate({
      ...settings,
      allowedEmails: updatedEmails
    });
  };

  // Validate email format
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Format date for input
  const formatDateForInput = (dateString?: string): string => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().slice(0, 16);
  };

  // Handle date change
  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    const isoString = value ? new Date(value).toISOString() : undefined;
    onUpdate({
      ...settings,
      [field]: isoString
    });
  };

  return (
    <div className="space-y-8">
      {/* Maintenance Status */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${settings.isEnabled ? 'bg-orange-100' : 'bg-gray-100'}`}>
              <Warning2 size={20} color={settings.isEnabled ? '#F97316' : '#6B7280'} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Maintenance Mode</h3>
              <p className="text-sm text-gray-600">
                {settings.isEnabled 
                  ? 'Site is currently in maintenance mode' 
                  : 'Site is operating normally'
                }
              </p>
            </div>
          </div>
          <Switch
            checked={settings.isEnabled}
            onChange={handleMaintenanceToggle}
            size="lg"
          />
        </div>

        {settings.isEnabled && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Warning2 size={16} color="#F97316" />
              <span className="text-sm font-medium text-orange-800">
                Maintenance Mode is Active
              </span>
            </div>
            <p className="text-sm text-orange-700">
              Only administrators with allowed email addresses can access the site.
              All other users will see the maintenance message.
            </p>
          </div>
        )}
      </div>

      {/* Maintenance Configuration */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Setting2 size={20} color="#6B7280" className="mr-2" />
          Maintenance Configuration
        </h3>

        <div className="space-y-6">
          {/* Maintenance Message */}
          <div>
            <Textarea
              label="Maintenance Message"
              placeholder="We're currently performing scheduled maintenance. Please check back soon!"
              value={settings.message}
              onChange={(e) => handleFieldUpdate('message', e.target.value)}
              rows={4}
            />
            <p className="text-sm text-gray-500 mt-1">
              This message will be displayed to users when maintenance mode is enabled
            </p>
          </div>

          {/* Maintenance Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date & Time (Optional)
              </label>
              <input
                type="datetime-local"
                value={formatDateForInput(settings.startDate)}
                onChange={(e) => handleDateChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date & Time (Optional)
              </label>
              <input
                type="datetime-local"
                value={formatDateForInput(settings.endDate)}
                onChange={(e) => handleDateChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <p className="text-sm text-gray-500">
            If dates are specified, maintenance mode will automatically activate/deactivate at these times.
            Leave empty for manual control only.
          </p>
        </div>
      </div>

      {/* Allowed Administrators */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Allowed Administrators
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          These email addresses can access the site even when maintenance mode is enabled
        </p>

        {/* Add New Email */}
        <div className="flex space-x-3 mb-4">
          <div className="flex-1">
            <Input
              placeholder="admin@example.com"
              value={newEmail}
              onChange={(e) => {
                setNewEmail(e.target.value);
                if (emailError) setEmailError('');
              }}
              error={emailError}
            />
          </div>
          <Button
            onClick={handleAddAllowedEmail}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Add size={16} color="white" />
            <span>Add</span>
          </Button>
        </div>

        {/* Existing Emails */}
        <div className="space-y-2">
          {settings.allowedEmails.map((email, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <span className="text-sm text-gray-900">{email}</span>
              <Button
                onClick={() => handleRemoveAllowedEmail(email)}
                className="p-1 text-gray-600 hover:text-red-600"
              >
                <Trash size={16} color="currentColor" />
              </Button>
            </div>
          ))}

          {settings.allowedEmails.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <p className="text-sm">No administrator emails configured</p>
              <p className="text-xs">Add email addresses that should have access during maintenance</p>
            </div>
          )}
        </div>
      </div>

      {/* Preview */}
      {settings.isEnabled && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Maintenance Page Preview
          </h3>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
            <div className="max-w-md mx-auto">
              <Warning2 size={48} color="#F97316" className="mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Site Under Maintenance
              </h2>
              <p className="text-gray-600 mb-6">
                {settings.message || 'We are currently performing scheduled maintenance. Please check back soon!'}
              </p>
              {settings.endDate && (
                <p className="text-sm text-gray-500">
                  Expected to be back online: {new Date(settings.endDate).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceSettingsSection;