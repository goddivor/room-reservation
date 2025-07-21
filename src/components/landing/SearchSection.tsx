import React, { useState } from 'react';
import { Calendar, SearchNormal } from 'iconsax-react';

const SearchSection: React.FC = () => {
    const [checkIn, setCheckIn] = useState<string>('');
    const [checkOut, setCheckOut] = useState<string>('');

    const handleSearch = () => {
        if (!checkIn || !checkOut) {
            alert('Please select both check-in and check-out dates');
            return;
        }
        
        if (new Date(checkIn) >= new Date(checkOut)) {
            alert('Check-out date must be after check-in date');
            return;
        }

        // Handle search logic here
        console.log('Searching rooms from', checkIn, 'to', checkOut);
    };

    // Get today's date in YYYY-MM-DD format for min date
    const today = new Date().toISOString().split('T')[0];

    return (
        <section className="relative -mt-52 z-20">
            <div className="max-w-6xl mx-auto px-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto border">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                        {/* Check-in Date */}
                        <div className="space-y-2">
                            <label htmlFor="checkin" className="block text-sm font-semibold text-gray-700">
                                Check-in Date
                            </label>
                            <div className="relative">
                                <Calendar 
                                    size={20} 
                                    color="#6B7280"
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10" 
                                />
                                <input
                                    id="checkin"
                                    type="date"
                                    value={checkIn}
                                    onChange={(e) => setCheckIn(e.target.value)}
                                    min={today}
                                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 hover:bg-white"
                                />
                            </div>
                        </div>

                        {/* Check-out Date */}
                        <div className="space-y-2">
                            <label htmlFor="checkout" className="block text-sm font-semibold text-gray-700">
                                Check-out Date
                            </label>
                            <div className="relative">
                                <Calendar 
                                    size={20} 
                                    color="#6B7280"
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10" 
                                />
                                <input
                                    id="checkout"
                                    type="date"
                                    value={checkOut}
                                    onChange={(e) => setCheckOut(e.target.value)}
                                    min={checkIn || today}
                                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 hover:bg-white"
                                />
                            </div>
                        </div>

                        {/* Search Button */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-transparent select-none">
                                Search
                            </label>
                            <button
                                onClick={handleSearch}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
                            >
                                <SearchNormal size={20} color="#FFFFFF" />
                                Search Rooms
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SearchSection;