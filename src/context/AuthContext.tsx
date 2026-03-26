import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { storage } from '../utils/storage';

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loggedInUser = storage.getLoggedInUser();
    if (loggedInUser) {
      setUser(loggedInUser);
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    const { password, ...userWithoutPassword } = userData;
    setUser(userWithoutPassword);
    storage.setLoggedInUser(userWithoutPassword);
  };

  const logout = () => {
    setUser(null);
    storage.setLoggedInUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
