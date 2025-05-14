import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  email: string;
  id: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const defaultContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  loading: true
};

const AuthContext = createContext<AuthContextType>(defaultContext);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider mounted');
    const token = localStorage.getItem('token');
    if (token) {
      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Verify token and get user info
      axios.get('https://backend-mongodb-vkph.onrender.com/api/auth/me')
        .then(response => {
          console.log('User data received:', response.data);
          if (response.data && response.data.email) {
            setUser({
              email: response.data.email,
              id: response.data.id || response.data._id
            });
          } else {
            console.error('Invalid user data received:', response.data);
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
          }
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login...');
      const response = await axios.post('https://backend-mongodb-vkph.onrender.com/api/auth/login', {
        email,
        password
      });
      
      const { token, user: userData } = response.data;
      console.log('Login response:', response.data);
      
      if (!token || !userData || !userData.email) {
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser({
        email: userData.email,
        id: userData.id || userData._id
      });
      
      console.log('Login successful, user set:', userData);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      console.log('Attempting registration...');
      const response = await axios.post('https://backend-mongodb-vkph.onrender.com/api/auth/register', {
        email,
        password
      });
      
      const { token, user: userData } = response.data;
      console.log('Registration response:', response.data);
      
      if (!token || !userData || !userData.email) {
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser({
        email: userData.email,
        id: userData.id || userData._id
      });
      
      console.log('Registration successful, user set:', userData);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('Logging out...');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    loading
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 