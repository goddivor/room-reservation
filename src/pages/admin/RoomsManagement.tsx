// src/pages/admin/RoomsManagement.tsx
import React, { useState, useRef } from "react";
import { Buildings2, Add } from "iconsax-react";
import Button from "@/components/Button";
import RoomsOverviewCards from "@/components/rooms/rooms-overview-cards";
import RoomsFilters from "@/components/rooms/rooms-filters";
import RoomsTable from "@/components/rooms/rooms-table";
import RoomFormModal from "@/components/modals/room-form-modal";
import ConfirmationModal from "@/components/modals/confirmation-modal";
import { useToast } from "@/context/toast-context";
import { mockRooms, mockRoomTypes, mockEquipments, mockRoomStats } from "@/mocks/rooms.mocks";
import type { Room, RoomStats, RoomFilters, RoomFormData } from "@/types/room.types";
import type { ModalRef } from "@/types/modal-ref";

export default function RoomsManagement() {
  const toast = useToast();
  const roomFormModalRef = useRef<ModalRef>(null);
  const deleteModalRef = useRef<ModalRef>(null);
  
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [roomTypes] = useState(mockRoomTypes);
  const [equipments] = useState(mockEquipments);
  const [stats, setStats] = useState<RoomStats>(mockRoomStats);
  const [filters, setFilters] = useState<RoomFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading] = useState(false);
  const [roomToEdit, setRoomToEdit] = useState<Room | null>(null);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);

  // Filter rooms based on current filters
  const filteredRooms = rooms.filter((room) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        room.code.toLowerCase().includes(searchLower) ||
        room.type?.name.toLowerCase().includes(searchLower) ||
        room.description?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Type filter
    if (filters.typeId && room.typeId !== filters.typeId) {
      return false;
    }

    // Status filter
    if (filters.status && room.status !== filters.status) {
      return false;
    }

    // Floor filter
    if (filters.floor && room.floor !== filters.floor) {
      return false;
    }

    // Capacity filters
    if (filters.minCapacity && room.capacity < filters.minCapacity) {
      return false;
    }
    if (filters.maxCapacity && room.capacity > filters.maxCapacity) {
      return false;
    }

    // Rate filters
    if (filters.minRate && room.dailyRate < filters.minRate) {
      return false;
    }
    if (filters.maxRate && room.dailyRate > filters.maxRate) {
      return false;
    }

    // Equipment filters
    if (filters.equipmentIds && filters.equipmentIds.length > 0) {
      const hasRequiredEquipment = filters.equipmentIds.every(eqId => 
        room.equipmentIds.includes(eqId)
      );
      if (!hasRequiredEquipment) return false;
    }

    // Feature filters
    if (filters.hasBalcony !== undefined && room.hasBalcony !== filters.hasBalcony) {
      return false;
    }
    if (filters.hasKitchen !== undefined && room.hasKitchen !== filters.hasKitchen) {
      return false;
    }
    if (filters.hasBathroom !== undefined && room.hasBathroom !== filters.hasBathroom) {
      return false;
    }
    if (filters.hasAirConditioning !== undefined && room.hasAirConditioning !== filters.hasAirConditioning) {
      return false;
    }
    if (filters.hasWifi !== undefined && room.hasWifi !== filters.hasWifi) {
      return false;
    }

    // Active status filter
    if (filters.isActive !== undefined && room.isActive !== filters.isActive) {
      return false;
    }

    return true;
  });

  // Update stats when rooms change
  React.useEffect(() => {
    const newStats: RoomStats = {
      totalRooms: rooms.length,
      availableRooms: rooms.filter(r => r.status === 'available').length,
      reservedRooms: rooms.filter(r => r.status === 'reserved').length,
      occupiedRooms: rooms.filter(r => r.status === 'occupied').length,
      maintenanceRooms: rooms.filter(r => r.status === 'maintenance').length,
      inactiveRooms: rooms.filter(r => !r.isActive).length,
      utilizationRate: rooms.length > 0 ? 
        ((rooms.filter(r => r.status === 'occupied' || r.status === 'reserved').length / rooms.length) * 100) : 0,
      averageRate: rooms.length > 0 ? 
        (rooms.reduce((sum, r) => sum + r.dailyRate, 0) / rooms.length) : 0,
      typeDistribution: {},
      floorDistribution: {
        ground: rooms.filter(r => r.floor === 'ground').length,
        first: rooms.filter(r => r.floor === 'first').length,
        second: rooms.filter(r => r.floor === 'second').length,
        third: rooms.filter(r => r.floor === 'third').length,
        fourth: rooms.filter(r => r.floor === 'fourth').length,
        fifth: rooms.filter(r => r.floor === 'fifth').length,
      }
    };
    setStats(newStats);
  }, [rooms]);

  // Handler functions
  const handleCreateRoom = () => {
    setRoomToEdit(null);
    roomFormModalRef.current?.open();
  };

  const handleRoomEdit = (room: Room) => {
    setRoomToEdit(room);
    roomFormModalRef.current?.open();
  };

  const handleRoomDelete = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      setRoomToDelete(room);
      deleteModalRef.current?.open();
    }
  };

  const handleRoomView = (room: Room) => {
    console.log("View room:", room);
    toast.info("View Room", `Room details ${room.code}`);
  };

  const handleRoomToggleStatus = (roomId: string, newStatus: boolean) => {
    setRooms(prevRooms => 
      prevRooms.map(room => 
        room.id === roomId 
          ? { ...room, isActive: newStatus, updatedAt: new Date().toISOString() }
          : room
      )
    );
    
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      toast.success(
        "Status changed", 
        `Room ${room.code} is now ${newStatus ? 'active' : 'inactive'}`
      );
    }
  };

  const handleClearFilters = () => {
    setFilters({});
    toast.info("Filters reset", "All filters have been cleared");
  };

  // Modal handlers
  const confirmDelete = () => {
    if (roomToDelete) {
      setRooms(prevRooms => prevRooms.filter(r => r.id !== roomToDelete.id));
      
      toast.success(
        "Room deleted",
        `Room ${roomToDelete.code} has been successfully deleted.`
      );
      
      setRoomToDelete(null);
    }
  };

  const cancelDelete = () => {
    setRoomToDelete(null);
  };

  const handleRoomSave = (roomData: RoomFormData) => {
    if (roomToEdit) {
      // Edit existing room
      setRooms(prevRooms => 
        prevRooms.map(room => 
          room.id === roomToEdit.id 
            ? {
                ...room,
                ...roomData,
                updatedAt: new Date().toISOString(),
              }
            : room
        )
      );
      
      toast.success(
        "Room updated",
        `Room ${roomData.code} has been successfully updated.`
      );
    } else {
      // Create new room
      const newRoom: Room = {
        id: `room_${Date.now()}`,
        ...roomData,
        images: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setRooms(prevRooms => [...prevRooms, newRoom]);
      
      toast.success(
        "Room created",
        `Room ${roomData.code} has been successfully created.`
      );
    }
    
    setRoomToEdit(null);
  };

  const handleRoomFormCancel = () => {
    setRoomToEdit(null);
  };

  return (
    <div className="space-y-6 grow p-5 mt-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Buildings2 size={32} color="#1D4ED8" variant="Bold" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Room Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage rooms, types, and availability
            </p>
          </div>
        </div>
        <Button
          onClick={handleCreateRoom}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2"
        >
          <Add size={20} color="white" />
          <span>Add Room</span>
        </Button>
      </div>

      {/* Overview Cards */}
      <RoomsOverviewCards
        stats={stats}
        trends={{
          totalRooms: 5.2,
          availableRooms: 8.1,
          occupancyRate: 12.5,
          averageRate: 3.2,
        }}
      />

      {/* Filters */}
      <RoomsFilters
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={handleClearFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        showFilters={showFilters}
        roomTypes={roomTypes}
        equipments={equipments}
      />

      {/* Rooms Table */}
      <RoomsTable
        rooms={filteredRooms}
        roomTypes={roomTypes}
        equipments={equipments}
        onRoomEdit={handleRoomEdit}
        onRoomDelete={handleRoomDelete}
        onRoomView={handleRoomView}
        onRoomToggleStatus={handleRoomToggleStatus}
        isLoading={isLoading}
      />

      {/* Results Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing {filteredRooms.length} room{filteredRooms.length !== 1 ? 's' : ''} of {rooms.length} total
          </span>
          {Object.keys(filters).length > 0 && (
            <span>
              Filters applied
            </span>
          )}
        </div>
      </div>

      {/* Modals */}
      <ConfirmationModal
        ref={deleteModalRef}
        title="Delete Room"
        message={`Are you sure you want to delete room ${roomToDelete?.code}?`}
        description="This action cannot be undone. All reservation data associated with this room will be permanently deleted."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      <RoomFormModal
        ref={roomFormModalRef}
        room={roomToEdit}
        roomTypes={roomTypes}
        equipments={equipments}
        onSave={handleRoomSave}
        onCancel={handleRoomFormCancel}
      />
    </div>
  );
}