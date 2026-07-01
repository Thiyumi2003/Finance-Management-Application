import { createContext, useContext, useEffect, useState } from 'react';

import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('fma_token');

    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get('/auth/me')
      .then((response) => setUser(response.data.user))
      .catch(() => {
        localStorage.removeItem('fma_token');
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(credentials) {
    const response = await api.post('/auth/login', credentials);
    localStorage.setItem('fma_token', response.data.token);
    setUser(response.data.user);
  }

  async function register(payload) {
    const response = await api.post('/auth/register', payload);
    localStorage.setItem('fma_token', response.data.token);
    setUser(response.data.user);
  }

  function logout() {
    localStorage.removeItem('fma_token');
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}