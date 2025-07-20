/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/settings/EmailSettingsSection.tsx
import React, { useState } from 'react';
import { Sms, Send, Eye, EyeSlash, DocumentText } from 'iconsax-react';
import Button from '../Button';
import { Input } from '../Input';
import { Textarea } from '../forms/Textarea';
import { Switch } from '../actions/switch';
import type { EmailSettings } from '../../types/settings.types';

interface EmailSettingsSectionProps {
  settings: EmailSettings;
  onUpdate: (settings: Partial<EmailSettings>) => void;
}

const EmailSettingsSection: React.FC<EmailSettingsSectionProps> = ({
  settings,
  onUpdate
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [testEmailStatus, setTestEmailStatus] = useState<'success' | 'error' | null>(null);

  // Handle field update
  const handleFieldUpdate = (field: keyof EmailSettings, value: string | number | boolean) => {
    onUpdate({
      ...settings,
      [field]: value
    });
  };

  // Handle template update
  const handleTemplateUpdate = (template: keyof EmailSettings['templates'], value: string) => {
    onUpdate({
      ...settings,
      templates: {
        ...settings.templates,
        [template]: value
      }
    });
  };

  // Test email configuration
  const handleTestEmail = async () => {
    if (!testEmail || !isValidEmail(testEmail)) {
      setTestEmailStatus('error');
      return;
    }

    setIsTestingEmail(true);
    setTestEmailStatus(null);

    try {
      // Simulate email test - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock success/failure
      const success = Math.random() > 0.3; // 70% success rate
      
      if (success) {
        setTestEmailStatus('success');
      } else {
        setTestEmailStatus('error');
      }
    } catch (error) {
      setTestEmailStatus('error');
    } finally {
      setIsTestingEmail(false);
    }
  };

  // Validate email format
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Default email templates
  const getDefaultTemplate = (type: keyof EmailSettings['templates']): string => {
    const templates = {
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
    };
    
    return templates[type];
  };

  return (
    <div className="space-y-8">
      {/* Email Service Status */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${settings.isEnabled ? 'bg-green-100' : 'bg-gray-100'}`}>
              <Sms size={20} color={settings.isEnabled ? '#059669' : '#6B7280'} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Email Service</h3>
              <p className="text-sm text-gray-600">
                {settings.isEnabled 
                  ? 'Email notifications are enabled' 
                  : 'Email notifications are disabled'
                }
              </p>
            </div>
          </div>
          <Switch
            checked={settings.isEnabled}
            onChange={(enabled) => handleFieldUpdate('isEnabled', enabled)}
            size="lg"
          />
        </div>

        {!settings.isEnabled && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              Email notifications are disabled. Configure SMTP settings and enable to start sending emails.
            </p>
          </div>
        )}
      </div>

      {/* SMTP Configuration */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Send size={20} color="#6B7280" className="mr-2" />
          SMTP Configuration
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="SMTP Host *"
            placeholder="smtp.gmail.com"
            value={settings.smtpHost}
            onChange={(e) => handleFieldUpdate('smtpHost', e.target.value)}
          />

          <Input
            label="SMTP Port *"
            type="number"
            placeholder="587"
            value={settings.smtpPort.toString()}
            onChange={(e) => handleFieldUpdate('smtpPort', parseInt(e.target.value) || 587)}
          />

          <Input
            label="SMTP Username *"
            placeholder="your-email@gmail.com"
            value={settings.smtpUser}
            onChange={(e) => handleFieldUpdate('smtpUser', e.target.value)}
          />

          <div className="relative">
            <Input
              label="SMTP Password *"
              type={showPassword ? 'text' : 'password'}
              placeholder="your-app-password"
              value={settings.smtpPassword}
              onChange={(e) => handleFieldUpdate('smtpPassword', e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeSlash size={16} color="currentColor" /> : <Eye size={16} color="currentColor" />}
            </button>
          </div>

          <Input
            label="From Email *"
            type="email"
            placeholder="noreply@yourdomain.com"
            value={settings.fromEmail}
            onChange={(e) => handleFieldUpdate('fromEmail', e.target.value)}
          />

          <Input
            label="From Name *"
            placeholder="Your Business Name"
            value={settings.fromName}
            onChange={(e) => handleFieldUpdate('fromName', e.target.value)}
          />
        </div>

        {/* Test Email */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Test Email Configuration</h4>
          <div className="flex space-x-3">
            <div className="flex-1">
              <Input
                placeholder="test@example.com"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
              />
            </div>
            <Button
              onClick={handleTestEmail}
              disabled={isTestingEmail || !testEmail}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              {isTestingEmail ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Testing...</span>
                </>
              ) : (
                <>
                  <Send size={16} color="white" />
                  <span>Send Test</span>
                </>
              )}
            </Button>
          </div>
          
          {testEmailStatus && (
            <div className={`mt-3 p-3 rounded-lg ${
              testEmailStatus === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {testEmailStatus === 'success' 
                ? '✅ Test email sent successfully!'
                : '❌ Failed to send test email. Please check your SMTP settings.'
              }
            </div>
          )}
        </div>
      </div>

      {/* Email Templates */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <DocumentText size={20} color="#6B7280" className="mr-2" />
          Email Templates
        </h3>

        <div className="space-y-6">
          {/* Available Variables */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Available Variables</h4>
            <p className="text-sm text-blue-800 mb-2">
              You can use these variables in your templates:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-blue-700">
              <span>{'{{customerName}}'}</span>
              <span>{'{{roomName}}'}</span>
              <span>{'{{checkInDate}}'}</span>
              <span>{'{{checkOutDate}}'}</span>
              <span>{'{{totalAmount}}'}</span>
              <span>{'{{reservationId}}'}</span>
              <span>{'{{businessName}}'}</span>
              <span>{'{{daysUntilCheckIn}}'}</span>
            </div>
          </div>

          {/* Confirmation Template */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Reservation Confirmation Template
              </label>
              <Button
                onClick={() => handleTemplateUpdate('confirmation', getDefaultTemplate('confirmation'))}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Reset to Default
              </Button>
            </div>
            <Textarea
              placeholder="Enter confirmation email template..."
              value={settings.templates.confirmation}
              onChange={(e) => handleTemplateUpdate('confirmation', e.target.value)}
              rows={8}
            />
          </div>

          {/* Cancellation Template */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Reservation Cancellation Template
              </label>
              <Button
                onClick={() => handleTemplateUpdate('cancellation', getDefaultTemplate('cancellation'))}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Reset to Default
              </Button>
            </div>
            <Textarea
              placeholder="Enter cancellation email template..."
              value={settings.templates.cancellation}
              onChange={(e) => handleTemplateUpdate('cancellation', e.target.value)}
              rows={8}
            />
          </div>

          {/* Reminder Template */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Reservation Reminder Template
              </label>
              <Button
                onClick={() => handleTemplateUpdate('reminder', getDefaultTemplate('reminder'))}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Reset to Default
              </Button>
            </div>
            <Textarea
              placeholder="Enter reminder email template..."
              value={settings.templates.reminder}
              onChange={(e) => handleTemplateUpdate('reminder', e.target.value)}
              rows={8}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailSettingsSection;