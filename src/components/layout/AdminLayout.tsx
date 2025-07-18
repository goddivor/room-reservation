// src/components/layout/AdminLayout.tsx
import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import Button from '@/components/Button';
import { 
    Home, 
    User, 
    Buildings2, 
    People, 
    HambergerMenu,
    CloseSquare,
    Setting2,
    Logout,
    ArrowDown2,
    Setting4,
} from 'iconsax-react';

interface SidebarItem {
    path: string;
    label: string;
    icon: React.ReactNode;
    description: string;
}

const AdminLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = React.useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);

    // Mock user data
    const currentUser = {
        name: 'Marie Dubois',
        email: 'marie.dubois@company.com',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Marie`
    };

    const sidebarItems: SidebarItem[] = [
        {
            path: '/admin',
            label: 'Administration',
            icon: <Home color="#1D4ED8" size={20} />,
            description: 'Dashboard'
        },
        {
            path: '/admin/rooms',
            label: 'Room Management',
            icon: <Buildings2 color="#1D4ED8" size={20} />,
            description: 'Rooms & equipment'
        },
        {
            path: '/admin/room-config',
            label: 'Room Configuration',
            icon: <Setting4 color="#1D4ED8" size={20} />,
            description: 'Types, locations & equipment'
        },

        {
            path: '/admin/users',
            label: 'User Management',
            icon: <People color="#1D4ED8" size={20} />,
            description: 'Accounts & permissions'
        }
    ];

    const isActivePath = (path: string) => {
        if (path === '/admin') {
            return location.pathname === '/admin';
        }
        return location.pathname.startsWith(path);
    };

    const handleNavigation = (path: string) => {
        navigate(path);
        setSidebarOpen(false); // Close mobile sidebar
    };

    const handleLogout = () => {
        // Handle logout logic here
        console.log('Logout clicked');
        setUserDropdownOpen(false);
    };

    const handleProfile = () => {
        navigate('/admin/profile');
        setUserDropdownOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar - Desktop */}
            <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0">
                <div className="flex flex-col flex-grow bg-white border-r border-gray-200 shadow-sm">
                    {/* Sidebar Header */}
                    <div className="flex items-center gap-3 p-6 border-b border-gray-200">
                        {/* Logo SVG */}
                        <div className="flex-shrink-0">
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="32" height="32" rx="8" fill="#1D4ED8"/>
                                <path d="M8 12h16v2H8v-2zm0 4h16v2H8v-2zm0 4h12v2H8v-2z" fill="white"/>
                                <path d="M10 8h12v2H10V8z" fill="white"/>
                                <circle cx="20" cy="20" r="3" fill="#60A5FA"/>
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">RoomAdmin</h1>
                            <p className="text-xs text-gray-500">Reservation management</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2">
                        {sidebarItems.map((item) => (
                            <button
                                key={item.path}
                                onClick={() => handleNavigation(item.path)}
                                className={`
                                    w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200
                                    ${isActivePath(item.path)
                                        ? 'bg-blue-50 border-l-4 border-blue-600 text-blue-900'
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                    }
                                `}
                            >
                                <div className={`
                                    p-2 rounded-lg transition-all duration-200
                                    ${isActivePath(item.path) 
                                        ? 'bg-blue-100' 
                                        : 'bg-gray-100'
                                    }
                                `}>
                                    {item.icon}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-sm">{item.label}</p>
                                    <p className="text-xs opacity-70">{item.description}</p>
                                </div>
                            </button>
                        ))}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-4 border-t border-gray-200">
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Buildings2 color="#1D4ED8" size={16} />
                                <span className="text-sm font-medium text-blue-900">RoomAdmin Pro</span>
                            </div>
                            <p className="text-xs text-blue-700 mb-3">
                                Optimize your room management
                            </p>
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 px-3 rounded-md transition-colors">
                                Upgrade
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="lg:hidden fixed inset-0 z-50 flex">
                    <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
                    
                    <div className="relative flex flex-col w-64 bg-white shadow-xl">
                        {/* Mobile Sidebar Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                                <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="32" height="32" rx="8" fill="#1D4ED8"/>
                                    <path d="M8 12h16v2H8v-2zm0 4h16v2H8v-2zm0 4h12v2H8v-2z" fill="white"/>
                                    <path d="M10 8h12v2H10V8z" fill="white"/>
                                    <circle cx="20" cy="20" r="3" fill="#60A5FA"/>
                                </svg>
                                <span className="text-lg font-bold text-gray-900">RoomAdmin</span>
                            </div>
                            <Button
                                onClick={() => setSidebarOpen(false)}
                                className="p-2 text-gray-500 hover:text-gray-700"
                            >
                                <CloseSquare color="#6B7280" size={20} />
                            </Button>
                        </div>

                        {/* Mobile Navigation */}
                        <nav className="flex-1 p-4 space-y-2">
                            {sidebarItems.map((item) => (
                                <button
                                    key={item.path}
                                    onClick={() => handleNavigation(item.path)}
                                    className={`
                                        w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200
                                        ${isActivePath(item.path)
                                            ? 'bg-blue-50 border-l-4 border-blue-600 text-blue-900'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                        }
                                    `}
                                >
                                    <div className={`
                                        p-2 rounded-lg transition-all duration-200
                                        ${isActivePath(item.path) 
                                            ? 'bg-blue-100' 
                                            : 'bg-gray-100'
                                        }
                                    `}>
                                        {item.icon}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">{item.label}</p>
                                        <p className="text-xs opacity-70">{item.description}</p>
                                    </div>
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 lg:pl-64">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            {/* Mobile Menu Button */}
                            <Button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                            >
                                <HambergerMenu color="#6B7280" size={20} />
                            </Button>

                            {/* Page Title */}
                            <div className="flex-1 lg:flex-initial">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    {(() => {
                                        const currentItem = sidebarItems.find(item => isActivePath(item.path));
                                        return currentItem?.label || 'Administration';
                                    })()}
                                </h2>
                            </div>

                            {/* Header Actions */}
                            <div className="flex items-center gap-4">
                                {/* Quick Stats */}
                                <div className="hidden md:flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Buildings2 color="#10B981" size={16} />
                                        <span>12 rooms</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <People color="#F59E0B" size={16} />
                                        <span>45 users</span>
                                    </div>
                                </div>

                                {/* User Menu */}
                                <div className="relative">
                                    <button
                                        onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                        className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                                    >
                                        <img
                                            src={currentUser.avatar}
                                            alt={currentUser.name}
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <div className="hidden sm:block text-left">
                                            <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                                            <p className="text-xs text-gray-500">Administrator</p>
                                        </div>
                                        <ArrowDown2 color="#6B7280" size={16} />
                                    </button>

                                    {/* User Dropdown */}
                                    {userDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                            <div className="px-4 py-2 border-b border-gray-200">
                                                <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                                                <p className="text-xs text-gray-500">{currentUser.email}</p>
                                            </div>
                                            
                                            <button
                                                onClick={handleProfile}
                                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                                            >
                                                <User color="#6B7280" size={16} />
                                                <span>My Profile</span>
                                            </button>
                                            
                                            <button
                                                onClick={() => setUserDropdownOpen(false)}
                                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                                            >
                                                <Setting2 color="#6B7280" size={16} />
                                                <span>Settings</span>
                                            </button>
                                            
                                            <hr className="my-1" />
                                            
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                                            >
                                                <Logout color="#DC2626" size={16} />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;