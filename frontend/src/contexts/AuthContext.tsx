import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, User } from '../types';
import { apiService } from '../services/api';

interface AuthContextType extends AuthState {
  login: (code: string) => Promise<void>;
  logout: () => void;
  getLoginUrl: () => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
  });

  useEffect(() => {
    // Check for existing token on app load
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('userInfo');
    
    if (token && userInfo) {
      setAuthState({
        isAuthenticated: true,
        user: JSON.parse(userInfo),
        token,
      });
    }
  }, []);

  const login = async (code: string) => {
    try {
      const { access_token, user_info } = await apiService.exchangeCodeForToken(code);
      
      const user: User = {
        id: user_info.id,
        name: user_info.name,
        email: user_info.email,
        picture: user_info.picture,
      };

      localStorage.setItem('token', access_token);
      localStorage.setItem('userInfo', JSON.stringify(user));

      setAuthState({
        isAuthenticated: true,
        user,
        token: access_token,
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
    });
  };

  const getLoginUrl = async () => {
    return await apiService.getLoginUrl();
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, getLoginUrl }}>
      {children}
    </AuthContext.Provider>
  );
}; 