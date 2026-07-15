import { useEffect, useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";
import StatCard from "../../components/dashboard/StatCard";
import api from "../../services/api";
import AnalyticsCard from "../../components/dashboard/AnalyticsCard";
import MonthlySalesChart from "../../components/charts/MonthlySalesChart";
import OrderStatusPieChart from "../../components/charts/OrderStatusPieChart";
import TopSellingItems from "../../components/dashboard/TopSellingItems";
import LeastSellingItems from "../../components/dashboard/LeastSellingItems";


function Dashboard() {

  const [dashboardData, setDashboardData] = useState(null);
  const [monthlyChartData, setMonthlyChartData] = useState([]);
  const [topSellingItems, setTopSellingItems] = useState([]);
  const [leastSellingItems, setLeastSellingItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchDashboard = async () => {

      try {

        const dashboardResponse = await api.get("/admin/dashboard");
        setDashboardData(dashboardResponse.data);
        const chartResponse = await api.get("/admin/reports/monthly-sales-chart");
        setMonthlyChartData(chartResponse.data);
        const topItemsResponse = await api.get("/admin/reports/top-selling-items");
        setTopSellingItems(topItemsResponse.data.top_selling_items);
        const leastItemsResponse = await api.get(  "/admin/reports/least-selling-items");
        setLeastSellingItems(leastItemsResponse.data.least_selling_items);
      

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    };

    fetchDashboard();

  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <h2 className="text-xl font-semibold">
          Loading Dashboard...
        </h2>
      </DashboardLayout>
    );
  }

  return (

    <DashboardLayout>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Welcome Back 👋
        </h1>

        <p className="text-gray-500 mt-2">
          Here's an overview of your restaurant today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <StatCard
          title="Revenue"
          value={`Rs. ${dashboardData.statistics.total_revenue}`}
        />

        <StatCard
          title="Managers"
          value={dashboardData.statistics.total_managers}
        />

        <StatCard
          title="Tables"
          value={dashboardData.statistics.total_tables}
        />

         <StatCard
          title="Available Tables"
          value={dashboardData.statistics.total_availables_tables}
        />

        <StatCard
          title="Orders"
          value={dashboardData.statistics.total_orders}
        />

         <StatCard
          title="Categories"
          value={dashboardData.statistics.total_categories}
        />
        
        <StatCard
          title="Menu Items"
          value={dashboardData.statistics.total_menu_items}
        />


      </div>
      <div className="mt-10">

  <h2 className="text-xl font-semibold text-gray-800 mb-6">
    Business Analytics
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

    <AnalyticsCard
      title="Today's Revenue"
      value={`Rs. ${dashboardData.analytics.today_revenue}`}
    />

    <AnalyticsCard
      title="Monthly Revenue"
      value={`Rs. ${dashboardData.analytics.monthly_revenue}`}
    />

    <AnalyticsCard
      title="Yearly Revenue"
      value={`Rs. ${dashboardData.analytics.yearly_revenue}`}
    />

    <AnalyticsCard
      title="Completion Rate"
      value={`${dashboardData.analytics.completion_rate}%`}
    />

  </div>
</div>
    {/* Monthly Revenue Chart */}
    <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <MonthlySalesChart
        data={monthlyChartData}
      />
      <OrderStatusPieChart
         analytics={dashboardData.analytics}
      />
      <TopSellingItems
          items={topSellingItems}
      />
      <LeastSellingItems
          items={leastSellingItems}
      />

    </div>

</DashboardLayout>

  );
}

export default Dashboard;