import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Calendar, 
  Refresh, 
  Calendar1,
  Timer1,
  People,
  TickSquare,
  CloseSquare,
  Warning2
} from 'iconsax-react';
import type { Room, RoomStatus } from '../../types/room.types';

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  reservationId?: string;
  reservedBy?: string;
  title?: string;
  attendees?: number;
}

interface RoomAvailabilityProps {
  room: Room;
  date?: string; // ISO date string, defaults to today
  onTimeSlotClick?: (slot: TimeSlot, room: Room) => void;
  onRoomStatusClick?: (room: Room) => void;
  showHeader?: boolean;
  compact?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number; // in seconds, default 30
  className?: string;
}

const RoomAvailability: React.FC<RoomAvailabilityProps> = ({
  room,
  date = new Date().toISOString().split('T')[0],
  onTimeSlotClick,
  onRoomStatusClick,
  showHeader = true,
  compact = false,
  autoRefresh = true,
  refreshInterval = 30,
  className = '',
}) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  }));

  // Generate time slots based on room availability
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const selectedDate = new Date(date);
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[selectedDate.getDay()] as keyof typeof room.availability;
    
    // Get day availability (simplified - in real app would come from API)
    const dayAvailability = room.availability[dayName];
    
    // Check if dayAvailability is actually a DayAvailability object
    if (!dayAvailability || Array.isArray(dayAvailability) || !('isAvailable' in dayAvailability) || !dayAvailability.isAvailable) {
      return slots;
    }

    // Generate 30-minute slots from open to close time
    const openTime = dayAvailability.openTime;
    const closeTime = dayAvailability.closeTime;
    
    const [openHour, openMinute] = openTime.split(':').map(Number);
    const [closeHour, closeMinute] = closeTime.split(':').map(Number);
    
    let currentHour = openHour;
    let currentMinute = openMinute;
    
    while (currentHour < closeHour || (currentHour === closeHour && currentMinute < closeMinute)) {
      const startTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      
      // Calculate end time (30 minutes later)
      let endHour = currentHour;
      let endMinute = currentMinute + 30;
      
      if (endMinute >= 60) {
        endHour += 1;
        endMinute = 0;
      }
      
      const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
      
      // Mock availability data (in real app would come from API)
      const isReserved = Math.random() > 0.7; // 30% chance of being reserved
      
      slots.push({
        id: `${room.id}-${startTime}-${endTime}`,
        startTime,
        endTime,
        isAvailable: !isReserved && room.status === 'available',
        reservationId: isReserved ? `res-${Math.random().toString(36).substr(2, 9)}` : undefined,
        reservedBy: isReserved ? 'Jean Dupont' : undefined,
        title: isReserved ? 'Réunion équipe' : undefined,
        attendees: isReserved ? Math.floor(Math.random() * 10) + 1 : undefined,
      });
      
      // Move to next slot
      currentMinute += 30;
      if (currentMinute >= 60) {
        currentHour += 1;
        currentMinute = 0;
      }
    }
    
    return slots;
  };

  // Load availability data
  const loadAvailability = React.useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const slots = generateTimeSlots();
      setTimeSlots(slots);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading availability:', error);
    } finally {
      setLoading(false);
    }
  }, [room.id, date]); // Dependencies for useCallback

  // Auto-refresh effect
  useEffect(() => {
    loadAvailability();
    
    if (autoRefresh) {
      const interval = setInterval(loadAvailability, refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [loadAvailability, autoRefresh, refreshInterval]); // Now loadAvailability is stable

  // Current time update effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }));
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Get status styling
  const getStatusStyling = (status: RoomStatus) => {
    const styles = {
      available: { bg: 'bg-green-100', text: 'text-green-800', icon: TickSquare, iconColor: '#10B981' },
      occupied: { bg: 'bg-red-100', text: 'text-red-800', icon: CloseSquare, iconColor: '#EF4444' },
      reserved: { bg: 'bg-blue-100', text: 'text-blue-800', icon: Calendar1, iconColor: '#3B82F6' },
      maintenance: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Warning2, iconColor: '#F59E0B' },
      out_of_service: { bg: 'bg-gray-100', text: 'text-gray-800', icon: CloseSquare, iconColor: '#6B7280' },
    };
    return styles[status];
  };

  // Check if time slot is current
  const isCurrentTimeSlot = (slot: TimeSlot): boolean => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    if (date !== today) return false;
    
    const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();
    const [startHour, startMinute] = slot.startTime.split(':').map(Number);
    const [endHour, endMinute] = slot.endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    
    return currentTimeMinutes >= startMinutes && currentTimeMinutes < endMinutes;
  };

  // Handle slot click
  const handleSlotClick = (slot: TimeSlot) => {
    onTimeSlotClick?.(slot, room);
  };

  // Get available slots count
  const availableSlots = timeSlots.filter(slot => slot.isAvailable).length;
  const totalSlots = timeSlots.length;

  const statusStyle = getStatusStyling(room.status);
  const StatusIcon = statusStyle.icon;

  return (
    <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>
      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <StatusIcon size={20} color={statusStyle.iconColor} />
            <div>
              <h3 className="font-medium text-gray-900">
                {compact ? room.code : room.name}
              </h3>
              {!compact && (
                <p className="text-sm text-gray-500">
                  Disponibilité du {new Date(date).toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long' 
                  })}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Current Status */}
            <button
              onClick={() => onRoomStatusClick?.(room)}
              className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text} hover:opacity-80`}
            >
              {room.status === 'available' && 'Disponible'}
              {room.status === 'occupied' && 'Occupée'}
              {room.status === 'reserved' && 'Réservée'}
              {room.status === 'maintenance' && 'Maintenance'}
              {room.status === 'out_of_service' && 'Hors service'}
            </button>
            
            {/* Refresh Button */}
            <button
              onClick={loadAvailability}
              disabled={loading}
              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              title="Actualiser"
            >
              <Refresh size={16} color="currentColor" className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Summary */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <TickSquare size={14} color="#10B981" />
              <span>{availableSlots} disponibles</span>
            </div>
            <div className="flex items-center space-x-1">
              <Timer1 size={14} color="#6B7280" />
              <span>{totalSlots} créneaux</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock size={14} color="#6B7280" />
              <span>{currentTime}</span>
            </div>
          </div>
          
          {/* Last Updated */}
          <div className="text-xs text-gray-400">
            Maj: {lastUpdated.toLocaleTimeString('fr-FR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>

        {/* Time Slots Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : timeSlots.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar size={24} color="#6B7280" className="mx-auto mb-2" />
            <p className="text-sm">Aucun créneau disponible pour cette date</p>
          </div>
        ) : (
          <div className={`grid gap-2 ${compact ? 'grid-cols-4 sm:grid-cols-6' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'}`}>
            {timeSlots.map((slot) => {
              const isCurrent = isCurrentTimeSlot(slot);
              const isClickable = onTimeSlotClick && (slot.isAvailable || slot.reservationId);
              
              return (
                <button
                  key={slot.id}
                  onClick={() => isClickable && handleSlotClick(slot)}
                  disabled={!isClickable}
                  className={`
                    p-3 rounded-lg border text-left transition-all duration-200
                    ${isCurrent ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
                    ${slot.isAvailable 
                      ? 'border-green-200 bg-green-50 hover:bg-green-100 text-green-800' 
                      : 'border-red-200 bg-red-50 text-red-800'
                    }
                    ${isClickable ? 'hover:shadow-sm cursor-pointer' : 'cursor-default'}
                    ${compact ? 'p-2' : 'p-3'}
                  `}
                  title={
                    slot.isAvailable 
                      ? `Créneau disponible: ${slot.startTime} - ${slot.endTime}`
                      : `Réservé: ${slot.title || 'Réunion'} par ${slot.reservedBy}`
                  }
                >
                  <div className={`text-xs font-medium ${compact ? 'text-xs' : 'text-sm'}`}>
                    {slot.startTime}
                  </div>
                  {!compact && (
                    <>
                      <div className="text-xs text-gray-600 mt-1">
                        {slot.endTime}
                      </div>
                      {slot.reservationId && (
                        <div className="mt-2">
                          <div className="text-xs font-medium truncate">
                            {slot.title || 'Réservée'}
                          </div>
                          {slot.attendees && (
                            <div className="flex items-center space-x-1 mt-1">
                              <People size={10} color="currentColor" />
                              <span className="text-xs">{slot.attendees}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                  
                  {isCurrent && (
                    <div className="absolute top-1 right-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Legend */}
        {!compact && timeSlots.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
                  <span className="text-gray-600">Disponible</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
                  <span className="text-gray-600">Réservé</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">Maintenant</span>
                </div>
              </div>
              
              {autoRefresh && (
                <div className="text-gray-400">
                  Auto-refresh: {refreshInterval}s
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomAvailability;