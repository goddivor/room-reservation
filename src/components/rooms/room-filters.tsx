/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { 
  Filter, 
  ArrowDown2, 
  ArrowUp2, 
  CloseCircle,
  People,
  Buildings2,
  Monitor,
  Camera,
  Edit2,
  Setting4,
  TickSquare
} from 'iconsax-react';
import type { Room, RoomFilters, RoomType, RoomStatus } from '../../types/room.types';

interface RoomFiltersProps {
  filters: RoomFilters;
  onFiltersChange: (filters: RoomFilters) => void;
  rooms: Room[]; // For dynamic filter options
  className?: string;
  isCollapsible?: boolean;
  defaultExpanded?: boolean;
}

const RoomFiltersComponent: React.FC<RoomFiltersProps> = ({
  filters,
  onFiltersChange,
  rooms,
  className = '',
  isCollapsible = true,
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Handle filter changes
  const handleFilterChange = (key: keyof RoomFilters, value: any) => {
    const newFilters = { ...filters };
    
    if (value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    
    onFiltersChange(newFilters);
  };

  // Handle capacity range changes
  const handleCapacityChange = (type: 'min' | 'max', value: string) => {
    const numValue = value ? parseInt(value) : undefined;
    const capacity = filters.capacity || {};
    
    const newCapacity = {
      ...capacity,
      [type]: numValue,
    };

    // Remove undefined values
    if (!newCapacity.min) delete newCapacity.min;
    if (!newCapacity.max) delete newCapacity.max;

    handleFilterChange('capacity', Object.keys(newCapacity).length > 0 ? newCapacity : undefined);
  };

  // Handle amenities selection
  const handleAmenityToggle = (amenityId: string) => {
    const currentAmenities = filters.amenities || [];
    const newAmenities = currentAmenities.includes(amenityId)
      ? currentAmenities.filter(id => id !== amenityId)
      : [...currentAmenities, amenityId];
    
    handleFilterChange('amenities', newAmenities.length > 0 ? newAmenities : undefined);
  };

  // Clear all filters
  const clearAllFilters = () => {
    onFiltersChange({});
  };

  // Get filter counts
  const activeFiltersCount = Object.keys(filters).filter(key => {
    const value = filters[key as keyof RoomFilters];
    return value !== undefined && value !== '' && !(Array.isArray(value) && value.length === 0);
  }).length;

  // Get unique values from rooms
  const uniqueBuildings = React.useMemo(() => {
    const buildings = rooms.map(room => room.building);
    return Array.from(new Map(buildings.map(b => [b.id, b])).values());
  }, [rooms]);

  const uniqueFloors = React.useMemo(() => {
    return Array.from(new Set(rooms.map(room => room.floor.floorNumber))).sort((a, b) => a - b);
  }, [rooms]);

  const allAmenities = React.useMemo(() => {
    const amenityMap = new Map();
    rooms.forEach(room => {
      room.amenities.forEach(amenity => {
        amenityMap.set(amenity.id, amenity);
      });
    });
    return Array.from(amenityMap.values());
  }, [rooms]);

  const roomTypes: { value: RoomType; label: string }[] = [
    { value: 'meeting', label: 'Réunion' },
    { value: 'conference', label: 'Conférence' },
    { value: 'training', label: 'Formation' },
    { value: 'office', label: 'Bureau' },
    { value: 'coworking', label: 'Coworking' },
    { value: 'presentation', label: 'Présentation' },
    { value: 'phone_booth', label: 'Cabine téléphonique' },
  ];

  const roomStatuses: { value: RoomStatus; label: string; color: string }[] = [
    { value: 'available', label: 'Disponible', color: '#10B981' },
    { value: 'occupied', label: 'Occupée', color: '#EF4444' },
    { value: 'reserved', label: 'Réservée', color: '#3B82F6' },
    { value: 'maintenance', label: 'Maintenance', color: '#F59E0B' },
    { value: 'out_of_service', label: 'Hors service', color: '#6B7280' },
  ];

  return (
    <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Filter size={20} color="#374151" />
          <h3 className="text-lg font-medium text-gray-900">Filtres</h3>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-red-600 hover:text-red-800 flex items-center space-x-1"
            >
              <CloseCircle size={16} color="currentColor" />
              <span>Tout effacer</span>
            </button>
          )}
          
          {isCollapsible && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              {isExpanded ? (
                <ArrowUp2 size={20} color="currentColor" />
              ) : (
                <ArrowDown2 size={20} color="currentColor" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Filters Content */}
      {(!isCollapsible || isExpanded) && (
        <div className="p-4 space-y-6">
          {/* Quick Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de salle
              </label>
              <select
                value={filters.type || ''}
                onChange={(e) => handleFilterChange('type', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tous les types</option>
                {roomTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tous les statuts</option>
                {roomStatuses.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Building Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bâtiment
              </label>
              <select
                value={filters.building || ''}
                onChange={(e) => handleFilterChange('building', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tous les bâtiments</option>
                {uniqueBuildings.map(building => (
                  <option key={building.id} value={building.id}>
                    {building.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Capacity and Floor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Capacity Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <People size={16} color="#374151" className="inline mr-1" />
                Capacité
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <input
                    type="number"
                    placeholder="Min"
                    min="1"
                    value={filters.capacity?.min || ''}
                    onChange={(e) => handleCapacityChange('min', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Max"
                    min="1"
                    value={filters.capacity?.max || ''}
                    onChange={(e) => handleCapacityChange('max', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Floor Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Buildings2 size={16} color="#374151" className="inline mr-1" />
                Étage
              </label>
              <select
                value={filters.floor || ''}
                onChange={(e) => handleFilterChange('floor', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tous les étages</option>
                {uniqueFloors.map(floor => (
                  <option key={floor} value={floor}>
                    Étage {floor}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Equipment Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Équipements essentiels
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <label className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.hasProjector || false}
                  onChange={(e) => handleFilterChange('hasProjector', e.target.checked ? true : undefined)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Monitor size={16} color="#6B7280" />
                <span className="text-sm text-gray-700">Projecteur</span>
              </label>

              <label className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.hasWhiteboard || false}
                  onChange={(e) => handleFilterChange('hasWhiteboard', e.target.checked ? true : undefined)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Edit2 size={16} color="#6B7280" />
                <span className="text-sm text-gray-700">Tableau</span>
              </label>

              <label className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.hasVideoConference || false}
                  onChange={(e) => handleFilterChange('hasVideoConference', e.target.checked ? true : undefined)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Camera size={16} color="#6B7280" />
                <span className="text-sm text-gray-700">Visioconférence</span>
              </label>

              <label className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.isAccessible || false}
                  onChange={(e) => handleFilterChange('isAccessible', e.target.checked ? true : undefined)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <TickSquare size={16} color="#6B7280" />
                <span className="text-sm text-gray-700">Accessible PMR</span>
              </label>
            </div>
          </div>

          {/* Amenities */}
          {allAmenities.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Équipements supplémentaires
              </label>
              <div className="max-h-40 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {allAmenities.map(amenity => (
                    <label
                      key={amenity.id}
                      className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={(filters.amenities || []).includes(amenity.id)}
                        onChange={() => handleAmenityToggle(amenity.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <Setting4 size={14} color="#6B7280" />
                      <span className="text-sm text-gray-700">{amenity.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Active Filters Summary */}
          {activeFiltersCount > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Filtres actifs ({activeFiltersCount})
                </span>
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Tout effacer
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {Object.entries(filters).map(([key, value]) => {
                  if (value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
                    return null;
                  }

                  let displayValue = '';
                  switch (key) {
                    case 'type':
                      displayValue = roomTypes.find(t => t.value === value)?.label || value as string;
                      break;
                    case 'status':
                      displayValue = roomStatuses.find(s => s.value === value)?.label || value as string;
                      break;
                    case 'building':
                      displayValue = uniqueBuildings.find(b => b.id === value)?.name || value as string;
                      break;
                    case 'floor':
                      displayValue = `Étage ${value}`;
                      break;
                    case 'capacity':
                      { const cap = value as { min?: number; max?: number };
                      if (cap.min && cap.max) {
                        displayValue = `${cap.min}-${cap.max} pers.`;
                      } else if (cap.min) {
                        displayValue = `Min ${cap.min} pers.`;
                      } else if (cap.max) {
                        displayValue = `Max ${cap.max} pers.`;
                      }
                      break; }
                    case 'hasProjector':
                      displayValue = 'Projecteur';
                      break;
                    case 'hasWhiteboard':
                      displayValue = 'Tableau';
                      break;
                    case 'hasVideoConference':
                      displayValue = 'Visioconférence';
                      break;
                    case 'isAccessible':
                      displayValue = 'Accessible PMR';
                      break;
                    case 'amenities':
                      { const amenityNames = (value as string[]).map(id => 
                        allAmenities.find(a => a.id === id)?.name || id
                      );
                      displayValue = amenityNames.join(', ');
                      break; }
                    default:
                      displayValue = String(value);
                  }

                  if (!displayValue) return null;

                  return (
                    <span
                      key={key}
                      className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                    >
                      <span>{displayValue}</span>
                      <button
                        onClick={() => handleFilterChange(key as keyof RoomFilters, undefined)}
                        className="hover:text-blue-900"
                      >
                        <CloseCircle size={12} color="currentColor" />
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RoomFiltersComponent;