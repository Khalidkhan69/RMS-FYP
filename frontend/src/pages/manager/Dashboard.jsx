import { useEffect, useState } from "react";
import ManagerLayout from "../../layouts/ManagerLayout";
import DashboardCards from "../../components/manager/dashboard/DashboardCards";
import api from "../../services/api";
import toast from "react-hot-toast";

function Dashboard() {

  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {

    try {

      const response = await api.get(
        "/manager/dashboard"
      );

      setStatistics(
        response.data.statistics
      );

    } catch (error) {

      toast.error(
        error.response?.data?.detail ||
        "Failed to load dashboard."
      );

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchDashboard();

  }, []);

  return (

    <ManagerLayout>

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-gray-800">
          Manager Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Welcome back! Here's today's restaurant overview.
        </p>

      </div>

      {loading ? (

        <div className="flex justify-center items-center h-96">

          <div className="text-xl font-semibold animate-pulse">
            Loading Dashboard...
          </div>

        </div>

      ) : (

        <DashboardCards
          statistics={statistics}
        />

      )}

    </ManagerLayout>

  );

}

export default Dashboard;