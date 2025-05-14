import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, login } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Check for token and user data in localStorage
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    // If token and user data exist but not authenticated, restore session
    if (token && userData && !isAuthenticated) {
      const user = JSON.parse(userData);
      login(user);
    }
  }, [isAuthenticated, login]);

  // Check both authentication state and token existence
  if (!isAuthenticated && !localStorage.getItem('token')) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;