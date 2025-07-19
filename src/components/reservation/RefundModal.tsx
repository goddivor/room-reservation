// components/RefundModal.tsx
import React, { useState } from "react";
import { X, AlertTriangle, Calculator } from "lucide-react";
import Button from "../Button";
import { Input } from "../Input";
import type { Reservation } from "@/types/reservation.types";

interface RefundModalProps {
  reservation: Reservation | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reservationId: string, amount: number, reason: string) => void;
}

export const RefundModal: React.FC<RefundModalProps> = ({
  reservation,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !reservation) return null;

  const formatCurrency = (amount: number, currency: string = "EUR") => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const maxRefundAmount =
    reservation.totalAmount - (reservation.payment.refundedAmount || 0);
  const refundAmountNum = parseFloat(refundAmount) || 0;
  const isValidAmount =
    refundAmountNum > 0 && refundAmountNum <= maxRefundAmount;

  const handleConfirm = async () => {
    if (!isValidAmount || !refundReason.trim()) return;

    setIsProcessing(true);
    try {
      await onConfirm(reservation.id, refundAmountNum, refundReason.trim());
      setRefundAmount("");
      setRefundReason("");
      onClose();
    } catch (error) {
      console.error("Refund processing failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const setFullRefund = () => {
    setRefundAmount(maxRefundAmount.toString());
  };

  const setPartialRefund = (percentage: number) => {
    const amount = (maxRefundAmount * percentage) / 100;
    setRefundAmount(amount.toFixed(2));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-lg w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertTriangle size={20} color="#ea580c" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Process Refund
              </h2>
              <p className="text-sm text-gray-600">
                Reservation ID: {reservation.id}
              </p>
            </div>
          </div>
          <Button onClick={onClose}>
            <X size={20} color="#6b7280" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Reservation Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-700">Guest:</span>
              <span className="text-sm text-gray-900">
                {reservation.user.firstName} {reservation.user.lastName}
              </span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-700">Room:</span>
              <span className="text-sm text-gray-900">
                {reservation.room.number} ({reservation.room.type})
              </span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-700">
                Total Paid:
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {formatCurrency(
                  reservation.totalAmount,
                  reservation.payment.currency
                )}
              </span>
            </div>
            {reservation.payment.refundedAmount && (
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-700">
                  Already Refunded:
                </span>
                <span className="text-sm font-semibold text-red-600">
                  -
                  {formatCurrency(
                    reservation.payment.refundedAmount,
                    reservation.payment.currency
                  )}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
              <span className="text-sm font-medium text-gray-700">
                Available for Refund:
              </span>
              <span className="text-sm font-bold text-green-600">
                {formatCurrency(maxRefundAmount, reservation.payment.currency)}
              </span>
            </div>
          </div>

          {/* Quick Refund Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Quick Refund Options
            </label>
            <div className="grid grid-cols-4 gap-2">
              <Button onClick={() => setPartialRefund(25)} className="text-xs">
                25%
              </Button>
              <Button onClick={() => setPartialRefund(50)} className="text-xs">
                50%
              </Button>
              <Button onClick={() => setPartialRefund(75)} className="text-xs">
                75%
              </Button>
              <Button onClick={setFullRefund} className="text-xs">
                100%
              </Button>
            </div>
          </div>

          {/* Refund Amount */}
          <div>
            <label
              htmlFor="refundAmount"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Refund Amount ({reservation.payment.currency})
            </label>
            <div className="relative">
              <Input
                id="refundAmount"
                type="number"
                step="0.01"
                min="0"
                max={maxRefundAmount}
                value={refundAmount}
                onChange={(e: {
                  target: { value: React.SetStateAction<string> };
                }) => setRefundAmount(e.target.value)}
                placeholder="Enter amount"
                className={`pr-12 ${
                  !isValidAmount && refundAmount ? "border-red-500" : ""
                }`}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Calculator size={16} color="#6b7280" />
              </div>
            </div>
            {!isValidAmount && refundAmount && (
              <p className="text-sm text-red-600 mt-1">
                Amount must be between 0.01 and{" "}
                {formatCurrency(maxRefundAmount, reservation.payment.currency)}
              </p>
            )}
          </div>

          {/* Refund Reason */}
          <div>
            <label
              htmlFor="refundReason"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Reason for Refund *
            </label>
            <textarea
              id="refundReason"
              rows={3}
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              placeholder="Please provide a reason for this refund..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 resize-none"
              required
            />
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle
                size={20}
                color="#eab308"
                className="flex-shrink-0 mt-0.5"
              />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Important:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>This action cannot be undone</li>
                  <li>
                    The refund will be processed to the original payment method
                  </li>
                  <li>Processing may take 3-5 business days</li>
                  <li>The guest will be notified automatically</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <Button onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!isValidAmount || !refundReason.trim() || isProcessing}
          >
            {isProcessing
              ? "Processing..."
              : `Refund ${formatCurrency(
                  refundAmountNum,
                  reservation.payment.currency
                )}`}
          </Button>
        </div>
      </div>
    </div>
  );
};
