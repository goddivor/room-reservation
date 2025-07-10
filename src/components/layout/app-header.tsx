// src/components/layout/app-header.tsx
import { useState } from "react";
import {
  Notification,
  SearchNormal1,
  HambergerMenu,
  Logout,
  User,
  Setting2,
  Calendar,
} from "iconsax-react";
import { Link } from "react-router";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "employee" | "manager";
  avatar?: string;
}

interface AppHeaderProps {
  user?: User;
  onLogout?: () => void;
  onToggleSidebar?: () => void;
}

export default function AppHeader({
  user,
  onLogout,
  onToggleSidebar,
}: AppHeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const currentUser: User = user || {
    id: "1",
    name: "Marie Dubois",
    email: "marie.dubois@company.com",
    role: "employee",
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrateur";
      case "manager":
        return "Manager";
      case "employee":
        return "Employé";
      default:
        return "Utilisateur";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "manager":
        return "bg-blue-100 text-blue-800";
      case "employee":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-40">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 lg:hidden"
          >
            <HambergerMenu size={20} color="currentColor" />
          </button>

          {/* Logo & Brand */}
          <Link to="/dashboard" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Calendar size={20} color="white" variant="Bold" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-900">RoomBooking</h1>
              <p className="text-xs text-gray-500">Système de réservation</p>
            </div>
          </Link>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-2xl mx-4">
          <div className="relative">
            <SearchNormal1
              size={20}
              color="#6B7280"
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
            />
            <input
              type="text"
              placeholder="Rechercher une salle, une réservation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <div className="relative">
            <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 relative">
              <Notification size={20} color="currentColor" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {currentUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">
                  {currentUser.name}
                </p>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${getRoleColor(
                    currentUser.role
                  )}`}
                >
                  {getRoleLabel(currentUser.role)}
                </span>
              </div>
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">
                    {currentUser.name}
                  </p>
                  <p className="text-sm text-gray-500">{currentUser.email}</p>
                </div>

                <Link
                  to="/profile"
                  className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <User size={16} color="currentColor" />
                  <span>Mon Profil</span>
                </Link>

                <Link
                  to="/settings"
                  className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <Setting2 size={16} color="currentColor" />
                  <span>Paramètres</span>
                </Link>

                <hr className="my-2" />

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    onLogout?.();
                  }}
                  className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                >
                  <Logout size={16} color="currentColor" />
                  <span>Se déconnecter</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
