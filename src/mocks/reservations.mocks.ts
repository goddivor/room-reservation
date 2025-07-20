import type { Reservation, ReservationStats } from '../types/reservation.types';
import { mockUsers } from './users.mocks';
import { mockRooms } from './rooms.mocks';

export const mockReservations: Reservation[] = [
  {
    id: 'res-001',
    userId: 'user-001',
    user: mockUsers[0],
    roomId: 'room-001',
    room: mockRooms[0],
    checkInDate: new Date('2024-08-15'),
    checkOutDate: new Date('2024-08-18'),
    nights: 3,
    guests: 2,
    status: 'confirmed',
    payment: {
      id: 'pay-001',
      amount: 450.00,
      currency: 'USD',
      method: 'credit_card',
      status: 'paid',
      transactionId: 'txn_1234567890',
      paidAt: new Date('2024-07-20T14:30:00Z')
    },
    specialRequests: 'Late check-in requested',
    createdAt: new Date('2024-07-20T14:30:00Z'),
    updatedAt: new Date('2024-07-20T14:30:00Z')
  },
  {
    id: 'res-002',
    userId: 'user-002',
    user: mockUsers[1],
    roomId: 'room-002',
    room: mockRooms[1],
    checkInDate: new Date('2024-08-20'),
    checkOutDate: new Date('2024-08-25'),
    nights: 5,
    guests: 1,
    status: 'pending',
    payment: {
      id: 'pay-002',
      amount: 750.00,
      currency: 'USD',
      method: 'on_site_cash',
      status: 'on_site_payment'
    },
    createdAt: new Date('2024-07-22T09:15:00Z'),
    updatedAt: new Date('2024-07-22T09:15:00Z')
  },
  {
    id: 'res-003',
    userId: 'user-003',
    user: mockUsers[2],
    roomId: 'room-003',
    room: mockRooms[2],
    checkInDate: new Date('2024-07-10'),
    checkOutDate: new Date('2024-07-12'),
    nights: 2,
    guests: 4,
    status: 'checked_out',
    payment: {
      id: 'pay-003',
      amount: 320.00,
      currency: 'USD',
      method: 'paypal',
      status: 'paid',
      transactionId: 'pp_9876543210',
      paidAt: new Date('2024-07-08T16:45:00Z')
    },
    createdAt: new Date('2024-07-08T16:45:00Z'),
    updatedAt: new Date('2024-07-12T11:00:00Z')
  },
  {
    id: 'res-004',
    userId: 'user-001',
    user: mockUsers[0],
    roomId: 'room-001',
    room: mockRooms[0],
    checkInDate: new Date('2024-09-05'),
    checkOutDate: new Date('2024-09-08'),
    nights: 3,
    guests: 2,
    status: 'cancelled',
    payment: {
      id: 'pay-004',
      amount: 450.00,
      currency: 'USD',
      method: 'credit_card',
      status: 'refunded',
      transactionId: 'txn_1111222233',
      paidAt: new Date('2024-07-25T10:20:00Z'),
      refundedAt: new Date('2024-08-01T14:15:00Z'),
      refundAmount: 405.00
    },
    cancelledAt: new Date('2024-08-01T14:15:00Z'),
    cancellationReason: 'Customer requested cancellation',
    createdAt: new Date('2024-07-25T10:20:00Z'),
    updatedAt: new Date('2024-08-01T14:15:00Z')
  },
  {
    id: 'res-005',
    userId: 'user-004',
    user: mockUsers[3],
    roomId: 'room-004',
    room: mockRooms[3],
    checkInDate: new Date('2024-08-25'),
    checkOutDate: new Date('2024-08-30'),
    nights: 5,
    guests: 3,
    status: 'confirmed',
    payment: {
      id: 'pay-005',
      amount: 1250.00,
      currency: 'USD',
      method: 'bank_transfer',
      status: 'paid',
      transactionId: 'bt_5555666677',
      paidAt: new Date('2024-07-28T08:30:00Z')
    },
    specialRequests: 'Ground floor room preferred, extra towels',
    createdAt: new Date('2024-07-28T08:30:00Z'),
    updatedAt: new Date('2024-07-28T08:30:00Z')
  }
];

export const mockReservationStats: ReservationStats = {
  total: 5,
  pending: 1,
  confirmed: 2,
  checkedIn: 0,
  checkedOut: 1,
  cancelled: 1,
  noShow: 0,
  totalRevenue: 2870.00,
  pendingPayments: 1
};