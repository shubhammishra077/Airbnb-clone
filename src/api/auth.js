import api from './axios';

// POST /auth/signup → returns UserDTO (no tokens)
// Field names must match SignUpRequestDTO
export const signup = (name, email, password) =>
  api.post('/auth/signup', { name, email, password });

// POST /auth/login → returns { accessToken }, sets refreshToken as HttpOnly cookie
// Field names must match LoginDTO
export const login = (email, password) =>
  api.post('/auth/login', { email, password }, { withCredentials: true });

// POST /auth/refresh → reads refreshToken from cookie, returns { accessToken }
export const refreshAccessToken = () =>
  api.post('/auth/refresh', {}, { withCredentials: true });
