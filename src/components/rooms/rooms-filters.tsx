// src/components/rooms/rooms-filters.tsx
import { Filter, SearchNormal1, CloseCircle } from "iconsax-react";
import { Input } from "@/components/forms/Input";
import { CustomSelect } from "@/components/forms/custom-select";
import Button from "@/components/actions/button";
import type { RoomFilters, RoomTypeConfig, Equipment } from "@/types/room.types";

interface RoomsFiltersProps {
  filters: RoomFilters;
  onFiltersChange: (filters: RoomFilters) => void;
  onClearFilters: () => void;
  onToggleFilters: () => void;
  showFilters: boolean;
  roomTypes: RoomTypeConfig[];
  equipments: Equipment[];
}

export default function RoomsFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  onToggleFilters,
  showFilters,
  roomTypes,
  equipments,
}: RoomsFiltersProps) {
  const handleFilterChange = <K extends keyof RoomFilters>(
    key: K,
    value: RoomFilters[K]
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const statusOptions = [
    { label: "All Statuses", value: "" },
    { label: "Available", value: "available" },
    { label: "Reserved", value: "reserved" },
    { label: "Occupied", value: "occupied" },
    { label: "Maintenance", value: "maintenance" },
    { label: "Inactive", value: "inactive" },
  ];

  const floorOptions = [
    { label: "All Floors", value: "" },
    { label: "Ground Floor", value: "ground" },
    { label: "First Floor", value: "first" },
    { label: "Second Floor", value: "second" },
    { label: "Third Floor", value: "third" },
    { label: "Fourth Floor", value: "fourth" },
    { label: "Fifth Floor", value: "fifth" },
  ];

  const roomTypeOptions = [
    { label: "All Types", value: "" },
    ...roomTypes.map(type => ({
      label: type.name,
      value: type.id,
    })),
  ];

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== "" && value !== null &&
    !(Array.isArray(value) && value.length === 0)
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold text-gray-900">Room Filters</h2>
          {hasActiveFilters && (
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
              Active filters
            </span>
          )}
        </div>
        <div className="flex items-center space-x-3">
          {hasActiveFilters && (
            <Button
              onClick={onClearFilters}
              className="text-sm text-red-600 hover:text-red-800 flex items-center space-x-1"
            >
              <CloseCircle size={16} color="currentColor" />
              <span>Clear All</span>
            </Button>
          )}
          <Button
            onClick={onToggleFilters}
            className={`px-4 py-2 border rounded-lg transition-colors ${
              showFilters
                ? "bg-blue-50 border-blue-200 text-blue-700"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Filter size={16} color="currentColor" />
            <span className="ml-2">{showFilters ? "Hide" : "Show"} Filters</span>
          </Button>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <SearchNormal1
              size={18}
              color="#6B7280"
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
            />
            <Input
              placeholder="Search rooms..."
              value={filters.search || ""}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Room Type */}
          <CustomSelect
            options={roomTypeOptions}
            value={filters.typeId || ""}
            onChange={(value) => handleFilterChange("typeId", value || undefined)}
            placeholder="Select type"
          />

          {/* Status */}
          <CustomSelect
            options={statusOptions}
            value={filters.status || ""}
            onChange={(value) => handleFilterChange("status", value ? value as RoomFilters["status"] : undefined)}
            placeholder="Select status"
          />

          {/* Floor */}
          <CustomSelect
            options={floorOptions}
            value={filters.floor || ""}
            onChange={(value) => handleFilterChange("floor", value ? (value as RoomFilters["floor"]) : undefined)}
            placeholder="Select floor"
          />
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="p-6 space-y-6">
          {/* Capacity and Rate Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              type="number"
              label="Min Capacity"
              placeholder="Min guests"
              value={filters.minCapacity?.toString() || ""}
              onChange={(e) => 
                handleFilterChange("minCapacity", e.target.value ? parseInt(e.target.value) : undefined)
              }
            />
            <Input
              type="number"
              label="Max Capacity"
              placeholder="Max guests"
              value={filters.maxCapacity?.toString() || ""}
              onChange={(e) => 
                handleFilterChange("maxCapacity", e.target.value ? parseInt(e.target.value) : undefined)
              }
            />
            <Input
              type="number"
              label="Min Rate ($)"
              placeholder="Min daily rate"
              value={filters.minRate?.toString() || ""}
              onChange={(e) => 
                handleFilterChange("minRate", e.target.value ? parseInt(e.target.value) : undefined)
              }
            />
            <Input
              type="number"
              label="Max Rate ($)"
              placeholder="Max daily rate"
              value={filters.maxRate?.toString() || ""}
              onChange={(e) => 
                handleFilterChange("maxRate", e.target.value ? parseInt(e.target.value) : undefined)
              }
            />
          </div>

          {/* Features */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Room Features</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.hasBalcony || false}
                  onChange={(e) => 
                    handleFilterChange("hasBalcony", e.target.checked ? true : undefined)
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Balcony</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.hasKitchen || false}
                  onChange={(e) => 
                    handleFilterChange("hasKitchen", e.target.checked ? true : undefined)
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Kitchen</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.hasBathroom || false}
                  onChange={(e) => 
                    handleFilterChange("hasBathroom", e.target.checked ? true : undefined)
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Bathroom</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.hasAirConditioning || false}
                  onChange={(e) => 
                    handleFilterChange("hasAirConditioning", e.target.checked ? true : undefined)
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">A/C</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.hasWifi || false}
                  onChange={(e) => 
                    handleFilterChange("hasWifi", e.target.checked ? true : undefined)
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">WiFi</span>
              </label>
            </div>
          </div>

          {/* Equipment Filters */}
          {equipments.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Equipment</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                {equipments.map(equipment => (
                  <label key={equipment.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={(filters.equipmentIds || []).includes(equipment.id)}
                      onChange={(e) => {
                        const currentIds = filters.equipmentIds || [];
                        const newIds = e.target.checked
                          ? [...currentIds, equipment.id]
                          : currentIds.filter(id => id !== equipment.id);
                        handleFilterChange("equipmentIds", newIds.length > 0 ? newIds : undefined);
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{equipment.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Quick Filter Buttons */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">Quick Filters:</p>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => handleFilterChange("status", "available")}
                className="px-3 py-1 text-sm bg-green-100 text-green-700 hover:bg-green-200 rounded-full"
              >
                Available Only
              </Button>
              <Button
                onClick={() => handleFilterChange("hasWifi", true)}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-full"
              >
                With WiFi
              </Button>
              <Button
                onClick={() => handleFilterChange("hasKitchen", true)}
                className="px-3 py-1 text-sm bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-full"
              >
                With Kitchen
              </Button>
              <Button
                onClick={() => handleFilterChange("hasBalcony", true)}
                className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-full"
              >
                With Balcony
              </Button>
              <Button
                onClick={() => {
                  handleFilterChange("minRate", 0);
                  handleFilterChange("maxRate", 100);
                }}
                className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded-full"
              >
                Budget Friendly
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}