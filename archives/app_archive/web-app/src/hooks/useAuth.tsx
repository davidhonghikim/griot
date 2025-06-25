import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { api } from '../api/client';

interface AuthContextType {
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('auth_token');
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('auth_token', token);
      api.setToken(token);
    } else {
      localStorage.removeItem('auth_token');
      api.clearToken();
    }
  }, [token]);

  const login = async (username: string, password: string) => {
    await api.login(username, password);
    // Get the token from the API client after login
    const newToken = (api as any).token;
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth }; 