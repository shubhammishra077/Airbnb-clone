import api from './axios';

// BookingRequest: hotelId, roomId, checkInDate, checkOutDate, roomsCount
export const initBooking = ({ hotelId, roomId, checkIn, checkOut, guests }) =>
  api.post('/bookings/init', {
    hotelId: Number(hotelId),
    roomId: roomId ? Number(roomId) : null,
    checkInDate: checkIn,
    checkOutDate: checkOut,
    roomsCount: guests || 1,
  });

export const initiatePayment = (bookingId) =>
  api.post(`/bookings/${bookingId}/payments`);

export const cancelBooking = (bookingId) =>
  api.post(`/bookings/${bookingId}/cancel`);

export const getBookingStatus = (bookingId) =>
  api.get(`/bookings/${bookingId}/status`);

// Body is List<GuestDTO>: [{ name, gender, age }]
export const addGuests = (bookingId, guestList) =>
  api.post(`/bookings/${bookingId}/addGuests`, guestList);
