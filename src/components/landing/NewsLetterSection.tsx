import React, { useState } from 'react';
import { Sms, TickSquare, Gift } from 'iconsax-react';

const NewsletterSection: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        console.log('Newsletter subscription:', email);
        setIsSubscribed(true);
        setEmail('');
        setIsLoading(false);

        // Reset success state after 3 seconds
        setTimeout(() => setIsSubscribed(false), 3000);
    };

    const benefits = [
        {
            icon: <Gift size={20} color="#F59E0B" />,
            text: 'Exclusive deals and early access to promotions'
        },
        {
            icon: <Sms size={20} color="#F59E0B" />,
            text: 'Latest news and updates about our properties'
        },
        {
            icon: <TickSquare size={20} color="#F59E0B" />,
            text: 'Special member-only room rates and packages'
        }
    ];

    return (
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700">
            <div className="max-w-6xl mx-auto px-4">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl">
                    <div className="text-center mb-8">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                            Stay in the Loop
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Subscribe to our newsletter and never miss out on exclusive offers, 
                            luxury experiences, and insider updates from RoomReserve.
                        </p>
                    </div>

                    {/* Benefits */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center space-x-3 p-4 bg-amber-50 rounded-xl">
                                <div className="bg-amber-100 p-2 rounded-lg">
                                    {benefit.icon}
                                </div>
                                <p className="text-gray-700 text-sm font-medium">
                                    {benefit.text}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Newsletter Form */}
                    <div className="max-w-md mx-auto">
                        {isSubscribed ? (
                            <div className="text-center p-6 bg-green-50 rounded-2xl border border-green-200">
                                <div className="flex justify-center mb-4">
                                    <div className="bg-green-100 p-3 rounded-full">
                                        <TickSquare size={32} color="#10B981" />
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-green-800 mb-2">
                                    Successfully Subscribed!
                                </h3>
                                <p className="text-green-700">
                                    Thank you for joining our newsletter. Check your email for a welcome message!
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="relative flex-1">
                                        <Sms 
                                            size={20} 
                                            color="#6B7280"
                                            className="absolute left-4 top-1/2 transform -translate-y-1/2"
                                        />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email address"
                                            required
                                            className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-gray-700"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg ${
                                            isLoading ? 'opacity-70 cursor-not-allowed' : ''
                                        }`}
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center gap-2">
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                Subscribing...
                                            </div>
                                        ) : (
                                            'Subscribe'
                                        )}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 text-center">
                                    By subscribing, you agree to our Privacy Policy and Terms of Service. 
                                    You can unsubscribe at any time.
                                </p>
                            </form>
                        )}
                    </div>

                    {/* Additional Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-200">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
                            <div className="text-gray-600">Happy Subscribers</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600 mb-2">Weekly</div>
                            <div className="text-gray-600">Newsletter Frequency</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600 mb-2">30%</div>
                            <div className="text-gray-600">Exclusive Savings</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewsletterSection;