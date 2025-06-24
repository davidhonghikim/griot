import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

interface AuthContextValue {
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  clearToken: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  // Set token in API client when component mounts or token changes
  useEffect(() => {
    if (token) {
      api.setToken(token);
    }
  }, [token]);

  const login = async (username: string, password: string) => {
    try {
      // Make direct API call since SDK login doesn't return token
      const response = await fetch('http://localhost:8003/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      const { accessToken } = await response.json();
      setToken(accessToken);
      api.setToken(accessToken);
      localStorage.setItem('token', accessToken);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    api.clearToken();
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, clearToken: logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}; 