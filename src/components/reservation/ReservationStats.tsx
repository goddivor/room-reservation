// components/ReservationStats.tsx
import React from 'react';
import { CalendarCheck, Clock, CheckCircle, TrendingUp, DollarSign } from 'lucide-react';
import type { Reservation } from '@/types/reservation.types';


interface ReservationStatsProps {
  reservations: Reservation[];
}

interface StatCard {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  colorClass: string;
}

export const ReservationStats: React.FC<ReservationStatsProps> = ({ reservations }) => {
  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate statistics
  const stats = React.useMemo(() => {
    const confirmed = reservations.filter(r => r.status === 'confirmed').length;
    const pending = reservations.filter(r => r.status === 'pending').length;
    const completed = reservations.filter(r => r.status === 'completed').length;
    const cancelled = reservations.filter(r => r.status === 'cancelled').length;
    
    const totalRevenue = reservations
      .filter(r => r.payment.status === 'paid')
      .reduce((sum, r) => sum + r.totalAmount, 0);
    
    const pendingRevenue = reservations
      .filter(r => r.payment.status === 'pending')
      .reduce((sum, r) => sum + r.totalAmount, 0);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const thisMonthReservations = reservations.filter(r => {
      const reservationDate = new Date(r.createdAt);
      return reservationDate.getMonth() === currentMonth && 
             reservationDate.getFullYear() === currentYear;
    }).length;

    return {
      confirmed,
      pending,
      completed,
      cancelled,
      totalRevenue,
      pendingRevenue,
      thisMonthReservations
    };
  }, [reservations]);

  const statCards: StatCard[] = [
    {
      title: 'Total Reservations',
      value: reservations.length,
      icon: CalendarCheck,
      trend: {
        value: 12,
        isPositive: true
      },
      colorClass: 'text-blue-600 bg-blue-100'
    },
    {
      title: 'Confirmed',
      value: stats.confirmed,
      icon: CheckCircle,
      colorClass: 'text-green-600 bg-green-100'
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: Clock,
      colorClass: 'text-yellow-600 bg-yellow-100'
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: CheckCircle,
      colorClass: 'text-purple-600 bg-purple-100'
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      trend: {
        value: 8.5,
        isPositive: true
      },
      colorClass: 'text-emerald-600 bg-emerald-100'
    },
    {
      title: 'Pending Revenue',
      value: formatCurrency(stats.pendingRevenue),
      icon: Clock,
      colorClass: 'text-orange-600 bg-orange-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">
                {stat.title}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stat.value}
              </p>
              {stat.trend && (
                <div className="flex items-center mt-2">
                  <TrendingUp 
                    size={14} 
                    color={stat.trend.isPositive ? '#059669' : '#dc2626'}
                    className={stat.trend.isPositive ? 'rotate-0' : 'rotate-180'}
                  />
                  <span className={`text-xs font-medium ml-1 ${
                    stat.trend.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.trend.isPositive ? '+' : '-'}{Math.abs(stat.trend.value)}%
                  </span>
                  <span className="text-xs text-gray-500 ml-1">vs last month</span>
                </div>
              )}
            </div>
            <div className={`p-3 rounded-lg ${stat.colorClass}`}>
              <stat.icon size={24} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};