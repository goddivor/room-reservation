/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { 
  Calendar, 
  Home, 
  Eye, 
  Printer, 
  Edit, 
  Trash,
  MoreCircle,
  ArrowDown2,
  ArrowUp2
} from 'iconsax-react';
import type { Reservation } from '../../types/reservation.types';
import Badge from '../badge';
import Button from '../actions/button';

interface ReservationTableProps {
  reservations: Reservation[];
  loading?: boolean;
  onViewDetails: (reservation: Reservation) => void;
  onPrintReservation: (reservation: Reservation) => void;
  onEditReservation: (reservation: Reservation) => void;
  onCancelReservation: (reservation: Reservation) => void;
}

const ReservationTable: React.FC<ReservationTableProps> = ({
  reservations,
  loading = false,
  onViewDetails,
  onPrintReservation,
  onEditReservation,
  onCancelReservation
}) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Reservation | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });

  const getStatusBadge = (status: Reservation['status']) => {
    const statusConfig = {
      pending: { variant: 'warning' as const, label: 'Pending' },
      confirmed: { variant: 'info' as const, label: 'Confirmed' },
      checked_in: { variant: 'success' as const, label: 'Checked In' },
      checked_out: { variant: 'secondary' as const, label: 'Checked Out' },
      cancelled: { variant: 'danger' as const, label: 'Cancelled' },
      no_show: { variant: 'warning' as const, label: 'No Show' }
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPaymentStatusBadge = (status: Reservation['payment']['status']) => {
    const statusConfig = {
      paid: { variant: 'success' as const, label: 'Paid' },
      pending: { variant: 'warning' as const, label: 'Pending' },
      failed: { variant: 'danger' as const, label: 'Failed' },
      refunded: { variant: 'info' as const, label: 'Refunded' },
      on_site_payment: { variant: 'secondary' as const, label: 'On-site' }
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const isArchived = (reservation: Reservation) => {
    const today = new Date();
    const checkOut = new Date(reservation.checkOutDate);
    return checkOut < today || reservation.status === 'checked_out' || reservation.status === 'cancelled';
  };

  const handleSort = (key: keyof Reservation) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedReservations = React.useMemo(() => {
    if (!sortConfig.key) return reservations;

    return [...reservations].sort((a, b) => {
      const aValue = a[sortConfig.key!] ?? '';
      const bValue = b[sortConfig.key!] ?? '';

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [reservations, sortConfig]);

  const columns = [
    {
      key: 'id',
      label: 'Reservation ID',
      sortable: true,
      render: (reservation: Reservation) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Calendar size={20} color="#3B82F6" />
          </div>
          <div>
            <div className="font-medium text-gray-900">#{reservation.id.toUpperCase()}</div>
            <div className="text-sm text-gray-500">
              {formatDate(reservation.createdAt)}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'user',
      label: 'Guest',
      sortable: false,
      render: (reservation: Reservation) => (
        <div className="flex items-center gap-3">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${reservation.user.email}`}
            alt={`${reservation.user.firstName} ${reservation.user.lastName}`}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <div className="font-medium text-gray-900">
              {reservation.user.firstName} {reservation.user.lastName}
            </div>
            <div className="text-sm text-gray-500">{reservation.user.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'room',
      label: 'Room',
      sortable: false,
      render: (reservation: Reservation) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Home size={20} color="#10B981" />
          </div>
          <div>
            <div className="font-medium text-gray-900">ROOM {reservation.room.code}</div>
            <div className="text-sm text-gray-500 capitalize">{String(reservation.room.type?.name ?? '')}</div>
          </div>
        </div>
      )
    },
    {
      key: 'dates',
      label: 'Stay Period',
      sortable: true,
      render: (reservation: Reservation) => (
        <div>
          <div className="font-medium text-gray-900">
            {formatDate(reservation.checkInDate)} - {formatDate(reservation.checkOutDate)}
          </div>
          <div className="text-sm text-gray-500">
            {reservation.nights} {reservation.nights === 1 ? 'night' : 'nights'} • {reservation.guests} {reservation.guests === 1 ? 'guest' : 'guests'}
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (reservation: Reservation) => (
        <div className="space-y-1">
          {getStatusBadge(reservation.status)}
          {getPaymentStatusBadge(reservation.payment.status)}
        </div>
      )
    },
    {
      key: 'payment',
      label: 'Amount',
      sortable: true,
      render: (reservation: Reservation) => (
        <div>
          <div className="font-medium text-gray-900">
            {formatCurrency(reservation.payment.amount, reservation.payment.currency)}
          </div>
          <div className="text-sm text-gray-500 capitalize">
            {reservation.payment.method.replace('_', ' ')}
          </div>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (reservation: Reservation) => {
        const archived = isArchived(reservation);
        
        return (
          <div className="flex items-center gap-2">
            <Button
              onClick={() => onViewDetails(reservation)}
              title="View Details"
            >
              <Eye size={16} color="#6B7280" />
            </Button>
            
            <Button
              onClick={() => onPrintReservation(reservation)}
              title="Print PDF"
            >
              <Printer size={16} color="#6B7280" />
            </Button>

            {!archived && (
              <>
                <Button
                  onClick={() => onEditReservation(reservation)}
                  title="Edit Reservation"
                >
                  <Edit size={16} color="#6B7280" />
                </Button>

                {reservation.status !== 'cancelled' && (
                  <Button
                    onClick={() => onCancelReservation(reservation)}
                    title="Cancel Reservation"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash size={16} color="#DC2626" />
                  </Button>
                )}
              </>
            )}

            <Button title="More Actions">
              <MoreCircle size={16} color="#6B7280" />
            </Button>
          </div>
        );
      }
    }
  ];

  const SortableHeader = ({ column, children }: { column: any; children: React.ReactNode }) => {
    if (!column.sortable) return <div>{children}</div>;

    const isActive = sortConfig.key === column.key;
    
    return (
      <button
        onClick={() => handleSort(column.key)}
        className="flex items-center gap-2 text-left hover:text-gray-900 transition-colors"
      >
        {children}
        {isActive ? (
          sortConfig.direction === 'asc' ? 
            <ArrowUp2 size={14} color="#6B7280" /> : 
            <ArrowDown2 size={14} color="#6B7280" />
        ) : (
          <ArrowDown2 size={14} color="#D1D5DB" />
        )}
      </button>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                  <SortableHeader column={column}>
                    {column.label}
                  </SortableHeader>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              [...Array(5)].map((_, index) => (
                <tr key={index} className="animate-pulse">
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : sortedReservations.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <Calendar size={48} color="#D1D5DB" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No reservations found</h3>
                      <p className="text-gray-500">Try adjusting your filters to see more results.</p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              sortedReservations.map((reservation) => {
                const archived = isArchived(reservation);
                return (
                  <tr 
                    key={reservation.id} 
                    className={`hover:bg-gray-50 transition-colors ${archived ? 'opacity-60 bg-gray-25' : ''}`}
                  >
                    {columns.map((column) => (
                      <td key={column.key} className="px-6 py-4">
                        {column.render(reservation)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservationTable;