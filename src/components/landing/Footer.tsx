import React from 'react';
import { Call, Sms, Location, Instagram, Facebook, Youtube } from 'iconsax-react';
import { TwitterLogoIcon } from '@phosphor-icons/react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    const footerSections = [
        {
            title: 'Quick Links',
            links: [
                { name: 'Home', href: '#home' },
                { name: 'Rooms & Suites', href: '#rooms' },
                { name: 'About Us', href: '#about' },
                { name: 'Contact', href: '#contact' },
                { name: 'Special Offers', href: '#offers' }
            ]
        },
        {
            title: 'Room Types',
            links: [
                { name: 'Studio', href: '#studio' },
                { name: 'Simple Room', href: '#simple' },
                { name: 'Room with Living Area', href: '#living' },
                { name: '2 Bedrooms + Living', href: '#two-bed' },
                { name: '3 Bedrooms + Living', href: '#three-bed' }
            ]
        },
        {
            title: 'Services',
            links: [
                { name: 'Room Service', href: '#room-service' },
                { name: 'Housekeeping', href: '#housekeeping' },
                { name: 'Concierge', href: '#concierge' },
                { name: 'Business Center', href: '#business' },
                { name: 'Parking', href: '#parking' }
            ]
        },
        {
            title: 'Policies',
            links: [
                { name: 'Booking Policy', href: '#booking-policy' },
                { name: 'Cancellation Policy', href: '#cancellation' },
                { name: 'Privacy Policy', href: '#privacy' },
                { name: 'Terms of Service', href: '#terms' },
                { name: 'FAQ', href: '#faq' }
            ]
        }
    ];

    const socialLinks = [
        {
            name: 'Facebook',
            icon: <Facebook size={24} color="#FFFFFF" />,
            href: '#facebook',
            hoverColor: 'hover:bg-blue-600'
        },
        {
            name: 'Instagram',
            icon: <Instagram size={24} color="#FFFFFF" />,
            href: '#instagram',
            hoverColor: 'hover:bg-pink-600'
        },
        {
            name: 'Twitter',
            icon: <TwitterLogoIcon size={24} color="#FFFFFF" />,
            href: '#twitter',
            hoverColor: 'hover:bg-blue-400'
        },
        {
            name: 'YouTube',
            icon: <Youtube size={24} color="#FFFFFF" />,
            href: '#youtube',
            hoverColor: 'hover:bg-red-600'
        }
    ];

    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 py-16">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
                    {/* Company Info */}
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                            RoomReserve
                        </h2>
                        <p className="text-gray-300 mb-6 leading-relaxed">
                            Experience luxury and comfort like never before. Our premium accommodations 
                            are designed to provide you with the perfect blend of elegance and convenience.
                        </p>
                        
                        {/* Contact Info */}
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <Call size={18} color="#60A5FA" />
                                <span className="text-gray-300">+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Sms size={18} color="#60A5FA" />
                                <span className="text-gray-300">info@roomreserve.com</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Location size={18} color="#60A5FA" />
                                <span className="text-gray-300">123 Luxury Avenue, Downtown</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer Links */}
                    {footerSections.map((section, index) => (
                        <div key={index}>
                            <h3 className="text-lg font-semibold mb-4 text-white">
                                {section.title}
                            </h3>
                            <ul className="space-y-2">
                                {section.links.map((link, linkIndex) => (
                                    <li key={linkIndex}>
                                        <a 
                                            href={link.href}
                                            className="text-gray-300 hover:text-blue-400 transition-colors duration-300 text-sm"
                                        >
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Social Media Section */}
                <div className="border-t border-gray-700 pt-8 mt-12">
                    <div className="flex flex-col lg:flex-row justify-between items-center">
                        <div className="mb-6 lg:mb-0">
                            <h3 className="text-xl font-semibold mb-2">Stay Connected</h3>
                            <p className="text-gray-300">Follow us on social media for updates and exclusive offers</p>
                        </div>
                        
                        {/* Social Links */}
                        <div className="flex space-x-4">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    aria-label={social.name}
                                    className={`bg-gray-700 ${social.hoverColor} p-3 rounded-full transition-all duration-300 transform hover:scale-110`}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Awards and Certifications */}
                <div className="border-t border-gray-700 pt-8 mt-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-lg mb-2">
                                <div className="text-2xl font-bold">★★★★★</div>
                            </div>
                            <p className="text-gray-400 text-sm">5-Star Rating</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg mb-2">
                                <div className="text-xl font-bold">ISO</div>
                            </div>
                            <p className="text-gray-400 text-sm">Certified Quality</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-4 rounded-lg mb-2">
                                <div className="text-xl font-bold">ECO</div>
                            </div>
                            <p className="text-gray-400 text-sm">Green Certified</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-4 rounded-lg mb-2">
                                <div className="text-xl font-bold">AAA</div>
                            </div>
                            <p className="text-gray-400 text-sm">Premium Member</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-gray-700 bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="text-gray-400 text-sm mb-4 md:mb-0">
                            © {currentYear} RoomReserve. All rights reserved. 
                            <span className="hidden md:inline"> | Designed with luxury in mind.</span>
                        </div>
                        <div className="flex space-x-6 text-sm">
                            <a href="#privacy" className="text-gray-400 hover:text-white transition-colors duration-300">
                                Privacy Policy
                            </a>
                            <a href="#terms" className="text-gray-400 hover:text-white transition-colors duration-300">
                                Terms of Service
                            </a>
                            <a href="#cookies" className="text-gray-400 hover:text-white transition-colors duration-300">
                                Cookie Policy
                            </a>
                            <a href="#sitemap" className="text-gray-400 hover:text-white transition-colors duration-300">
                                Sitemap
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;