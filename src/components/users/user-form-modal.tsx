// src/components/modals/user-form-modal.tsx
import { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { People, Save2, Add, Sms } from "iconsax-react";
import { Input } from "@/components/forms/Input";
import Button from "@/components/actions/button";
import type { ModalRef } from "@/types/modal-ref";
import type { User, UserFormData } from "@/types/user.types";
import { X } from "@phosphor-icons/react";

interface UserFormModalProps {
  user?: User | null; // null for create, user object for edit
  onSave: (userData: UserFormData) => void;
  onCancel?: () => void;
}

const UserFormModal = forwardRef<ModalRef, UserFormModalProps>(
  ({ user, onSave, onCancel }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<UserFormData>({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      sendWelcomeEmail: true,
    });
    const [errors, setErrors] = useState<
      Partial<Record<keyof UserFormData, string>>
    >({});

    const isEditMode = !!user;

    useImperativeHandle(ref, () => ({
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }));

    // Reset form when modal opens/closes or user changes
    useEffect(() => {
      if (isOpen) {
        if (user) {
          // Edit mode - populate form with user data
          setFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone || "",
            sendWelcomeEmail: false, // Don't send welcome email for existing users
          });
        } else {
          // Create mode - reset form
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            sendWelcomeEmail: true,
          });
        }
        setErrors({});
      }
    }, [isOpen, user]);

    const handleInputChange = (field: keyof UserFormData, value: string | boolean) => {
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

    const validateForm = (): boolean => {
      const newErrors: Partial<Record<keyof UserFormData, string>> = {};

      if (!formData.firstName.trim()) {
        newErrors.firstName = "First name is required";
      }

      if (!formData.lastName.trim()) {
        newErrors.lastName = "Last name is required";
      }

      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          newErrors.email = "Please enter a valid email address";
        }
      }

      if (formData.phone && formData.phone.trim()) {
        const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
          newErrors.phone = "Please enter a valid phone number";
        }
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
        console.error("Error saving user:", error);
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

    const generatePreviewAvatar = () => {
      const name = `${formData.firstName} ${formData.lastName}`.trim();
      if (!name) return "";
      return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
    };

    if (!isOpen) return null;

    return (
      <div
        className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-hidden overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                {isEditMode ? (
                  <People size={24} color="#1D4ED8" variant="Bold" />
                ) : (
                  <Add size={24} color="#1D4ED8" variant="Bold" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {isEditMode ? "Edit User" : "Create New User"}
                </h2>
                <p className="text-sm text-gray-500">
                  {isEditMode
                    ? "Update user information"
                    : "Add a new user to the system"}
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
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Avatar Preview */}
            {(formData.firstName || formData.lastName) && (
              <div className="flex justify-center">
                <div className="text-center">
                  <img
                    src={generatePreviewAvatar()}
                    alt="Avatar Preview"
                    className="w-16 h-16 rounded-full mx-auto mb-2"
                  />
                  <p className="text-xs text-gray-500">Avatar Preview</p>
                </div>
              </div>
            )}

            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name *"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                error={errors.firstName}
              />
              <Input
                label="Last Name *"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                error={errors.lastName}
              />
            </div>

            <Input
              label="Email Address *"
              type="email"
              placeholder="john.doe@example.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              error={errors.email}
              disabled={isEditMode} // Don't allow email changes in edit mode
            />

            <Input
              label="Phone Number"
              type="tel"
              placeholder="+33123456789"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              error={errors.phone}
            />

            {/* Options */}
            {!isEditMode && (
              <div className="space-y-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.sendWelcomeEmail}
                    onChange={(e) => handleInputChange("sendWelcomeEmail", e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    Send welcome email with account verification
                  </span>
                </label>
              </div>
            )}

            {/* Information notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  {isEditMode ? (
                    <People size={20} color="#3B82F6" />
                  ) : (
                    <Sms size={20} color="#3B82F6" />
                  )}
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-blue-900">
                    {isEditMode ? "Important Information" : "Account Creation"}
                  </h4>
                  <p className="text-sm text-blue-700 mt-1">
                    {isEditMode
                      ? "Changes will be applied immediately. The user will be notified of any significant changes to their account."
                      : "A verification email will be sent to the user's email address. They must verify their email before they can access their account."}
                  </p>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
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
                    <span>{isEditMode ? "Update User" : "Create User"}</span>
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

UserFormModal.displayName = "UserFormModal";

export default UserFormModal;