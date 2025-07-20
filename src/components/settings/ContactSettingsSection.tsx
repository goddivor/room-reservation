/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/settings/ContactSettingsSection.tsx
import React, { useState, useRef, type ReactNode } from 'react';
import { 
  Add, 
  Edit2, 
  Trash, 
  Link, 
  Call,
  Facebook,
  Instagram,
  Youtube,
  Whatsapp,
  Send,
  Global
} from 'iconsax-react';
import Button from '../Button';
import { Input } from '../Input';
import { Textarea } from '../forms/Textarea';
import Modal, { type ModalRef } from '../ui/Modal';
import type { ContactSettings, SocialLink } from '../../types/settings.types';
import { LinkedinLogo, TelegramLogo } from '@phosphor-icons/react';

interface ContactSettingsSectionProps {
  settings: ContactSettings;
  onUpdate: (settings: Partial<ContactSettings>) => void;
}

interface SocialLinkFormData {
  platform: string;
  url: string;
  icon: ReactNode;
  isActive: boolean;
  order: number;
}

const SOCIAL_PLATFORMS = [
  { 
    value: 'facebook', 
    label: 'Facebook', 
    icon: <Facebook size={24} color="#1877F2" variant="Bold" />
  },
  { 
    value: 'instagram', 
    label: 'Instagram', 
    icon: <Instagram size={24} color="#E4405F" variant="Bold" />
  },
  { 
    value: 'youtube', 
    label: 'YouTube', 
    icon: <Youtube size={24} color="#FF0000" variant="Bold" />
  },
  { 
    value: 'twitter', 
    label: 'Twitter', 
    icon: <Send size={24} color="#1DA1F2" variant="Bold" />
  },
  { 
    value: 'linkedin', 
    label: 'LinkedIn', 
    icon: <LinkedinLogo size={24} color="#0077B5" weight="fill" />
  },
  { 
    value: 'whatsapp', 
    label: 'WhatsApp', 
    icon: <Whatsapp size={24} color="#25D366" variant="Bold" />
  },
  { 
    value: 'telegram', 
    label: 'Telegram', 
    icon: <TelegramLogo size={24} color="#0088CC" weight="fill" />
  },
  { 
    value: 'website', 
    label: 'Website', 
    icon: <Global size={24} color="#6B7280" variant="Bold" />
  },
];

