import api from './axios';

export const getProfile = () => api.get('/users/profile');

// ProfileUpdateRequestDTO: name, dateOfBirth, gender
export const updateProfile = ({ name, dateOfBirth, gender }) =>
  api.patch('/users/profile', {
    name: name || null,
    dateOfBirth: dateOfBirth || null,
    gender: gender ? gender.toUpperCase() : null,
  });

export const getMyBookings = () => api.get('/users/myBookings');

export const getGuests = () => api.get('/users/guests');

// GuestDTO: { name (required), gender (MALE/FEMALE/OTHER), age (integer) }
export const addGuest = ({ name, gender, age }) =>
  api.post('/users/guests', {
    name: name?.trim(),
    gender: (gender || 'MALE').toUpperCase(), // NOT NULL in DB — default MALE
    age: age ? parseInt(age) : null,
  });

export const updateGuest = (id, data) => api.put(`/users/guests/${id}`, data);
export const deleteGuest = (id) => api.delete(`/users/guests/${id}`);
