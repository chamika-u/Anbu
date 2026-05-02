import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getMe, logoutUser, type User } from '../services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('anbu_token');
      if (token) {
        try {
          const res = await getMe();
          if (res.user) setUser(res.user);
        } catch (error) {
          console.error("Auth check failed", error);
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = (newUser: User) => setUser(newUser);
  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
