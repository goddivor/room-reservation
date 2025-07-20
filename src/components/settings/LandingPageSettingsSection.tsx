/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/settings/LandingPageSettingsSection.tsx
import React, { useState, useRef } from 'react';
import { Home, Star, Add, Edit2, Trash } from 'iconsax-react';
import Button from '../Button';
import { Input } from '../Input';
import { Textarea } from '../forms/Textarea';
import Modal, { type ModalRef } from '../ui/Modal';
import type { LandingPageSettings } from '../../types/settings.types';
import { Upload } from '@phosphor-icons/react';

interface LandingPageSettingsSectionProps {
  settings: LandingPageSettings;
  onUpdate: (settings: Partial<LandingPageSettings>) => void;
}

interface TestimonialFormData {
  name: string;
  avatar: string;
  content: string;
  rating: number;
}

const LandingPageSettingsSection: React.FC<LandingPageSettingsSectionProps> = ({
  settings,
  onUpdate
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<any>(null);
  const testimonialModalRef = useRef<ModalRef>(null);

  const [testimonialFormData, setTestimonialFormData] = useState<TestimonialFormData>({
    name: '',
    avatar: '',
    content: '',
    rating: 5
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle basic field update
  const handleFieldUpdate = (field: keyof LandingPageSettings, value: string | string[]) => {
    onUpdate({
      ...settings,
      [field]: value
    });
  };

  // Handle hero image upload (mock implementation)
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Mock upload - replace with actual upload logic
    const mockImageUrl = URL.createObjectURL(file);
    handleFieldUpdate('heroImage', mockImageUrl);
  };

  // Handle testimonial creation
  const handleCreateTestimonial = () => {
    setEditingTestimonial(null);
    setTestimonialFormData({
      name: '',
      avatar: '',
      content: '',
      rating: 5
    });
    setErrors({});
    testimonialModalRef.current?.open();
  };

  // Handle testimonial edit
  const handleEditTestimonial = (testimonial: any) => {
    setEditingTestimonial(testimonial);
    setTestimonialFormData({
      name: testimonial.name,
      avatar: testimonial.avatar,
      content: testimonial.content,
      rating: testimonial.rating
    });
    setErrors({});
    testimonialModalRef.current?.open();
  };

  // Handle testimonial form input
  const handleTestimonialInputChange = (field: keyof TestimonialFormData, value: any) => {
    setTestimonialFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validate testimonial form
  const validateTestimonialForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!testimonialFormData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!testimonialFormData.content.trim()) {
      newErrors.content = 'Testimonial content is required';
    }

    if (testimonialFormData.rating < 1 || testimonialFormData.rating > 5) {
      newErrors.rating = 'Rating must be between 1 and 5';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle testimonial form submit
  const handleTestimonialFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateTestimonialForm()) return;

    setIsLoading(true);

    try {
      const updatedTestimonials = [...settings.testimonials];

      if (editingTestimonial) {
        // Update existing
        const index = updatedTestimonials.findIndex(t => t.id === editingTestimonial.id);
        if (index !== -1) {
          updatedTestimonials[index] = {
            ...editingTestimonial,
            ...testimonialFormData
          };
        }
      } else {
        // Create new
        const newTestimonial = {
          id: Date.now().toString(),
          ...testimonialFormData
        };
        updatedTestimonials.push(newTestimonial);
      }

      onUpdate({
        ...settings,
        testimonials: updatedTestimonials
      });

      testimonialModalRef.current?.close();
    } catch (error) {
      console.error('Error saving testimonial:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle testimonial delete
  const handleDeleteTestimonial = (testimonialId: string) => {
    const updatedTestimonials = settings.testimonials.filter(t => t.id !== testimonialId);
    onUpdate({
      ...settings,
      testimonials: updatedTestimonials
    });
  };

  // Handle avatar upload for testimonial
  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Mock upload - replace with actual upload logic
    const mockAvatarUrl = URL.createObjectURL(file);
    handleTestimonialInputChange('avatar', mockAvatarUrl);
  };

  // Render star rating
  const renderStarRating = (rating: number, interactive: boolean = false, onChange?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onChange?.(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            disabled={!interactive}
          >
            <Star
              size={16}
              color={star <= rating ? '#FCD34D' : '#D1D5DB'}
              variant={star <= rating ? 'Bold' : 'Outline'}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Home size={20} color="#6B7280" className="mr-2" />
          Hero Section
        </h3>

        <div className="space-y-6">
          <Input
            label="Hero Title"
            placeholder="Welcome to Our Amazing Rooms"
            value={settings.heroTitle}
            onChange={(e) => handleFieldUpdate('heroTitle', e.target.value)}
          />

          <Textarea
            label="Hero Subtitle"
            placeholder="Discover comfort and luxury in our carefully designed spaces..."
            value={settings.heroSubtitle}
            onChange={(e) => handleFieldUpdate('heroSubtitle', e.target.value)}
            rows={3}
          />

          {/* Hero Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hero Background Image
            </label>
            
            {settings.heroImage && (
              <div className="mb-4">
                <img
                  src={settings.heroImage}
                  alt="Hero"
                  className="w-full h-48 object-cover rounded-lg border border-gray-200"
                />
              </div>
            )}

            <div className="flex items-center space-x-3">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                  <Upload size={16} color="#6B7280" />
                  <span className="text-sm text-gray-700">
                    {settings.heroImage ? 'Change Image' : 'Upload Image'}
                  </span>
                </div>
              </label>
              
              {settings.heroImage && (
                <Button
                  onClick={() => handleFieldUpdate('heroImage', '')}
                  className="px-3 py-2 text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Rooms */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Featured Rooms
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Select which rooms to showcase on the homepage
        </p>

        {/* Mock room selection - replace with actual room data */}
        <div className="space-y-2">
          <p className="text-sm text-gray-500">
            Room selection will be implemented when room management is connected.
            Currently showing: {settings.featuredRooms.length} featured rooms
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-600">
              Featured Room IDs: {settings.featuredRooms.join(', ') || 'None'}
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Star size={20} color="#6B7280" className="mr-2" />
            Customer Testimonials
          </h3>
          <Button
            onClick={handleCreateTestimonial}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Add size={16} color="white" />
            <span>Add Testimonial</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {settings.testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-gray-50 rounded-lg border border-gray-200 p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {testimonial.avatar ? (
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 text-sm font-medium">
                        {testimonial.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
                    {renderStarRating(testimonial.rating)}
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Button
                    onClick={() => handleEditTestimonial(testimonial)}
                    className="p-2 text-gray-600 hover:text-blue-600"
                  >
                    <Edit2 size={16} color="currentColor" />
                  </Button>
                  <Button
                    onClick={() => handleDeleteTestimonial(testimonial.id)}
                    className="p-2 text-gray-600 hover:text-red-600"
                  >
                    <Trash size={16} color="currentColor" />
                  </Button>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 italic">"{testimonial.content}"</p>
            </div>
          ))}

          {settings.testimonials.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              <Star size={48} color="#9CA3AF" className="mx-auto mb-2" />
              <p>No testimonials yet</p>
              <p className="text-sm">Add customer reviews to showcase on your homepage</p>
            </div>
          )}
        </div>
      </div>

      {/* Testimonial Form Modal */}
      <Modal
        ref={testimonialModalRef}
        title={editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}
        size="md"
      >
        <form onSubmit={handleTestimonialFormSubmit} className="p-6 space-y-6">
          <Input
            label="Customer Name *"
            placeholder="John Doe"
            value={testimonialFormData.name}
            onChange={(e) => handleTestimonialInputChange('name', e.target.value)}
            error={errors.name}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer Avatar
            </label>
            
            {testimonialFormData.avatar && (
              <div className="mb-3">
                <img
                  src={testimonialFormData.avatar}
                  alt="Avatar"
                  className="w-16 h-16 rounded-full object-cover border border-gray-200"
                />
              </div>
            )}

            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
              <div className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                <Upload size={16} color="#6B7280" />
                <span className="text-sm text-gray-700">
                  {testimonialFormData.avatar ? 'Change Avatar' : 'Upload Avatar'}
                </span>
              </div>
            </label>
          </div>

          <Textarea
            label="Testimonial Content *"
            placeholder="This was an amazing experience! The room was perfect and the service was outstanding..."
            value={testimonialFormData.content}
            onChange={(e) => handleTestimonialInputChange('content', e.target.value)}
            rows={4}
            error={errors.content}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating *
            </label>
            {renderStarRating(
              testimonialFormData.rating, 
              true, 
              (rating) => handleTestimonialInputChange('rating', rating)
            )}
            {errors.rating && (
              <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              onClick={() => testimonialModalRef.current?.close()}
              className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-4 py-2 bg-yellow-600 text-white hover:bg-yellow-700 rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                <span>{editingTestimonial ? 'Update' : 'Create'}</span>
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default LandingPageSettingsSection;