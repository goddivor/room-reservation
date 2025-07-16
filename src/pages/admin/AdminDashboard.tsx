// src/pages/admin/AdminDashboard.tsx
import React from 'react';
import { 
  Buildings2, 
  People, 
  Calendar,
  TrendUp,
  Chart,
  Clock,
  TickSquare,
  Warning2
} from 'iconsax-react';

const AdminDashboard: React.FC = () => {
  // Mock data for dashboard
  const stats = {
    totalRooms: 12,
    totalUsers: 45,
    activeReservations: 8,
    monthlyBookings: 156,
    utilizationRate: 72,
    availableRooms: 7
  };

  const recentBookings = [
    {
      id: '1',
      roomName: 'Salle Zeus',
      userName: 'Marie Dubois',
      date: '2024-07-16',
      time: '14:00 - 16:00',
      status: 'confirmed'
    },
    {
      id: '2',
      roomName: 'Salle Hermès',
      userName: 'Thomas Martin',
      date: '2024-07-16',
      time: '10:00 - 12:00',
      status: 'pending'
    },
    {
      id: '3',
      roomName: 'Salle Athéna',
      userName: 'Sophie Laurent',
      date: '2024-07-17',
      time: '09:00 - 11:00',
      status: 'confirmed'
    }
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      confirmed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Confirmée' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'En attente' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Annulée' }
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
            <p className="text-gray-600 mt-1">
              Bienvenue dans l'interface d'administration
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock color="#6B7280" size={16} />
            <span>Dernière mise à jour: {new Date().toLocaleTimeString('fr-FR')}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total des salles</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRooms}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Buildings2 color="#1D4ED8" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <TrendUp color="#10B981" size={14} />
            <span className="text-green-600">+2 ce mois</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Utilisateurs actifs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <People color="#10B981" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <TrendUp color="#10B981" size={14} />
            <span className="text-green-600">+8 cette semaine</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Réservations actives</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeReservations}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Calendar color="#F59E0B" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-gray-600">En cours aujourd'hui</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Taux d'utilisation</p>
              <p className="text-2xl font-bold text-gray-900">{stats.utilizationRate}%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Chart color="#7C3AED" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <TrendUp color="#10B981" size={14} />
            <span className="text-green-600">+5% vs mois dernier</span>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Réservations récentes</h3>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Voir tout
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentBookings.map((booking) => {
                  const statusStyle = getStatusBadge(booking.status);
                  return (
                    <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Buildings2 color="#1D4ED8" size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{booking.roomName}</p>
                          <p className="text-sm text-gray-600">{booking.userName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{booking.date}</p>
                        <p className="text-sm text-gray-600">{booking.time}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                        {statusStyle.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Alerts */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <Buildings2 color="#1D4ED8" size={20} />
                <span className="text-blue-900 font-medium">Ajouter une salle</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <People color="#10B981" size={20} />
                <span className="text-green-900 font-medium">Inviter un utilisateur</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                <Chart color="#7C3AED" size={20} />
                <span className="text-purple-900 font-medium">Voir les rapports</span>
              </button>
            </div>
          </div>

          {/* System Alerts */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertes système</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <TickSquare color="#10B981" size={20} className="mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-900">Système opérationnel</p>
                  <p className="text-xs text-green-700">Tous les services fonctionnent normalement</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                <Warning2 color="#F59E0B" size={20} className="mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-900">Maintenance prévue</p>
                  <p className="text-xs text-yellow-700">Dimanche 21 juillet à 2h00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;