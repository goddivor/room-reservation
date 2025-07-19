// types/reservation.ts

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
}

export interface Room {
  id: string;
  number: string;
  type: string;
  floor: number;
  capacity: number;
  pricePerNight: number;
  amenities: string[];
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  method: 'card' | 'cash' | 'transfer' | 'pending';
  status: 'paid' | 'pending' | 'failed' | 'refunded' | 'partial_refund';
  paidAt?: Date;
  refundedAmount?: number;
  refundedAt?: Date;
  transactionId?: string;
}

export interface Reservation {
  id: string;
  userId: string;
  user: User;
  roomId: string;
  room: Room;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'no_show';
  totalAmount: number;
  payment: Payment;
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
}

export type ViewMode = 'table' | 'calendar';

export type ReservationFilter = 'all' | 'active' | 'archived';