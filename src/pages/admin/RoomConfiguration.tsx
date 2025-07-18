// src/pages/admin/RoomConfiguration.tsx
import React, { useState } from 'react';
import { 
  Buildings2, 
  Setting4,
  Location,
  Star1,
  Monitor
} from 'iconsax-react';
import RoomTypesSection from '@/components/room-config/RoomTypesSection';
import LocationsSection from '@/components/room-config/LocationsSection';
import FeaturesSection from '@/components/room-config/FeaturesSection';
import EquipmentSection from '@/components/room-config/EquipmentSection';
import type { RoomTypeConfig, Equipment, RoomFeature, LocationConfig } from '@/types/room-config.types';
import { 
  mockRoomTypes, 
  mockEquipments, 
  mockFeatures, 
  mockLocations 
} from '@/mocks/room-config.mocks';

type ConfigSection = 'room-types' | 'locations' | 'features' | 'equipment';

const RoomConfiguration: React.FC = () => {
  const [activeSection, setActiveSection] = useState<ConfigSection>('room-types');
  
  // State management for each configuration type
  const [roomTypes, setRoomTypes] = useState<RoomTypeConfig[]>(mockRoomTypes);
  const [locations, setLocations] = useState<LocationConfig[]>(mockLocations);
  const [features, setFeatures] = useState<RoomFeature[]>(mockFeatures);
  const [equipment, setEquipment] = useState<Equipment[]>(mockEquipments);

  const sections = [
    {
      key: 'room-types' as ConfigSection,
      label: 'Room Types',
      description: 'Manage different types of rooms',
      icon: <Buildings2 color="#1D4ED8" size={20} />,
      count: roomTypes.length,
      color: 'blue'
    },
    {
      key: 'locations' as ConfigSection,
      label: 'Locations',
      description: 'Manage floors and building sections',
      icon: <Location color="#059669" size={20} />,
      count: locations.length,
      color: 'green'
    },
    {
      key: 'features' as ConfigSection,
      label: 'Features',
      description: 'Manage room features and amenities',
      icon: <Star1 color="#F59E0B" size={20} />,
      count: features.length,
      color: 'yellow'
    },
    {
      key: 'equipment' as ConfigSection,
      label: 'Equipment',
      description: 'Manage available equipment',
      icon: <Monitor color="#7C3AED" size={20} />,
      count: equipment.length,
      color: 'purple'
    }
  ];

  const getColorClasses = (color: string, active: boolean) => {
    const colors = {
      blue: active ? 'bg-blue-50 border-blue-200 text-blue-900' : 'hover:bg-blue-50 border-gray-200',
      green: active ? 'bg-green-50 border-green-200 text-green-900' : 'hover:bg-green-50 border-gray-200',
      yellow: active ? 'bg-yellow-50 border-yellow-200 text-yellow-900' : 'hover:bg-yellow-50 border-gray-200',
      purple: active ? 'bg-purple-50 border-purple-200 text-purple-900' : 'hover:bg-purple-50 border-gray-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'room-types':
        return (
          <RoomTypesSection
            roomTypes={roomTypes}
            onRoomTypesChange={setRoomTypes}
          />
        );
      case 'locations':
        return (
          <LocationsSection
            locations={locations}
            onLocationsChange={setLocations}
          />
        );
      case 'features':
        return (
          <FeaturesSection
            features={features}
            onFeaturesChange={setFeatures}
          />
        );
      case 'equipment':
        return (
          <EquipmentSection
            equipment={equipment}
            onEquipmentChange={setEquipment}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 grow p-5 mt-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gray-100 rounded-xl">
            <Setting4 size={32} color="#374151" variant="Bold" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Room Configuration
            </h1>
            <p className="text-gray-600 mt-1">
              Manage room types, locations, features, and equipment
            </p>
          </div>
        </div>
      </div>

      {/* Configuration Sections */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-4">
          {/* Sidebar Navigation */}
          <div className="md:border-r border-gray-200 bg-gray-50">
            <div className="p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Configuration Sections</h3>
              <div className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.key}
                    onClick={() => setActiveSection(section.key)}
                    className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                      getColorClasses(section.color, activeSection === section.key)
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          activeSection === section.key ? `bg-${section.color}-100` : 'bg-gray-100'
                        }`}>
                          {section.icon}
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{section.label}</h4>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        activeSection === section.key 
                          ? `bg-${section.color}-200 text-${section.color}-800`
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {section.count}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{section.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-3">
            {renderActiveSection()}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {sections.map((section) => (
          <div key={section.key} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{section.label}</p>
                <p className="text-2xl font-bold text-gray-900">{section.count}</p>
              </div>
              <div className={`p-3 bg-${section.color}-100 rounded-lg`}>
                {section.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomConfiguration;