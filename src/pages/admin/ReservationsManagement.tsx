/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { Calendar, TableDocument, Printer, Add } from "iconsax-react";
import { useReservations } from "../../hooks/useReservations";
import type {
  Reservation,
  ReservationFilters,
} from "../../types/reservation.types";
import ReservationFiltersComponent from "../../components/reservations/reservation-filters";
import ReservationTable from "../../components/reservations/reservation-table";
import ReservationCalendar from "../../components/reservations/reservation-calendar";
import ReservationDetailsModal from "../../components/reservations/reservation-details-modal";
import ConfirmationModal from "../../components/modals/confirmation-modal";
import Button from "../../components/actions/button";
import SpinLoader from "../../components/SpinLoader";
import { useToast } from "../../context/toast-context";
import ReservationOverviewCards from "@/components/reservations/reservation-overview-card";

type ViewMode = "table" | "calendar";

const ReservationsManagement: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [reservationToCancel, setReservationToCancel] =
    useState<Reservation | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  const {
    reservations,
    allReservations,
    stats,
    loading,
    error: reservationError,
    applyFilters,
    updateReservationStatus,
    cancelReservation,
    processRefund,
  } = useReservations();

  const { success, info, error: showError } = useToast();

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

  const handlePrintReservation = (reservation: Reservation) => {
    // Mock PDF generation
    info(
      `Génération du PDF pour la réservation #${reservation.id.toUpperCase()}...`
    );
    setTimeout(() => {
      success(
        `PDF généré avec succès pour la réservation #${reservation.id.toUpperCase()}`
      );
      console.log("Printing reservation:", reservation);
    }, 1500);
  };

  const handleEditReservation = (reservation: Reservation) => {
    info("La fonctionnalité d'édition arrive bientôt !");
    console.log("Edit reservation:", reservation);
  };

  const handleCancelReservation = (reservation: Reservation) => {
    setReservationToCancel(reservation);
    setShowCancelModal(true);
  };

  const confirmCancelReservation = async () => {
    if (!reservationToCancel) return;
    try {
      await cancelReservation(
        reservationToCancel.id,
        cancelReason || "Annulé par l'admin"
      );
      success(
        `La réservation #${reservationToCancel.id.toUpperCase()} a été annulée`
      );
      setShowCancelModal(false);
      setReservationToCancel(null);
      setCancelReason("");
    } catch (err) {
      showError("Échec de l'annulation de la réservation");
    }
  };

  const handleRefund = async (reservation: Reservation) => {
    try {
      const refundAmount = reservation.payment.amount * 0.9;
      await processRefund(reservation.id, refundAmount);
      success(
        `Remboursement de ${refundAmount.toFixed(2)} effectué avec succès`
      );
      setShowDetailsModal(false);
    } catch (err) {
      showError("Échec du remboursement");
    }
  };

  const handleUpdateStatus = async (
    reservation: Reservation,
    status: Reservation["status"]
  ) => {
    try {
      await updateReservationStatus(reservation.id, status);
      success(
        `Statut de la réservation mis à jour : ${status.replace("_", " ")}`
      );
      setShowDetailsModal(false);
    } catch (err) {
      showError("Échec de la mise à jour du statut de la réservation");
    }
  };

  const handleReservationClick = (reservation: Reservation) => {
    handleViewDetails(reservation);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedReservation(null);
  };

  if (loading && allReservations.length === 0) {
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
            Reservations Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and track all hotel reservations
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

          <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2">
            <Add size={16} color="#ffffff" />
            <span>Add Reservation</span>
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <ReservationOverviewCards stats={stats} loading={loading} />

      {/* Filters */}
      <ReservationFiltersComponent
        onFiltersChange={handleFiltersChange}
        totalCount={allReservations.length}
        filteredCount={reservations.length}
      />

      {/* Content Based on View Mode */}
      {viewMode === "table" ? (
        <ReservationTable
          reservations={reservations}
          loading={loading}
          onViewDetails={handleViewDetails}
          onPrintReservation={handlePrintReservation}
          onEditReservation={handleEditReservation}
          onCancelReservation={handleCancelReservation}
        />
      ) : (
        <ReservationCalendar
          reservations={reservations}
          onReservationClick={handleReservationClick}
        />
      )}

      {/* Reservation Details Modal */}
      <ReservationDetailsModal
        reservation={selectedReservation}
        isOpen={showDetailsModal}
        onClose={handleCloseDetailsModal}
        onEdit={handleEditReservation}
        onPrint={handlePrintReservation}
        onCancel={handleCancelReservation}
        onRefund={handleRefund}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Cancel Confirmation Modal */}
      <ConfirmationModal
        isOpen={showCancelModal}
        onClose={() => {
          setShowCancelModal(false);
          setReservationToCancel(null);
          setCancelReason("");
        }}
        onConfirm={confirmCancelReservation}
        title="Cancel Reservation"
        message={
          reservationToCancel
            ? `Are you sure you want to cancel reservation #${reservationToCancel.id.toUpperCase()} for ${
                reservationToCancel.user.firstName
              } ${reservationToCancel.user.lastName}?`
            : ""
        }
        confirmText="Cancel Reservation"
        cancelText="Keep Reservation"
        variant="danger"
      >
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cancellation Reason (Optional)
          </label>
          <textarea
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Enter reason for cancellation..."
          />
        </div>
      </ConfirmationModal>

      {/* Export Actions */}
      <div className="fixed bottom-6 right-6">
        <div className="flex flex-col gap-2">
          <Button
            onClick={() => {
              info("Exportation des réservations en PDF...");
              setTimeout(() => {
                success("Réservations exportées avec succès !");
              }, 2000);
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Printer size={16} color="#fff" />
            <span>Export PDF</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReservationsManagement;
