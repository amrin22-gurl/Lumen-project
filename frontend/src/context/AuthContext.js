import React, { createContext, useContext, useState, useEffect } from 'react';
import { verifyToken } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      verifyToken()
        .then(response => {
          if (response.data.valid) {
            setUser(response.data.user);
          } else {
            localStorage.removeItem('access_token');
          }
        })
        .catch(() => {
          localStorage.removeItem('access_token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('access_token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
  };

  const getRoleBasedRoute = (role) => {
    switch (role) {
      case 'admin': return '/admin-dashboard';
      default: return '/subscription';
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, getRoleBasedRoute }}>
      {children}
    </AuthContext.Provider>
  );
};