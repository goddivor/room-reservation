import React, { type JSX } from 'react';
import { 
  Buildings2, 
  Location, 
  Monitor, 
  Lock1, 
  People, 
  Wifi, 
  Camera, 
  Edit2, 
  Setting4,
  Eye,
  Edit,
  Trash,
  Calendar
} from 'iconsax-react';
import type { Room, RoomStatus, RoomType } from '../../types/room.types';

interface RoomCardProps {
  room: Room;
  onView?: (room: Room) => void;
  onEdit?: (room: Room) => void;
  onDelete?: (room: Room) => void;
  onBook?: (room: Room) => void;
  showActions?: boolean;
  className?: string;
}

const RoomCard: React.FC<RoomCardProps> = ({
  room,
  onView,
  onEdit,
  onDelete,
  onBook,
  showActions = true,
  className = '',
}) => {
  // Get status badge styling
  const getStatusBadge = (status: RoomStatus) => {
    const styles = {
      available: { bg: 'bg-green-100', text: 'text-green-800', label: 'Disponible' },
      occupied: { bg: 'bg-red-100', text: 'text-red-800', label: 'Occupée' },
      maintenance: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Maintenance' },
      reserved: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Réservée' },
      out_of_service: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Hors service' },
    };
    return styles[status];
  };

  // Get type icon
  const getTypeIcon = (type: RoomType, size = 20) => {
    const icons = {
      meeting: <Location size={size} color="#059669" />,
      conference: <Buildings2 size={size} color="#1D4ED8" />,
      training: <Monitor size={size} color="#D97706" />,
      office: <Lock1 size={size} color="#7C3AED" />,
      coworking: <People size={size} color="#DC2626" />,
      presentation: <Monitor size={size} color="#0891B2" />,
      phone_booth: <Location size={size} color="#65A30D" />,
    };
    return icons[type];
  };

  // Get type label
  const getTypeLabel = (type: RoomType) => {
    const labels = {
      meeting: 'Réunion',
      conference: 'Conférence',
      training: 'Formation',
      office: 'Bureau',
      coworking: 'Coworking',
      presentation: 'Présentation',
      phone_booth: 'Cabine téléphonique',
    };
    return labels[type];
  };

  // Get amenity icon
  const getAmenityIcon = (amenityName: string) => {
    const icons: Record<string, JSX.Element> = {
      wifi: <Wifi size={14} color="#6B7280" />,
      projector: <Monitor size={14} color="#6B7280" />,
      camera: <Camera size={14} color="#6B7280" />,
      whiteboard: <Edit2 size={14} color="#6B7280" />,
      ac: <Setting4 size={14} color="#6B7280" />,
    };
    return icons[amenityName.toLowerCase()] || <Setting4 size={14} color="#6B7280" />;
  };

  const statusStyle = getStatusBadge(room.status);

  return (
    <div className={`bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 ${className}`}>
      {/* Room Image */}
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        {room.images && room.images.length > 0 ? (
          <img
            src={room.images[0]}
            alt={room.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            {getTypeIcon(room.type, 48)}
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
            {statusStyle.label}
          </span>
        </div>

        {/* Type Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-white text-gray-700 shadow-sm">
            {getTypeLabel(room.type)}
          </span>
        </div>
      </div>

      {/* Room Content */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {room.name}
            </h3>
            <p className="text-sm text-gray-500">
              {room.building.name} - Étage {room.floor.floorNumber}
            </p>
          </div>
          <div className="flex items-center space-x-1 text-gray-500 text-sm">
            <People size={16} color="#6B7280" />
            <span>{room.capacity}</span>
          </div>
        </div>

        {/* Room Code */}
        <div className="mb-3">
          <span className="text-xs font-mono bg-gray-100 text-gray-700 px-2 py-1 rounded">
            {room.code}
          </span>
        </div>

        {/* Description */}
        {room.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {room.description}
          </p>
        )}

        {/* Amenities */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {room.amenities.slice(0, 4).map((amenity) => (
              <div
                key={amenity.id}
                className="flex items-center space-x-1 bg-gray-50 px-2 py-1 rounded text-xs text-gray-600"
                title={amenity.description}
              >
                {getAmenityIcon(amenity.name)}
                <span>{amenity.name}</span>
              </div>
            ))}
            {room.amenities.length > 4 && (
              <span className="text-xs text-gray-500 px-2 py-1">
                +{room.amenities.length - 4} autres
              </span>
            )}
          </div>
        </div>

        {/* Quick Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span>{room.area}m²</span>
          {room.hourlyRate && (
            <span className="font-medium">{room.hourlyRate}€/h</span>
          )}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              {onView && (
                <button
                  onClick={() => onView(room)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Voir les détails"
                >
                  <Eye size={16} color="currentColor" />
                </button>
              )}
              {onEdit && (
                <button
                  onClick={() => onEdit(room)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Modifier"
                >
                  <Edit size={16} color="currentColor" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(room)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Supprimer"
                >
                  <Trash size={16} color="currentColor" />
                </button>
              )}
            </div>
            
            {onBook && room.status === 'available' && (
              <button
                onClick={() => onBook(room)}
                className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
              >
                <Calendar size={14} color="white" />
                <span>Réserver</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomCard;