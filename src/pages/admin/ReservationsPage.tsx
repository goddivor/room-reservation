// components/reservations/ReservationsPage.tsx
import React, { useState } from 'react';
import { Calendar, Table, Search, Download, Plus, RefreshCw } from 'lucide-react';
import Button from '@/components/Button';
import { Input } from '@/components/Input';
import { RefundModal } from '@/components/reservation/RefundModal';
import { ReservationCalendarView } from '@/components/reservation/ReservationCalendarView';
import { ReservationDetailsModal } from '@/components/reservation/ReservationDetailsModal';
import { ReservationTableView } from '@/components/reservation/ReservationTableView';
import { useReservations } from '@/hooks/useReservations';
import { type Reservation } from '@/types';
import type { ViewMode, ReservationFilter } from '@/types/reservation.types';
import { ReservationStats } from '@/components/reservation/ReservationStats';

export const ReservationsPage: React.FC = () => {
  const {
    reservations,
    loading,
    error,
    filteredReservations,
    getFilterCounts,
    refreshReservations,
    processRefund,
    generatePDF,
    exportReservations
  } = useReservations();

  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [filter, setFilter] = useState<ReservationFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleViewDetails = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsDetailsModalOpen(true);
  };

  const handlePrint = async (reservation: Reservation) => {
    try {
      await generatePDF(reservation);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // You could show a toast notification here
    }
  };

  const handleRefund = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsRefundModalOpen(true);
  };

  const handleRefundConfirm = async (reservationId: string, amount: number, reason: string) => {
    try {
      await processRefund(reservationId, amount, reason);
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error; // Re-throw to be handled by the modal
    }
  };

  const handleExportData = async () => {
    try {
      await exportReservations('csv');
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await refreshReservations();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const filterCounts = getFilterCounts();
  const currentReservations = filteredReservations(filter, searchQuery);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reservations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <Button onClick={handleRefresh}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reservations</h1>
          <p className="text-gray-600 mt-1">
            Manage hotel reservations and bookings
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
             
            onClick={handleRefresh} 
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} color="#6b7280" className={isRefreshing ? 'animate-spin' : ''} />
            Refresh
          </Button>
          <Button  onClick={handleExportData}>
            <Download size={16} color="#6b7280" />
            Export
          </Button>
            <Button>
            <Plus size={16} color="white" />
            New Reservation
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <ReservationStats reservations={reservations} />

      {/* Filters and Search */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search */}
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search size={20} color="#9ca3af" className="absolute left-3 top-1/2 transform -translate-y-1/2" />
              <Input
                type="text"
                placeholder="Search reservations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filter === 'all'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All ({filterCounts.all})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filter === 'active'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Active ({filterCounts.active})
            </button>
            <button
              onClick={() => setFilter('archived')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filter === 'archived'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Archived ({filterCounts.archived})
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Table View"
            >
              <Table size={16} />
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Calendar View"
            >
              <Calendar size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white border border-gray-200 rounded-lg">
        {viewMode === 'table' ? (
          <ReservationTableView
            reservations={currentReservations}
            filter={filter}
            onViewDetails={handleViewDetails}
            onPrint={handlePrint}
            onRefund={handleRefund}
          />
        ) : (
          <div className="p-6">
            <ReservationCalendarView
              reservations={currentReservations}
              filter={filter}
              onViewDetails={handleViewDetails}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <ReservationDetailsModal
        reservation={selectedReservation}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedReservation(null);
        }}
        onPrint={handlePrint}
        onRefund={handleRefund}
      />

      <RefundModal
        reservation={selectedReservation}
        isOpen={isRefundModalOpen}
        onClose={() => {
          setIsRefundModalOpen(false);
          setSelectedReservation(null);
        }}
        onConfirm={handleRefundConfirm}
      />
    </div>
  );
};