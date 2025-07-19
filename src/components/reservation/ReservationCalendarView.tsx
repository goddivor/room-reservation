// components/ReservationCalendarView.tsx
import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, startOfWeek, endOfWeek, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, User, MapPin } from 'lucide-react';
import { ReservationStatusBadge } from './ReservationStatusBadge';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import Button from '../Button';
import type { Reservation } from '@/types/reservation.types';

interface ReservationCalendarViewProps {
  reservations: Reservation[];
  filter: 'all' | 'active' | 'archived';
  onViewDetails: (reservation: Reservation) => void;
}

interface CalendarDay {
  date: Date;
  reservations: Reservation[];
  isCurrentMonth: boolean;
  isToday: boolean;
}

export const ReservationCalendarView: React.FC<ReservationCalendarViewProps> = ({
  reservations,
  filter,
  onViewDetails
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const isArchived = filter === 'archived';

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  // Generate all days in the calendar view
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Group reservations by date
  const getReservationsForDate = (date: Date): Reservation[] => {
    return reservations.filter(reservation => {
      const checkIn = new Date(reservation.checkIn);
      const checkOut = new Date(reservation.checkOut);
      
      // Check if the date falls within the reservation period
      return date >= checkIn && date < checkOut;
    });
  };

  const calendarData: CalendarDay[] = calendarDays.map(date => ({
    date,
    reservations: getReservationsForDate(date),
    isCurrentMonth: isSameMonth(date, currentDate),
    isToday: isToday(date)
  }));

  const goToPreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    setSelectedDay(null);
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    setSelectedDay(null);
  };

  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const selectedDayData = selectedDay ? 
    calendarData.find(day => isSameDay(day.date, selectedDay)) : null;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Calendar Grid */}
      <div className="flex-1">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex gap-2">
            <Button onClick={goToPreviousMonth}>
              <ChevronLeft size={16} color="#6b7280" />
            </Button>
            <Button onClick={goToNextMonth}>
              <ChevronRight size={16} color="#6b7280" />
            </Button>
          </div>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-px mb-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className={`grid grid-cols-7 gap-px bg-gray-200 ${isArchived ? 'opacity-60' : ''}`}>
          {calendarData.map((day, index) => (
            <div
              key={index}
              onClick={() => setSelectedDay(day.date)}
              className={`
                min-h-24 bg-white p-2 cursor-pointer hover:bg-gray-50
                ${!day.isCurrentMonth ? 'text-gray-400 bg-gray-50' : ''}
                ${day.isToday ? 'bg-blue-50 border-2 border-blue-200' : ''}
                ${selectedDay && isSameDay(day.date, selectedDay) ? 'ring-2 ring-blue-500' : ''}
              `}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`text-sm ${day.isToday ? 'font-bold text-blue-600' : ''}`}>
                  {format(day.date, 'd')}
                </span>
                {day.reservations.length > 0 && (
                  <span className="text-xs bg-blue-500 text-white rounded-full px-1 min-w-4 text-center">
                    {day.reservations.length}
                  </span>
                )}
              </div>
              
              {/* Show first few reservations */}
              <div className="space-y-1">
                {day.reservations.slice(0, 2).map((reservation) => (
                  <div
                    key={reservation.id}
                    className={`text-xs p-1 rounded truncate ${
                      isArchived 
                        ? 'bg-gray-100 text-gray-500' 
                        : reservation.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : reservation.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                    }`}
                  >
                    Room {reservation.room.number}
                  </div>
                ))}
                {day.reservations.length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{day.reservations.length - 2} more
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Day Details Sidebar */}
      <div className="lg:w-80 bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {selectedDay ? format(selectedDay, 'EEEE, MMMM d, yyyy') : 'Select a day'}
          </h3>
        </div>
        
        <div className="p-4">
          {selectedDayData && selectedDayData.reservations.length > 0 ? (
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                {selectedDayData.reservations.length} reservation
                {selectedDayData.reservations.length > 1 ? 's' : ''}
              </div>
              
              {selectedDayData.reservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className={`p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 ${
                    isArchived ? 'opacity-60' : ''
                  }`}
                  onClick={() => onViewDetails(reservation)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {reservation.user.avatar ? (
                        <img
                          className="h-8 w-8 rounded-full object-cover"
                          src={reservation.user.avatar}
                          alt={`${reservation.user.firstName} ${reservation.user.lastName}`}
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <User size={16} color="#9ca3af" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {reservation.user.firstName} {reservation.user.lastName}
                        </span>
                        <ReservationStatusBadge status={reservation.status} />
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                        <MapPin size={14} color="#6b7280" />
                        Room {reservation.room.number} • {reservation.room.type}
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        {format(reservation.checkIn, 'MMM d')} - {format(reservation.checkOut, 'MMM d')} • {reservation.guests} guest{reservation.guests > 1 ? 's' : ''}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(reservation.totalAmount, reservation.payment.currency)}
                        </span>
                        <PaymentStatusBadge 
                          status={reservation.payment.status}
                          method={reservation.payment.method}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : selectedDay ? (
            <p className="text-gray-500 text-sm">No reservations for this day</p>
          ) : (
            <p className="text-gray-500 text-sm">Click on a day to see reservations</p>
          )}
        </div>
      </div>
    </div>
  );
};