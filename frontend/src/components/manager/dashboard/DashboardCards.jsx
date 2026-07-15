import StatCard from "./StatCard";

function DashboardCards({ statistics }) {

  if (!statistics) return null;

  return (

    <div className="space-y-10">

      {/* ================= TABLES ================= */}

      <div>

        <h2 className="text-2xl font-bold mb-5">
          Table Statistics
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

          <StatCard
            title="Total Tables"
            value={statistics.tables.total}
            color="bg-blue-600"
            icon="table"
          />

          <StatCard
            title="Available"
            value={statistics.tables.available}
            color="bg-green-600"
            icon="success"
          />

          <StatCard
            title="Occupied"
            value={statistics.tables.occupied}
            color="bg-red-600"
            icon="table"
          />

          <StatCard
            title="Reserved"
            value={statistics.tables.reserved}
            color="bg-yellow-500"
            icon="table"
          />

        </div>

      </div>

      {/* ================= RESTAURANT ================= */}

      <div>

        <h2 className="text-2xl font-bold mb-5">
          Restaurant Statistics
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

          <StatCard
            title="Categories"
            value={statistics.categories}
            color="bg-purple-600"
            icon="menu"
          />

          <StatCard
            title="Menu Items"
            value={statistics.menu_items}
            color="bg-indigo-600"
            icon="menu"
          />

          <StatCard
            title="Today's Orders"
            value={statistics.today_orders}
            color="bg-cyan-600"
            icon="order"
          />

        </div>

      </div>

      {/* ================= ORDERS ================= */}

      <div>

        <h2 className="text-2xl font-bold mb-5">
          Order Statistics
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">

          <StatCard
            title="Total"
            value={statistics.orders.total}
            color="bg-slate-700"
            icon="order"
          />

          <StatCard
            title="Pending"
            value={statistics.orders.pending}
            color="bg-orange-500"
            icon="order"
          />

          <StatCard
            title="Preparing"
            value={statistics.orders.preparing}
            color="bg-yellow-600"
            icon="order"
          />

          <StatCard
            title="Ready"
            value={statistics.orders.ready}
            color="bg-teal-600"
            icon="success"
          />

          <StatCard
            title="Completed"
            value={statistics.orders.completed}
            color="bg-green-700"
            icon="success"
          />

          <StatCard
            title="Cancelled"
            value={statistics.orders.cancelled}
            color="bg-red-700"
            icon="order"
          />

        </div>

      </div>

    </div>

  );

}

export default DashboardCards;