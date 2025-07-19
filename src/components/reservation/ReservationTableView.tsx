// components/ReservationTableView.tsx
import React from "react";
import { format } from "date-fns";
import { User, MapPin } from "lucide-react";
import { ReservationStatusBadge } from "./ReservationStatusBadge";
import type { Reservation } from "@/types/reservation.types";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { ReservationActions } from "./ReservationActions";

interface ReservationTableViewProps {
  reservations: Reservation[];
  filter: "all" | "active" | "archived";
  onViewDetails: (reservation: Reservation) => void;
  onPrint: (reservation: Reservation) => void;
  onRefund: (reservation: Reservation) => void;
}

export const ReservationTableView: React.FC<ReservationTableViewProps> = ({
  reservations,
  filter,
  onViewDetails,
  onPrint,
  onRefund,
}) => {
  const isArchived = filter === "archived";

  const formatCurrency = (amount: number, currency: string = "EUR") => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const formatDateRange = (checkIn: Date, checkOut: Date) => {
    return `${format(checkIn, "dd/MM/yy")} - ${format(checkOut, "dd/MM/yy")}`;
  };

  const calculateNights = (checkIn: Date, checkOut: Date) => {
    const diffTime = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (reservations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No reservations found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table
        className={`min-w-full divide-y divide-gray-200 ${
          isArchived ? "opacity-60" : ""
        }`}
      >
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Guest
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Room
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Dates
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Payment
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {reservations.map((reservation) => (
            <tr key={reservation.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    {reservation.user.avatar ? (
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={reservation.user.avatar}
                        alt={`${reservation.user.firstName} ${reservation.user.lastName}`}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User size={20} color="#9ca3af" />
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {reservation.user.firstName} {reservation.user.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {reservation.user.email}
                    </div>
                  </div>
                </div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <MapPin size={16} color="#6b7280" className="mr-2" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Room {reservation.room.number}
                    </div>
                    <div className="text-sm text-gray-500">
                      {reservation.room.type} • Floor {reservation.room.floor}
                    </div>
                  </div>
                </div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {formatDateRange(reservation.checkIn, reservation.checkOut)}
                </div>
                <div className="text-sm text-gray-500">
                  {calculateNights(reservation.checkIn, reservation.checkOut)}{" "}
                  night
                  {calculateNights(reservation.checkIn, reservation.checkOut) >
                  1
                    ? "s"
                    : ""}{" "}
                  • {reservation.guests} guest
                  {reservation.guests > 1 ? "s" : ""}
                </div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <ReservationStatusBadge status={reservation.status} />
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <PaymentStatusBadge
                  status={reservation.payment.status}
                  method={reservation.payment.method}
                />
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {formatCurrency(
                    reservation.totalAmount,
                    reservation.payment.currency
                  )}
                </div>
                {reservation.payment.refundedAmount && (
                  <div className="text-sm text-red-600">
                    -
                    {formatCurrency(
                      reservation.payment.refundedAmount,
                      reservation.payment.currency
                    )}{" "}
                    refunded
                  </div>
                )}
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <ReservationActions
                  reservation={reservation}
                  isArchived={isArchived}
                  onViewDetails={onViewDetails}
                  onPrint={onPrint}
                  onRefund={onRefund}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
