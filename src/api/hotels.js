import api from './axios';

// POST /hotels/search — backend uses @RequestBody so must be POST
// HotelSearchRequest fields: city, checkIn, checkOut, roomsCount, page, size
export const searchHotels = (body) =>
  api.post('/hotels/search', body);

export const getHotelInfo = (hotelId) =>
  api.get(`/hotels/${hotelId}/info`);

// Admin
export const getAdminHotels = () => api.get('/admin/hotels');
export const createHotel = (data) => api.post('/admin/hotels', data);
export const updateHotel = (id, data) => api.put(`/admin/hotels/${id}`, data);
export const deleteHotel = (id) => api.delete(`/admin/hotels/${id}`);
export const activateHotel = (id) => api.patch(`/admin/hotels/${id}/activate`);
export const getHotelRooms = (hotelId) => api.get(`/admin/hotels/${hotelId}/rooms`);
export const createRoom = (hotelId, data) => api.post(`/admin/hotels/${hotelId}/rooms`, data);
export const updateRoom = (hotelId, roomId, data) => api.put(`/admin/hotels/${hotelId}/rooms/${roomId}`, data);
export const deleteRoom = (hotelId, roomId) => api.delete(`/admin/hotels/${hotelId}/rooms/${roomId}`);
