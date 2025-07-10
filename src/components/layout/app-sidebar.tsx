// src/components/layout/app-sidebar.tsx
import React from 'react';
import {
  Home,
  Calendar,
  Building,
  User,
  ChartSquare,
  Setting2,
  Box,
  ClipboardText,
  People,
} from 'iconsax-react';
import { Link, useLocation } from 'react-router';

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ComponentType<{
    size?: number;
    color?: string;
    variant?: "Linear" | "Outline" | "Broken" | "Bold" | "Bulk" | "TwoTone";
  }>;
  badge?: number;
  roles?: ('admin' | 'employee' | 'manager')[];
}

interface AppSidebarProps {
  userRole?: 'admin' | 'employee' | 'manager';
  isCollapsed?: boolean;
  onClose?: () => void;
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Tableau de bord",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Réserver une salle",
    href: "/reservations/book",
    icon: Calendar,
    roles: ['employee', 'manager'],
  },
  {
    title: "Mes réservations",
    href: "/reservations/my-bookings",
    icon: ClipboardText,
  },
  {
    title: "Salles disponibles",
    href: "/rooms",
    icon: Building,
  },
  {
    title: "Toutes les réservations",
    href: "/reservations/all",
    icon: Calendar,
    roles: ['admin', 'manager'],
  },
  {
    title: "Gestion des utilisateurs",
    href: "/users",
    icon: People,
    roles: ['admin'],
  },
  {
    title: "Équipements",
    href: "/equipment",
    icon: Box,
    roles: ['admin', 'manager'],
  },
  {
    title: "Analytique",
    href: "/analytics",
    icon: ChartSquare,
    roles: ['admin', 'manager'],
  },
  {
    title: "Paramètres",
    href: "/settings",
    icon: Setting2,
    roles: ['admin'],
  },
];

function SidebarNavItem({ 
  item, 
  isCollapsed = false 
}: { 
  item: SidebarItem; 
  isCollapsed?: boolean;
}) {
  const { pathname } = useLocation();
  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
  const Icon = item.icon;

  return (
    <Link
      to={item.href}
      className={`flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors group ${
        isActive
          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
      }`}
      title={isCollapsed ? item.title : undefined}
    >
      <div className="flex items-center space-x-3">
        <Icon
          size={20}
          color={isActive ? "#1D4ED8" : "#6B7280"}
          variant={isActive ? "Bold" : "Outline"}
        />
        {!isCollapsed && <span>{item.title}</span>}
      </div>
      {!isCollapsed && item.badge && (
        <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-600 rounded-full">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

export default function AppSidebar({ 
  userRole = 'employee', 
  isCollapsed = false,
  onClose 
}: AppSidebarProps) {
  // Filter items based on user role
  const filteredItems = sidebarItems.filter(item => 
    !item.roles || item.roles.includes(userRole)
  );

  const getRoleInfo = (role: string) => {
    switch (role) {
      case 'admin':
        return {
          title: 'Administration',
          subtitle: 'Panneau de contrôle',
          icon: Setting2,
          color: '#DC2626'
        };
      case 'manager':
        return {
          title: 'Management',
          subtitle: 'Gestion d\'équipe',
          icon: User,
          color: '#2563EB'
        };
      default:
        return {
          title: 'Employé',
          subtitle: 'Espace personnel',
          icon: User,
          color: '#059669'
        };
    }
  };

  const roleInfo = getRoleInfo(userRole);
  const RoleIcon = roleInfo.icon;

  return (
    <>
      {/* Mobile Overlay */}
      {onClose && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={`fixed top-16 left-0 ${isCollapsed ? 'w-16' : 'w-64'} h-[calc(100vh-4rem)] bg-white border-r border-gray-200 overflow-y-auto z-40 transition-all duration-300 ${onClose ? 'lg:translate-x-0' : ''}`}>
        <div className="p-4">
          {/* Role Section Header */}
          {!isCollapsed && (
            <div className="flex items-center space-x-2 mb-6 p-3 rounded-lg" style={{ backgroundColor: `${roleInfo.color}15` }}>
              <RoleIcon size={24} color={roleInfo.color} variant="Bold" />
              <div>
                <h3 className="text-sm font-semibold" style={{ color: roleInfo.color }}>
                  {roleInfo.title}
                </h3>
                <p className="text-xs" style={{ color: roleInfo.color, opacity: 0.8 }}>
                  {roleInfo.subtitle}
                </p>
              </div>
            </div>
          )}

          {/* Navigation Items */}
          <nav className="space-y-2">
            {filteredItems.map((item) => (
              <SidebarNavItem 
                key={item.href} 
                item={item} 
                isCollapsed={isCollapsed}
              />
            ))}
          </nav>

          {/* Footer Section */}
          {!isCollapsed && (
            <div className="mt-8 pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-500 space-y-1">
                <p>RoomBooking System</p>
                <p>Version 1.0.0</p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}