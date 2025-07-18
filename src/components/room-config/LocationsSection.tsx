/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/room-config/LocationsSection.tsx
import React, { useState, useRef } from 'react';
import { Add, Edit, Trash, Location, Buildings, ArrowUp, ArrowDown, TickCircle } from 'iconsax-react';
import Button from '@/components/Button';
import { Input } from '@/components/Input';
import { Textarea } from '@/components/forms/Textarea';
import { CustomSelect } from '@/components/forms/custom-select';
import Modal, { type ModalRef } from '@/components/ui/Modal';
import ConfirmationModal from '@/components/modals/confirmation-modal';
import { useToast } from '@/context/toast-context';
import type { LocationConfig, LocationFormData } from '@/types/room-config.types';
import type { ModalRef as ConfirmModalRef } from '@/types/modal-ref';

interface LocationsSectionProps {
  locations: LocationConfig[];
  onLocationsChange: (locations: LocationConfig[]) => void;
}

const LocationsSection: React.FC<LocationsSectionProps> = ({
  locations,
  onLocationsChange
}) => {
  const toast = useToast();
  const formModalRef = useRef<ModalRef>(null);
  const deleteModalRef = useRef<ConfirmModalRef>(null);
  
  const [editingLocation, setEditingLocation] = useState<LocationConfig | null>(null);
  const [locationToDelete, setLocationToDelete] = useState<LocationConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'floor' | 'building' | 'section'>('floor');
  
  const [formData, setFormData] = useState<LocationFormData>({
    type: 'floor',
    name: '',
    label: '',
    description: '',
    order: 0,
    isActive: true,
    parentId: undefined
  });

  const [errors, setErrors] = useState<Partial<Record<keyof LocationFormData, string>>>({});

  // Filter locations by type
  const getLocationsByType = (type: 'floor' | 'building' | 'section') => {
    return locations
      .filter(loc => loc.type === type)
      .sort((a, b) => a.order - b.order);
  };

  // Get buildings for section parent selection
  const buildings = locations.filter(loc => loc.type === 'building');

  const resetForm = () => {
    setFormData({
      type: activeTab,
      name: '',
      label: '',
      description: '',
      order: getLocationsByType(activeTab).length,
      isActive: true,
      parentId: undefined
    });
    setErrors({});
    setEditingLocation(null);
  };

  const handleCreate = () => {
    resetForm();
    formModalRef.current?.open();
  };

  const handleEdit = (location: LocationConfig) => {
    setFormData({
      type: location.type,
      name: location.name,
      label: location.label,
      description: location.description || '',
      order: location.order,
      isActive: location.isActive,
      parentId: location.parentId
    });
    setEditingLocation(location);
    setErrors({});
    formModalRef.current?.open();
  };

  const handleDelete = (location: LocationConfig) => {
    setLocationToDelete(location);
    deleteModalRef.current?.open();
  };

  const handleToggleStatus = (location: LocationConfig) => {
    const updatedLocations = locations.map(loc =>
      loc.id === location.id 
        ? { ...loc, isActive: !loc.isActive, updatedAt: new Date().toISOString() }
        : loc
    );
    onLocationsChange(updatedLocations);
    
    toast.success(
      'Status Updated',
      `${location.label} is now ${!location.isActive ? 'active' : 'inactive'}`
    );
  };

  const handleReorder = (location: LocationConfig, direction: 'up' | 'down') => {
    const sameTypeLocations = getLocationsByType(location.type);
    const currentIndex = sameTypeLocations.findIndex(loc => loc.id === location.id);
    
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === sameTypeLocations.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const swapLocation = sameTypeLocations[newIndex];

    const updatedLocations = locations.map(loc => {
      if (loc.id === location.id) {
        return { ...loc, order: swapLocation.order, updatedAt: new Date().toISOString() };
      }
      if (loc.id === swapLocation.id) {
        return { ...loc, order: location.order, updatedAt: new Date().toISOString() };
      }
      return loc;
    });

    onLocationsChange(updatedLocations);
    
    toast.success(
      'Order Updated',
      `${location.label} moved ${direction}`
    );
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof LocationFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (locations.some(loc => 
      loc.name.toLowerCase() === formData.name.toLowerCase() && 
      loc.type === formData.type &&
      loc.id !== editingLocation?.id
    )) {
      newErrors.name = 'This name already exists for this type';
    }

    if (!formData.label.trim()) {
      newErrors.label = 'Label is required';
    }

    if (formData.order < 0) {
      newErrors.order = 'Order must be 0 or greater';
    }

    if (formData.type === 'section' && !formData.parentId) {
      newErrors.parentId = 'Parent building is required for sections';
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

      if (editingLocation) {
        // Update existing location
        const updatedLocations = locations.map(loc =>
          loc.id === editingLocation.id
            ? {
                ...loc,
                ...formData,
                updatedAt: new Date().toISOString()
              }
            : loc
        );
        onLocationsChange(updatedLocations);
        
        toast.success(
          'Location Updated',
          `"${formData.label}" has been successfully updated`
        );
      } else {
        // Create new location
        const newLocation: LocationConfig = {
          id: `${formData.type}_${Date.now()}`,
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        onLocationsChange([...locations, newLocation]);
        
        toast.success(
          'Location Created',
          `"${formData.label}" has been successfully created`
        );
      }

      formModalRef.current?.close();
      resetForm();
    } catch (error) {
      toast.error('Error', 'Failed to save location');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = () => {
    if (locationToDelete) {
      // Check if location has children (for buildings with sections)
      const hasChildren = locations.some(loc => loc.parentId === locationToDelete.id);
      
      if (hasChildren) {
        toast.error(
          'Cannot Delete',
          `Cannot delete "${locationToDelete.label}" because it has sections associated with it`
        );
        setLocationToDelete(null);
        return;
      }

      const updatedLocations = locations.filter(loc => loc.id !== locationToDelete.id);
      onLocationsChange(updatedLocations);
      
      toast.success(
        'Location Deleted',
        `"${locationToDelete.label}" has been successfully deleted`
      );
      
      setLocationToDelete(null);
    }
  };

  const handleInputChange = (field: keyof LocationFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'floor':
        return <Location color="#3B82F6" size={20} />;
      case 'building':
        return <Buildings color="#10B981" size={20} />;
      case 'section':
        return <Location color="#F59E0B" size={20} />;
      default:
        return <Location color="#6B7280" size={20} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'floor':
        return 'bg-blue-100 text-blue-800';
      case 'building':
        return 'bg-green-100 text-green-800';
      case 'section':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { key: 'floor' as const, label: 'Floors', count: getLocationsByType('floor').length },
    { key: 'building' as const, label: 'Buildings', count: getLocationsByType('building').length },
    { key: 'section' as const, label: 'Sections', count: getLocationsByType('section').length }
  ];

  const typeOptions = [
    { label: 'Floor', value: 'floor' },
    { label: 'Building', value: 'building' },
    { label: 'Section', value: 'section' }
  ];

  const buildingOptions = [
    { label: 'No parent (standalone)', value: '' },
    ...buildings.map(building => ({
      label: building.label,
      value: building.id
    }))
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Locations</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage floors, buildings, and sections for room organization
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Add size={16} color="white" />
          <span>Add Location</span>
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </nav>
      </div>

      {/* Locations List */}
      <div className="space-y-3">
        {getLocationsByType(activeTab).map((location, index) => {
          const sameTypeLocations = getLocationsByType(activeTab);
          const isFirst = index === 0;
          const isLast = index === sameTypeLocations.length - 1;
          const parentBuilding = location.parentId ? buildings.find(b => b.id === location.parentId) : null;

          return (
            <div
              key={location.id}
              className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-500">#{location.order + 1}</span>
                    {getTypeIcon(location.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-medium text-gray-900">{location.label}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(location.type)}`}>
                        {location.type}
                      </span>
                      {location.isActive ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          Inactive
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <p className="text-sm text-gray-600">
                        Key: <code className="bg-gray-200 px-1 rounded text-xs">{location.name}</code>
                      </p>
                      {parentBuilding && (
                        <p className="text-sm text-gray-600">
                          Building: {parentBuilding.label}
                        </p>
                      )}
                    </div>
                    {location.description && (
                      <p className="text-sm text-gray-600 mt-1">{location.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Reorder buttons */}
                  <div className="flex flex-col space-y-1">
                    <Button
                      onClick={() => handleReorder(location, 'up')}
                      disabled={isFirst}
                      className={`p-1 rounded ${
                        isFirst 
                          ? 'text-gray-300 cursor-not-allowed' 
                          : 'text-gray-600 hover:bg-gray-200'
                      }`}
                      title="Move Up"
                    >
                      <ArrowUp size={12} color="currentColor" />
                    </Button>
                    <Button
                      onClick={() => handleReorder(location, 'down')}
                      disabled={isLast}
                      className={`p-1 rounded ${
                        isLast 
                          ? 'text-gray-300 cursor-not-allowed' 
                          : 'text-gray-600 hover:bg-gray-200'
                      }`}
                      title="Move Down"
                    >
                      <ArrowDown size={12} color="currentColor" />
                    </Button>
                  </div>

                  <Button
                    onClick={() => handleToggleStatus(location)}
                    className={`p-2 rounded-lg ${
                      location.isActive
                        ? 'text-yellow-600 hover:bg-yellow-50'
                        : 'text-green-600 hover:bg-green-50'
                    }`}
                    title={location.isActive ? 'Deactivate' : 'Activate'}
                  >
                    <TickCircle size={16} color="currentColor" />
                  </Button>

                  <Button
                    onClick={() => handleEdit(location)}
                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg"
                    title="Edit"
                  >
                    <Edit size={16} color="currentColor" />
                  </Button>

                  <Button
                    onClick={() => handleDelete(location)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                    title="Delete"
                  >
                    <Trash size={16} color="currentColor" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Form Modal */}
      <Modal
        ref={formModalRef}
        title={editingLocation ? 'Edit Location' : 'Create Location'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <CustomSelect
            label="Type *"
            options={typeOptions}
            value={formData.type}
            onChange={(value) => handleInputChange('type', value)}
            placeholder="Select location type"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Name (Key) *"
              placeholder="e.g., ground, main, a"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value.toLowerCase())}
              error={errors.name}
            />

            <Input
              label="Display Label *"
              placeholder="e.g., Ground Floor, Main Building"
              value={formData.label}
              onChange={(e) => handleInputChange('label', e.target.value)}
              error={errors.label}
            />
          </div>

          <Textarea
            label="Description"
            placeholder="Optional description..."
            value={formData.description}
            onChange={(e: { target: { value: any; }; }) => handleInputChange('description', e.target.value)}
            rows={3}
          />

          <Input
            type="number"
            label="Order *"
            placeholder="Display order (0, 1, 2...)"
            value={formData.order.toString()}
            onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 0)}
            error={errors.order}
            min="0"
          />

          {formData.type === 'section' && (
            <CustomSelect
              label="Parent Building *"
              options={buildingOptions}
              value={formData.parentId || ''}
              onChange={(value) => handleInputChange('parentId', value || undefined)}
              placeholder="Select parent building"
            />
          )}

          {/* Status */}
          <div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
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
              {getTypeIcon(formData.type)}
              <div>
                <h4 className="font-medium text-gray-900">
                  {formData.label || 'Location Label'}
                </h4>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(formData.type)}`}>
                    {formData.type}
                  </span>
                  <code className="bg-gray-200 px-1 rounded text-xs">
                    {formData.name || 'key'}
                  </code>
                </div>
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
              className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                <span>{editingLocation ? 'Update' : 'Create'}</span>
              )}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        ref={deleteModalRef}
        title="Delete Location"
        message={`Are you sure you want to delete "${locationToDelete?.label}"?`}
        description="This action cannot be undone. Rooms using this location will need to be reassigned."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={confirmDelete}
        onCancel={() => setLocationToDelete(null)}
      />
    </div>
  );
};

export default LocationsSection;