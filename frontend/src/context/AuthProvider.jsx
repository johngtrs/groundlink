import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import AuthContext from './AuthContext';

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await api.get('/api/user');
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    await api.get('/sanctum/csrf-cookie');
    await api.post('/login', credentials);
    await fetchUser();
  };

  const logout = async () => {
    await api.post('/logout');
    setUser(null);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>
  );
}
