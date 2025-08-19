import React, { useState, useEffect } from "react";
import { Calendar, TableDocument, Eye, DocumentDownload } from "iconsax-react";
import { useReservations } from "../../hooks/useReservations";
import type {
  Reservation,
  ReservationFilters,
} from "../../types/reservation.types";
import ReservationFiltersComponent from "../../components/reservations/reservation-filters";
import ReservationCalendar from "../../components/reservations/reservation-calendar";
import ReservationDetailsModal from "../../components/reservations/reservation-details-modal";
import Button from "../../components/actions/button";
import SpinLoader from "../../components/SpinLoader";
import { useToast } from "../../context/toast-context";

type ViewMode = "table" | "calendar";

const UserReservations: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const {
    reservations,
    allReservations,
    loading,
    error: reservationError,
    applyFilters,
  } = useReservations();

  const { success, info, error: showError } = useToast();

  // Filter reservations to show only current user's reservations
  // In a real app, this would be filtered on the backend
  const currentUserId = "user_1"; // Mock user ID
  const userReservations = reservations.filter(
    (reservation) => reservation.user.id === currentUserId
  );
  const allUserReservations = allReservations.filter(
    (reservation) => reservation.user.id === currentUserId
  );

  useEffect(() => {
    if (reservationError) {
      showError("Une erreur est survenue", reservationError);
    }
  }, [reservationError, showError]);

  const handleFiltersChange = (filters: ReservationFilters) => {
    applyFilters(filters);
  };

  const handleViewDetails = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setShowDetailsModal(true);
  };

  const handleDownloadPDF = (reservation: Reservation) => {
    info(
      `Téléchargement du PDF pour la réservation #${reservation.id.toUpperCase()}...`
    );
    setTimeout(() => {
      success(
        `PDF téléchargé avec succès pour la réservation #${reservation.id.toUpperCase()}`
      );
      // Mock PDF download
      const link = document.createElement('a');
      link.href = '#';
      link.download = `reservation-${reservation.id}.pdf`;
      link.click();
      console.log("Downloading reservation PDF:", reservation);
    }, 1500);
  };

  const handleReservationClick = (reservation: Reservation) => {
    handleViewDetails(reservation);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedReservation(null);
  };

  // Calculate user-specific stats
  const userStats = {
    total: allUserReservations.length,
    confirmed: allUserReservations.filter(r => r.status === 'confirmed').length,
    checkedOut: allUserReservations.filter(r => r.status === 'checked_out').length,
    cancelled: allUserReservations.filter(r => r.status === 'cancelled').length,
  };

  if (loading && allUserReservations.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <SpinLoader />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            My Reservations
          </h1>
          <p className="text-gray-600 mt-1">
            View and manage your room reservations
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("table")}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${
                  viewMode === "table"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }
              `}
            >
              <TableDocument
                size={16}
                color={viewMode === "table" ? "#111827" : "#6B7280"}
              />
              Table View
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${
                  viewMode === "calendar"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }
              `}
            >
              <Calendar
                size={16}
                color={viewMode === "calendar" ? "#111827" : "#6B7280"}
              />
              Calendar View
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reservations</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{userStats.total}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Calendar color="#3B82F6" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{userStats.confirmed}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Calendar color="#10B981" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Checked Out</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{userStats.checkedOut}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Calendar color="#8B5CF6" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cancelled</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{userStats.cancelled}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <Calendar color="#EF4444" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <ReservationFiltersComponent
        onFiltersChange={handleFiltersChange}
        totalCount={allUserReservations.length}
        filteredCount={userReservations.length}
      />

      {/* Content Based on View Mode */}
      {viewMode === "table" ? (
        <UserReservationTable
          reservations={userReservations}
          loading={loading}
          onViewDetails={handleViewDetails}
          onDownloadPDF={handleDownloadPDF}
        />
      ) : (
        <ReservationCalendar
          reservations={userReservations}
          onReservationClick={handleReservationClick}
        />
      )}

      {/* Reservation Details Modal - Read-only for users */}
      <ReservationDetailsModal
        reservation={selectedReservation}
        isOpen={showDetailsModal}
        onClose={handleCloseDetailsModal}
        onEdit={() => {}} // Disabled for users
        onPrint={handleDownloadPDF}
        onCancel={() => {}} // Disabled for users
        onRefund={() => {}} // Disabled for users
        onUpdateStatus={() => {}} // Disabled for users
      />
    </div>
  );
};

// Custom table component for user reservations with limited actions
interface UserReservationTableProps {
  reservations: Reservation[];
  loading: boolean;
  onViewDetails: (reservation: Reservation) => void;
  onDownloadPDF: (reservation: Reservation) => void;
}

const UserReservationTable: React.FC<UserReservationTableProps> = ({
  reservations,
  loading,
  onViewDetails,
  onDownloadPDF,
}) => {
  const getStatusColor = (status: Reservation["status"]) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "checked_out":
        return "bg-blue-100 text-blue-800";
      case "no_show":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const formatTime = (timeString: string) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-center h-64">
          <SpinLoader />
        </div>
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <Calendar color="#9CA3AF" size={48} className="mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No reservations found</h3>
        <p className="text-gray-500">You haven't made any reservations yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-4 px-6 font-medium text-gray-700">Reservation</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700">Room</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700">Date & Time</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700">Status</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700">Amount</th>
              <th className="text-left py-4 px-6 font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-6">
                  <div>
                    <p className="font-medium text-gray-900">#{reservation.id.toUpperCase()}</p>
                    <p className="text-sm text-gray-500">
                      Created {formatDate(reservation.createdAt)}
                    </p>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div>
                    <p className="font-medium text-gray-900">{reservation.room.code}</p>
                    <p className="text-sm text-gray-500">{reservation.room.type?.name || 'Room'}</p>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div>
                    <p className="font-medium text-gray-900">
                      {formatDate(reservation.checkInDate)} - {formatDate(reservation.checkOutDate)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {reservation.nights} night{reservation.nights > 1 ? 's' : ''}
                    </p>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      reservation.status
                    )}`}
                  >
                    {reservation.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <p className="font-medium text-gray-900">
                    ${reservation.payment.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {reservation.payment.status}
                  </p>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => onViewDetails(reservation)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye color="#2563EB" size={16} />
                    </Button>
                    <Button
                      onClick={() => onDownloadPDF(reservation)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Download PDF"
                    >
                      <DocumentDownload color="#059669" size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserReservations;