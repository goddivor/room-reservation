/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select } from '@/components/ui/select';
import { mockRoomTypes } from '@/mocks/rooms.mocks';
import { mockRooms } from '@/mocks/rooms.mocks';
import { mockEquipments } from '@/mocks/rooms.mocks';
import Navbar from '@/components/landing/Navbar';
import { 
  Search, 
  Star,
  ArrowRight,
  Filter
} from 'lucide-react';

interface RoomFilters {
  priceRange: number[];
  roomTypes: string[];
  locations: string[];
  guests: number;
  equipment: string[];
  features: string[];
  searchQuery: string;
}

const RoomsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [filters, setFilters] = useState<RoomFilters>({
    priceRange: [0, 300],
    roomTypes: [],
    locations: [],
    guests: 1,
    equipment: [],
    features: [],
    searchQuery: ''
  });

  const [checkInDate, setCheckInDate] = useState<string>('');
  const [checkOutDate, setCheckOutDate] = useState<string>('');

  // Get check-in/check-out dates from URL parameters
  useEffect(() => {
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    if (checkIn) setCheckInDate(checkIn);
    if (checkOut) setCheckOutDate(checkOut);
  }, [searchParams]);

  const [showFilters, setShowFilters] = useState(false);

  // Generate room type data with availability and pricing from actual rooms
  const roomTypesWithData = useMemo(() => {
    return mockRoomTypes.map(type => {
      const roomsOfType = mockRooms.filter(room => room.typeId === type.id);
      
      // Filter available rooms based on dates if provided
      let availableRooms = roomsOfType.filter(room => room.status === 'available');
      
      // If check-in and check-out dates are provided, filter based on availability
      if (checkInDate && checkOutDate) {
        
        availableRooms = availableRooms.filter(() => {
          // For now, we'll assume all rooms are available unless there's a conflict
          // In a real application, this would check against actual reservations
          // For demo purposes, randomly make some rooms unavailable for the selected dates
          const isAvailableForDates = Math.random() > 0.3; // 70% availability rate
          return isAvailableForDates;
        });
      }
      
      const prices = roomsOfType.map(room => room.dailyRate);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const avgRating = 4.2 + Math.random() * 0.8; // Mock rating

      return {
        ...type,
        availableCount: availableRooms.length,
        totalCount: roomsOfType.length,
        minPrice,
        maxPrice,
        avgRating,
        // Mock banner images
        bannerImage: `https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`,
        features: ['WiFi', 'AC', 'Kitchen'].slice(0, Math.floor(Math.random() * 3) + 1)
      };
    });
  }, [checkInDate, checkOutDate]);

  // Filter room types based on filters
  const filteredRoomTypes = useMemo(() => {
    return roomTypesWithData.filter(roomType => {
      // Get rooms of this type
      const roomsOfType = mockRooms.filter(room => room.typeId === roomType.id && room.status === 'available');
      
      // Price filter
      if (roomType.minPrice > filters.priceRange[1] || roomType.maxPrice < filters.priceRange[0]) {
        return false;
      }

      // Room type filter
      if (filters.roomTypes.length > 0 && !filters.roomTypes.includes(roomType.id)) {
        return false;
      }

      // Location filter
      if (filters.locations.length > 0) {
        const hasMatchingLocation = roomsOfType.some(room => 
          room.building && filters.locations.includes(room.building)
        );
        if (!hasMatchingLocation) return false;
      }

      // Equipment filter
      if (filters.equipment.length > 0) {
        const hasMatchingEquipment = roomsOfType.some(room =>
          filters.equipment.every(equipId => room.equipmentIds.includes(equipId))
        );
        if (!hasMatchingEquipment) return false;
      }

      // Features filter
      if (filters.features.length > 0) {
        const hasMatchingFeatures = roomsOfType.some(room => {
          return filters.features.every(featureId => {
            switch(featureId) {
              case 'balcony': return room.hasBalcony;
              case 'kitchen': return room.hasKitchen;
              case 'bathroom': return room.hasBathroom;
              case 'air_conditioning': return room.hasAirConditioning;
              case 'wifi': return room.hasWifi;
              default: return false;
            }
          });
        });
        if (!hasMatchingFeatures) return false;
      }

      // Search query
      if (filters.searchQuery && !roomType.name.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
        return false;
      }

      // Only show types with available rooms
      return roomType.availableCount > 0;
    });
  }, [roomTypesWithData, filters]);

  const handleRoomTypeClick = (roomTypeId: string) => {
    const params = new URLSearchParams();
    if (checkInDate) params.append('checkIn', checkInDate);
    if (checkOutDate) params.append('checkOut', checkOutDate);
    
    const queryString = params.toString();
    navigate(`/rooms/${roomTypeId}${queryString ? `?${queryString}` : ''}`);
  };

  const updateFilters = (key: keyof RoomFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = (key: 'roomTypes' | 'locations' | 'equipment' | 'features', value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value) 
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 300],
      roomTypes: [],
      locations: [],
      guests: 1,
      equipment: [],
      features: [],
      searchQuery: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar from landing page */}
      <Navbar />

      {/* Main Content - add top padding for fixed navbar */}
      <div className="pt-16">
        {/* Date display section if dates are provided */}
        {(checkInDate || checkOutDate) && (
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                {checkInDate && (
                  <div>
                    <span className="font-medium">Check-in:</span> {new Date(checkInDate).toLocaleDateString()}
                  </div>
                )}
                {checkOutDate && (
                  <div>
                    <span className="font-medium">Check-out:</span> {new Date(checkOutDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Date Selection Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Select Your Stay Dates</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="checkin-rooms" className="block text-sm font-medium text-gray-700">
                  Check-in Date
                </label>
                <input
                  id="checkin-rooms"
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="checkout-rooms" className="block text-sm font-medium text-gray-700">
                  Check-out Date
                </label>
                <input
                  id="checkout-rooms"
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  min={checkInDate || new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={() => {
                    // Trigger a re-render by updating the URL params
                    const params = new URLSearchParams(window.location.search);
                    if (checkInDate) params.set('checkIn', checkInDate);
                    if (checkOutDate) params.set('checkOut', checkOutDate);
                    window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
                  }}
                  className="w-full"
                >
                  Update Availability
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search rooms..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.searchQuery}
                  onChange={(e) => updateFilters('searchQuery', e.target.value)}
                />
              </div>
              
              <Select
                className='text-gray-900'
                value={filters.guests.toString()} 
                onChange={(e) => updateFilters('guests', parseInt(e.target.value))}
              >
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests</option>
                <option value="5">5+ Guests</option>
              </Select>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 min-w-fit">€{filters.priceRange[0]} - €{filters.priceRange[1]}</span>
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => updateFilters('priceRange', value)}
                  max={500}
                  min={0}
                  step={10}
                  className="flex-1"
                />
              </div>

              <Button 
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="text-gray-900 border-gray-300"
              >
                <Filter className="w-4 h-4 mr-2" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Filters
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Room Types */}
                <div>
                  <h3 className="font-semibold mb-3">Room Types</h3>
                  <div className="space-y-2">
                    {mockRoomTypes.map(type => (
                      <div key={type.id} className="flex items-center space-x-2">
                        <Checkbox
                          checked={filters.roomTypes.includes(type.id)}
                          onChange={() => toggleArrayFilter('roomTypes', type.id)}
                        />
                        <label className="text-sm cursor-pointer flex-1">
                          {type.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <h3 className="font-semibold mb-3">Building</h3>
                  <div className="space-y-2">
                    {Array.from(new Set(mockRooms.map(room => room.building).filter(Boolean))).map(building => (
                      <div key={building} className="flex items-center space-x-2">
                        <Checkbox
                          checked={filters.locations.includes(building!)}
                          onChange={() => toggleArrayFilter('locations', building!)}
                        />
                        <label className="text-sm cursor-pointer flex-1">
                          {building}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Equipment */}
                <div>
                  <h3 className="font-semibold mb-3">Equipment</h3>
                  <div className="space-y-2">
                    {mockEquipments.slice(0, 6).map(equipment => (
                      <div key={equipment.id} className="flex items-center space-x-2">
                        <Checkbox
                          checked={filters.equipment.includes(equipment.id)}
                          onChange={() => toggleArrayFilter('equipment', equipment.id)}
                        />
                        <label className="text-sm cursor-pointer flex-1">
                          {equipment.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h3 className="font-semibold mb-3">Features</h3>
                  <div className="space-y-2">
                    {[
                      { id: 'balcony', name: 'Balcony' },
                      { id: 'kitchen', name: 'Kitchen' },
                      { id: 'bathroom', name: 'Private Bathroom' },
                      { id: 'air_conditioning', name: 'Air Conditioning' },
                      { id: 'wifi', name: 'WiFi' },
                    ].map(feature => (
                      <div key={feature.id} className="flex items-center space-x-2">
                        <Checkbox
                          checked={filters.features.includes(feature.id)}
                          onChange={() => toggleArrayFilter('features', feature.id)}
                        />
                        <label className="text-sm cursor-pointer flex-1">
                          {feature.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Room Types Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Available Room Types
                </h2>
                <p className="text-gray-600">
                  {filteredRoomTypes.length} room type{filteredRoomTypes.length !== 1 ? 's' : ''} available
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRoomTypes.map((roomType) => (
                <Card 
                  key={roomType.id} 
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                  onClick={() => handleRoomTypeClick(roomType.id)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={roomType.bannerImage}
                      alt={roomType.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary" className="bg-white/90 text-gray-900">
                        {roomType.availableCount} available
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge variant="default" className="bg-black/70 text-white">
                        <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                        {roomType.avgRating.toFixed(1)}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-xl">{roomType.name}</CardTitle>
                      <span className="text-sm text-gray-500">{roomType.icon}</span>
                    </div>
                    
                    <CardDescription className="mb-4">
                      {roomType.description}
                    </CardDescription>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {roomType.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          €{roomType.minPrice}
                          {roomType.minPrice !== roomType.maxPrice && (
                            <span className="text-sm text-gray-500"> - €{roomType.maxPrice}</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">per night</div>
                      </div>
                      
                      <Button className="group">
                        View Rooms
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredRoomTypes.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="text-gray-400 mb-4">
                    <Search className="w-16 h-16 mx-auto" />
                  </div>
                  <CardTitle className="mb-2">No rooms found</CardTitle>
                  <CardDescription>
                    Try adjusting your filters to see more results
                  </CardDescription>
                  <Button onClick={clearFilters} className="mt-4">
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomsPage;