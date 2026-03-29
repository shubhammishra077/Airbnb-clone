import { useState } from 'react';
import { initBooking, initiatePayment, cancelBooking } from '../api/bookings';
import { unwrap } from '../api/axios';

export function useBooking() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const init = async ({ hotelId, roomId, checkIn, checkOut, guests }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await initBooking({ hotelId, roomId, checkIn, checkOut, guests });
      // Unwrap: { timeStamp, data: BookingDTO }
      return unwrap(response);
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Booking failed';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const pay = async (bookingId) => {
    setLoading(true);
    try {
      const response = await initiatePayment(bookingId);
      // Unwrap: { timeStamp, data: BookingPaymentInitResponseDTO { sessionUrl } }
      const payload = unwrap(response);
      if (payload?.sessionUrl) window.location.href = payload.sessionUrl;
      return payload;
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Payment failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancel = async (bookingId) => {
    setLoading(true);
    try {
      await cancelBooking(bookingId);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Cancellation failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, init, pay, cancel };
}
