/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft2, 
  ArrowRight2, 
  Calendar as CalendarIcon, 
  User,
  Home,
  DollarCircle,
} from 'iconsax-react';
import type { Reservation } from '../../types/reservation.types';
import Button from '../actions/button';
import Badge from '../badge';

interface ReservationCalendarProps {
  reservations: Reservation[];
  onReservationClick: (reservation: Reservation) => void;
}

const ReservationCalendar: React.FC<ReservationCalendarProps> = ({
  reservations,
  onReservationClick
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(currentYear, currentMonth, day));
    }

    return days;
  }, [currentMonth, currentYear]);

  // Get reservations for a specific date
  const getReservationsForDate = (date: Date) => {
    return reservations.filter(reservation => {
      const checkIn = new Date(reservation.checkInDate);
      const checkOut = new Date(reservation.checkOutDate);
      
      // Check if the date falls within the reservation period
      return date >= checkIn && date <= checkOut;
    });
  };

  // Check if a date is in the past
  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const getStatusColor = (status: Reservation['status']) => {
    const colors = {
      pending: 'bg-yellow-200 border-yellow-300',
      confirmed: 'bg-blue-200 border-blue-300',
      checked_in: 'bg-green-200 border-green-300',
      checked_out: 'bg-gray-200 border-gray-300',
      cancelled: 'bg-red-200 border-red-300',
      no_show: 'bg-orange-200 border-orange-300'
    };
    return colors[status] || 'bg-gray-200 border-gray-300';
  };

  const selectedDateReservations = selectedDate ? getReservationsForDate(selectedDate) : [];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {monthNames[currentMonth]} {currentYear}
            </h2>
            <Button onClick={goToToday}>
              Today
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button onClick={goToPreviousMonth}>
              <ArrowLeft2 size={16} color="#6B7280" />
            </Button>
            <Button onClick={goToNextMonth}>
              <ArrowRight2 size={16} color="#6B7280" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Grid */}
          <div className="lg:col-span-2">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-px mb-2">
              {dayNames.map(day => (
                <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
              {calendarDays.map((date, index) => {
                if (!date) {
                  return <div key={index} className="bg-gray-50 h-24"></div>;
                }

                const dayReservations = getReservationsForDate(date);
                const isToday = date.toDateString() === new Date().toDateString();
                const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
                const isPast = isPastDate(new Date(date));

                return (
                  <div
                    key={index}
                    onClick={() => setSelectedDate(date)}
                    className={`
                      bg-white h-24 p-2 cursor-pointer hover:bg-gray-50 transition-colors
                      ${isSelected ? 'ring-2 ring-blue-500' : ''}
                      ${isToday ? 'bg-blue-50' : ''}
                      ${isPast ? 'opacity-60' : ''}
                    `}
                  >
                    <div className={`
                      text-sm font-medium mb-1
                      ${isToday ? 'text-blue-600' : 'text-gray-900'}
                    `}>
                      {date.getDate()}
                    </div>
                    
                    <div className="space-y-1">
                      {dayReservations.slice(0, 2).map((reservation, _resIndex) => (
                        <div
                          key={reservation.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onReservationClick(reservation);
                          }}
                          className={`
                            text-xs p-1 rounded border cursor-pointer hover:opacity-80
                            ${getStatusColor(reservation.status)}
                            ${isPast && (reservation.status === 'checked_out' || reservation.status === 'cancelled') ? 'opacity-50' : ''}
                          `}
                          title={`${reservation.user.firstName} ${reservation.user.lastName} - ${reservation.room.code}`}
                        >
                          {/* <div className="truncate font-medium">
                            {reservation.user.firstName} {reservation.user.lastName}
                          </div> */}
                          <div className="truncate">
                            {reservation.room.code}
                          </div>
                        </div>
                      ))}
                      
                      {dayReservations.length > 2 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{dayReservations.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Date Details */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <CalendarIcon size={20} color="#6B7280" />
                <h3 className="font-medium text-gray-900">
                  {selectedDate ? selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Select a date'}
                </h3>
              </div>

              {selectedDate && (
                <div className="space-y-4">
                  {selectedDateReservations.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      No reservations for this date
                    </p>
                  ) : (
                    selectedDateReservations.map((reservation) => {
                      const isPast = isPastDate(selectedDate) && 
                        (reservation.status === 'checked_out' || reservation.status === 'cancelled');
                      
                      return (
                        <div
                          key={reservation.id}
                          onClick={() => onReservationClick(reservation)}
                          className={`
                            bg-white rounded-lg p-4 border cursor-pointer hover:shadow-md transition-shadow
                            ${isPast ? 'opacity-60' : ''}
                          `}
                        >
                          {/* Guest Info */}
                          <div className="flex items-center gap-3 mb-3">
                            <img
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${reservation.user.email}`}
                              alt={`${reservation.user.firstName} ${reservation.user.lastName}`}
                              className="w-8 h-8 rounded-full"
                            />
                            <div>
                              <div className="font-medium text-gray-900 text-sm">
                                {reservation.user.firstName} {reservation.user.lastName}
                              </div>
                              <div className="text-xs text-gray-500">
                                #{reservation.id.toUpperCase()}
                              </div>
                            </div>
                          </div>

                          {/* Room Info */}
                          <div className="flex items-center gap-2 mb-2 text-sm">
                            <Home size={14} color="#6B7280" />
                            <span className="text-gray-700">{reservation.room.code}</span>
                          </div>

                          {/* Guests */}
                          <div className="flex items-center gap-2 mb-2 text-sm">
                            <User size={14} color="#6B7280" />
                            <span className="text-gray-700">
                              {reservation.guests} {reservation.guests === 1 ? 'guest' : 'guests'}
                            </span>
                          </div>

                          {/* Amount */}
                          <div className="flex items-center gap-2 mb-3 text-sm">
                            <DollarCircle size={14} color="#6B7280" />
                            <span className="text-gray-700">
                              {formatCurrency(reservation.payment.amount, reservation.payment.currency)}
                            </span>
                          </div>

                          {/* Status */}
                          <div className="flex items-center justify-between">
                            <Badge variant={
                              reservation.status === 'pending' ? 'warning' :
                              reservation.status === 'confirmed' ? 'info' :
                              reservation.status === 'checked_in' ? 'success' :
                              reservation.status === 'checked_out' ? 'secondary' :
                              reservation.status === 'cancelled' ? 'danger' : 'warning'
                            }>
                              {reservation.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                            
                            <Badge variant={
                              reservation.payment.status === 'paid' ? 'success' :
                              reservation.payment.status === 'pending' ? 'warning' :
                              reservation.payment.status === 'failed' ? 'danger' :
                              reservation.payment.status === 'refunded' ? 'info' : 'secondary'
                            }>
                              {reservation.payment.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Status Legend</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-200 border border-yellow-300 rounded"></div>
                  <span>Pending</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-200 border border-blue-300 rounded"></div>
                  <span>Confirmed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-200 border border-green-300 rounded"></div>
                  <span>Checked In</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 border border-gray-300 rounded"></div>
                  <span>Checked Out</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-200 border border-red-300 rounded"></div>
                  <span>Cancelled</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-200 border border-orange-300 rounded"></div>
                  <span>No Show</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationCalendar;