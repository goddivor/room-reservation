// src/components/rooms/rooms-table.tsx
import { useState } from "react";
import {
  Edit,
  Trash,
  Eye,
  StatusUp,
  Status,
  Buildings2,
  People,
  MoneyRecive,
  Wifi,
  More,
} from "iconsax-react";
import Badge from "@/components/badge";
import Button from "@/components/actions/button";
import type { Room, RoomTypeConfig, Equipment } from "@/types/room.types";

interface RoomsTableProps {
  rooms: Room[];
  roomTypes: RoomTypeConfig[];
  equipments: Equipment[];
  onRoomEdit: (room: Room) => void;
  onRoomDelete: (roomId: string) => void;
  onRoomView: (room: Room) => void;
  onRoomToggleStatus: (roomId: string, newStatus: boolean) => void;
  isLoading?: boolean;
}

export default function RoomsTable({
  rooms,
  roomTypes,
  equipments,
  onRoomEdit,
  onRoomDelete,
  onRoomView,
  onRoomToggleStatus,
  isLoading = false,
}: RoomsTableProps) {
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);

  const getStatusBadge = (status: Room["status"]) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "reserved":
        return "bg-blue-100 text-blue-800";
      case "occupied":
        return "bg-yellow-100 text-yellow-800";
      case "maintenance":
        return "bg-orange-100 text-orange-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoomType = (typeId: string) => {
    return roomTypes.find(type => type.id === typeId);
  };

  const getRoomEquipment = (equipmentIds: string[]) => {
    return equipments.filter(eq => equipmentIds.includes(eq.id));
  };

  const formatFloor = (floor: Room["floor"]) => {
    const floorMap = {
      ground: "Ground",
      first: "1st",
      second: "2nd", 
      third: "3rd",
      fourth: "4th",
      fifth: "5th",
    };
    return floorMap[floor] || floor;
  };

  const handleSelectRoom = (roomId: string) => {
    setSelectedRooms((prev) =>
      prev.includes(roomId)
        ? prev.filter((id) => id !== roomId)
        : [...prev, roomId]
    );
  };

  const handleSelectAll = () => {
    setSelectedRooms((prev) =>
      prev.length === rooms.length ? [] : rooms.map((room) => room.id)
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading rooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Bulk actions header */}
      {selectedRooms.length > 0 && (
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedRooms.length} room{selectedRooms.length > 1 ? "s" : ""} selected
            </span>
            <div className="flex space-x-2">
              <Button className="text-sm px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700">
                <StatusUp size={14} color="white" />
                <span className="ml-1">Activate</span>
              </Button>
              <Button className="text-sm px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
                <Status size={14} color="white" />
                <span className="ml-1">Deactivate</span>
              </Button>
              <Button className="text-sm px-3 py-1 border border-red-400 text-red-700 hover:bg-red-50 rounded-lg">
                <Trash size={14} color="#DC2626" />
                <span className="ml-1">Delete</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedRooms.length === rooms.length && rooms.length > 0}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Room
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type & Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Features
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rate
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rooms.map((room) => {
              const roomType = getRoomType(room.typeId);
              const roomEquipment = getRoomEquipment(room.equipmentIds);

              return (
                <tr key={room.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedRooms.includes(room.id)}
                      onChange={() => handleSelectRoom(room.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>

                  <td className="px-6 py-4 max-w-[220px]">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: roomType?.color + '20' }}
                        >
                          <Buildings2 size={20} color={roomType?.color || "#6B7280"} />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          Room {room.code}
                        </div>
                        {room.description && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {room.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {roomType?.name || "Unknown Type"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatFloor(room.floor)} Floor
                        {room.building && ` • ${room.building}`}
                        {room.section && ` • Section ${room.section}`}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <Badge className={`text-xs px-2 py-1 ${getStatusBadge(room.status)}`}>
                        {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                      </Badge>
                      <div>
                        <Badge 
                          className={`text-xs px-2 py-1 ${
                            room.isActive 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {room.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center space-x-1 mb-1">
                        <People size={14} color="#6B7280" />
                        <span>{room.capacity} guests</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {room.area}m² area
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {room.hasWifi && (
                        <div className="p-1 bg-blue-100 rounded" title="WiFi">
                          <Wifi size={12} color="#3B82F6" />
                        </div>
                      )}
                      {room.hasKitchen && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">K</span>
                      )}
                      {room.hasBalcony && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">B</span>
                      )}
                      {room.hasAirConditioning && (
                        <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded">AC</span>
                      )}
                      {roomEquipment.length > 0 && (
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          +{roomEquipment.length} eq
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 flex items-center">
                      <MoneyRecive size={14} color="#6B7280" className="mr-1" />
                      ${room.dailyRate}/day
                    </div>
                    {room.monthlyRate && (
                      <div className="text-xs text-gray-500">
                        ${room.monthlyRate}/month
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center space-x-2 justify-end">
                      <Button
                        onClick={() => onRoomView(room)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg"
                        title="View Details"
                      >
                        <Eye size={16} color="currentColor" />
                      </Button>

                      <Button
                        onClick={() => onRoomEdit(room)}
                        className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg"
                        title="Edit"
                      >
                        <Edit size={16} color="currentColor" />
                      </Button>

                      <Button
                        onClick={() => onRoomToggleStatus(room.id, !room.isActive)}
                        className={`p-2 rounded-lg ${
                          room.isActive
                            ? "text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50"
                            : "text-green-600 hover:text-green-800 hover:bg-green-50"
                        }`}
                        title={room.isActive ? "Deactivate" : "Activate"}
                      >
                        {room.isActive ? (
                          <Status size={16} color="currentColor" />
                        ) : (
                          <StatusUp size={16} color="currentColor" />
                        )}
                      </Button>

                      <Button
                        onClick={() => onRoomDelete(room.id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                        title="Delete"
                      >
                        <Trash size={16} color="currentColor" />
                      </Button>

                      <Button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg">
                        <More size={16} color="currentColor" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {rooms.length === 0 && (
        <div className="text-center py-12">
          <Buildings2 size={48} color="#9CA3AF" className="mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No rooms found</h3>
          <p className="text-sm text-gray-500 mt-1">
            Try adjusting your search criteria or filters.
          </p>
        </div>
      )}
    </div>
  );
}