const ContactSettingsSection: React.FC<ContactSettingsSectionProps> = ({
  settings,
  onUpdate
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [editingSocialLink, setEditingSocialLink] = useState<SocialLink | null>(null);
  const socialModalRef = useRef<ModalRef>(null);

  const [socialFormData, setSocialFormData] = useState<SocialLinkFormData>({
    platform: '',
    url: '',
    icon: <Global size={24} color="#6B7280" variant="Bold" />,
    isActive: true,
    order: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle contact info update
  const handleContactUpdate = (field: keyof ContactSettings, value: string) => {
    onUpdate({
      ...settings,
      [field]: value
    });
  };

  // Handle social link creation
  const handleCreateSocialLink = () => {
    setEditingSocialLink(null);
    setSocialFormData({
      platform: '',
      url: '',
      icon: <Global size={24} color="#6B7280" variant="Bold" />,
      isActive: true,
      order: settings.socialLinks.length
    });
    setErrors({});
    socialModalRef.current?.open();
  };

  // Handle social link edit
  const handleEditSocialLink = (socialLink: SocialLink) => {
    setEditingSocialLink(socialLink);
    setSocialFormData({
      platform: socialLink.platform,
      url: socialLink.url,
      icon: socialLink.icon,
      isActive: socialLink.isActive,
      order: socialLink.order
    });
    setErrors({});
    socialModalRef.current?.open();
  };

  // Handle social link form input
  const handleSocialInputChange = (field: keyof SocialLinkFormData, value: any) => {
    setSocialFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validate social link form
  const validateSocialForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!socialFormData.platform) {
      newErrors.platform = 'Platform is required';
    }

    if (!socialFormData.url) {
      newErrors.url = 'URL is required';
    } else if (!isValidUrl(socialFormData.url)) {
      newErrors.url = 'Please enter a valid URL';
    }

    if (!socialFormData.icon) {
      newErrors.icon = 'Icon is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check if URL is valid
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Handle social link form submit
  const handleSocialFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSocialForm()) return;

    setIsLoading(true);

    try {
      const updatedSocialLinks = [...settings.socialLinks];

      if (editingSocialLink) {
        // Update existing
        const index = updatedSocialLinks.findIndex(link => link.id === editingSocialLink.id);
        if (index !== -1) {
          updatedSocialLinks[index] = {
            ...editingSocialLink,
            ...socialFormData
          };
        }
      } else {
        // Create new
        const newSocialLink: SocialLink = {
          id: Date.now().toString(),
          ...socialFormData
        };
        updatedSocialLinks.push(newSocialLink);
      }

      onUpdate({
        ...settings,
        socialLinks: updatedSocialLinks
      });

      socialModalRef.current?.close();
    } catch (error) {
      console.error('Error saving social link:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle social link delete
  const handleDeleteSocialLink = (linkId: string) => {
    const updatedSocialLinks = settings.socialLinks.filter(link => link.id !== linkId);
    onUpdate({
      ...settings,
      socialLinks: updatedSocialLinks
    });
  };

  // Handle social link toggle
  const handleToggleSocialLink = (linkId: string) => {
    const updatedSocialLinks = settings.socialLinks.map(link =>
      link.id === linkId ? { ...link, isActive: !link.isActive } : link
    );
    onUpdate({
      ...settings,
      socialLinks: updatedSocialLinks
    });
  };

  // Get platform info
  const getPlatformInfo = (platform: string) => {
    return SOCIAL_PLATFORMS.find(p => p.value === platform) || SOCIAL_PLATFORMS[7];
  };

  return (
    <div className="space-y-8">
      {/* Basic Contact Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Call size={20} color="#6B7280" className="mr-2" />
          Basic Contact Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Phone Number"
            placeholder="+33 1 23 45 67 89"
            value={settings.phone}
            onChange={(e) => handleContactUpdate('phone', e.target.value)}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="contact@example.com"
            value={settings.email}
            onChange={(e) => handleContactUpdate('email', e.target.value)}
          />
        </div>

        <div className="mt-4">
          <Textarea
            label="Physical Address"
            placeholder="123 Street Name, City, Country"
            value={settings.address}
            onChange={(e) => handleContactUpdate('address', e.target.value)}
            rows={3}
          />
        </div>

        <div className="mt-4">
          <Input
            label="Map URL (Google Maps, OpenStreetMap, etc.)"
            placeholder="https://maps.google.com/..."
            value={settings.mapUrl}
            onChange={(e) => handleContactUpdate('mapUrl', e.target.value)}
          />
          <p className="text-sm text-gray-500 mt-1">
            This URL will be used for the map on the contact page
          </p>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Link size={20} color="#6B7280" className="mr-2" />
            Social Links
          </h3>
          <Button
            onClick={handleCreateSocialLink}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Add size={16} color="white" />
            <span>Add Social Link</span>
          </Button>
        </div>

        <div className="space-y-3">
          {settings.socialLinks.map((link) => {
            const platform = getPlatformInfo(link.platform);
            return (
              <div
                key={link.id}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  link.isActive ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {link.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{platform.label}</h4>
                    <p className="text-sm text-gray-600 truncate max-w-xs">{link.url}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => handleToggleSocialLink(link.id)}
                    className={`px-3 py-1 text-xs rounded-full ${
                      link.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {link.isActive ? 'Active' : 'Inactive'}
                  </Button>
                  <Button
                    onClick={() => handleEditSocialLink(link)}
                    className="p-2 text-gray-600 hover:text-blue-600"
                  >
                    <Edit2 size={16} color="currentColor" />
                  </Button>
                  <Button
                    onClick={() => handleDeleteSocialLink(link.id)}
                    className="p-2 text-gray-600 hover:text-red-600"
                  >
                    <Trash size={16} color="currentColor" />
                  </Button>
                </div>
              </div>
            );
          })}

          {settings.socialLinks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Link size={48} color="#9CA3AF" className="mx-auto mb-2" />
              <p>No social links configured yet</p>
              <p className="text-sm">Add your first social media link to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Social Link Form Modal */}
      <Modal
        ref={socialModalRef}
        title={editingSocialLink ? 'Edit Social Link' : 'Add Social Link'}
        size="md"
      >
        <form onSubmit={handleSocialFormSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Platform *</label>
            <div className="grid grid-cols-4 gap-2">
              {SOCIAL_PLATFORMS.map((platform) => (
                <button
                  key={platform.value}
                  type="button"
                  onClick={() => {
                    handleSocialInputChange('platform', platform.value);
                    handleSocialInputChange('icon', platform.icon);
                  }}
                  className={`p-3 rounded-lg border text-center transition-colors ${
                    socialFormData.platform === platform.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-center mb-1">
                    {platform.icon}
                  </div>
                  <div className="text-xs text-gray-600">{platform.label}</div>
                </button>
              ))}
            </div>
            {errors.platform && (
              <p className="text-red-500 text-sm mt-1">{errors.platform}</p>
            )}
          </div>

          <Input
            label="URL *"
            placeholder="https://..."
            value={socialFormData.url}
            onChange={(e) => handleSocialInputChange('url', e.target.value)}
            error={errors.url}
          />

          {/* Preview de l'icône sélectionnée */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Selected Icon</label>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border">
              {socialFormData.icon}
              <span className="text-sm text-gray-600">
                {SOCIAL_PLATFORMS.find(p => p.value === socialFormData.platform)?.label || 'Custom Icon'}
              </span>
            </div>
          </div>

          <div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={socialFormData.isActive}
                onChange={(e) => handleSocialInputChange('isActive', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Active</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              onClick={() => socialModalRef.current?.close()}
              className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                <span>{editingSocialLink ? 'Update' : 'Create'}</span>
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ContactSettingsSection;