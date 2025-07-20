/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Filter, Calendar, User } from 'iconsax-react';
import type { ReservationFilters } from '../../types/reservation.types';
// import SearchInput from '../forms/search-input';
import Button from '../actions/button';
import { SearchInput } from '../forms/search-input';

interface ReservationFiltersProps {
  onFiltersChange: (filters: ReservationFilters) => void;
  totalCount: number;
  filteredCount: number;
}

const ReservationFiltersComponent: React.FC<ReservationFiltersProps> = ({
  onFiltersChange,
  totalCount,
  filteredCount
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ReservationFilters>({});

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
    { value: 'checked_in', label: 'Checked In', color: 'bg-green-100 text-green-800' },
    { value: 'checked_out', label: 'Checked Out', color: 'bg-gray-100 text-gray-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
    { value: 'no_show', label: 'No Show', color: 'bg-orange-100 text-orange-800' }
  ];


  const roomTypeOptions = [
    { value: 'single', label: 'Single Room' },
    { value: 'double', label: 'Double Room' },
    { value: 'suite', label: 'Suite' },
    { value: 'family', label: 'Family Room' },
    { value: 'deluxe', label: 'Deluxe Room' }
  ];

  const handleSearchChange = (query: string) => {
    const newFilters = { ...filters, searchQuery: query || undefined };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleStatusChange = (status: string, checked: boolean) => {
    const currentStatus = filters.status || [];
    const newStatus = checked
      ? [...currentStatus, status as any]
      : currentStatus.filter(s => s !== status);
    
    const newFilters = { 
      ...filters, 
      status: newStatus.length > 0 ? newStatus : undefined 
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };


  const handleRoomTypeChange = (type: string, checked: boolean) => {
    const currentTypes = filters.roomType || [];
    const newTypes = checked
      ? [...currentTypes, type]
      : currentTypes.filter(t => t !== type);
    
    const newFilters = { 
      ...filters, 
      roomType: newTypes.length > 0 ? newTypes : undefined 
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFiltersChange({});
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
        <div className="flex-1 max-w-md">
          <SearchInput 
            placeholder="Search reservations..."
            onChange={e => handleSearchChange(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Showing {filteredCount} of {totalCount} reservations
          </div>
          
          <Button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter size={16} color="#6B7280" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </Button>

          {activeFiltersCount > 0 && (
            <Button
              onClick={clearFilters}
              className="text-gray-500 hover:text-gray-700"
            >
              Clear all
            </Button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="border-t border-gray-200 pt-4 space-y-6">
          {/* Reservation Status Filter */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={16} color="#6B7280" />
              <h4 className="font-medium text-gray-900">Reservation Status</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.status?.includes(option.value as any) || false}
                    onChange={(e) => handleStatusChange(option.value, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${option.color}`}>
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Room Type Filter */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <User size={16} color="#6B7280" />
              <h4 className="font-medium text-gray-900">Room Type</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {roomTypeOptions.map((option) => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.roomType?.includes(option.value) || false}
                    onChange={(e) => handleRoomTypeChange(option.value, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Guest Range Filter */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <User size={16} color="#6B7280" />
              <h4 className="font-medium text-gray-900">Number of Guests</h4>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Min:</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={filters.guestRange?.min || ''}
                  onChange={(e) => {
                    const value = e.target.value ? parseInt(e.target.value) : undefined;
                    const newFilters = {
                      ...filters,
                      guestRange: value !== undefined ? { 
                        min: value, 
                        max: filters.guestRange?.max || 10 
                      } : undefined
                    };
                    setFilters(newFilters);
                    onFiltersChange(newFilters);
                  }}
                  className="w-20 px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Max:</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={filters.guestRange?.max || ''}
                  onChange={(e) => {
                    const value = e.target.value ? parseInt(e.target.value) : undefined;
                    const newFilters = {
                      ...filters,
                      guestRange: value !== undefined ? { 
                        min: filters.guestRange?.min || 1, 
                        max: value 
                      } : undefined
                    };
                    setFilters(newFilters);
                    onFiltersChange(newFilters);
                  }}
                  className="w-20 px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationFiltersComponent;