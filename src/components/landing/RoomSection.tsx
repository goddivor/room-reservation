import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, ArrowRight, Eye, Heart } from 'iconsax-react';

interface Room {
    id: number;
    title: string;
    image: string;
    description: string;
    features: string[];
    price: string;
}

const rooms: Room[] = [
    {
        id: 1,
        title: 'Luxury Ocean View Suite',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Breathtaking ocean views with modern amenities and elegant design.',
        features: ['Ocean View', 'King Bed', 'Private Balcony'],
        price: 'From $299/night'
    },
    {
        id: 2,
        title: 'Modern City Apartment',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Contemporary urban living with skyline views and premium furnishings.',
        features: ['City View', 'Living Area', 'Full Kitchen'],
        price: 'From $199/night'
    },
    {
        id: 3,
        title: 'Cozy Mountain Retreat',
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Peaceful mountain setting with rustic charm and modern comfort.',
        features: ['Mountain View', 'Fireplace', 'Terrace'],
        price: 'From $179/night'
    },
    {
        id: 4,
        title: 'Elegant Garden Villa',
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Spacious villa surrounded by beautiful gardens and tranquil atmosphere.',
        features: ['Garden View', 'Private Pool', 'BBQ Area'],
        price: 'From $399/night'
    },
    {
        id: 5,
        title: 'Minimalist Studio Loft',
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Clean lines and open space perfect for the modern traveler.',
        features: ['High Ceilings', 'Workspace', 'Smart TV'],
        price: 'From $129/night'
    },
    {
        id: 6,
        title: 'Royal Heritage Suite',
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Classic elegance meets modern luxury in this sophisticated suite.',
        features: ['Antique Decor', 'Marble Bathroom'],
        price: 'From $549/night'
    }
];

const RoomsSection: React.FC = () => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Auto-scroll functionality
    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => 
                (prevIndex + 1) % Math.max(1, rooms.length - 2)
            );
        }, 4000);

        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => 
            (prevIndex + 1) % Math.max(1, rooms.length - 2)
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? Math.max(0, rooms.length - 3) : prevIndex - 1
        );
    };

    return (
        <section 
            id="rooms" 
            className="py-20 bg-gradient-to-b from-white to-gray-50"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                        Discover Our Rooms
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Explore our collection of beautifully designed accommodations, 
                        each offering unique charm and exceptional comfort for your perfect stay.
                    </p>
                </div>

                {/* Carousel Container */}
                <div className="relative">
                    {/* Navigation Arrows */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg hover:shadow-xl text-gray-700 p-3 rounded-full transition-all duration-300 z-10 hover:scale-110"
                        aria-label="Previous rooms"
                    >
                        <ArrowLeft size={24} color="#374151" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg hover:shadow-xl text-gray-700 p-3 rounded-full transition-all duration-300 z-10 hover:scale-110"
                        aria-label="Next rooms"
                    >
                        <ArrowRight size={24} color="#374151" />
                    </button>

                    {/* Cards Container */}
                    <div className="overflow-hidden pb-4 mx-12">
                        <div 
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentIndex * 33.333}%)` }}
                        >
                            {rooms.map((room) => (
                                <div
                                    key={room.id}
                                    className="w-1/3 flex-shrink-0 px-4"
                                >
                                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
                                        {/* Image */}
                                        <div className="relative h-64 overflow-hidden group">
                                            <img
                                                src={room.image}
                                                alt={room.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            
                                            {/* Overlay on hover */}
                                            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <div className="flex space-x-4">
                                                    <button className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-3 rounded-full transition-all duration-300">
                                                        <Eye size={20} color="#1F2937" />
                                                    </button>
                                                    <button className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-3 rounded-full transition-all duration-300">
                                                        <Heart size={20} color="#1F2937" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Price Badge */}
                                            <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                                {room.price}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-gray-800 mb-3">
                                                {room.title}
                                            </h3>
                                            <p className="text-gray-600 mb-4 leading-relaxed">
                                                {room.description}
                                            </p>

                                            {/* Features */}
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {room.features.map((feature, index) => (
                                                    <span
                                                        key={index}
                                                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium"
                                                    >
                                                        {feature}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Action Button */}
                                            <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105">
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Indicators */}
                    <div className="flex justify-center space-x-2 mt-8">
                        {Array.from({ length: Math.max(1, rooms.length - 2) }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    index === currentIndex 
                                        ? 'bg-blue-600 scale-125' 
                                        : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* View All Button */}
                <div className="text-center mt-12">
                    <button 
                        onClick={() => navigate('/rooms')}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                        View All Rooms
                    </button>
                </div>
            </div>
        </section>
    );
};

export default RoomsSection;