// src/components/layout/app-layout.tsx
import { useState } from "react";
import { Outlet } from "react-router";
import AppHeader from "./app-header";
import AppSidebar from "./app-sidebar";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "employee" | "manager";
  avatar?: string;
}

interface AppLayoutProps {
  user?: User;
  onLogout?: () => void;
}

export default function AppLayout({ user, onLogout }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const currentUser: User = user || {
    id: "1",
    name: "Marie Dubois",
    email: "marie.dubois@company.com",
    role: "employee",
  };

  const handleLogout = () => {
    // Clear user session, tokens, etc.
    onLogout?.();
    // Redirect to login page would happen here
    console.log("User logged out");
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AppHeader
        user={currentUser}
        onLogout={handleLogout}
        onToggleSidebar={toggleMobileSidebar}
      />

      <div className="flex">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block">
          <AppSidebar
            userRole={currentUser.role}
            isCollapsed={sidebarCollapsed}
          />
        </div>

        {/* Sidebar - Mobile */}
        {mobileSidebarOpen && (
          <AppSidebar
            userRole={currentUser.role}
            onClose={closeMobileSidebar}
          />
        )}

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 ${
            sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
          } p-6 mt-16`}
        >
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Sidebar Toggle Button - Desktop */}
      <button
        onClick={toggleSidebar}
        className="hidden lg:block fixed bottom-6 left-6 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <div
          className={`transform transition-transform ${
            sidebarCollapsed ? "rotate-180" : ""
          }`}
        >
          ←
        </div>
      </button>
    </div>
  );
}
