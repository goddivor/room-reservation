/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ReservationDetailsModal.tsx
import React from 'react';
import { format } from 'date-fns';
import { X, User, MapPin, Calendar, CreditCard, Phone, Mail, Users, MessageSquare } from 'lucide-react';
import { ReservationStatusBadge } from './ReservationStatusBadge';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import type { Reservation } from '@/types/reservation.types';
import Button from '../Button';

interface ReservationDetailsModalProps {
  reservation: Reservation | null;
  isOpen: boolean;
  onClose: () => void;
  onPrint: (reservation: Reservation) => void;
  onRefund: (reservation: Reservation) => void;
}

export const ReservationDetailsModal: React.FC<ReservationDetailsModalProps> = ({
  reservation,
  isOpen,
  onClose,
  onPrint,
  onRefund
}) => {
  if (!isOpen || !reservation) return null;

  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const calculateNights = (checkIn: Date, checkOut: Date) => {
    const diffTime = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const isArchived = reservation.status === 'completed' || reservation.status === 'cancelled';
  const canRefund = reservation.payment.status === 'paid' && 
    reservation.status !== 'cancelled' && 
    !isArchived;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Reservation Details
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              ID: {reservation.id}
            </p>
          </div>
          <Button onClick={onClose}>
            <X size={20} color="#6b7280" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Guest Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <User size={20} color="#374151" />
                  Guest Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    {reservation.user.avatar ? (
                      <img
                        className="h-12 w-12 rounded-full object-cover"
                        src={reservation.user.avatar}
                        alt={`${reservation.user.firstName} ${reservation.user.lastName}`}
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <User size={24} color="#9ca3af" />
                      </div>
                    )}
                    <div>
                      <div className="text-base font-medium text-gray-900">
                        {reservation.user.firstName} {reservation.user.lastName}
                      </div>
                      <div className="text-sm text-gray-600">
                        Guest since {format(reservation.createdAt, 'MMM yyyy')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail size={16} color="#6b7280" />
                      <span className="text-gray-600">{reservation.user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone size={16} color="#6b7280" />
                      <span className="text-gray-600">{reservation.user.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users size={16} color="#6b7280" />
                      <span className="text-gray-600">
                        {reservation.guests} guest{reservation.guests > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Room Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin size={20} color="#374151" />
                  Room Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-lg font-medium text-gray-900">
                        Room {reservation.room.number}
                      </div>
                      <div className="text-sm text-gray-600">
                        {reservation.room.type} • Floor {reservation.room.floor}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(reservation.room.pricePerNight)} / night
                      </div>
                      <div className="text-sm text-gray-600">
                        Capacity: {reservation.room.capacity}
                      </div>
                    </div>
                  </div>
                  
                  {reservation.room.amenities.length > 0 && (
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Amenities:</div>
                      <div className="flex flex-wrap gap-1">
                        {reservation.room.amenities.map((amenity: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined, index: React.Key | null | undefined) => (
                          <span
                            key={index}
                            className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Special Requests */}
              {reservation.specialRequests && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <MessageSquare size={20} color="#374151" />
                    Special Requests
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700">{reservation.specialRequests}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Reservation & Payment Details */}
            <div className="space-y-6">
              {/* Reservation Details */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar size={20} color="#374151" />
                  Reservation Details
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status</span>
                    <ReservationStatusBadge status={reservation.status} />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Check-in</span>
                    <span className="text-sm font-medium text-gray-900">
                      {format(reservation.checkIn, 'EEEE, MMMM d, yyyy')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Check-out</span>
                    <span className="text-sm font-medium text-gray-900">
                      {format(reservation.checkOut, 'EEEE, MMMM d, yyyy')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Duration</span>
                    <span className="text-sm font-medium text-gray-900">
                      {calculateNights(reservation.checkIn, reservation.checkOut)} night
                      {calculateNights(reservation.checkIn, reservation.checkOut) > 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Created</span>
                    <span className="text-sm font-medium text-gray-900">
                      {format(reservation.createdAt, 'MMM d, yyyy HH:mm')}
                    </span>
                  </div>
                  
                  {reservation.cancelledAt && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Cancelled</span>
                      <span className="text-sm font-medium text-red-600">
                        {format(reservation.cancelledAt, 'MMM d, yyyy HH:mm')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard size={20} color="#374151" />
                  Payment Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Payment Status</span>
                    <PaymentStatusBadge 
                      status={reservation.payment.status}
                      method={reservation.payment.method}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Amount</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {formatCurrency(reservation.totalAmount, reservation.payment.currency)}
                    </span>
                  </div>
                  
                  {reservation.payment.paidAt && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Paid Date</span>
                      <span className="text-sm font-medium text-gray-900">
                        {format(reservation.payment.paidAt, 'MMM d, yyyy HH:mm')}
                      </span>
                    </div>
                  )}
                  
                  {reservation.payment.transactionId && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Transaction ID</span>
                      <span className="text-sm font-mono text-gray-900">
                        {reservation.payment.transactionId}
                      </span>
                    </div>
                  )}
                  
                  {reservation.payment.refundedAmount && (
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Refunded Amount</span>
                        <span className="text-sm font-medium text-red-600">
                          -{formatCurrency(reservation.payment.refundedAmount, reservation.payment.currency)}
                        </span>
                      </div>
                      {reservation.payment.refundedAt && (
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm text-gray-600">Refund Date</span>
                          <span className="text-sm font-medium text-gray-900">
                            {format(reservation.payment.refundedAt, 'MMM d, yyyy HH:mm')}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <Button onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => onPrint(reservation)}>
            Print PDF
          </Button>
          {canRefund && (
            <Button onClick={() => onRefund(reservation)}>
              Process Refund
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};