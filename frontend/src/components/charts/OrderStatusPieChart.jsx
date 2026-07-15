import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#F59E0B",
  "#3B82F6",
  "#8B5CF6",
  "#06B6D4",
  "#10B981",
  "#EF4444",
];

function OrderStatusPieChart({ analytics }) {
  const data = [
    {
      name: "Pending",
      value: analytics.pending_orders,
    },
    {
      name: "Preparing",
      value: analytics.preparing_orders,
    },
    {
      name: "Ready",
      value: analytics.ready_orders,
    },
    {
      name: "Served",
      value: analytics.served_orders,
    },
    {
      name: "Completed",
      value: analytics.completed_orders,
    },
    {
      name: "Cancelled",
      value: analytics.cancelled_orders,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-xl font-semibold mb-6">
        Order Status Distribution
      </h2>

      <ResponsiveContainer width="100%" height={350}>

        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={120}
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />

          <Legend />

        </PieChart>

      </ResponsiveContainer>

    </div>
  );
}

export default OrderStatusPieChart;