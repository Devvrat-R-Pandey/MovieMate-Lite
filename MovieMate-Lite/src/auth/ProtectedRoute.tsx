import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type { JSX } from "react";
import { Box, CircularProgress } from "@mui/material";
import AccessDeniedPage from "../pages/AccessDeniedPage";

interface Props {
  children: JSX.Element;
  role?: "user" | "admin";
}

const ProtectedRoute = ({ children, role }: Props) => {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  // Wrong role — show 403 instead of silent redirect
  if (role && user.role !== role) return <AccessDeniedPage />;

  return children;
};

export default ProtectedRoute;