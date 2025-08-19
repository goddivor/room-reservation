# 🏨 Room Reservation System

[![GitHub stars](https://img.shields.io/github/stars/goddivor/room-reservation?style=for-the-badge)](https://github.com/goddivor/room-reservation/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/goddivor/room-reservation?style=for-the-badge)](https://github.com/goddivor/room-reservation/network)
[![GitHub issues](https://img.shields.io/github/issues/goddivor/room-reservation?style=for-the-badge)](https://github.com/goddivor/room-reservation/issues)
[![GitHub license](https://img.shields.io/github/license/goddivor/room-reservation?style=for-the-badge)](https://github.com/goddivor/room-reservation/blob/main/LICENSE)

A modern, feature-rich room reservation system built with React 19, TypeScript, and Tailwind CSS. This application provides a comprehensive platform for managing room bookings with both admin and user interfaces.

## ✨ Features

### 🎨 **Modern UI/UX**
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **shadcn/ui Components** - Beautiful, accessible UI components
- **Smooth Animations** - Engaging transitions and interactions
- **Hero Image Galleries** - Scrollable image carousels for room types

### 🏠 **Room Management**
- **7 Room Types** - Studio, Simple, Living Area, 2-3 Bedrooms, Deluxe Suite, Penthouse
- **15+ Rooms** - Diverse inventory across multiple buildings
- **Advanced Filtering** - By price, type, building, equipment, and amenities
- **Date-Based Availability** - Real-time availability checking

### 📅 **Booking System**
- **Date Selection** - Intuitive check-in/check-out date picker
- **URL Parameter Support** - Shareable links with selected dates
- **Smart Navigation** - Seamless flow between pages
- **Enhanced Room Details** - Comprehensive modal with all amenities

### 👥 **User Management**
- **Admin Dashboard** - Complete management interface
- **User Portal** - Personal dashboard and booking history
- **Role-Based Access** - Different interfaces for different user types
- **Authentication System** - Secure login and registration

### 🔧 **Technical Features**
- **React 19** - Latest React features and performance
- **TypeScript** - Type-safe development
- **React Router v7** - Modern routing solution
- **Vite** - Fast development and build tool
- **Tailwind CSS** - Utility-first styling

## 📊 Project Statistics

| Metric | Value |
|--------|-------|
| 📝 **Total Commits** | 56 |
| 🌿 **Branches** | 2 |
| 👥 **Contributors** | 1 |
| 📁 **Source Files** | 102 |
| 📅 **Created** | August 19, 2025 |
| 🔧 **Tech Stack** | React 19, TypeScript, Vite |

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/goddivor/room-reservation.git
   cd room-reservation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
npm run preview
```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── landing/        # Landing page components
│   └── layout/         # Layout components
├── pages/              # Page components
│   ├── admin/          # Admin interface
│   ├── user/           # User interface
│   └── auth/           # Authentication pages
├── mocks/              # Mock data for development
├── types/              # TypeScript type definitions
├── lib/                # Utility functions and configs
└── assets/             # Static assets
```

## 🎯 Key Components

### 🏠 **Room Types**
- **Studio** - Compact apartments with basic amenities
- **Simple Room** - Single bedrooms without living area
- **Living Area** - Rooms with separate living/sitting area
- **2-3 Bedrooms** - Family apartments with multiple bedrooms
- **Deluxe Suite** - Luxury suites with premium amenities
- **Penthouse** - Top floor with panoramic views

### 🔧 **Equipment & Amenities**
- Smart TV, Refrigerator, Microwave
- Washing Machine, Desk, Security Safe
- Iron & Board, Hair Dryer
- WiFi, Air Conditioning, Kitchen, Balcony

### 🏢 **Buildings**
- Main Building, Building B, C, D, E
- Multiple floors and sections
- Diverse room configurations

## 🛠️ Technologies Used

| Technology | Purpose |
|-----------|---------|
| **React 19** | Frontend framework |
| **TypeScript** | Type safety |
| **Vite** | Build tool |
| **Tailwind CSS** | Styling |
| **shadcn/ui** | UI components |
| **React Router v7** | Routing |
| **Lucide React** | Icons |
| **@radix-ui** | Accessible primitives |

## 📱 Pages & Features

### 🏠 **Landing Page**
- Hero section with property showcase
- Search functionality with date selection
- Featured rooms carousel
- Navigation to booking system

### 🏨 **Rooms Page**
- Advanced filtering system
- Room type cards with images
- Price range and availability
- Date-based filtering

### 🔍 **Room Type Details**
- Hero image gallery with auto-rotation
- Comprehensive room information
- Available rooms listing
- Enhanced booking modal

### 👔 **Admin Dashboard**
- Room management interface
- User management
- Booking oversight
- Statistics and analytics

### 👤 **User Portal**
- Personal dashboard
- Booking history
- Profile management
- Reservation management

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📋 Development Roadmap

- [ ] **Payment Integration** - Stripe/PayPal integration
- [ ] **Real-time Updates** - WebSocket for live availability
- [ ] **Email Notifications** - Booking confirmations
- [ ] **Multi-language** - i18n support
- [ ] **Mobile App** - React Native version
- [ ] **Analytics Dashboard** - Advanced reporting

## 🐛 Known Issues

- Image carousel auto-rotation can be disabled on mobile for performance
- Date picker could benefit from better mobile UX
- Filter state persistence across page navigation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **shadcn/ui** for the beautiful component system
- **Unsplash** for high-quality room images
- **Lucide** for the comprehensive icon library
- **Tailwind CSS** for the utility-first CSS framework

## 📞 Support

If you have any questions or need support, please:

1. Check the [Issues](https://github.com/goddivor/room-reservation/issues) page
2. Create a new issue if needed
3. Contact the maintainers

---

<div align="center">

**Built with ❤️ using React 19 and TypeScript**

[⭐ Star this repo](https://github.com/goddivor/room-reservation) | [🐛 Report Bug](https://github.com/goddivor/room-reservation/issues) | [✨ Request Feature](https://github.com/goddivor/room-reservation/issues)

</div>
