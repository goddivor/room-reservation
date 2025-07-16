// pages/rooms/rooms-list.tsx
import React, { useState, useRef, type JSX } from "react";
import {
  Location,
  Add,
  SearchNormal1,
  Filter,
  Eye,
  Edit2,
  Trash,
  Wifi,
  Monitor,
  Camera,
  Lock1,
  Buildings2,
  Setting4,
} from "iconsax-react";
import Button from "@/components/Button";

import Modal, { type ModalRef } from "@/components/ui/Modal";
import DataTable, { type Column } from "@/components/ui/DataTable";
import { Input } from "@/components/Input";

// Types
interface Room {
  id: string;
  name: string;
  code: string;
  type: "conference" | "meeting" | "training" | "office";
  building: string;
  floor: number;
  capacity: number;
  area: number; // m²
  status: "available" | "occupied" | "maintenance" | "disabled";
  amenities: string[];
  equipment: string[];
  hourlyRate?: number;
  description?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface RoomFilters {
  search: string;
  type: string;
  building: string;
  status: string;
  minCapacity: string;
  maxCapacity: string;
  amenities: string[];
}

const RoomsManagement: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: "1",
      name: "Salle Zeus",
      code: "CONF-001",
      type: "conference",
      building: "Bâtiment A",
      floor: 2,
      capacity: 50,
      area: 75,
      status: "available",
      amenities: ["wifi", "projector", "whiteboard", "ac"],
      equipment: ["Projecteur 4K", "Système audio", 'Écran 85"'],
      hourlyRate: 45,
      description: "Grande salle de conférence avec équipement haut de gamme",
      createdAt: "2024-01-15",
      updatedAt: "2024-07-10",
    },
    {
      id: "2",
      name: "Salle Hermès",
      code: "MEET-102",
      type: "meeting",
      building: "Bâtiment A",
      floor: 1,
      capacity: 12,
      area: 25,
      status: "occupied",
      amenities: ["wifi", "tv", "whiteboard"],
      equipment: ['TV 55"', "Caméra de visioconférence"],
      hourlyRate: 25,
      description: "Salle de réunion idéale pour les équipes",
      createdAt: "2024-02-01",
      updatedAt: "2024-07-12",
    },
    {
      id: "3",
      name: "Salle Athéna",
      code: "TRAIN-201",
      type: "training",
      building: "Bâtiment B",
      floor: 2,
      capacity: 30,
      area: 50,
      status: "maintenance",
      amenities: ["wifi", "projector", "whiteboard", "flipchart"],
      equipment: ["Projecteur", "Tableau interactif", "Système audio"],
      hourlyRate: 35,
      description: "Salle de formation modulable avec équipement interactif",
      createdAt: "2024-01-20",
      updatedAt: "2024-07-14",
    },
  ]);

  const [filters, setFilters] = useState<RoomFilters>({
    search: "",
    type: "",
    building: "",
    status: "",
    minCapacity: "",
    maxCapacity: "",
    amenities: [],
  });

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const filtersModalRef = useRef<ModalRef>(null);
  const roomDetailsModalRef = useRef<ModalRef>(null);

  // Filter options
  const typeOptions = [
    { label: "Tous les types", value: "" },
    { label: "Conférence", value: "conference" },
    { label: "Réunion", value: "meeting" },
    { label: "Formation", value: "training" },
    { label: "Bureau", value: "office" },
  ];

  const buildingOptions = [
    { label: "Tous les bâtiments", value: "" },
    { label: "Bâtiment A", value: "Bâtiment A" },
    { label: "Bâtiment B", value: "Bâtiment B" },
    { label: "Bâtiment C", value: "Bâtiment C" },
  ];

  const statusOptions = [
    { label: "Tous les statuts", value: "" },
    { label: "Disponible", value: "available" },
    { label: "Occupée", value: "occupied" },
    { label: "Maintenance", value: "maintenance" },
    { label: "Désactivée", value: "disabled" },
  ];

  // Get status badge
  const getStatusBadge = (status: Room["status"]) => {
    const config = {
      available: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Disponible",
      },
      occupied: { bg: "bg-red-100", text: "text-red-800", label: "Occupée" },
      maintenance: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Maintenance",
      },
      disabled: {
        bg: "bg-gray-100",
        text: "text-gray-800",
        label: "Désactivée",
      },
    };

    const style = config[status];
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}
      >
        {style.label}
      </span>
    );
  };

  // Get type icon
  const getTypeIcon = (type: Room["type"], size = 16) => {
    const icons = {
      conference: <Buildings2 size={size} color="#1D4ED8" />,
      meeting: <Location size={size} color="#059669" />,
      training: <Monitor size={size} color="#D97706" />,
      office: <Lock1 size={size} color="#7C3AED" />,
    };
    return icons[type];
  };

  // Get amenity icon
  const getAmenityIcon = (amenity: string) => {
    const icons: Record<string, JSX.Element> = {
      wifi: <Wifi size={14} color="#6B7280" />,
      projector: <Monitor size={14} color="#6B7280" />,
      camera: <Camera size={14} color="#6B7280" />,
      whiteboard: <Edit2 size={14} color="#6B7280" />,
      ac: <Setting4 size={14} color="#6B7280" />,
    };
    return icons[amenity] || <Setting4 size={14} color="#6B7280" />;
  };

  // Handle actions
  const handleViewRoom = (room: Room) => {
    setSelectedRoom(room);
    roomDetailsModalRef.current?.open();
  };

  const handleEditRoom = (room: Room) => {
    // Navigate to edit form
    console.log("Edit room:", room.id);
  };

  const handleDeleteRoom = (room: Room) => {
    if (
      confirm(`Êtes-vous sûr de vouloir supprimer la salle "${room.name}" ?`)
    ) {
      setRooms((prev) => prev.filter((r) => r.id !== room.id));
    }
  };

  const handleAddRoom = () => {
    // Navigate to create form
    console.log("Add new room");
  };

  // Table columns
  const columns: Column<Room>[] = [
    {
      key: "name",
      title: "Salle",
      render: (_, room) => (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">{getTypeIcon(room.type, 20)}</div>
          <div>
            <div className="font-medium text-gray-900">{room.name}</div>
            <div className="text-sm text-gray-500">{room.code}</div>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      key: "location",
      title: "Localisation",
      render: (_, room) => (
        <div>
          <div className="text-sm font-medium text-gray-900">
            {room.building}
          </div>
          <div className="text-xs text-gray-500">Étage {room.floor}</div>
        </div>
      ),
    },
    {
      key: "capacity",
      title: "Capacité",
      render: (_, room) => (
        <div className="text-center">
          <div className="text-sm font-medium text-gray-900">
            {room.capacity}
          </div>
          <div className="text-xs text-gray-500">{room.area}m²</div>
        </div>
      ),
      sortable: true,
    },
    {
      key: "status",
      title: "Statut",
      render: (_, room) => getStatusBadge(room.status),
      sortable: true,
    },
    {
      key: "amenities",
      title: "Équipements",
      render: (_, room) => (
        <div className="flex flex-wrap gap-1">
          {room.amenities.slice(0, 3).map((amenity, index) => (
            <div
              key={index}
              className="p-1 bg-gray-100 rounded"
              title={amenity}
            >
              {getAmenityIcon(amenity)}
            </div>
          ))}
          {room.amenities.length > 3 && (
            <div className="text-xs text-gray-500 px-1">
              +{room.amenities.length - 3}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "rate",
      title: "Tarif/h",
      render: (_, room) => (
        <div className="text-sm font-medium text-gray-900">
          {room.hourlyRate ? `${room.hourlyRate}€` : "Gratuit"}
        </div>
      ),
      sortable: true,
    },
    {
      key: "actions",
      title: "Actions",
      render: (_, room) => (
        <div className="flex items-center space-x-1">
          <Button
            onClick={() => handleViewRoom(room)}
            className="p-2 text-blue-600 hover:bg-blue-50"
            title="Voir les détails"
          >
            <Eye size={16} color="currentColor" />
          </Button>
          <Button
            onClick={() => handleEditRoom(room)}
            className="p-2 text-yellow-600 hover:bg-yellow-50"
            title="Modifier"
          >
            <Edit2 size={16} color="currentColor" />
          </Button>
          <Button
            onClick={() => handleDeleteRoom(room)}
            className="p-2 text-red-600 hover:bg-red-50"
            title="Supprimer"
          >
            <Trash size={16} color="currentColor" />
          </Button>
        </div>
      ),
    },
  ];

  // Filtered rooms
  const filteredRooms = rooms.filter((room) => {
    if (
      filters.search &&
      !room.name.toLowerCase().includes(filters.search.toLowerCase()) &&
      !room.code.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }
    if (filters.type && room.type !== filters.type) return false;
    if (filters.building && room.building !== filters.building) return false;
    if (filters.status && room.status !== filters.status) return false;
    if (filters.minCapacity && room.capacity < parseInt(filters.minCapacity))
      return false;
    if (filters.maxCapacity && room.capacity > parseInt(filters.maxCapacity))
      return false;

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestion des Salles
          </h1>
          <p className="text-gray-600">
            Gérez et organisez les salles de votre établissement
          </p>
        </div>
        <Button
          onClick={handleAddRoom}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Add size={16} color="white" />
          <span>Ajouter une salle</span>
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchNormal1 size={16} color="#6B7280" />
              </div>
              <Input
                placeholder="Rechercher par nom ou code..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={filters.type}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, type: e.target.value }))
              }
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {typeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, status: e.target.value }))
              }
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <Button
              onClick={() => filtersModalRef.current?.open()}
              className="text-gray-600"
            >
              <Filter size={16} color="currentColor" />
              <span>Filtres avancés</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Buildings2 size={24} color="#1D4ED8" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Total salles</div>
              <div className="text-xl font-semibold text-gray-900">
                {rooms.length}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Location size={24} color="#059669" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Disponibles</div>
              <div className="text-xl font-semibold text-gray-900">
                {rooms.filter((r) => r.status === "available").length}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Lock1 size={24} color="#DC2626" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Occupées</div>
              <div className="text-xl font-semibold text-gray-900">
                {rooms.filter((r) => r.status === "occupied").length}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Setting4 size={24} color="#D97706" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Maintenance</div>
              <div className="text-xl font-semibold text-gray-900">
                {rooms.filter((r) => r.status === "maintenance").length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rooms Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <DataTable
          columns={columns}
          data={filteredRooms}
          loading={isLoading}
          searchable={false}
          showRefresh={true}
          onRefresh={() => {
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 1000);
          }}
          emptyText="Aucune salle trouvée"
          rowKey="id"
        />
      </div>

      {/* Room Details Modal */}
      <Modal
        ref={roomDetailsModalRef}
        title="Détails de la salle"
        size="lg"
        onClose={() => setSelectedRoom(null)}
      >
        {selectedRoom && (
          <div className="p-6 space-y-6">
            {/* Room Header */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {getTypeIcon(selectedRoom.type, 32)}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedRoom.name}
                </h3>
                <p className="text-gray-600">{selectedRoom.code}</p>
                <div className="mt-2">
                  {getStatusBadge(selectedRoom.status)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Tarif horaire</div>
                <div className="text-xl font-semibold text-gray-900">
                  {selectedRoom.hourlyRate
                    ? `${selectedRoom.hourlyRate}€`
                    : "Gratuit"}
                </div>
              </div>
            </div>

            {/* Room Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Informations générales
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Localisation:</span>
                    <span className="font-medium">
                      {selectedRoom.building} - Étage {selectedRoom.floor}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Capacité:</span>
                    <span className="font-medium">
                      {selectedRoom.capacity} personnes
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Surface:</span>
                    <span className="font-medium">{selectedRoom.area}m²</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Équipements disponibles
                </h4>
                <div className="space-y-2">
                  {selectedRoom.equipment.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Monitor size={14} color="#6B7280" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            {selectedRoom.description && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Description</h4>
                <p className="text-gray-700">{selectedRoom.description}</p>
              </div>
            )}

            {/* Amenities */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                Services inclus
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedRoom.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-full"
                  >
                    {getAmenityIcon(amenity)}
                    <span className="text-sm text-gray-700 capitalize">
                      {amenity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Advanced Filters Modal */}
      <Modal ref={filtersModalRef} title="Filtres avancés" size="md">
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bâtiment
              </label>
              <select
                value={filters.building}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, building: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {buildingOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacité minimale
              </label>
              <Input
                type="number"
                placeholder="Ex: 10"
                value={filters.minCapacity}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    minCapacity: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacité maximale
              </label>
              <Input
                type="number"
                placeholder="Ex: 50"
                value={filters.maxCapacity}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    maxCapacity: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              onClick={() => {
                setFilters({
                  search: "",
                  type: "",
                  building: "",
                  status: "",
                  minCapacity: "",
                  maxCapacity: "",
                  amenities: [],
                });
                filtersModalRef.current?.close();
              }}
            >
              Réinitialiser
            </Button>
            <Button
              onClick={() => filtersModalRef.current?.close()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Appliquer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RoomsManagement;
