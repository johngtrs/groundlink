import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import AuthContext from './AuthContext';

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true); // Avoid home clipping

  const fetchUser = async () => {
    try {
      const res = await api.get('/api/user');
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  const login = async (credentials) => {
    setLoading(true);

    try {
      await api.get('/sanctum/csrf-cookie');
      await api.post('/api/login', credentials);
      await fetchUser();
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await api.post('/api/logout');
    setUser(null);
  };

  const register = async (payload) => {
    setLoading(true);

    try {
      await api.get('/sanctum/csrf-cookie');
      const response = await api.post('api/register', payload);
      setUser(response.data.user);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading, initialLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
