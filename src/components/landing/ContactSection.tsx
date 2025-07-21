import React, { useState } from 'react';
import { Call, Sms, Location, Clock, Send2, MessageQuestion, Headphone } from 'iconsax-react';

interface ContactForm {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}

const ContactSection: React.FC = () => {
    const [formData, setFormData] = useState<ContactForm>({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log('Contact form submitted:', formData);
        alert('Thank you for your message! We will get back to you soon.');
        
        // Reset form
        setFormData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: ''
        });
        
        setIsSubmitting(false);
    };

    const contactMethods = [
        {
            icon: <Call size={28} color="green" />,
            title: 'Call Us',
            primary: '+33 1 42 96 73 18',
            secondary: 'Available 24/7',
            bgColor: 'from-green-500 to-emerald-600',
            hoverColor: 'hover:from-green-600 hover:to-emerald-700'
        },
        {
            icon: <Sms size={28} color="blue" />,
            title: 'Email Us',
            primary: 'contact@roomreserve.com',
            secondary: 'Response within 2 hours',
            bgColor: 'from-blue-500 to-indigo-600',
            hoverColor: 'hover:from-blue-600 hover:to-indigo-700'
        },
        {
            icon: <Location size={28} color="purple" />,
            title: 'Visit Us',
            primary: '25 Place Vendôme',
            secondary: '75001 Paris, France',
            bgColor: 'from-purple-500 to-violet-600',
            hoverColor: 'hover:from-purple-600 hover:to-violet-700'
        },
        {
            icon: <Headphone size={28} color="orange" />,
            title: 'Live Chat',
            primary: 'Chat with our team',
            secondary: 'Online now',
            bgColor: 'from-orange-500 to-red-600',
            hoverColor: 'hover:from-orange-600 hover:to-red-700'
        }
    ];

    return (
        <section id="contact" className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
                        <MessageQuestion size={32} color="#FFFFFF" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                        Let's Get in Touch
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Ready to book your perfect stay? Have questions about our services? 
                        Our dedicated team is here to make your experience exceptional.
                    </p>
                </div>

                {/* Contact Methods */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {contactMethods.map((method, index) => (
                        <div
                            key={index}
                            className={`bg-gradient-to-br ${method.bgColor} ${method.hoverColor} p-6 rounded-2xl text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer`}
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="bg-white bg-opacity-20 p-4 rounded-full mb-4 backdrop-blur-sm">
                                    {method.icon}
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{method.title}</h3>
                                <p className="font-medium text-sm opacity-95 mb-1">{method.primary}</p>
                                <p className="text-xs opacity-80">{method.secondary}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">
                                Send us a Message
                            </h3>
                            <p className="text-gray-600">
                                Fill out the form below and we'll get back to you as soon as possible.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 hover:bg-white"
                                        placeholder="Your full name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 hover:bg-white"
                                        placeholder="your.email@example.com"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 hover:bg-white"
                                        placeholder="+33 1 23 45 67 89"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-700">
                                        Subject *
                                    </label>
                                    <select
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 hover:bg-white"
                                    >
                                        <option value="">Select a subject</option>
                                        <option value="reservation">Reservation Inquiry</option>
                                        <option value="support">Customer Support</option>
                                        <option value="feedback">Feedback & Reviews</option>
                                        <option value="partnership">Partnership</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="block text-sm font-semibold text-gray-700">
                                    Message *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    required
                                    rows={10}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 resize-vertical bg-gray-50 hover:bg-white"
                                    placeholder="Please describe your inquiry or how we can help you..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3 ${
                                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        Sending Message...
                                    </>
                                ) : (
                                    <>
                                        <Send2 size={20} color="#FFFFFF" />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Map and Location Info */}
                    <div className="space-y-6">
                        {/* Map */}
                        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Our Location</h3>
                                <p className="text-gray-600">Visit us in the heart of Paris</p>
                            </div>
                            <div className="h-80">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.2711874577613!2d2.3272776156743!3d48.86766600794322!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e1de36f4147%3A0x6cd4c69a0e55c96d!2sPlace%20Vend%C3%B4me%2C%2075001%20Paris%2C%20France!5e0!3m2!1sen!2sus!4v1635784882846!5m2!1sen!2sus"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="RoomReserve Location"
                                />
                            </div>
                        </div>

                        {/* Business Hours */}
                        <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100">
                            <div className="flex items-center mb-6">
                                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-full mr-4">
                                    <Clock size={24} color="#FFFFFF" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">Business Hours</h3>
                                    <p className="text-gray-600">We're here when you need us</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="font-medium text-gray-700">Reception</span>
                                    <span className="text-gray-600">24/7</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="font-medium text-gray-700">Customer Service</span>
                                    <span className="text-gray-600">8:00 AM - 10:00 PM</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="font-medium text-gray-700">Concierge</span>
                                    <span className="text-gray-600">6:00 AM - 12:00 AM</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="font-medium text-gray-700">Emergency Support</span>
                                    <span className="text-green-600 font-semibold">24/7</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;