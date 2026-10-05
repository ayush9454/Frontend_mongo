import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Alert, Box, Button, CircularProgress } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, loading, sessionError, retrySession, logout } = useAuth(),
    location = useLocation();
  if (loading)
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress aria-label="Verifying session" />
      </Box>
    );
  if (sessionError)
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{sessionError}</Alert>
        <Button onClick={retrySession}>Retry session</Button>
        <Button onClick={logout}>Sign out</Button>
      </Box>
    );
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return <>{children}</>;
};
export default ProtectedRoute;
