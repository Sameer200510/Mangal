'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserRole } from '../common';

export interface AuthUser {
  id: string;
  email: string;
  phone?: string | null;
  firstName: string;
  lastName: string;
  role: UserRole;
  isVerified: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  accessToken: string | null;
  token: string | null;
  loading: boolean;
  login: (tokens: { accessToken: string; refreshToken: string }, user: AuthUser) => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Rehydrate auth state on mount
    try {
      const storedUser = localStorage.getItem('mangal_user');
      const storedToken = localStorage.getItem('mangal_access_token');
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setAccessToken(storedToken);
      }
    } catch (e) {
      console.error('Failed to restore session:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (tokens: { accessToken: string; refreshToken: string }, authUser: AuthUser) => {
    setUser(authUser);
    setAccessToken(tokens.accessToken);
    localStorage.setItem('mangal_user', JSON.stringify(authUser));
    localStorage.setItem('mangal_access_token', tokens.accessToken);
    localStorage.setItem('mangal_refresh_token', tokens.refreshToken);
  };

  const logout = async () => {
    try {
      if (accessToken) {
        await fetch('/api/v1/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }
    } catch (e) {
      console.error('Error during logout:', e);
    } finally {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem('mangal_user');
      localStorage.removeItem('mangal_access_token');
      localStorage.removeItem('mangal_refresh_token');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        token: accessToken,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
