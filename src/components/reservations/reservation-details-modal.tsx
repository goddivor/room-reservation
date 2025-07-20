import React, { useState, useRef, useEffect } from 'react';
import { 
  CloseCircle, 
  User, 
  Home, 
  Calendar, 
  DollarCircle, 
  Clock,
  Edit,
  Printer,
  Trash,
  RefreshCircle,
  Call,
  Sms
} from 'iconsax-react';
import type { Reservation } from '../../types/reservation.types';
import Modal from '../ui/Modal';
import type { ModalRef } from '../ui/Modal';
import Badge from '../badge';
import Button from '../actions/button';

interface ReservationDetailsModalProps {
  reservation: Reservation | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (reservation: Reservation) => void;
  onPrint: (reservation: Reservation) => void;
  onCancel: (reservation: Reservation) => void;
  onRefund: (reservation: Reservation) => void;
  onUpdateStatus: (reservation: Reservation, status: Reservation['status']) => void;
}

const ReservationDetailsModal: React.FC<ReservationDetailsModalProps> = ({
  reservation,
  isOpen,
  onClose,
  onEdit,
  onPrint,
  onCancel,
  onRefund,
  onUpdateStatus
}) => {
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundAmount, setRefundAmount] = useState('');
  const modalRef = useRef<ModalRef>(null);
  const refundModalRef = useRef<ModalRef>(null);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.open();
    } else {
      modalRef.current?.close();
    }
  }, [isOpen]);

  useEffect(() => {
    if (showRefundModal) {
      refundModalRef.current?.open();
    } else {
      refundModalRef.current?.close();
    }
  }, [showRefundModal]);

  if (!reservation) return null;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

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
      on_site_payment: { variant: 'secondary' as const, label: 'On-site Payment' }
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const isArchived = () => {
    const today = new Date();
    const checkOut = new Date(reservation.checkOutDate);
    return checkOut < today || reservation.status === 'checked_out' || reservation.status === 'cancelled';
  };

  const canRefund = () => {
    return reservation.payment.status === 'paid' && 
           reservation.status !== 'checked_out' && 
           reservation.status !== 'cancelled';
  };

  const availableStatusUpdates = () => {
    const current = reservation.status;
    const options = [];

    if (current === 'pending') {
      options.push({ value: 'confirmed', label: 'Confirm Reservation' });
      options.push({ value: 'cancelled', label: 'Cancel Reservation' });
    }
    if (current === 'confirmed') {
      options.push({ value: 'checked_in', label: 'Check In' });
      options.push({ value: 'cancelled', label: 'Cancel Reservation' });
      options.push({ value: 'no_show', label: 'Mark as No Show' });
    }
    if (current === 'checked_in') {
      options.push({ value: 'checked_out', label: 'Check Out' });
    }

    return options;
  };

  const handleRefund = () => {
    const amount = parseFloat(refundAmount);
    if (amount > 0 && amount <= reservation.payment.amount) {
      onRefund(reservation);
      setShowRefundModal(false);
      setRefundAmount('');
    }
  };

  return (
    <>
      <Modal ref={modalRef} onClose={onClose} size="lg">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Reservation Details
              </h2>
              <p className="text-gray-500">#{reservation.id.toUpperCase()}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <CloseCircle size={24} color="#6B7280" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Guest Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <User size={20} color="#6B7280" />
                  <h3 className="font-semibold text-gray-900">Guest Information</h3>
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${reservation.user.email}`}
                    alt={`${reservation.user.firstName} ${reservation.user.lastName}`}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      {reservation.user.firstName} {reservation.user.lastName}
                    </h4>
                    <div className="text-gray-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <Sms size={14} color="#6B7280" />
                        <span>{reservation.user.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Call size={14} color="#6B7280" />
                        <span>{reservation.user.phone || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Room Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Home size={20} color="#6B7280" />
                  <h3 className="font-semibold text-gray-900">Room Information</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Room Name</p>
                    <p className="font-medium text-gray-900">{reservation.room.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Room Type</p>
                    <p className="font-medium text-gray-900 capitalize">
                      {typeof reservation.room.type === 'string'
                        ? reservation.room.type
                        : reservation.room.type?.name || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Floor</p>
                    <p className="font-medium text-gray-900">{reservation.room.floor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Capacity</p>
                    <p className="font-medium text-gray-900">{reservation.room.capacity} guests</p>
                  </div>
                </div>
              </div>

              {/* Stay Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar size={20} color="#6B7280" />
                  <h3 className="font-semibold text-gray-900">Stay Information</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Check-in Date</p>
                    <p className="font-medium text-gray-900">{formatDate(reservation.checkInDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Check-out Date</p>
                    <p className="font-medium text-gray-900">{formatDate(reservation.checkOutDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium text-gray-900">
                      {reservation.nights} {reservation.nights === 1 ? 'night' : 'nights'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Guests</p>
                    <p className="font-medium text-gray-900">
                      {reservation.guests} {reservation.guests === 1 ? 'guest' : 'guests'}
                    </p>
                  </div>
                </div>

                {reservation.specialRequests && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Special Requests</p>
                    <p className="font-medium text-gray-900">{reservation.specialRequests}</p>
                  </div>
                )}
              </div>

              {/* Payment Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <DollarCircle size={20} color="#6B7280" />
                  <h3 className="font-semibold text-gray-900">Payment Information</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-xl font-bold text-gray-900">
                      {formatCurrency(reservation.payment.amount, reservation.payment.currency)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="font-medium text-gray-900 capitalize">
                      {reservation.payment.method.replace('_', ' ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Status</p>
                    {getPaymentStatusBadge(reservation.payment.status)}
                  </div>
                  {reservation.payment.transactionId && (
                    <div>
                      <p className="text-sm text-gray-500">Transaction ID</p>
                      <p className="font-medium text-gray-900 font-mono text-sm">
                        {reservation.payment.transactionId}
                      </p>
                    </div>
                  )}
                </div>

                {reservation.payment.paidAt && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Paid At</p>
                    <p className="font-medium text-gray-900">
                      {formatDateTime(reservation.payment.paidAt)}
                    </p>
                  </div>
                )}

                {reservation.payment.refundedAt && (
                  <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-600 font-medium">Refund Information</p>
                    <p className="text-purple-900">
                      Refunded {formatCurrency(reservation.payment.refundAmount || 0)} on {formatDateTime(reservation.payment.refundedAt)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Sidebar */}
            <div className="space-y-6">
              {/* Status */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={20} color="#6B7280" />
                  <h3 className="font-semibold text-gray-900">Status</h3>
                </div>
                <div className="space-y-2">
                  {getStatusBadge(reservation.status)}
                  {getPaymentStatusBadge(reservation.payment.status)}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <Button
                    
                    
                    onClick={() => onPrint(reservation)}
                    className="w-full justify-start"
                  >
                    <Printer size={16} color="#6B7280" />
                    Print PDF
                  </Button>

                  {!isArchived() && (
                    <>
                      <Button
                        
                        
                        onClick={() => onEdit(reservation)}
                        className="w-full justify-start"
                      >
                        <Edit size={16} color="#6B7280" />
                        Edit Reservation
                      </Button>

                      {canRefund() && (
                        <Button
                          
                          
                          onClick={() => setShowRefundModal(true)}
                          className="w-full justify-start text-purple-600 border-purple-300 hover:bg-purple-50"
                        >
                          <RefreshCircle size={16} color="#7C3AED" />
                          Process Refund
                        </Button>
                      )}

                      {reservation.status !== 'cancelled' && (
                        <Button
                          
                          
                          onClick={() => onCancel(reservation)}
                          className="w-full justify-start text-red-600 border-red-300 hover:bg-red-50"
                        >
                          <Trash size={16} color="#DC2626" />
                          Cancel Reservation
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Status Updates */}
              {availableStatusUpdates().length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Update Status</h3>
                  <div className="space-y-2">
                    {availableStatusUpdates().map((option) => (
                      <Button
                        key={option.value}
                        
                        
                        onClick={() => onUpdateStatus(reservation, option.value as Reservation['status'])}
                        className="w-full justify-start"
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="bg-gray-50 rounded-lg p-4 text-sm">
                <h4 className="font-medium text-gray-900 mb-2">Timestamps</h4>
                <div className="space-y-2 text-gray-600">
                  <div>
                    <span className="text-gray-500">Created:</span><br />
                    {formatDateTime(reservation.createdAt)}
                  </div>
                  <div>
                    <span className="text-gray-500">Updated:</span><br />
                    {formatDateTime(reservation.updatedAt)}
                  </div>
                  {reservation.cancelledAt && (
                    <div>
                      <span className="text-gray-500">Cancelled:</span><br />
                      {formatDateTime(reservation.cancelledAt)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Refund Modal */}
      <Modal 
        ref={refundModalRef}
        onClose={() => setShowRefundModal(false)}
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Process Refund</h3>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              Original payment: {formatCurrency(reservation.payment.amount, reservation.payment.currency)}
            </p>
            
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Refund Amount
            </label>
            <input
              type="number"
              value={refundAmount}
              onChange={(e) => setRefundAmount(e.target.value)}
              max={reservation.payment.amount}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
            />
          </div>

          <div className="flex gap-3">
            <Button
              
              onClick={() => setShowRefundModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              
              onClick={handleRefund}
              disabled={!refundAmount || parseFloat(refundAmount) <= 0}
              className="flex-1"
            >
              Process Refund
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ReservationDetailsModal;