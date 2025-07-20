/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import type { Reservation, ReservationFilters, ReservationStats } from '../types/reservation.types';
import { mockReservations, mockReservationStats } from '../mocks/reservations.mocks';

export const useReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [stats, setStats] = useState<ReservationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate API call
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setReservations(mockReservations);
        setFilteredReservations(mockReservations);
        setStats(mockReservationStats);
      } catch (err) {
        setError('Failed to fetch reservations');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const applyFilters = (filters: ReservationFilters) => {
    let filtered = [...reservations];

    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(res => filters.status!.includes(res.status));
    }

    if (filters.paymentStatus && filters.paymentStatus.length > 0) {
      filtered = filtered.filter(res => filters.paymentStatus!.includes(res.payment.status));
    }

    if (filters.roomType && filters.roomType.length > 0) {
      filtered = filtered.filter(res => filters.roomType!.includes(res.room.typeId));
    }

    if (filters.dateRange) {
      filtered = filtered.filter(res => {
        const checkIn = new Date(res.checkInDate);
        const checkOut = new Date(res.checkOutDate);
        return (
          (checkIn >= filters.dateRange!.start && checkIn <= filters.dateRange!.end) ||
          (checkOut >= filters.dateRange!.start && checkOut <= filters.dateRange!.end) ||
          (checkIn <= filters.dateRange!.start && checkOut >= filters.dateRange!.end)
        );
      });
    }

    if (filters.guestRange) {
      filtered = filtered.filter(res => 
        res.guests >= filters.guestRange!.min && res.guests <= filters.guestRange!.max
      );
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(res => 
        res.user.firstName.toLowerCase().includes(query) ||
        res.user.lastName.toLowerCase().includes(query) ||
        res.user.email.toLowerCase().includes(query) ||
        res.room.name.toLowerCase().includes(query) ||
        res.id.toLowerCase().includes(query)
      );
    }

    setFilteredReservations(filtered);
  };

  const updateReservationStatus = async (reservationId: string, status: Reservation['status']) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const updatedReservations = reservations.map(res => 
        res.id === reservationId 
          ? { ...res, status, updatedAt: new Date() }
          : res
      );
      
      setReservations(updatedReservations);
      setFilteredReservations(prev => 
        prev.map(res => 
          res.id === reservationId 
            ? { ...res, status, updatedAt: new Date() }
            : res
        )
      );
    } catch (err) {
      setError('Failed to update reservation status');
    } finally {
      setLoading(false);
    }
  };

  const cancelReservation = async (reservationId: string, reason: string) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const updatedReservations = reservations.map(res => 
        res.id === reservationId 
          ? { 
              ...res, 
              status: 'cancelled' as const,
              cancelledAt: new Date(),
              cancellationReason: reason,
              updatedAt: new Date()
            }
          : res
      );
      
      setReservations(updatedReservations);
      setFilteredReservations(prev => 
        prev.map(res => 
          res.id === reservationId 
            ? { 
                ...res, 
                status: 'cancelled' as const,
                cancelledAt: new Date(),
                cancellationReason: reason,
                updatedAt: new Date()
              }
            : res
        )
      );
    } catch (err) {
      setError('Failed to cancel reservation');
    } finally {
      setLoading(false);
    }
  };

  const processRefund = async (reservationId: string, amount: number) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedReservations = reservations.map(res => 
        res.id === reservationId 
          ? { 
              ...res, 
              payment: {
                ...res.payment,
                status: 'refunded' as const,
                refundedAt: new Date(),
                refundAmount: amount
              },
              updatedAt: new Date()
            }
          : res
      );
      
      setReservations(updatedReservations);
      setFilteredReservations(prev => 
        prev.map(res => 
          res.id === reservationId 
            ? { 
                ...res, 
                payment: {
                  ...res.payment,
                  status: 'refunded' as const,
                  refundedAt: new Date(),
                  refundAmount: amount
                },
                updatedAt: new Date()
              }
            : res
        )
      );
    } catch (err) {
      setError('Failed to process refund');
    } finally {
      setLoading(false);
    }
  };

  return {
    reservations: filteredReservations,
    allReservations: reservations,
    stats,
    loading,
    error,
    applyFilters,
    updateReservationStatus,
    cancelReservation,
    processRefund
  };
};