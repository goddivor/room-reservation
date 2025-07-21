/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/room-config/RoomTypesSection.tsx
import React, { useState, useRef } from 'react';
import { Add, Edit, Trash, Buildings2, TickCircle, Gallery } from 'iconsax-react';
import Button from '@/components/Button';
import { Input } from '@/components/Input';
import { Textarea } from '@/components/forms/Textarea';
import Modal, { type ModalRef } from '@/components/ui/Modal';
import ConfirmationModal from '@/components/modals/confirmation-modal';
import ImageManagementModal from '@/components/room-config/ImageManagementModal';
import { useToast } from '@/context/toast-context';
import type { RoomTypeConfig, RoomTypeFormData } from '@/types/room-config.types';
import type { ModalRef as ConfirmModalRef } from '@/types/modal-ref';

interface RoomTypesSectionProps {
  roomTypes: RoomTypeConfig[];
  onRoomTypesChange: (roomTypes: RoomTypeConfig[]) => void;
}

const RoomTypesSection: React.FC<RoomTypesSectionProps> = ({
  roomTypes,
  onRoomTypesChange
}) => {
  const toast = useToast();
  const formModalRef = useRef<ModalRef>(null);
  const deleteModalRef = useRef<ConfirmModalRef>(null);
  const imageModalRef = useRef<ModalRef>(null);
  
  const [editingType, setEditingType] = useState<RoomTypeConfig | null>(null);
  const [typeToDelete, setTypeToDelete] = useState<RoomTypeConfig | null>(null);
  const [typeForImages, setTypeForImages] = useState<RoomTypeConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<RoomTypeFormData>({
    name: '',
    description: '',
    color: '#3B82F6',
    icon: '🏠',
    isActive: true
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RoomTypeFormData, string>>>({});

  // Predefined color options
  const colorOptions = [
    { value: '#3B82F6', label: 'Blue' },
    { value: '#10B981', label: 'Green' },
    { value: '#F59E0B', label: 'Yellow' },
    { value: '#EF4444', label: 'Red' },
    { value: '#8B5CF6', label: 'Purple' },
    { value: '#06B6D4', label: 'Cyan' },
    { value: '#84CC16', label: 'Lime' },
    { value: '#F97316', label: 'Orange' },
  ];

  // Common room type icons
  const iconOptions = ['🏠', '🛏️', '🛋️', '🏡', '🏘️', '🏢', '🏨', '🏬', '🏭', '🏪'];

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      color: '#3B82F6',
      icon: '🏠',
      isActive: true
    });
    setErrors({});
    setEditingType(null);
  };

  const handleCreate = () => {
    resetForm();
    formModalRef.current?.open();
  };

  const handleEdit = (roomType: RoomTypeConfig) => {
    setFormData({
      name: roomType.name,
      description: roomType.description,
      color: roomType.color,
      icon: roomType.icon,
      isActive: roomType.isActive
    });
    setEditingType(roomType);
    setErrors({});
    formModalRef.current?.open();
  };

  const handleDelete = (roomType: RoomTypeConfig) => {
    setTypeToDelete(roomType);
    deleteModalRef.current?.open();
  };

  const handleManageImages = (roomType: RoomTypeConfig) => {
    setTypeForImages(roomType);
    imageModalRef.current?.open();
  };

  const handleToggleStatus = (roomType: RoomTypeConfig) => {
    const updatedTypes = roomTypes.map(type =>
      type.id === roomType.id 
        ? { ...type, isActive: !type.isActive, updatedAt: new Date().toISOString() }
        : type
    );
    onRoomTypesChange(updatedTypes);
    
    toast.success(
      'Status Updated',
      `Room type "${roomType.name}" is now ${!roomType.isActive ? 'active' : 'inactive'}`
    );
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof RoomTypeFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (roomTypes.some(type => 
      type.name.toLowerCase() === formData.name.toLowerCase() && 
      type.id !== editingType?.id
    )) {
      newErrors.name = 'This name already exists';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.color) {
      newErrors.color = 'Color is required';
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

      if (editingType) {
        // Update existing type
        const updatedTypes = roomTypes.map(type =>
          type.id === editingType.id
            ? {
                ...type,
                ...formData,
                updatedAt: new Date().toISOString()
              }
            : type
        );
        onRoomTypesChange(updatedTypes);
        
        toast.success(
          'Room Type Updated',
          `"${formData.name}" has been successfully updated`
        );
      } else {
        // Create new type
        const newType: RoomTypeConfig = {
          id: `room_type_${Date.now()}`,
          ...formData,
          images: [], // Initialize with empty images array
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        onRoomTypesChange([...roomTypes, newType]);
        
        toast.success(
          'Room Type Created',
          `"${formData.name}" has been successfully created`
        );
      }

      formModalRef.current?.close();
      resetForm();
    } catch (error) {
      toast.error('Error', 'Failed to save room type');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = () => {
    if (typeToDelete) {
      const updatedTypes = roomTypes.filter(type => type.id !== typeToDelete.id);
      onRoomTypesChange(updatedTypes);
      
      toast.success(
        'Room Type Deleted',
        `"${typeToDelete.name}" has been successfully deleted`
      );
      
      setTypeToDelete(null);
    }
  };

  const handleInputChange = (field: keyof RoomTypeFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleImagesUpdate = (roomTypeId: string, images: string[]) => {
    const updatedTypes = roomTypes.map(type =>
      type.id === roomTypeId
        ? { ...type, images, updatedAt: new Date().toISOString() }
        : type
    );
    onRoomTypesChange(updatedTypes);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Room Types</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage different types of rooms available for booking
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Add size={16} color="white" />
          <span>Add Room Type</span>
        </Button>
      </div>

      {/* Room Types List */}
      <div className="space-y-4">
        {roomTypes.map((roomType) => (
          <div
            key={roomType.id}
            className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-xl"
                  style={{ backgroundColor: `${roomType.color}20` }}
                >
                  {roomType.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-medium text-gray-900">{roomType.name}</h3>
                    <div
                      className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: roomType.color }}
                    />
                    {roomType.isActive ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        Inactive
                      </span>
                    )}
                    {roomType.images && roomType.images.length > 0 && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {roomType.images.length} image{roomType.images.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{roomType.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Created: {new Date(roomType.createdAt).toLocaleDateString()}
                    {roomType.updatedAt !== roomType.createdAt && (
                      <span> • Updated: {new Date(roomType.updatedAt).toLocaleDateString()}</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => handleManageImages(roomType)}
                  className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg"
                  title="Manage Images"
                >
                  <Gallery size={16} color="currentColor" />
                </Button>

                <Button
                  onClick={() => handleToggleStatus(roomType)}
                  className={`p-2 rounded-lg ${
                    roomType.isActive
                      ? 'text-yellow-600 hover:bg-yellow-50'
                      : 'text-green-600 hover:bg-green-50'
                  }`}
                  title={roomType.isActive ? 'Deactivate' : 'Activate'}
                >
                  <TickCircle size={16} color="currentColor" />
                </Button>

                <Button
                  onClick={() => handleEdit(roomType)}
                  className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg"
                  title="Edit"
                >
                  <Edit size={16} color="currentColor" />
                </Button>

                <Button
                  onClick={() => handleDelete(roomType)}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                  title="Delete"
                >
                  <Trash size={16} color="currentColor" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {roomTypes.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Buildings2 size={48} color="#9CA3AF" className="mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No room types found</h3>
            <p className="text-sm text-gray-500 mt-1">
              Create your first room type to get started.
            </p>
            <Button
              onClick={handleCreate}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              <Add size={16} color="white" />
              <span className="ml-2">Add Room Type</span>
            </Button>
          </div>
        )}
      </div>

      {/* Form Modal */}
      <Modal
        ref={formModalRef}
        title={editingType ? 'Edit Room Type' : 'Create Room Type'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <Input
            label="Name *"
            placeholder="e.g., Studio, Deluxe Suite"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={errors.name}
          />

          <Textarea
            label="Description *"
            placeholder="Describe this room type..."
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            error={errors.description}
            rows={3}
          />

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Color *
            </label>
            <div className="grid grid-cols-4 gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => handleInputChange('color', color.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.color === color.value
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div
                    className="w-6 h-6 rounded-full mx-auto"
                    style={{ backgroundColor: color.value }}
                  />
                  <span className="text-xs text-gray-600 mt-1 block">{color.label}</span>
                </button>
              ))}
            </div>
            {errors.color && (
              <p className="text-red-500 text-sm mt-1">{errors.color}</p>
            )}
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Icon *
            </label>
            <div className="grid grid-cols-5 gap-3">
              {iconOptions.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => handleInputChange('icon', icon)}
                  className={`p-3 rounded-lg border-2 transition-all text-xl ${
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
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                style={{ backgroundColor: `${formData.color}20` }}
              >
                {formData.icon}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">
                  {formData.name || 'Room Type Name'}
                </h4>
                <p className="text-sm text-gray-600">
                  {formData.description || 'Room type description'}
                </p>
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
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                <span>{editingType ? 'Update' : 'Create'}</span>
              )}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Image Management Modal */}
      <ImageManagementModal
        ref={imageModalRef}
        roomType={typeForImages}
        onImagesUpdate={handleImagesUpdate}
        onClose={() => setTypeForImages(null)}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        ref={deleteModalRef}
        title="Delete Room Type"
        message={`Are you sure you want to delete "${typeToDelete?.name}"?`}
        description="This action cannot be undone. Rooms using this type will need to be reassigned."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={confirmDelete}
        onCancel={() => setTypeToDelete(null)}
      />
    </div>
  );
};

export default RoomTypesSection;