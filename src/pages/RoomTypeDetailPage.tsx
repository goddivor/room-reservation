/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockRoomTypes, mockRooms } from '@/mocks/rooms.mocks';
import Navbar from '@/components/landing/Navbar';
import type { Room } from '@/types/room.types';
import { 
  ArrowLeft, 
  Users, 
  MapPin, 
  Maximize, 
  Star,
  Wifi,
  Coffee,
  Utensils,
  Car,
  ChevronLeft,
  ChevronRight,
  Check,
  Calendar
} from 'lucide-react';

const RoomTypeDetailPage: React.FC = () => {
  const { roomTypeId } = useParams<{ roomTypeId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [checkInDate, setCheckInDate] = useState<string>('');
  const [checkOutDate, setCheckOutDate] = useState<string>('');

  // Get dates from URL parameters
  useEffect(() => {
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    if (checkIn) setCheckInDate(checkIn);
    if (checkOut) setCheckOutDate(checkOut);
  }, [searchParams]);

  const roomType = mockRoomTypes.find(type => type.id === roomTypeId);
  const roomsOfType = mockRooms.filter(room => room.typeId === roomTypeId && room.status === 'available');

  // Generate mock images for rooms
  const generateRoomImages = (roomId: string) => {
    const baseImages = [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
    ];
    return baseImages.map((url, index) => `${url}&seed=${roomId}-${index}`);
  };

  const roomsWithImages = useMemo(() => {
    return roomsOfType.map(room => ({
      ...room,
      images: generateRoomImages(room.id)
    }));
  }, [roomsOfType]);

  if (!roomType) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="text-center p-8">
          <CardContent>
            <h1 className="text-2xl font-bold mb-4">Room Type Not Found</h1>
            <Button onClick={() => navigate('/rooms')}>
              Back to Rooms
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const prices = roomsWithImages.map(room => room.dailyRate);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const avgRating = 4.2 + Math.random() * 0.8;

  const nextImage = () => {
    if (selectedRoom) {
      setCurrentImageIndex((prev) => 
        prev === selectedRoom.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedRoom) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedRoom.images.length - 1 : prev - 1
      );
    }
  };

  const nextHeroImage = () => {
    if (roomType?.images) {
      setHeroImageIndex((prev) => 
        prev === roomType.images!.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevHeroImage = () => {
    if (roomType?.images) {
      setHeroImageIndex((prev) => 
        prev === 0 ? roomType.images!.length - 1 : prev - 1
      );
    }
  };

  // Auto-slide hero images
  useEffect(() => {
    if (roomType?.images && roomType.images.length > 1) {
      const interval = setInterval(nextHeroImage, 5000);
      return () => clearInterval(interval);
    }
  }, [roomType?.images]);

  const handleBookRoom = (room: Room) => {
    // Navigate to booking page with room details
    console.log('Booking room:', room);
    // In a real app, this would navigate to a booking form
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />
      
      {/* Hero Section with Images */}
      <div className="relative h-96 overflow-hidden">
        {roomType?.images && roomType.images.length > 0 && (
          <>
            <div className="absolute inset-0">
              <img
                src={roomType.images[heroImageIndex]}
                alt={roomType.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 backdrop-blur-sm bg-opacity-40" />
            </div>
            
            {/* Navigation Arrows */}
            {roomType.images.length > 1 && (
              <>
                <button
                  onClick={prevHeroImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextHeroImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
            
            {/* Dots Indicator */}
            {roomType.images.length > 1 && (
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
                {roomType.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setHeroImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === heroImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
            
            {/* Content Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="max-w-4xl text-center text-white px-4">
                <h1 className="text-5xl font-bold mb-4">{roomType.name}</h1>
                <p className="text-xl mb-6">{roomType.description}</p>
                <div className="flex items-center justify-center gap-6 mb-6">
                  <Badge variant="outline" className="flex items-center gap-1 bg-white/10 backdrop-blur-sm text-white border-white/30">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {avgRating.toFixed(1)}
                  </Badge>
                  <Badge variant="outline" className="bg-white/10 backdrop-blur-sm text-white border-white/30">
                    {roomsWithImages.length} rooms available
                  </Badge>
                </div>
                <div className="text-4xl font-bold mb-2">
                  €{minPrice}
                  {minPrice !== maxPrice && (
                    <span className="text-2xl"> - €{maxPrice}</span>
                  )}
                </div>
                <div className="text-lg opacity-90">per night</div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Navigation Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/rooms')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Rooms
            </Button>
            
            {/* Date Display */}
            {(checkInDate || checkOutDate) && (
              <div className="flex items-center gap-4 text-sm text-gray-600">
                {checkInDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Check-in: {new Date(checkInDate).toLocaleDateString()}
                  </div>
                )}
                {checkOutDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Check-out: {new Date(checkOutDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Room Type Features */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What's Included</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Wifi className="w-5 h-5 text-blue-600" />
                <span>Free WiFi</span>
              </div>
              <div className="flex items-center gap-2">
                <Coffee className="w-5 h-5 text-brown-600" />
                <span>Kitchen Access</span>
              </div>
              <div className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-green-600" />
                <span>Fully Equipped</span>
              </div>
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-purple-600" />
                <span>Parking Available</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Rooms */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Available Rooms ({roomsWithImages.length})
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roomsWithImages.map((room) => (
              <Card key={room.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div 
                  className="relative h-48 overflow-hidden cursor-pointer"
                  onClick={() => setSelectedRoom(room)}
                >
                  <img
                    src={room.images[0]}
                    alt={`Room ${room.code}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-white/90 text-gray-900">
                      Room {room.code}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <Badge variant="outline" className="bg-white/90 text-gray-900">
                      +{room.images.length - 1} photos
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-lg">
                      Room {room.code}
                    </CardTitle>
                    <Badge variant="outline">
                      Floor {room.floor}
                    </Badge>
                  </div>
                  
                  <CardDescription className="mb-4">
                    {room.description}
                  </CardDescription>

                  <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {room.capacity} guests
                    </div>
                    <div className="flex items-center gap-1">
                      <Maximize className="w-4 h-4" />
                      {room.area}m²
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {room.building}
                    </div>
                    <div className="flex items-center gap-1">
                      {room.hasBalcony && <Check className="w-4 h-4 text-green-600" />}
                      {room.hasBalcony ? 'Balcony' : 'No Balcony'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        €{room.dailyRate}
                      </div>
                      <div className="text-sm text-gray-500">per night</div>
                    </div>
                    
                    <Button onClick={() => handleBookRoom(room)}>
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {roomsWithImages.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <CardTitle className="mb-2">No rooms available</CardTitle>
              <CardDescription>
                All rooms of this type are currently occupied or under maintenance
              </CardDescription>
              <Button onClick={() => navigate('/rooms')} className="mt-4">
                Browse Other Room Types
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Enhanced Room Detail Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 backdrop-blur-2xl bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative max-w-6xl max-h-[95vh] w-full mx-4 bg-white rounded-2xl overflow-hidden shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setSelectedRoom(null)}
              className="absolute top-6 right-6 z-20 bg-black/20 backdrop-blur-sm hover:bg-black/30 text-white p-2 rounded-full transition-all"
            >
              ✕
            </button>
            
            <div className="flex flex-col lg:flex-row max-h-[95vh]">
              {/* Image Section */}
              <div className="lg:w-2/3 relative">
                <div className="relative h-64 lg:h-full min-h-[400px]">
                  <img
                    src={selectedRoom.images[currentImageIndex]}
                    alt={`Room ${selectedRoom.code}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {selectedRoom.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/20 backdrop-blur-sm hover:bg-black/30 text-white p-3 rounded-full transition-all"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/20 backdrop-blur-sm hover:bg-black/30 text-white p-3 rounded-full transition-all"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}
                  
                  {/* Image Counter */}
                  <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {selectedRoom.images.length}
                  </div>
                  
                  {/* Dots Indicator */}
                  {selectedRoom.images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                      {selectedRoom.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Details Section */}
              <div className="lg:w-1/3 p-8 overflow-y-auto">
                <div className="space-y-6">
                  {/* Header */}
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      Room {selectedRoom.code}
                    </h2>
                    <p className="text-gray-600 text-lg">
                      {selectedRoom.description}
                    </p>
                  </div>
                  
                  {/* Quick Info */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">{selectedRoom.capacity} guests</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Maximize className="w-5 h-5 text-green-600" />
                      <span className="font-medium">{selectedRoom.area}m²</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-purple-600" />
                      <span className="font-medium">{selectedRoom.building}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-sm">
                        Floor {selectedRoom.floor}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Amenities */}
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Amenities</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {selectedRoom.hasWifi && (
                        <div className="flex items-center gap-3 p-2">
                          <Wifi className="w-5 h-5 text-blue-600" />
                          <span>Free WiFi</span>
                        </div>
                      )}
                      {selectedRoom.hasKitchen && (
                        <div className="flex items-center gap-3 p-2">
                          <Utensils className="w-5 h-5 text-green-600" />
                          <span>Kitchen</span>
                        </div>
                      )}
                      {selectedRoom.hasAirConditioning && (
                        <div className="flex items-center gap-3 p-2">
                          <Coffee className="w-5 h-5 text-purple-600" />
                          <span>Air Conditioning</span>
                        </div>
                      )}
                      {selectedRoom.hasBalcony && (
                        <div className="flex items-center gap-3 p-2">
                          <Check className="w-5 h-5 text-green-600" />
                          <span>Private Balcony</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Equipment */}
                  {selectedRoom.equipment && selectedRoom.equipment.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Equipment</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedRoom.equipment.map((equipment) => (
                          <Badge key={equipment.id} variant="outline" className="text-sm">
                            {equipment.icon} {equipment.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Pricing */}
                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-3xl font-bold text-gray-900">
                          €{selectedRoom.dailyRate}
                        </div>
                        <div className="text-gray-500">per night</div>
                        {selectedRoom.monthlyRate && (
                          <div className="text-sm text-gray-500">
                            Monthly: €{selectedRoom.monthlyRate}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => handleBookRoom(selectedRoom)}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl text-lg"
                    >
                      Book This Room
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomTypeDetailPage;