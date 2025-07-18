/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/modals/room-form-modal.tsx
import { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { Buildings2, Save2, Add } from "iconsax-react";
import { Input } from "@/components/forms/Input";
import { Textarea } from "@/components/forms/Textarea";
import { CustomSelect } from "@/components/forms/custom-select";
import Button from "@/components/actions/button";
import type { ModalRef } from "@/types/modal-ref";
import type {
  Room,
  RoomFormData,
  RoomTypeConfig,
  Equipment,
} from "@/types/room.types";
import { X } from "@phosphor-icons/react";

interface RoomFormModalProps {
  room?: Room | null; // null for create, room object for edit
  roomTypes: RoomTypeConfig[];
  equipments: Equipment[];
  onSave: (roomData: RoomFormData) => void;
  onCancel?: () => void;
}

const RoomFormModal = forwardRef<ModalRef, RoomFormModalProps>(
  ({ room, roomTypes, equipments, onSave, onCancel }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<RoomFormData>({
      code: "",
      typeId: "",
      status: "available",
      floor: "ground",
      capacity: 1,
      area: 20,
      equipmentIds: [],
      dailyRate: 50,
      monthlyRate: undefined,
      description: "",
      building: "",
      section: "",
      hasBalcony: false,
      hasKitchen: false,
      hasBathroom: true,
      hasAirConditioning: false,
      hasWifi: true,
      isActive: true,
    });
    const [errors, setErrors] = useState<
      Partial<Record<keyof RoomFormData, string>>
    >({});

    const isEditMode = !!room;

    useImperativeHandle(ref, () => ({
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }));

    // Reset form when modal opens/closes or room changes
    useEffect(() => {
      if (isOpen) {
        if (room) {
          // Edit mode - populate form with room data
          setFormData({
            code: room.code,
            typeId: room.typeId,
            status: room.status,
            floor: room.floor,
            capacity: room.capacity,
            area: room.area,
            equipmentIds: room.equipmentIds,
            dailyRate: room.dailyRate,
            monthlyRate: room.monthlyRate,
            description: room.description || "",
            building: room.building || "",
            section: room.section || "",
            hasBalcony: room.hasBalcony,
            hasKitchen: room.hasKitchen,
            hasBathroom: room.hasBathroom,
            hasAirConditioning: room.hasAirConditioning,
            hasWifi: room.hasWifi,
            isActive: room.isActive,
          });
        } else {
          // Create mode - reset form
          setFormData({
            code: "",
            typeId: roomTypes[0]?.id || "",
            status: "available",
            floor: "ground",
            capacity: 1,
            area: 20,
            equipmentIds: [],
            dailyRate: 50,
            monthlyRate: undefined,
            description: "",
            building: "",
            section: "",
            hasBalcony: false,
            hasKitchen: false,
            hasBathroom: true,
            hasAirConditioning: false,
            hasWifi: true,
            isActive: true,
          });
        }
        setErrors({});
      }
    }, [isOpen, room, roomTypes]);

    const handleInputChange = (field: keyof RoomFormData, value: any) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }
    };

    const handleEquipmentToggle = (equipmentId: string) => {
      setFormData((prev) => ({
        ...prev,
        equipmentIds: prev.equipmentIds.includes(equipmentId)
          ? prev.equipmentIds.filter((id) => id !== equipmentId)
          : [...prev.equipmentIds, equipmentId],
      }));
    };

    const validateForm = (): boolean => {
      const newErrors: Partial<Record<keyof RoomFormData, string>> = {};

      if (!formData.code.trim()) {
        newErrors.code = "Room code is required";
      }

      if (!formData.typeId) {
        newErrors.typeId = "Room type is required";
      }

      if (formData.capacity < 1) {
        newErrors.capacity = "Capacity must be at least 1";
      }

      if (formData.area < 1) {
        newErrors.area = "Area must be at least 1 m²";
      }

      if (formData.dailyRate < 0) {
        newErrors.dailyRate = "Daily rate cannot be negative";
      }

      if (formData.monthlyRate && formData.monthlyRate < 0) {
        newErrors.monthlyRate = "Monthly rate cannot be negative";
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
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        onSave(formData);
        setIsOpen(false);
      } catch (error) {
        console.error("Error saving room:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const handleCancel = () => {
      onCancel?.();
      setIsOpen(false);
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        handleCancel();
      }
    };

    const roomTypeOptions = roomTypes.map((type) => ({
      label: type.name,
      value: type.id,
    }));

    const statusOptions = [
      { label: "Available", value: "available" },
      { label: "Reserved", value: "reserved" },
      { label: "Occupied", value: "occupied" },
      { label: "Maintenance", value: "maintenance" },
      { label: "Inactive", value: "inactive" },
    ];

    const floorOptions = [
      { label: "Ground Floor", value: "ground" },
      { label: "First Floor", value: "first" },
      { label: "Second Floor", value: "second" },
      { label: "Third Floor", value: "third" },
      { label: "Fourth Floor", value: "fourth" },
      { label: "Fifth Floor", value: "fifth" },
    ];

    if (!isOpen) return null;

    return (
    <div
      className="fixed inset-0 bg-opacity-20 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                {isEditMode ? (
                  <Buildings2 size={24} color="#1D4ED8" variant="Bold" />
                ) : (
                  <Add size={24} color="#1D4ED8" variant="Bold" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {isEditMode ? "Edit Room" : "Create New Room"}
                </h2>
                <p className="text-sm text-gray-500">
                  {isEditMode
                    ? "Update room information and settings"
                    : "Add a new room to the system"}
                </p>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} color="#6B7280" />
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="overflow-y-auto max-h-[calc(90vh-140px)]"
          >
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Room Code *"
                    placeholder="e.g., A101, B205"
                    value={formData.code}
                    onChange={(e) => handleInputChange("code", e.target.value)}
                    error={errors.code}
                  />
                  <CustomSelect
                    label="Room Type *"
                    options={roomTypeOptions}
                    value={formData.typeId}
                    onChange={(value) => handleInputChange("typeId", value)}
                    placeholder="Select room type"
                  />
                  <CustomSelect
                    label="Status *"
                    options={statusOptions}
                    value={formData.status}
                    onChange={(value) => handleInputChange("status", value)}
                    placeholder="Select status"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Location
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <CustomSelect
                    label="Floor *"
                    options={floorOptions}
                    value={formData.floor}
                    onChange={(value) => handleInputChange("floor", value)}
                    placeholder="Select floor"
                  />
                  <Input
                    label="Building"
                    placeholder="e.g., Main Building"
                    value={formData.building}
                    onChange={(e) =>
                      handleInputChange("building", e.target.value)
                    }
                  />
                  <Input
                    label="Section"
                    placeholder="e.g., A, B, C"
                    value={formData.section}
                    onChange={(e) =>
                      handleInputChange("section", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Room Details */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Room Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="number"
                    label="Capacity *"
                    placeholder="Number of guests"
                    value={formData.capacity.toString()}
                    onChange={(e) =>
                      handleInputChange(
                        "capacity",
                        parseInt(e.target.value) || 0
                      )
                    }
                    error={errors.capacity}
                    min="1"
                  />
                  <Input
                    type="number"
                    label="Area (m²) *"
                    placeholder="Room area in square meters"
                    value={formData.area.toString()}
                    onChange={(e) =>
                      handleInputChange("area", parseInt(e.target.value) || 0)
                    }
                    error={errors.area}
                    min="1"
                  />
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Pricing
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="number"
                    label="Daily Rate ($) *"
                    placeholder="Daily rental rate"
                    value={formData.dailyRate.toString()}
                    onChange={(e) =>
                      handleInputChange(
                        "dailyRate",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    error={errors.dailyRate}
                    min="0"
                    step="0.01"
                  />
                  <Input
                    type="number"
                    label="Monthly Rate ($)"
                    placeholder="Optional monthly rate"
                    value={formData.monthlyRate?.toString() || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "monthlyRate",
                        e.target.value ? parseFloat(e.target.value) : undefined
                      )
                    }
                    error={errors.monthlyRate}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Room Features
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasBalcony}
                      onChange={(e) =>
                        handleInputChange("hasBalcony", e.target.checked)
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Balcony</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasKitchen}
                      onChange={(e) =>
                        handleInputChange("hasKitchen", e.target.checked)
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Kitchen</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasBathroom}
                      onChange={(e) =>
                        handleInputChange("hasBathroom", e.target.checked)
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Bathroom</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasAirConditioning}
                      onChange={(e) =>
                        handleInputChange(
                          "hasAirConditioning",
                          e.target.checked
                        )
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">A/C</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasWifi}
                      onChange={(e) =>
                        handleInputChange("hasWifi", e.target.checked)
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">WiFi</span>
                  </label>
                </div>
              </div>

              {/* Equipment */}
              {equipments.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Equipment
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-4">
                    {equipments.map((equipment) => (
                      <label
                        key={equipment.id}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.equipmentIds.includes(equipment.id)}
                          onChange={() => handleEquipmentToggle(equipment.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">
                          {equipment.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <Textarea
                  label="Description"
                  placeholder="Optional room description..."
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={3}
                />
              </div>

              {/* Status */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Room Status
                </h3>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      handleInputChange("isActive", e.target.checked)
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    Room is active and available for booking
                  </span>
                </label>
              </div>

              {/* Information notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Buildings2 size={20} color="#3B82F6" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-blue-900">
                      Important Information
                    </h4>
                    <p className="text-sm text-blue-700 mt-1">
                      {isEditMode
                        ? "Changes will be applied immediately after saving. Active reservations will not be affected."
                        : "The room will be available for booking immediately after creation if set as active."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end space-x-3 p-6 bg-gray-50 border-t border-gray-200">
              <Button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors flex items-center space-x-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save2 size={16} color="white" />
                    <span>{isEditMode ? "Update Room" : "Create Room"}</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }
);

RoomFormModal.displayName = "RoomFormModal";

export default RoomFormModal;
