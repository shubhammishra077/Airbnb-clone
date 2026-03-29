import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, signup as apiSignup } from '../api/auth';
import { unwrap } from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) { try { setUser(JSON.parse(stored)); } catch {} }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await apiLogin(email, password);
    // Every response is wrapped: { timeStamp, data: { accessToken }, error }
    const payload = unwrap(response);
    console.log('Login unwrapped payload:', payload);

    const token = payload?.accessToken || payload?.token;
    if (!token) throw new Error('No access token received from server');

    localStorage.setItem('accessToken', token);
    const userData = { email, name: email.split('@')[0] };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const signup = async (name, email, password) => {
    const response = await apiSignup(name, email, password);
    // signup returns UserDTO wrapped: { timeStamp, data: { id, email, name, ... } }
    const payload = unwrap(response);
    console.log('Signup unwrapped payload:', payload);
    // Auto-login after signup
    return await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
