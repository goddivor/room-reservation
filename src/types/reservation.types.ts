import type { User } from './user.types';
import type { Room } from './room.types';

export type ReservationStatus = 
  | 'pending'
  | 'confirmed' 
  | 'checked_in'
  | 'checked_out'
  | 'cancelled'
  | 'no_show';

export type PaymentStatus = 
  | 'paid'
  | 'pending'
  | 'failed'
  | 'refunded'
  | 'on_site_payment';

export type PaymentMethod = 
  | 'credit_card'
  | 'paypal'
  | 'bank_transfer'
  | 'on_site_cash'
  | 'on_site_card';

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  paidAt?: Date;
  refundedAt?: Date;
  refundAmount?: number;
}

export interface Reservation {
  id: string;
  userId: string;
  user: User;
  roomId: string;
  room: Room;
  checkInDate: Date;
  checkOutDate: Date;
  nights: number;
  guests: number;
  status: ReservationStatus;
  payment: Payment;
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
}

export interface ReservationFilters {
  status?: ReservationStatus[];
  paymentStatus?: PaymentStatus[];
  roomType?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  guestRange?: {
    min: number;
    max: number;
  };
  searchQuery?: string;
}

export interface ReservationStats {
  total: number;
  pending: number;
  confirmed: number;
  checkedIn: number;
  checkedOut: number;
  cancelled: number;
  noShow: number;
  totalRevenue: number;
  pendingPayments: number;
}