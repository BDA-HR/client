import { useAuth } from "../contexts/AuthContext"; // Adjust path
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
