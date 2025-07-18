/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/room-config/EquipmentSection.tsx
import React, { useState, useRef } from 'react';
import { Add, Edit, Trash, Monitor, TickCircle } from 'iconsax-react';
import Button from '@/components/Button';
import { Input } from '@/components/Input';
import { Textarea } from '@/components/forms/Textarea';
import { CustomSelect } from '@/components/forms/custom-select';
import Modal, { type ModalRef } from '@/components/ui/Modal';
import ConfirmationModal from '@/components/modals/confirmation-modal';
import { useToast } from '@/context/toast-context';
import type { Equipment, EquipmentFormData } from '@/types/room-config.types';
import type { ModalRef as ConfirmModalRef } from '@/types/modal-ref';

interface EquipmentSectionProps {
  equipment: Equipment[];
  onEquipmentChange: (equipment: Equipment[]) => void;
}

const EquipmentSection: React.FC<EquipmentSectionProps> = ({
  equipment,
  onEquipmentChange
}) => {
  const toast = useToast();
  const formModalRef = useRef<ModalRef>(null);
  const deleteModalRef = useRef<ConfirmModalRef>(null);
  
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [equipmentToDelete, setEquipmentToDelete] = useState<Equipment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  const [formData, setFormData] = useState<EquipmentFormData>({
    name: '',
    description: '',
    icon: '📺',
    category: 'electronics',
    isActive: true
  });

  const [errors, setErrors] = useState<Partial<Record<keyof EquipmentFormData, string>>>({});

  // Categories for equipment
  const categories = [
    { value: 'electronics', label: 'Electronics', color: '#3B82F6' },
    { value: 'furniture', label: 'Furniture', color: '#8B5CF6' },
    { value: 'appliances', label: 'Appliances', color: '#10B981' },
    { value: 'comfort', label: 'Comfort', color: '#F59E0B' },
    { value: 'safety', label: 'Safety', color: '#EF4444' }
  ];

  // Common equipment icons
  const iconOptions = [
    '📺', '💻', '📱', '🖥️', '⌨️', '🖱️', '🎮', '📷', '🎤', '🔌',
    '🛏️', '🪑', '🛋️', '🗄️', '🚪', '🪟', '💡', '🕯️', '🖼️', '🪴',
    '🧊', '🔥', '☕', '🍳', '🥄', '🍽️', '🧽', '🧴', '🧻', '🗑️',
    '🛁', '🚿', '🧼', '💨', '👔', '🧺', '🔒', '🚨', '🔥', '⚡'
  ];

  // Filter equipment by category
  const filteredEquipment = filterCategory === 'all' 
    ? equipment 
    : equipment.filter(eq => eq.category === filterCategory);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      icon: '📺',
      category: 'electronics',
      isActive: true
    });
    setErrors({});
    setEditingEquipment(null);
  };

  const handleCreate = () => {
    resetForm();
    formModalRef.current?.open();
  };

  const handleEdit = (eq: Equipment) => {
    setFormData({
      name: eq.name,
      description: eq.description || '',
      icon: eq.icon,
      category: eq.category,
      isActive: eq.isActive
    });
    setEditingEquipment(eq);
    setErrors({});
    formModalRef.current?.open();
  };

  const handleDelete = (eq: Equipment) => {
    setEquipmentToDelete(eq);
    deleteModalRef.current?.open();
  };

  const handleToggleStatus = (eq: Equipment) => {
    const updatedEquipment = equipment.map(item =>
      item.id === eq.id 
        ? { ...item, isActive: !item.isActive, updatedAt: new Date().toISOString() }
        : item
    );
    onEquipmentChange(updatedEquipment);
    
    toast.success(
      'Status Updated',
      `Equipment "${eq.name}" is now ${!eq.isActive ? 'active' : 'inactive'}`
    );
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof EquipmentFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (equipment.some(eq => 
      eq.name.toLowerCase() === formData.name.toLowerCase() && 
      eq.id !== editingEquipment?.id
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

      if (editingEquipment) {
        // Update existing equipment
        const updatedEquipment = equipment.map(eq =>
          eq.id === editingEquipment.id
            ? {
                ...eq,
                ...formData,
                updatedAt: new Date().toISOString()
              }
            : eq
        );
        onEquipmentChange(updatedEquipment);
        
        toast.success(
          'Equipment Updated',
          `"${formData.name}" has been successfully updated`
        );
      } else {
        // Create new equipment
        const newEquipment: Equipment = {
          id: `equipment_${Date.now()}`,
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        onEquipmentChange([...equipment, newEquipment]);
        
        toast.success(
          'Equipment Created',
          `"${formData.name}" has been successfully created`
        );
      }

      formModalRef.current?.close();
      resetForm();
    } catch (error) {
      toast.error('Error', 'Failed to save equipment');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = () => {
    if (equipmentToDelete) {
      const updatedEquipment = equipment.filter(eq => eq.id !== equipmentToDelete.id);
      onEquipmentChange(updatedEquipment);
      
      toast.success(
        'Equipment Deleted',
        `"${equipmentToDelete.name}" has been successfully deleted`
      );
      
      setEquipmentToDelete(null);
    }
  };

  const handleInputChange = (field: keyof EquipmentFormData, value: any) => {
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
    switch (category) {
      case 'electronics':
        return 'bg-blue-100 text-blue-800';
      case 'furniture':
        return 'bg-purple-100 text-purple-800';
      case 'appliances':
        return 'bg-green-100 text-green-800';
      case 'comfort':
        return 'bg-yellow-100 text-yellow-800';
      case 'safety':
        return 'bg-red-100 text-red-800';
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
          <h2 className="text-xl font-semibold text-gray-900">Equipment</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage equipment and appliances available in rooms
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Add size={16} color="white" />
          <span>Add Equipment</span>
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
            ({filteredEquipment.length} item{filteredEquipment.length !== 1 ? 's' : ''})
          </span>
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEquipment.map((eq) => (
          <div
            key={eq.id}
            className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{eq.icon}</div>
                <div>
                  <h3 className="font-medium text-gray-900">{eq.name}</h3>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${getCategoryColor(eq.category)}`}>
                    {getCategoryInfo(eq.category).label}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                {eq.isActive ? (
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

            {eq.description && (
              <p className="text-sm text-gray-600 mb-3">{eq.description}</p>
            )}

            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                Created: {new Date(eq.createdAt).toLocaleDateString()}
              </div>

              <div className="flex items-center space-x-1">
                <Button
                  onClick={() => handleToggleStatus(eq)}
                  className={`p-2 rounded-lg ${
                    eq.isActive
                      ? 'text-yellow-600 hover:bg-yellow-50'
                      : 'text-green-600 hover:bg-green-50'
                  }`}
                  title={eq.isActive ? 'Deactivate' : 'Activate'}
                >
                  <TickCircle size={14} color="currentColor" />
                </Button>

                <Button
                  onClick={() => handleEdit(eq)}
                  className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg"
                  title="Edit"
                >
                  <Edit size={14} color="currentColor" />
                </Button>

                <Button
                  onClick={() => handleDelete(eq)}
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

      {filteredEquipment.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Monitor size={48} color="#9CA3AF" className="mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">
            {filterCategory === 'all' ? 'No equipment found' : `No ${filterCategory} equipment found`}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {filterCategory === 'all' 
              ? 'Create your first equipment item to get started.'
              : `Try selecting a different category or create a new ${filterCategory} equipment.`
            }
          </p>
          <Button
            onClick={handleCreate}
            className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
          >
            <Add size={16} color="white" />
            <span className="ml-2">Add Equipment</span>
          </Button>
        </div>
      )}

      {/* Form Modal */}
      <Modal
        ref={formModalRef}
        title={editingEquipment ? 'Edit Equipment' : 'Create Equipment'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <Input
            label="Name *"
            placeholder="e.g., Smart TV, Coffee Machine, Work Desk"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={errors.name}
          />

          <Textarea
            label="Description"
            placeholder="Optional description of this equipment..."
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
            <div className="grid grid-cols-10 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
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
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
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
                  {formData.name || 'Equipment Name'}
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
              className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                <span>{editingEquipment ? 'Update' : 'Create'}</span>
              )}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        ref={deleteModalRef}
        title="Delete Equipment"
        message={`Are you sure you want to delete "${equipmentToDelete?.name}"?`}
        description="This action cannot be undone. Rooms using this equipment will have it removed."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={confirmDelete}
        onCancel={() => setEquipmentToDelete(null)}
      />
    </div>
  );
};

export default EquipmentSection;