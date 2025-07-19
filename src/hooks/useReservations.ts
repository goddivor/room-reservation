// hooks/useReservations.ts
import type { Reservation, ReservationFilter } from '@/types/reservation.types';
import { useState, useEffect, useMemo } from 'react';

interface UseReservationsReturn {
  reservations: Reservation[];
  loading: boolean;
  error: string | null;
  filteredReservations: (filter: ReservationFilter, searchQuery: string) => Reservation[];
  getFilterCounts: () => { all: number; active: number; archived: number };
  refreshReservations: () => Promise<void>;
  updateReservationStatus: (id: string, status: Reservation['status']) => Promise<void>;
  processRefund: (id: string, amount: number, reason: string) => Promise<void>;
  generatePDF: (reservation: Reservation) => Promise<void>;
  exportReservations: (format: 'csv' | 'excel') => Promise<void>;
}

export const useReservations = (): UseReservationsReturn => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data - replace with actual API calls
  const mockReservations: Reservation[] = [
    {
      id: 'RES-001',
      userId: 'USR-001',
      user: {
        id: 'USR-001',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@email.com',
        phone: '+33 6 12 34 56 78',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      roomId: 'RM-101',
      room: {
        id: 'RM-101',
        number: '101',
        type: 'Standard Double',
        floor: 1,
        capacity: 2,
        pricePerNight: 120,
        amenities: ['Wi-Fi', 'TV', 'Mini-bar', 'Air Conditioning']
      },
      checkIn: new Date('2025-07-20'),
      checkOut: new Date('2025-07-23'),
      guests: 2,
      status: 'confirmed',
      totalAmount: 360,
      payment: {
        id: 'PAY-001',
        amount: 360,
        currency: 'EUR',
        method: 'card',
        status: 'paid',
        paidAt: new Date('2025-07-15T14:30:00'),
        transactionId: 'TXN-12345'
      },
      specialRequests: 'Late check-in requested around 10 PM',
      createdAt: new Date('2025-07-15T10:00:00'),
      updatedAt: new Date('2025-07-15T10:00:00')
    },
    {
      id: 'RES-002',
      userId: 'USR-002',
      user: {
        id: 'USR-002',
        firstName: 'Sarah',
        lastName: 'Smith',
        email: 'sarah.smith@email.com',
        phone: '+33 6 98 76 54 32',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b73a4a33?w=150&h=150&fit=crop&crop=face'
      },
      roomId: 'RM-205',
      room: {
        id: 'RM-205',
        number: '205',
        type: 'Luxury Suite',
        floor: 2,
        capacity: 4,
        pricePerNight: 250,
        amenities: ['Wi-Fi', 'TV', 'Mini-bar', 'Balcony', 'Jacuzzi', 'Room Service']
      },
      checkIn: new Date('2025-07-22'),
      checkOut: new Date('2025-07-25'),
      guests: 3,
      status: 'pending',
      totalAmount: 750,
      payment: {
        id: 'PAY-002',
        amount: 750,
        currency: 'EUR',
        method: 'pending',
        status: 'pending'
      },
      specialRequests: 'Anniversary celebration - would appreciate room decoration',
      createdAt: new Date('2025-07-18T16:20:00'),
      updatedAt: new Date('2025-07-18T16:20:00')
    },
    {
      id: 'RES-003',
      userId: 'USR-003',
      user: {
        id: 'USR-003',
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.johnson@email.com',
        phone: '+33 6 11 22 33 44'
      },
      roomId: 'RM-102',
      room: {
        id: 'RM-102',
        number: '102',
        type: 'Standard Single',
        floor: 1,
        capacity: 1,
        pricePerNight: 95,
        amenities: ['Wi-Fi', 'TV', 'Desk']
      },
      checkIn: new Date('2025-06-15'),
      checkOut: new Date('2025-06-18'),
      guests: 1,
      status: 'completed',
      totalAmount: 285,
      payment: {
        id: 'PAY-003',
        amount: 285,
        currency: 'EUR',
        method: 'cash',
        status: 'paid',
        paidAt: new Date('2025-06-15T15:00:00')
      },
      createdAt: new Date('2025-06-10T09:15:00'),
      updatedAt: new Date('2025-06-18T11:00:00')
    },
    {
      id: 'RES-004',
      userId: 'USR-004',
      user: {
        id: 'USR-004',
        firstName: 'Emma',
        lastName: 'Wilson',
        email: 'emma.wilson@email.com',
        phone: '+33 6 55 44 33 22',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      },
      roomId: 'RM-301',
      room: {
        id: 'RM-301',
        number: '301',
        type: 'Deluxe Room',
        floor: 3,
        capacity: 2,
        pricePerNight: 180,
        amenities: ['Wi-Fi', 'TV', 'Mini-bar', 'City View', 'Safe']
      },
      checkIn: new Date('2025-05-20'),
      checkOut: new Date('2025-05-22'),
      guests: 2,
      status: 'cancelled',
      totalAmount: 360,
      payment: {
        id: 'PAY-004',
        amount: 360,
        currency: 'EUR',
        method: 'card',
        status: 'refunded',
        paidAt: new Date('2025-05-15T11:30:00'),
        refundedAmount: 360,
        refundedAt: new Date('2025-05-18T14:45:00'),
        transactionId: 'TXN-67890'
      },
      createdAt: new Date('2025-05-15T11:30:00'),
      updatedAt: new Date('2025-05-18T14:45:00'),
      cancelledAt: new Date('2025-05-18T14:45:00'),
      cancellationReason: 'Guest requested cancellation due to emergency'
    },
    {
      id: 'RES-005',
      userId: 'USR-005',
      user: {
        id: 'USR-005',
        firstName: 'David',
        lastName: 'Brown',
        email: 'david.brown@email.com',
        phone: '+33 6 77 88 99 00'
      },
      roomId: 'RM-203',
      room: {
        id: 'RM-203',
        number: '203',
        type: 'Family Room',
        floor: 2,
        capacity: 4,
        pricePerNight: 200,
        amenities: ['Wi-Fi', 'TV', 'Mini-bar', 'Sofa Bed', 'Kitchenette']
      },
      checkIn: new Date('2025-07-25'),
      checkOut: new Date('2025-07-28'),
      guests: 4,
      status: 'confirmed',
      totalAmount: 600,
      payment: {
        id: 'PAY-005',
        amount: 600,
        currency: 'EUR',
        method: 'transfer',
        status: 'paid',
        paidAt: new Date('2025-07-20T09:15:00'),
        transactionId: 'TXN-11111'
      },
      specialRequests: 'Two extra pillows and baby crib if available',
      createdAt: new Date('2025-07-20T09:15:00'),
      updatedAt: new Date('2025-07-20T09:15:00')
    }
  ];

  // Simulate loading reservations
  useEffect(() => {
    const loadReservations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setReservations(mockReservations);
      } catch (err) {
        setError('Failed to load reservations');
        console.error('Error loading reservations:', err);
      } finally {
        setLoading(false);
      }
    };

    loadReservations();
  }, []);

  // Filter reservations based on status and search query
  const filteredReservations = useMemo(() => {
    return (filter: ReservationFilter, searchQuery: string): Reservation[] => {
      let filtered = reservations;

      // Apply status filter
      if (filter === 'active') {
        filtered = filtered.filter(r => 
          r.status === 'confirmed' || r.status === 'pending'
        );
      } else if (filter === 'archived') {
        filtered = filtered.filter(r => 
          r.status === 'completed' || r.status === 'cancelled'
        );
      }

      // Apply search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(r =>
          r.user.firstName.toLowerCase().includes(query) ||
          r.user.lastName.toLowerCase().includes(query) ||
          r.user.email.toLowerCase().includes(query) ||
          r.room.number.includes(query) ||
          r.room.type.toLowerCase().includes(query) ||
          r.id.toLowerCase().includes(query)
        );
      }

      return filtered;
    };
  }, [reservations]);

  // Get filter counts
  const getFilterCounts = useMemo(() => {
    return (): { all: number; active: number; archived: number } => {
      const all = reservations.length;
      const active = reservations.filter(r => 
        r.status === 'confirmed' || r.status === 'pending'
      ).length;
      const archived = reservations.filter(r => 
        r.status === 'completed' || r.status === 'cancelled'
      ).length;
      
      return { all, active, archived };
    };
  }, [reservations]);

  // Refresh reservations
  const refreshReservations = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In real implementation, fetch from API
      // const response = await reservationService.getAll();
      // setReservations(response.data);
      
    } catch (err) {
      setError('Failed to refresh reservations');
      console.error('Error refreshing reservations:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update reservation status
  const updateReservationStatus = async (id: string, status: Reservation['status']): Promise<void> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setReservations(prev => 
        prev.map(reservation => 
          reservation.id === id 
            ? { ...reservation, status, updatedAt: new Date() }
            : reservation
        )
      );
      
      console.log(`Reservation ${id} status updated to ${status}`);
    } catch (err) {
      console.error('Error updating reservation status:', err);
      throw new Error('Failed to update reservation status');
    }
  };

  // Process refund
  const processRefund = async (id: string, amount: number, reason: string): Promise<void> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setReservations(prev => 
        prev.map(reservation => {
          if (reservation.id === id) {
            const currentRefunded = reservation.payment.refundedAmount || 0;
            const newRefundedAmount = currentRefunded + amount;
            const newStatus = newRefundedAmount >= reservation.totalAmount ? 'refunded' : 'partial_refund';
            
            return {
              ...reservation,
              payment: {
                ...reservation.payment,
                status: newStatus,
                refundedAmount: newRefundedAmount,
                refundedAt: new Date()
              },
              updatedAt: new Date()
            };
          }
          return reservation;
        })
      );
      
      console.log(`Refund of €${amount} processed for reservation ${id}. Reason: ${reason}`);
    } catch (err) {
      console.error('Error processing refund:', err);
      throw new Error('Failed to process refund');
    }
  };

  // Generate PDF
  const generatePDF = async (reservation: Reservation): Promise<void> => {
    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log(`PDF generated for reservation ${reservation.id}`);
      
      // In real implementation, you would use a PDF library like jsPDF or call an API
      // const pdfBlob = await pdfService.generateReservationPDF(reservation);
      // const url = URL.createObjectURL(pdfBlob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = `reservation-${reservation.id}.pdf`;
      // a.click();
      
      alert(`PDF for reservation ${reservation.id} would be downloaded`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      throw new Error('Failed to generate PDF');
    }
  };

  // Export reservations
  const exportReservations = async (format: 'csv' | 'excel'): Promise<void> => {
    try {
      // Simulate export
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log(`Exporting reservations in ${format} format`);
      
      // In real implementation, you would format the data and trigger download
      alert(`Reservations export in ${format.toUpperCase()} format would be downloaded`);
    } catch (err) {
      console.error('Error exporting reservations:', err);
      throw new Error('Failed to export reservations');
    }
  };

  return {
    reservations,
    loading,
    error,
    filteredReservations,
    getFilterCounts,
    refreshReservations,
    updateReservationStatus,
    processRefund,
    generatePDF,
    exportReservations
  };
};