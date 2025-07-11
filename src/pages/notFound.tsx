import React from "react";
import { Link } from "react-router";
import { SearchNormal1, Home, ArrowLeft2 } from "iconsax-react";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        {/* 404 Illustration */}
        <div className="relative mb-8">
          <div className="text-8xl md:text-9xl font-bold text-gray-200 select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white rounded-full p-4 shadow-lg animate-bounce">
              <SearchNormal1
                color="#2563EB"
                size={48}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Room Not Found
          </h2>
          <p className="text-gray-600 text-base md:text-lg leading-relaxed px-4">
            Oops! The room or page you're looking for seems to be unavailable. 
            Let's get you back to managing your reservations efficiently.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <Home color="white" size={20} />
            <span>Go Home</span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center space-x-2 border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-all"
          >
            <ArrowLeft2 color="#2563EB" size={20} />
            <span>Go Back</span>
          </button>
        </div>
      </div>

      {/* Floating Elements - Hidden on mobile for better performance */}
      <div className="hidden md:block fixed top-20 left-10 opacity-10 animate-float">
        <div className="w-16 h-16 bg-blue-200 rounded-lg flex items-center justify-center">
          <span className="text-blue-600 font-bold text-sm">ROOM</span>
        </div>
      </div>
      <div className="hidden md:block fixed bottom-20 left-20 opacity-10 animate-float-delayed">
        <div className="w-12 h-12 bg-indigo-200 rounded-full flex items-center justify-center">
          <span className="text-indigo-600 font-bold text-xs">📅</span>
        </div>
      </div>
      <div className="hidden md:block fixed top-32 right-16 opacity-10 animate-float">
        <div className="w-14 h-14 bg-purple-200 rounded-lg flex items-center justify-center">
          <span className="text-purple-600 font-bold text-xs">🏢</span>
        </div>
      </div>
      <div className="hidden md:block fixed bottom-32 right-10 opacity-10 animate-float-delayed">
        <SearchNormal1 color="#2563EB" size={48} />
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px); 
          }
          50% { 
            transform: translateY(-20px); 
          }
        }

        @keyframes float-delayed {
          0%, 100% { 
            transform: translateY(0px); 
          }
          50% { 
            transform: translateY(-15px); 
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default NotFound;