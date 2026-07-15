import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CustomerNavbar from "../components/layout/CustomerNavbar";
import useTablet from "../hooks/useTablet";

function CustomerLayout({ children }) {

  const navigate = useNavigate();
  const location = useLocation();

  const {
    tablet,
    loading,
    error
  } = useTablet();

  useEffect(() => {

    const deviceId = localStorage.getItem("deviceId");

    // No device configured → Setup page
    if (!deviceId && location.pathname !== "/customer/setup") {

      navigate("/customer/setup", { replace: true });

      return;

    }

    // Device exists but backend says it is invalid
    if (
      !loading &&
      error &&
      location.pathname !== "/customer/setup"
    ) {

      localStorage.removeItem("deviceId");

      navigate("/customer/setup", { replace: true });

    }

  }, [loading, error, navigate, location]);

  if (
    loading &&
    location.pathname !== "/customer/setup"
  ) {

    return (

      <div className="min-h-screen flex justify-center items-center">

        <h2 className="text-xl font-semibold">

          Loading Tablet Configuration...

        </h2>

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-gray-100">

      <CustomerNavbar />

      <main className="max-w-7xl mx-auto px-4 py-8">

        {children}

      </main>

    </div>

  );

}

export default CustomerLayout;