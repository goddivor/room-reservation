import React, { useState } from 'react';
import { HambergerMenu, CloseSquare } from 'iconsax-react';
import { Link } from 'react-router';

const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const menuItems = [
        { name: 'Home', href: '#home', active: true },
        { name: 'Rooms', href: '#rooms' },
        { name: 'About', href: '#about' },
        { name: 'Contact', href: '#contact' }
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            RoomReserve
                        </h1>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            {menuItems.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                                        item.active
                                            ? 'text-blue-600 bg-blue-50'
                                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                    }`}
                                >
                                    {item.name}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Login Now Button */}
                    <div className="hidden md:block">
                        <Link to="/auth/login">
                            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
                                Log Now
                            </button>
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="text-gray-700 hover:text-blue-600 transition-colors duration-300"
                        >
                            {isMenuOpen ? (
                                <CloseSquare size={24} color="currentColor" />
                            ) : (
                                <HambergerMenu size={24} color="currentColor" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {menuItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                                    item.active
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                }`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.name}
                            </a>
                        ))}
                        <Link to="/auth/login">
                            <button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2 px-6 rounded-full transition-all duration-300">
                                Log Now
                            </button>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;