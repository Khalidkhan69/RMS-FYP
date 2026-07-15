import { Navigate } from "react-router-dom";
import { useManagerAuth } from "../../context/ManagerAuthContext";

function ManagerProtectedRoute({ children }) {

  const { manager, loading } = useManagerAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!manager) {
    return <Navigate to="/manager/login" replace />;
  }

  return children;
}

export default ManagerProtectedRoute;