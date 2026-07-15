import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ProtectedRoute({ children, allowedRole }) {
  const { user, loading } = useAuth();

  // Wait until AuthContext finishes loading
  if (loading) {
    return <div>Loading...</div>;
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Wrong role
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default ProtectedRoute;