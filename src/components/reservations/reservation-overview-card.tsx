import React from 'react';
import { Calendar, Clock, DollarSquare } from 'iconsax-react';
import type { ReservationStats } from '../../types/reservation.types';
import { CheckCircle, WarningCircle, XCircle } from '@phosphor-icons/react';

interface ReservationOverviewCardsProps {
  stats: ReservationStats | null;
  loading?: boolean;
}

const ReservationOverviewCards: React.FC<ReservationOverviewCardsProps> = ({ 
  stats, 
  loading = false 
}) => {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Reservations',
      value: stats.total,
      icon: Calendar,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSquare,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Pending Reservations',
      value: stats.pending,
      icon: Clock,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Confirmed Today',
      value: stats.confirmed,
      icon: CheckCircle,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    }
  ];

  const statusCards = [
    {
      title: 'Checked In',
      value: stats.checkedIn,
      icon: CheckCircle,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Checked Out',
      value: stats.checkedOut,
      icon: CheckCircle,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Cancelled',
      value: stats.cancelled,
      icon: XCircle,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'No Show',
      value: stats.noShow,
      icon: WarningCircle,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="space-y-6 mb-8">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {card.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${card.bgColor}`}>
                  <IconComponent 
                    size={24} 
                    color="#fff"
                    className={`${card.color}`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Status Overview */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reservation Status Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statusCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <div key={index} className={`p-4 rounded-lg ${card.bgColor} border border-gray-100`}>
                <div className="flex items-center space-x-3">
                  <IconComponent 
                    size={20} 
                    color={card.textColor.replace('text-', '#').replace('-600', '')}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {card.title}
                    </p>
                    <p className={`text-xl font-bold ${card.textColor}`}>
                      {card.value}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReservationOverviewCards;