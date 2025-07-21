import React, { useState, useEffect } from 'react';
import { Star, QuoteUp } from 'iconsax-react';

interface Testimonial {
    id: number;
    name: string;
    location: string;
    rating: number;
    comment: string;
    avatar: string;
    roomType: string;
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        name: 'Sarah Johnson',
        location: 'New York, USA',
        rating: 5,
        comment: 'Absolutely stunning accommodation! The attention to detail and luxury amenities exceeded all expectations. Will definitely return!',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
        roomType: 'Studio'
    },
    {
        id: 2,
        name: 'Michael Chen',
        location: 'Tokyo, Japan',
        rating: 5,
        comment: 'Perfect for our family vacation. The kids loved the spacious living area and we appreciated the fully equipped kitchen.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
        roomType: '2 Bedrooms + Living Area'
    },
    {
        id: 3,
        name: 'Emma Rodriguez',
        location: 'Barcelona, Spain',
        rating: 5,
        comment: 'The service was impeccable and the room was beautifully designed. The view from our balcony was breathtaking!',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
        roomType: '3 Bedrooms + Living Area'
    },
    {
        id: 4,
        name: 'David Thompson',
        location: 'London, UK',
        rating: 5,
        comment: 'Outstanding business trip accommodation. The work desk and living area made it perfect for both meetings and relaxation.',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
        roomType: 'Room with Living Area'
    },
    {
        id: 5,
        name: 'Lisa Anderson',
        location: 'Sydney, Australia',
        rating: 5,
        comment: 'Clean, comfortable, and perfectly located. The simple room had everything we needed for our romantic getaway.',
        avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
        roomType: 'Simple Room'
    }
];

const TestimonialsSection: React.FC = () => {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTestimonial((prev) => 
                (prev + 1) % testimonials.length
            );
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
            <Star
                key={index}
                size={20}
                color={index < rating ? "#FFA500" : "#E5E7EB"}
                variant={index < rating ? "Bold" : "Outline"}
            />
        ));
    };

    return (
        <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                        What Our Guests Say
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Don't just take our word for it. Here's what our satisfied guests have to say about their experience
                    </p>
                </div>

                {/* Main Testimonial Display */}
                <div className="relative bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-4xl mx-auto">
                    <div className="absolute top-6 left-6">
                        <QuoteUp size={40} color="#3B82F6" className="opacity-20" />
                    </div>

                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            {renderStars(testimonials[currentTestimonial].rating)}
                        </div>

                        <blockquote className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed italic">
                            "{testimonials[currentTestimonial].comment}"
                        </blockquote>

                        <div className="flex items-center justify-center space-x-4">
                            <img
                                src={testimonials[currentTestimonial].avatar}
                                alt={testimonials[currentTestimonial].name}
                                className="w-16 h-16 rounded-full object-cover border-4 border-blue-100"
                            />
                            <div className="text-left">
                                <h4 className="font-bold text-gray-800 text-lg">
                                    {testimonials[currentTestimonial].name}
                                </h4>
                                <p className="text-gray-600">
                                    {testimonials[currentTestimonial].location}
                                </p>
                                <p className="text-blue-600 text-sm font-medium">
                                    Stayed in: {testimonials[currentTestimonial].roomType}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Dots */}
                    <div className="flex justify-center space-x-2 mt-8">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentTestimonial(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    index === currentTestimonial 
                                        ? 'bg-blue-600 scale-125' 
                                        : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                                aria-label={`Go to testimonial ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
                    <div className="text-center bg-white rounded-xl p-6 shadow-lg">
                        <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
                        <div className="text-gray-600">Guest Satisfaction</div>
                    </div>
                    <div className="text-center bg-white rounded-xl p-6 shadow-lg">
                        <div className="text-3xl font-bold text-blue-600 mb-2">2,500+</div>
                        <div className="text-gray-600">Happy Guests</div>
                    </div>
                    <div className="text-center bg-white rounded-xl p-6 shadow-lg">
                        <div className="text-3xl font-bold text-blue-600 mb-2">4.9</div>
                        <div className="text-gray-600">Average Rating</div>
                    </div>
                    <div className="text-center bg-white rounded-xl p-6 shadow-lg">
                        <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
                        <div className="text-gray-600">Return Rate</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;