// components/ReservationActions.tsx
import React, { useState } from 'react';
import { Printer, Eye, RotateCcw, MoreHorizontal } from 'lucide-react';
import type { Reservation } from '@/types';
import Button from '../Button';

interface ReservationActionsProps {
  reservation: Reservation;
  isArchived: boolean;
  onViewDetails: (reservation: Reservation) => void;
  onPrint: (reservation: Reservation) => void;
  onRefund: (reservation: Reservation) => void;
}

export const ReservationActions: React.FC<ReservationActionsProps> = ({
  reservation,
  isArchived,
  onViewDetails,
  onPrint,
  onRefund
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const canRefund = reservation.payment.status === 'paid' && 
    reservation.status !== 'cancelled' && 
    !isArchived;

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 w-8 p-0"
      >
        <MoreHorizontal size={16} />
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10">
          <button
            onClick={() => handleAction(() => onViewDetails(reservation))}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Eye size={16} color="#6b7280" />
            View Details
          </button>

          <button
            onClick={() => handleAction(() => onPrint(reservation))}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Printer size={16} color="#6b7280" />
            Print PDF
          </button>

          {canRefund && (
            <button
              onClick={() => handleAction(() => onRefund(reservation))}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <RotateCcw size={16} color="#6b7280" />
              Process Refund
            </button>
          )}
        </div>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};