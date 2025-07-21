import React from 'react';
import RoomTypeCard from './RoomTypeCard';

// Hard-coded room types as requested
const roomTypes = [
    {
        id: 1,
        name: 'Studio',
        description: 'Perfect for solo travelers or couples seeking comfort and efficiency in a beautifully designed space.',
        images: [
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ],
        features: ['Kitchenette', 'Free WiFi', 'City View', 'Air Conditioning'],
        price: 'From $89/night'
    },
    {
        id: 2,
        name: 'Simple Room',
        description: 'Comfortable and well-appointed accommodation with all essential amenities for a pleasant stay.',
        images: [
            'https://images.unsplash.com/photo-1540518614846-7eded47d24e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1556020685-ae41abfc9365?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ],
        features: ['Queen Bed', 'Private Bathroom', 'Flat Screen TV', 'Mini Fridge'],
        price: 'From $119/night'
    },
    {
        id: 3,
        name: 'Room with Living Area',
        description: 'Spacious accommodation featuring a separate living area perfect for relaxation and work.',
        images: [
            'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ],
        features: ['Separate Living Area', 'Comfortable Sofa', 'Work Desk', 'Coffee Machine'],
        price: 'From $159/night'
    },
    {
        id: 4,
        name: '2 Bedrooms + Living Area',
        description: 'Ideal for families or groups, offering ample space with two bedrooms and a common living area.',
        images: [
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1615873968403-89e068629265?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ],
        features: ['2 Bedrooms', 'Spacious Living Room', 'Full Kitchen', 'Dining Area'],
        price: 'From $239/night'
    },
    {
        id: 5,
        name: '3 Bedrooms + Living Area',
        description: 'Our premium suite perfect for large families or extended stays, featuring three bedrooms and luxury amenities.',
        images: [
            'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ],
        features: ['3 Bedrooms', 'Large Living Room', 'Full Kitchen', 'Private Balcony'],
        price: 'From $349/night'
    }
];

const RoomTypesSection: React.FC = () => {
    return (
        <section id="rooms" className="py-20 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                        Our Room Collection
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Choose from our carefully curated selection of accommodations, 
                        each designed to provide the perfect balance of comfort, style, and luxury
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {roomTypes.map((roomType) => (
                        <RoomTypeCard 
                            key={roomType.id} 
                            roomType={roomType} 
                        />
                    ))}
                </div>

                {/* View All Rooms Button */}
                <div className="text-center mt-12">
                    <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
                        View All Available Rooms
                    </button>
                </div>
            </div>
        </section>
    );
};

export default RoomTypesSection;