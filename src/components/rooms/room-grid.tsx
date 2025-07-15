/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Filter, Grid1, SearchNormal1, Sort } from "iconsax-react";
import type { Room, RoomFilters } from "../../types/room.types";
import RoomCard from "./room-card";
import { List } from "@phosphor-icons/react";

interface RoomGridProps {
  rooms: Room[];
  loading?: boolean;
  filters?: RoomFilters;
  onFiltersChange?: (filters: RoomFilters) => void;
  onRoomView?: (room: Room) => void;
  onRoomEdit?: (room: Room) => void;
  onRoomDelete?: (room: Room) => void;
  onRoomBook?: (room: Room) => void;
  showFilters?: boolean;
  showSearch?: boolean;
  viewMode?: "grid" | "list";
  onViewModeChange?: (mode: "grid" | "list") => void;
  className?: string;
}

type SortOption = "name" | "capacity" | "type" | "status" | "building";
type SortDirection = "asc" | "desc";

const RoomGrid: React.FC<RoomGridProps> = ({
  rooms,
  loading = false,
  filters = {},
  onFiltersChange,
  onRoomView,
  onRoomEdit,
  onRoomDelete,
  onRoomBook,
  showFilters = true,
  showSearch = true,
  viewMode = "grid",
  onViewModeChange,
  className = "",
}) => {
  const [localFilters, setLocalFilters] = useState<RoomFilters>(filters);
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [searchTerm, setSearchTerm] = useState("");

  // Handle filter changes
  const handleFilterChange = (key: keyof RoomFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  // Handle search
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    handleFilterChange("search", value);
  };

  // Handle sorting
  //   const handleSort = (option: SortOption) => {
  //     if (sortBy === option) {
  //       setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  //     } else {
  //       setSortBy(option);
  //       setSortDirection('asc');
  //     }
  //   };

  // Filter and sort rooms
  const filteredAndSortedRooms = React.useMemo(() => {
    let filtered = [...rooms];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (room) =>
          room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          room.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          room.building.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply other filters
    if (localFilters.type) {
      filtered = filtered.filter((room) => room.type === localFilters.type);
    }
    if (localFilters.status) {
      filtered = filtered.filter((room) => room.status === localFilters.status);
    }
    if (localFilters.building) {
      filtered = filtered.filter(
        (room) => room.building.id === localFilters.building
      );
    }
    if (localFilters.capacity?.min) {
      filtered = filtered.filter(
        (room) => room.capacity >= localFilters.capacity!.min!
      );
    }
    if (localFilters.capacity?.max) {
      filtered = filtered.filter(
        (room) => room.capacity <= localFilters.capacity!.max!
      );
    }
    if (localFilters.hasProjector !== undefined) {
      filtered = filtered.filter(
        (room) => room.hasProjector === localFilters.hasProjector
      );
    }
    if (localFilters.hasWhiteboard !== undefined) {
      filtered = filtered.filter(
        (room) => room.hasWhiteboard === localFilters.hasWhiteboard
      );
    }
    if (localFilters.hasVideoConference !== undefined) {
      filtered = filtered.filter(
        (room) => room.hasVideoConference === localFilters.hasVideoConference
      );
    }
    if (localFilters.isAccessible !== undefined) {
      filtered = filtered.filter(
        (room) => room.isAccessible === localFilters.isAccessible
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case "name":
          aValue = a.name;
          bValue = b.name;
          break;
        case "capacity":
          aValue = a.capacity;
          bValue = b.capacity;
          break;
        case "type":
          aValue = a.type;
          bValue = b.type;
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "building":
          aValue = a.building.name;
          bValue = b.building.name;
          break;
        default:
          return 0;
      }

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [rooms, localFilters, searchTerm, sortBy, sortDirection]);

  // Get unique values for filter options
  const uniqueBuildings = React.useMemo(() => {
    const buildings = rooms.map((room) => room.building);
    return Array.from(new Map(buildings.map((b) => [b.id, b])).values());
  }, [rooms]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Search */}
        {showSearch && (
          <div className="relative flex-1 max-w-md">
            <SearchNormal1
              size={20}
              color="#6B7280"
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
            />
            <input
              type="text"
              placeholder="Rechercher une salle..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center space-x-3">
          {/* Sort */}
          <div className="relative">
            <select
              value={`${sortBy}-${sortDirection}`}
              onChange={(e) => {
                const [sort, direction] = e.target.value.split("-") as [
                  SortOption,
                  SortDirection
                ];
                setSortBy(sort);
                setSortDirection(direction);
              }}
              className="appearance-none pl-8 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="name-asc">Nom A-Z</option>
              <option value="name-desc">Nom Z-A</option>
              <option value="capacity-asc">Capacité ↑</option>
              <option value="capacity-desc">Capacité ↓</option>
              <option value="type-asc">Type A-Z</option>
              <option value="type-desc">Type Z-A</option>
              <option value="building-asc">Bâtiment A-Z</option>
              <option value="building-desc">Bâtiment Z-A</option>
            </select>
            <Sort
              size={16}
              color="#6B7280"
              className="absolute left-2 top-1/2 transform -translate-y-1/2"
            />
          </div>

          {/* View Mode Toggle */}
          {onViewModeChange && (
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => onViewModeChange("grid")}
                className={`p-2 ${
                  viewMode === "grid"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
                title="Vue grille"
              >
                <Grid1 size={16} color="currentColor" />
              </button>
              <button
                onClick={() => onViewModeChange("list")}
                className={`p-2 ${
                  viewMode === "list"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
                title="Vue liste"
              >
                <List size={16} color="currentColor" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-3">
          {/* Status Filter */}
          <select
            value={localFilters.status || ""}
            onChange={(e) =>
              handleFilterChange("status", e.target.value || undefined)
            }
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tous les statuts</option>
            <option value="available">Disponible</option>
            <option value="occupied">Occupée</option>
            <option value="reserved">Réservée</option>
            <option value="maintenance">Maintenance</option>
            <option value="out_of_service">Hors service</option>
          </select>

          {/* Type Filter */}
          <select
            value={localFilters.type || ""}
            onChange={(e) =>
              handleFilterChange("type", e.target.value || undefined)
            }
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tous les types</option>
            <option value="meeting">Réunion</option>
            <option value="conference">Conférence</option>
            <option value="training">Formation</option>
            <option value="office">Bureau</option>
            <option value="coworking">Coworking</option>
            <option value="presentation">Présentation</option>
            <option value="phone_booth">Cabine téléphonique</option>
          </select>

          {/* Building Filter */}
          <select
            value={localFilters.building || ""}
            onChange={(e) =>
              handleFilterChange("building", e.target.value || undefined)
            }
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tous les bâtiments</option>
            {uniqueBuildings.map((building) => (
              <option key={building.id} value={building.id}>
                {building.name}
              </option>
            ))}
          </select>

          {/* Equipment Filters */}
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-1 text-sm">
              <input
                type="checkbox"
                checked={localFilters.hasProjector || false}
                onChange={(e) =>
                  handleFilterChange(
                    "hasProjector",
                    e.target.checked ? true : undefined
                  )
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Projecteur</span>
            </label>
            <label className="flex items-center space-x-1 text-sm">
              <input
                type="checkbox"
                checked={localFilters.hasWhiteboard || false}
                onChange={(e) =>
                  handleFilterChange(
                    "hasWhiteboard",
                    e.target.checked ? true : undefined
                  )
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Tableau</span>
            </label>
            <label className="flex items-center space-x-1 text-sm">
              <input
                type="checkbox"
                checked={localFilters.hasVideoConference || false}
                onChange={(e) =>
                  handleFilterChange(
                    "hasVideoConference",
                    e.target.checked ? true : undefined
                  )
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Visio</span>
            </label>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          {filteredAndSortedRooms.length} salle
          {filteredAndSortedRooms.length !== 1 ? "s" : ""} trouvée
          {filteredAndSortedRooms.length !== 1 ? "s" : ""}
        </span>
        {Object.keys(localFilters).length > 0 && (
          <button
            onClick={() => {
              setLocalFilters({});
              setSearchTerm("");
              onFiltersChange?.({});
            }}
            className="text-blue-600 hover:text-blue-800"
          >
            Effacer les filtres
          </button>
        )}
      </div>

      {/* Grid/List Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredAndSortedRooms.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Filter size={24} color="#6B7280" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucune salle trouvée
          </h3>
          <p className="text-gray-600">
            Aucune salle ne correspond aux critères de recherche.
          </p>
        </div>
      ) : (
        <div
          className={`${
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }`}
        >
          {filteredAndSortedRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onView={onRoomView}
              onEdit={onRoomEdit}
              onDelete={onRoomDelete}
              onBook={onRoomBook}
              className={viewMode === "list" ? "max-w-none" : ""}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomGrid;
