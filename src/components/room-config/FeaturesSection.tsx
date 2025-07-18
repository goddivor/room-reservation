/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/room-config/FeaturesSection.tsx
import React, { useState, useRef } from 'react';
import { Add, Edit, Trash, Star1, TickCircle } from 'iconsax-react';
import Button from '@/components/Button';
import { Input } from '@/components/Input';
import { Textarea } from '@/components/forms/Textarea';
import { CustomSelect } from '@/components/forms/custom-select';
import Modal, { type ModalRef } from '@/components/ui/Modal';
import ConfirmationModal from '@/components/modals/confirmation-modal';
import { useToast } from '@/context/toast-context';
import type { RoomFeature, FeatureFormData } from '@/types/room-config.types';
import type { ModalRef as ConfirmModalRef } from '@/types/modal-ref';

interface FeaturesSectionProps {
  features: RoomFeature[];
  onFeaturesChange: (features: RoomFeature[]) => void;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  features,
  onFeaturesChange
}) => {
  const toast = useToast();
  const formModalRef = useRef<ModalRef>(null);
  const deleteModalRef = useRef<ConfirmModalRef>(null);
  
  const [editingFeature, setEditingFeature] = useState<RoomFeature | null>(null);
  const [featureToDelete, setFeatureToDelete] = useState<RoomFeature | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  const [formData, setFormData] = useState<FeatureFormData>({
    name: '',
    description: '',
    icon: '⭐',
    category: 'basic',
    isActive: true
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FeatureFormData, string>>>({});

  // Categories for features
  const categories = [
    { value: 'basic', label: 'Basic', color: '#3B82F6' },
    { value: 'comfort', label: 'Comfort', color: '#10B981' },
    { value: 'technology', label: 'Technology', color: '#8B5CF6' },
    { value: 'safety', label: 'Safety', color: '#EF4444' },
    { value: 'accessibility', label: 'Accessibility', color: '#F59E0B' }
  ];

  // Common feature icons
  const iconOptions = [
    '⭐', '🌟', '💎', '🏠', '🛏️', '🚿', '🍳', '📶', '❄️', '🔥', 
    '🌅', '🔒', '🚨', '♿', '📺', '☕', '🧊', '🧽', '💻', '💨'
  ];

  // Filter features by category
  const filteredFeatures = filterCategory === 'all' 
    ? features 
    : features.filter(feature => feature.category === filterCategory);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      icon: '⭐',
      category: 'basic',
      isActive: true
    });
    setErrors({});
    setEditingFeature(null);
  };

  const handleCreate = () => {
    resetForm();
    formModalRef.current?.open();
  };

  const handleEdit = (feature: RoomFeature) => {
    setFormData({
      name: feature.name,
      description: feature.description || '',
      icon: feature.icon,
      category: feature.category,
      isActive: feature.isActive
    });
    setEditingFeature(feature);
    setErrors({});
    formModalRef.current?.open();
  };

  const handleDelete = (feature: RoomFeature) => {
    setFeatureToDelete(feature);
    deleteModalRef.current?.open();
  };

  const handleToggleStatus = (feature: RoomFeature) => {
    const updatedFeatures = features.map(feat =>
      feat.id === feature.id 
        ? { ...feat, isActive: !feat.isActive, updatedAt: new Date().toISOString() }
        : feat
    );
    onFeaturesChange(updatedFeatures);
    
    toast.success(
      'Status Updated',
      `Feature "${feature.name}" is now ${!feature.isActive ? 'active' : 'inactive'}`
    );
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FeatureFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (features.some(feat => 
      feat.name.toLowerCase() === formData.name.toLowerCase() && 
      feat.id !== editingFeature?.id
    )) {
      newErrors.name = 'This name already exists';
    }

    if (!formData.icon) {
      newErrors.icon = 'Icon is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (editingFeature) {
        // Update existing feature
        const updatedFeatures = features.map(feat =>
          feat.id === editingFeature.id
            ? {
                ...feat,
                ...formData,
                updatedAt: new Date().toISOString()
              }
            : feat
        );
        onFeaturesChange(updatedFeatures);
        
        toast.success(
          'Feature Updated',
          `"${formData.name}" has been successfully updated`
        );
      } else {
        // Create new feature
        const newFeature: RoomFeature = {
          id: `feature_${Date.now()}`,
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        onFeaturesChange([...features, newFeature]);
        
        toast.success(
          'Feature Created',
          `"${formData.name}" has been successfully created`
        );
      }

      formModalRef.current?.close();
      resetForm();
    } catch (error) {
      toast.error('Error', 'Failed to save feature');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = () => {
    if (featureToDelete) {
      const updatedFeatures = features.filter(feat => feat.id !== featureToDelete.id);
      onFeaturesChange(updatedFeatures);
      
      toast.success(
        'Feature Deleted',
        `"${featureToDelete.name}" has been successfully deleted`
      );
      
      setFeatureToDelete(null);
    }
  };

  const handleInputChange = (field: keyof FeatureFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const getCategoryInfo = (category: string) => {
    return categories.find(cat => cat.value === category) || categories[0];
  };

  const getCategoryColor = (category: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const categoryInfo = getCategoryInfo(category);
    switch (category) {
      case 'basic':
        return 'bg-blue-100 text-blue-800';
      case 'comfort':
        return 'bg-green-100 text-green-800';
      case 'technology':
        return 'bg-purple-100 text-purple-800';
      case 'safety':
        return 'bg-red-100 text-red-800';
      case 'accessibility':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const categoryOptions = [
    { label: 'All Categories', value: 'all' },
    ...categories.map(cat => ({ label: cat.label, value: cat.value }))
  ];

  const formCategoryOptions = categories.map(cat => ({ 
    label: cat.label, 
    value: cat.value 
  }));

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Room Features</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage amenities and features available in rooms
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Add size={16} color="white" />
          <span>Add Feature</span>
        </Button>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filter by category:</label>
          <CustomSelect
            options={categoryOptions}
            value={filterCategory}
            onChange={(value) => setFilterCategory(value || 'all')}
            placeholder="Select category"
          />
          <span className="text-sm text-gray-500">
            ({filteredFeatures.length} feature{filteredFeatures.length !== 1 ? 's' : ''})
          </span>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFeatures.map((feature) => (
          <div
            key={feature.id}
            className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{feature.icon}</div>
                <div>
                  <h3 className="font-medium text-gray-900">{feature.name}</h3>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${getCategoryColor(feature.category)}`}>
                    {getCategoryInfo(feature.category).label}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                {feature.isActive ? (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Active
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    Inactive
                  </span>
                )}
              </div>
            </div>

            {feature.description && (
              <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
            )}

            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                Created: {new Date(feature.createdAt).toLocaleDateString()}
              </div>

              <div className="flex items-center space-x-1">
                <Button
                  onClick={() => handleToggleStatus(feature)}
                  className={`p-2 rounded-lg ${
                    feature.isActive
                      ? 'text-yellow-600 hover:bg-yellow-50'
                      : 'text-green-600 hover:bg-green-50'
                  }`}
                  title={feature.isActive ? 'Deactivate' : 'Activate'}
                >
                  <TickCircle size={14} color="currentColor" />
                </Button>

                <Button
                  onClick={() => handleEdit(feature)}
                  className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg"
                  title="Edit"
                >
                  <Edit size={14} color="currentColor" />
                </Button>

                <Button
                  onClick={() => handleDelete(feature)}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                  title="Delete"
                >
                  <Trash size={14} color="currentColor" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredFeatures.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Star1 size={48} color="#9CA3AF" className="mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">
            {filterCategory === 'all' ? 'No features found' : `No ${filterCategory} features found`}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {filterCategory === 'all' 
              ? 'Create your first feature to get started.'
              : `Try selecting a different category or create a new ${filterCategory} feature.`
            }
          </p>
          <Button
            onClick={handleCreate}
            className="mt-4 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg"
          >
            <Add size={16} color="white" />
            <span className="ml-2">Add Feature</span>
          </Button>
        </div>
      )}

      {/* Form Modal */}
      <Modal
        ref={formModalRef}
        title={editingFeature ? 'Edit Feature' : 'Create Feature'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <Input
            label="Name *"
            placeholder="e.g., WiFi, Balcony, Kitchen"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={errors.name}
          />

          <Textarea
            label="Description"
            placeholder="Optional description of this feature..."
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
          />

          <CustomSelect
            label="Category *"
            options={formCategoryOptions}
            value={formData.category}
            onChange={(value) => handleInputChange('category', value)}
            placeholder="Select category"
          />

          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Icon *
            </label>
            <div className="grid grid-cols-10 gap-2">
              {iconOptions.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => handleInputChange('icon', icon)}
                  className={`p-2 rounded-lg border-2 transition-all text-lg ${
                    formData.icon === icon
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
            {errors.icon && (
              <p className="text-red-500 text-sm mt-1">{errors.icon}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
              />
              <span className="text-sm text-gray-700">
                Active (available for use)
              </span>
            </label>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{formData.icon}</div>
              <div>
                <h4 className="font-medium text-gray-900">
                  {formData.name || 'Feature Name'}
                </h4>
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${getCategoryColor(formData.category)}`}>
                  {getCategoryInfo(formData.category).label}
                </span>
                {formData.description && (
                  <p className="text-sm text-gray-600 mt-1">{formData.description}</p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              onClick={() => formModalRef.current?.close()}
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
                <span>{editingFeature ? 'Update' : 'Create'}</span>
              )}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        ref={deleteModalRef}
        title="Delete Feature"
        message={`Are you sure you want to delete "${featureToDelete?.name}"?`}
        description="This action cannot be undone. Rooms using this feature will have it removed."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={confirmDelete}
        onCancel={() => setFeatureToDelete(null)}
      />
    </div>
  );
};

export default FeaturesSection;