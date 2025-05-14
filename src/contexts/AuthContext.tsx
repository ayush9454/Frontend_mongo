import React, { createContext, useContext, useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';

interface User {
  email: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Try to restore from token
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded: any = jwt_decode(token);
          if (decoded && decoded.email) {
            const userData = { email: decoded.email, role: 'user' as const };
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          }
        } catch (e) {
          // Invalid token, do nothing
        }
      }
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 