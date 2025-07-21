import AboutSection from "@/components/landing/AboutSection";
import ContactSection from "@/components/landing/ContactSection";
import Footer from "@/components/landing/Footer";
import HeroSection from "@/components/landing/HeroSection";
import Navbar from "@/components/landing/NavBar";
import NewsletterSection from "@/components/landing/NewsLetterSection";
import SearchSection from "@/components/landing/SearchSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import RoomSection from "@/components/room-config/RoomSection";
import React from "react";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <SearchSection />
      <RoomSection />
      <AboutSection />
      <TestimonialsSection />
      <ContactSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
