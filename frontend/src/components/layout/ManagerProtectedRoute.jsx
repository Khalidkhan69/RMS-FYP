import { Navigate } from "react-router-dom";
import { useManagerAuth } from "../../context/ManagerAuthContext";

function ManagerProtectedRoute({ children }) {

  const { user, loading } = useManagerAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/manager/login" replace />;
  }

  if (user.role !== "manager") {
    return <Navigate to="/manager/login" replace />;
  }

  return children;
}

export default ManagerProtectedRoute;