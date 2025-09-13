import React, { createContext, useContext, useState, useEffect } from 'react';
import { verifyToken } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken(token)
        .then(response => {
          setUser(response.data.user);
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const getRoleBasedRoute = (role) => {
    switch (role) {
      case 'admin': return '/admin/dashboard';
      case 'company': return '/admin/plans';
      default: return '/plans';
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, getRoleBasedRoute }}>
      {children}
    </AuthContext.Provider>
  );
};