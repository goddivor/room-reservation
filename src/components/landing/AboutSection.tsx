import React from "react";
import { Award, People, Heart, Star, Shield, Crown } from "iconsax-react";

const AboutSection: React.FC = () => {
  const features = [
    {
      icon: <Crown size={32} color="#F59E0B" />,
      title: "Luxury Experience",
      description:
        "Every detail crafted to perfection, from premium amenities to personalized service that exceeds expectations.",
    },
    {
      icon: <Shield size={32} color="#10B981" />,
      title: "Trust & Security",
      description:
        "Your safety and privacy are our top priorities with 24/7 security and secure booking systems.",
    },
    {
      icon: <Heart size={32} color="#EF4444" />,
      title: "Passionate Service",
      description:
        "Our dedicated team goes above and beyond to ensure your stay is memorable and comfortable.",
    },
    {
      icon: <Award size={32} color="#8B5CF6" />,
      title: "Award Winning",
      description:
        "Recognized globally for excellence in hospitality and customer satisfaction.",
    },
  ];

  const stats = [
    {
      number: "10+",
      label: "Years of Excellence",
      description: "Serving guests worldwide",
    },
    {
      number: "50K+",
      label: "Happy Guests",
      description: "Satisfied customers",
    },
    {
      number: "98%",
      label: "Satisfaction Rate",
      description: "Customer approval",
    },
    {
      number: "24/7",
      label: "Customer Support",
      description: "Always available",
    },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      position: "General Manager",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      description: "Leading our team with 15+ years of hospitality experience.",
    },
    {
      name: "Michael Chen",
      position: "Guest Relations Director",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      description: "Ensuring every guest receives personalized attention.",
    },
    {
      name: "Emma Rodriguez",
      position: "Head of Operations",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      description: "Managing daily operations with precision and care.",
    },
  ];

  return (
    <section
      id="about"
      className="py-20 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
            <People size={32} color="#FFFFFF" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            About RoomReserve
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Founded with a vision to redefine luxury hospitality, RoomReserve
            has been creating unforgettable experiences for discerning travelers
            who expect nothing less than perfection.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-gray-800">Our Story</h3>
            <p className="text-gray-600 leading-relaxed">
              What started as a passion project in 2014 has grown into a premier
              destination for luxury accommodations. We believe that travel is
              not just about reaching a destination, but about the journey and
              the memories created along the way.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our commitment to excellence drives everything we do. From the
              moment you make your reservation to the time you check out, every
              interaction is designed to exceed your expectations and leave you
              with lasting memories.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={24} color="#F59E0B" variant="Bold" />
                ))}
              </div>
              <span className="text-gray-600">Rated 4.9/5 by our guests</span>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Luxury hotel interior"
                className="rounded-2xl shadow-lg h-48 w-full object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Hotel reception"
                className="rounded-2xl shadow-lg h-48 w-full object-cover mt-8"
              />
              <img
                src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Hotel amenities"
                className="rounded-2xl shadow-lg h-48 w-full object-cover -mt-8"
              />
              <img
                src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Hotel suite"
                className="rounded-2xl shadow-lg h-48 w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              Why Choose Us
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're not just a place to stay – we're your gateway to
              extraordinary experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-6">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-3">
                  {feature.title}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl p-12 mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-lg font-semibold opacity-90">
                  {stat.label}
                </div>
                <div className="text-sm opacity-75">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">
            Meet Our Team
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Behind every great experience is a dedicated team committed to your
            satisfaction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {team.map((member, index) => (
            <div key={index} className="text-center group">
              <div className="relative mb-6">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto object-cover shadow-lg group-hover:shadow-xl transition-all duration-300"
                />
                <div className="absolute inset-0 w-32 h-32 rounded-full mx-auto bg-gradient-to-tr from-blue-600/20 to-purple-600/20 group-hover:opacity-100 opacity-0 transition-all duration-300"></div>
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">
                {member.name}
              </h4>
              <p className="text-blue-600 font-semibold mb-3">
                {member.position}
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                {member.description}
              </p>
            </div>
          ))}
        </div>

        {/* Mission Statement */}
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center border border-gray-100">
          <h3 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h3>
          <p className="text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
            "To create extraordinary hospitality experiences that inspire,
            comfort, and connect people from around the world. We believe that
            every guest deserves to feel valued, welcomed, and cared for
            throughout their journey with us."
          </p>
          <div className="mt-8 flex justify-center">
            <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full">
              <Heart size={20} color="#FFFFFF" />
              <span className="font-semibold">Hospitality from the Heart</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
