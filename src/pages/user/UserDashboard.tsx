import React from 'react';
import { 
    Calendar, 
    Buildings2, 
    Clock,
    TickSquare,
    Activity,
    TrendUp,
    Eye
} from 'iconsax-react';

const UserDashboard: React.FC = () => {
    // Mock data
    const userStats = {
        totalReservations: 12,
        upcomingReservations: 3,
        totalHours: 48,
        favoriteRoom: 'Conference Room A'
    };

    const recentReservations = [
        {
            id: 1,
            roomName: 'Conference Room A',
            date: '2025-08-22',
            time: '10:00 - 12:00',
            status: 'confirmed',
            attendees: 8
        },
        {
            id: 2,
            roomName: 'Meeting Room B',
            date: '2025-08-20',
            time: '14:00 - 15:30',
            status: 'completed',
            attendees: 5
        },
        {
            id: 3,
            roomName: 'Training Room',
            date: '2025-08-18',
            time: '09:00 - 11:00',
            status: 'completed',
            attendees: 12
        }
    ];

    const recentActions = [
        {
            id: 1,
            action: 'Reserved Conference Room A',
            timestamp: '2 hours ago',
            type: 'reservation'
        },
        {
            id: 2,
            action: 'Cancelled Meeting Room C reservation',
            timestamp: '1 day ago',
            type: 'cancellation'
        },
        {
            id: 3,
            action: 'Updated Meeting Room B booking',
            timestamp: '3 days ago',
            type: 'modification'
        },
        {
            id: 4,
            action: 'Completed Training Room session',
            timestamp: '1 week ago',
            type: 'completion'
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getActionIcon = (type: string) => {
        switch (type) {
            case 'reservation':
                return <Calendar color="#10B981" size={16} />;
            case 'cancellation':
                return <Clock color="#EF4444" size={16} />;
            case 'modification':
                return <Activity color="#F59E0B" size={16} />;
            case 'completion':
                return <TickSquare color="#10B981" size={16} />;
            default:
                return <Activity color="#6B7280" size={16} />;
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
                <h1 className="text-2xl font-bold mb-2">Welcome back, Jean!</h1>
                <p className="text-blue-100">Here's an overview of your room reservations and activity.</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Reservations</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{userStats.totalReservations}</p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <Calendar color="#3B82F6" size={24} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                        <TrendUp color="#10B981" size={16} />
                        <span className="text-green-600 ml-1">+2 this month</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Upcoming</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{userStats.upcomingReservations}</p>
                        </div>
                        <div className="p-3 bg-orange-50 rounded-lg">
                            <Clock color="#F97316" size={24} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                        <span className="text-orange-600">Next: Tomorrow 10:00</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Hours</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{userStats.totalHours}h</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                            <Activity color="#10B981" size={24} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                        <span className="text-gray-600">This month: 12h</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Favorite Room</p>
                            <p className="text-lg font-semibold text-gray-900 mt-1">{userStats.favoriteRoom}</p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg">
                            <Buildings2 color="#8B5CF6" size={24} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                        <span className="text-purple-600">Used 5 times</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Reservations */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Recent Reservations</h3>
                            <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800">
                                <Eye color="#3B82F6" size={16} />
                                View all
                            </button>
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        {recentReservations.map((reservation) => (
                            <div key={reservation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                        <Buildings2 color="#3B82F6" size={20} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{reservation.roomName}</p>
                                        <p className="text-sm text-gray-600">{reservation.date} • {reservation.time}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                                        {reservation.status}
                                    </span>
                                    <p className="text-xs text-gray-500 mt-1">{reservation.attendees} attendees</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Actions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Actions</h3>
                    </div>
                    <div className="p-6 space-y-4">
                        {recentActions.map((action) => (
                            <div key={action.id} className="flex items-start gap-3">
                                <div className="p-2 bg-gray-50 rounded-lg">
                                    {getActionIcon(action.type)}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">{action.action}</p>
                                    <p className="text-xs text-gray-500 mt-1">{action.timestamp}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;