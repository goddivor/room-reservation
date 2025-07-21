import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Eye } from 'iconsax-react';

interface RoomType {
    id: number;
    name: string;
    description: string;
    images: string[];
    features: string[];
    price: string;
}

interface RoomTypeCardProps {
    roomType: RoomType;
}

const RoomTypeCard: React.FC<RoomTypeCardProps> = ({ roomType }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Auto-slide functionality
    useEffect(() => {
        if (!isAutoPlaying || roomType.images.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => 
                (prevIndex + 1) % roomType.images.length
            );
        }, 4000); // Change image every 4 seconds

        return () => clearInterval(interval);
    }, [isAutoPlaying, roomType.images.length]);

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => 
            (prevIndex + 1) % roomType.images.length
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) => 
            prevIndex === 0 ? roomType.images.length - 1 : prevIndex - 1
        );
    };

    const goToImage = (index: number) => {
        setCurrentImageIndex(index);
    };

    return (
        <div 
            className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            {/* Image Carousel */}
            <div className="relative h-64 md:h-80 overflow-hidden group">
                <div 
                    className="flex transition-transform duration-500 ease-in-out h-full"
                    style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                >
                    {roomType.images.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`${roomType.name} - Image ${index + 1}`}
                            className="w-full h-full object-cover flex-shrink-0"
                            loading="lazy"
                        />
                    ))}
                </div>

                {/* Navigation Arrows */}
                {roomType.images.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            aria-label="Previous image"
                        >
                            <ArrowLeft size={20} color="#FFFFFF" />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            aria-label="Next image"
                        >
                            <ArrowRight size={20} color="#FFFFFF" />
                        </button>
                    </>
                )}

                {/* Image Indicators */}
                {roomType.images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {roomType.images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToImage(index)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                    index === currentImageIndex 
                                        ? 'bg-white scale-125' 
                                        : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                                }`}
                                aria-label={`Go to image ${index + 1}`}
                            />
                        ))}
                    </div>
                )}

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-30"></div>
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    {roomType.name}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                    {roomType.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {roomType.features.map((feature, index) => (
                        <span
                            key={index}
                            className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium"
                        >
                            {feature}
                        </span>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                    <div className="text-right">
                        <span className="text-2xl font-bold text-blue-600">
                            {roomType.price}
                        </span>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                            <Eye size={18} color="#FFFFFF" />
                            View Details
                        </button>
                        <button className="border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 font-semibold py-3 px-6 rounded-xl transition-all duration-300">
                            Book Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomTypeCard;