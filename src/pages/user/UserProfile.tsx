// src/pages/user/UserProfile.tsx
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router";
import Button from "@/components/Button";
import { Input } from "@/components/forms/Input";
import { Textarea } from "@/components/forms/Textarea";
import Modal, { type ModalRef } from "@/components/ui/Modal";
import {
  User,
  Edit2,
  Camera,
  Gallery,
  Save2,
  Eye,
  Lock,
  Notification,
  Shield,
  Clock,
  Logout,
  ArrowLeft2,
  TickSquare,
  CloseSquare,
  Calendar,
  Buildings2,
} from "iconsax-react";

interface UserProfileData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar: string;
  role: string;
  department: string;
  lastLogin: string;
  createdAt: string;
  bio?: string;
  preferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    darkMode: boolean;
    language: string;
  };
}

interface AvatarOption {
  id: string;
  name: string;
  url: string;
}

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarModalRef = useRef<ModalRef>(null);
  const passwordModalRef = useRef<ModalRef>(null);

  // Mock current user data
  const [userData, setUserData] = useState<UserProfileData>({
    id: "user_1",
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean.dupont@company.com",
    phone: "+33123456789",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jean",
    role: "User",
    department: "Marketing Department",
    lastLogin: "2025-08-19T08:30:00Z",
    createdAt: "2024-03-15T10:00:00Z",
    bio: "Marketing professional who frequently uses meeting rooms for client presentations.",
    preferences: {
      emailNotifications: true,
      pushNotifications: true,
      darkMode: false,
      language: "en",
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string>(
    userData.avatar
  );
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Predefined avatar options using Dicebear API
  const avatarOptions: AvatarOption[] = [
    {
      id: "1",
      name: "Default",
      url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.firstName}${userData.lastName}`,
    },
    {
      id: "2",
      name: "Alternative 1",
      url: `https://api.dicebear.com/7.x/avataaars/svg?seed=user1&backgroundColor=b6e3f4`,
    },
    {
      id: "3",
      name: "Alternative 2",
      url: `https://api.dicebear.com/7.x/avataaars/svg?seed=user2&backgroundColor=c0aede`,
    },
    {
      id: "4",
      name: "Alternative 3",
      url: `https://api.dicebear.com/7.x/avataaars/svg?seed=user3&backgroundColor=d1d4f9`,
    },
    {
      id: "5",
      name: "Alternative 4",
      url: `https://api.dicebear.com/7.x/avataaars/svg?seed=user4&backgroundColor=fecaca`,
    },
    {
      id: "6",
      name: "Alternative 5",
      url: `https://api.dicebear.com/7.x/avataaars/svg?seed=user5&backgroundColor=fed7aa`,
    },
    {
      id: "7",
      name: "Alternative 6",
      url: `https://api.dicebear.com/7.x/avataaars/svg?seed=user6&backgroundColor=d9f99d`,
    },
    {
      id: "8",
      name: "Alternative 7",
      url: `https://api.dicebear.com/7.x/avataaars/svg?seed=user7&backgroundColor=fbcfe8`,
    },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update avatar if changed
      if (selectedAvatar !== userData.avatar) {
        setUserData((prev) => ({ ...prev, avatar: selectedAvatar }));
      }

      setIsEditing(false);
      console.log("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setSelectedAvatar(userData.avatar);
    setIsEditing(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you'd upload to a server
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedAvatar(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarSelect = (avatarUrl: string) => {
    setSelectedAvatar(avatarUrl);
    avatarModalRef.current?.close();
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      passwordModalRef.current?.close();
      console.log("Password updated successfully");
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button
            onClick={() => navigate("/user")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft2 color="#6B7280" size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600">
              Manage your account settings and preferences
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3">
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Edit2 color="#FFFFFF" size={16} />
              <span>Edit Profile</span>
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save2 color="#FFFFFF" size={16} />
                )}
                <span>{isSaving ? "Saving..." : "Save Changes"}</span>
              </Button>
              <Button
                onClick={handleCancel}
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <CloseSquare color="#FFFFFF" size={16} />
                <span>Cancel</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Card */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User color="#1D4ED8" size={20} />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Basic Information
              </h2>
            </div>

            <div className="space-y-4">
              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <img
                    src={selectedAvatar}
                    alt="Profile Avatar"
                    className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                  />
                  {isEditing && (
                    <button
                      onClick={() => avatarModalRef.current?.open()}
                      className="absolute -bottom-1 -right-1 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-colors"
                    >
                      <Camera color="#FFFFFF" size={16} />
                    </button>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">
                    {userData.firstName} {userData.lastName}
                  </h3>
                  <p className="text-gray-600">{userData.role}</p>
                  <p className="text-sm text-gray-500">
                    {userData.department}
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  value={userData.firstName}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                  disabled={!isEditing}
                />
                <Input
                  label="Last Name"
                  value={userData.lastName}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                  disabled={!isEditing}
                />
              </div>

              <Input
                label="Email Address"
                type="email"
                value={userData.email}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, email: e.target.value }))
                }
                disabled={!isEditing}
              />

              <Input
                label="Phone Number"
                value={userData.phone || ""}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, phone: e.target.value }))
                }
                disabled={!isEditing}
                placeholder="+33123456789"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <Textarea
                  value={userData.bio || ""}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  disabled={!isEditing}
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-100 rounded-lg">
                <Shield color="#DC2626" size={20} />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Security</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Lock color="#6B7280" size={20} />
                  <div>
                    <p className="font-medium text-gray-900">Password</p>
                    <p className="text-sm text-gray-600">
                      Last updated 2 weeks ago
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => passwordModalRef.current?.open()}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Change Password
                </Button>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Notification color="#7C3AED" size={20} />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Preferences
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    Email Notifications
                  </p>
                  <p className="text-sm text-gray-600">
                    Receive reservation updates via email
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={userData.preferences.emailNotifications}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        preferences: {
                          ...prev.preferences,
                          emailNotifications: e.target.checked,
                        },
                      }))
                    }
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    Push Notifications
                  </p>
                  <p className="text-sm text-gray-600">
                    Receive browser notifications for reservations
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={userData.preferences.pushNotifications}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        preferences: {
                          ...prev.preferences,
                          pushNotifications: e.target.checked,
                        },
                      }))
                    }
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock color="#059669" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Account Info
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Member Since
                </p>
                <p className="text-gray-900">
                  {formatDate(userData.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Last Login</p>
                <p className="text-gray-900">
                  {formatDate(userData.lastLogin)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Account ID</p>
                <p className="text-gray-900 font-mono text-sm">
                  {userData.id}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>

            <div className="space-y-2">
              <Button
                onClick={() => navigate("/user")}
                className="w-full flex items-center gap-2 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left"
              >
                <Eye color="#6B7280" size={16} />
                <span>View Dashboard</span>
              </Button>

              <Button
                onClick={() => navigate("/user/reservations")}
                className="w-full flex items-center gap-2 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left"
              >
                <Calendar color="#6B7280" size={16} />
                <span>My Reservations</span>
              </Button>

              <Button
                onClick={() => navigate("/rooms")}
                className="w-full flex items-center gap-2 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left"
              >
                <Buildings2 color="#6B7280" size={16} />
                <span>Browse Rooms</span>
              </Button>

              <hr className="my-2" />

              <Button
                onClick={() => console.log("Logout")}
                className="w-full flex items-center gap-2 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
              >
                <Logout color="#DC2626" size={16} />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Selection Modal */}
      <Modal ref={avatarModalRef} title="Choose Avatar">
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Select from Gallery
            </h3>
            <div className="grid grid-cols-4 gap-4">
              {avatarOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleAvatarSelect(option.url)}
                  className={`p-2 rounded-lg border-2 transition-all hover:scale-105 ${
                    selectedAvatar === option.url
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={option.url}
                    alt={option.name}
                    className="w-16 h-16 rounded-full mx-auto"
                  />
                  <p className="text-xs text-gray-600 mt-1 text-center">
                    {option.name}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Upload Custom Image
            </h3>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                <Gallery color="#6B7280" size={16} />
                <span>Choose File</span>
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <span className="text-sm text-gray-500">
                JPG, PNG or GIF (max 2MB)
              </span>
            </div>
          </div>
        </div>
      </Modal>

      {/* Password Change Modal */}
      <Modal ref={passwordModalRef} title="Change Password">
        <div className="p-6">
          <div className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  currentPassword: e.target.value,
                }))
              }
              placeholder="Enter current password"
            />

            <Input
              label="New Password"
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  newPassword: e.target.value,
                }))
              }
              placeholder="Enter new password"
            />

            <Input
              label="Confirm New Password"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              placeholder="Confirm new password"
            />
          </div>

          <div className="flex items-center gap-3 mt-6 pt-4 border-t">
            <Button
              onClick={handlePasswordChange}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <TickSquare color="#FFFFFF" size={16} />
              <span>Update Password</span>
            </Button>
            <Button
              onClick={() => passwordModalRef.current?.close()}
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <CloseSquare color="#FFFFFF" size={16} />
              <span>Cancel</span>
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserProfile;