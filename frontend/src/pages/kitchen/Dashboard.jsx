import { useEffect, useState } from "react";
import KitchenLayout from "../../layouts/KitchenLayout";
import api from "../../services/api";
import toast from "react-hot-toast";
import OrderDetailsModal from "../../components/kitchen/OrderDetailsModal";

function Dashboard() {

 const [statistics, setStatistics] = useState({

  pending_orders: 0,

  preparing_orders: 0,

  ready_orders: 0,

  total_active_orders: 0

});

const [orders, setOrders] = useState([]);
const [completedOrders, setCompletedOrders] = useState([]);
const [selectedOrderId, setSelectedOrderId] = useState(null);

const [showOrderModal, setShowOrderModal] = useState(false);

const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {

  try {

    const [dashboardResponse, ordersResponse,completedResponse] = await Promise.all([

      api.get("/kitchen/dashboard"),
      api.get("/kitchen/orders"),
      api.get("/kitchen/completed-orders")

    ]);

    setStatistics(

      dashboardResponse.data.statistics

    );

    setOrders(

      ordersResponse.data.orders

    );
    setCompletedOrders(

  completedResponse.data.orders

);

  }

  catch (error) {

    toast.error("Failed to load kitchen dashboard.");

  }

  finally {

    setLoading(false);

  }

};

 useEffect(() => {

  fetchDashboard();

  const interval = setInterval(() => {

    fetchDashboard();

  }, 5000);

  return () => clearInterval(interval);

}, []);
const pendingOrders = orders.filter(

  (order) => order.status === "Pending"

);

const preparingOrders = orders.filter(

  (order) => order.status === "Preparing"

);

const readyOrders = orders.filter(

  (order) => order.status === "Ready"

);
const updateOrderStatus = async (orderId, status) => {

  try {

    const response = await api.put(

      `/kitchen/orders/${orderId}/status`,

      {

        status

      }

    );

    toast.success(response.data.message);

    fetchDashboard();

  }

  catch (error) {

    toast.error(

      error.response?.data?.detail ||

      "Failed to update order."

    );

  }

};

  return (

    <KitchenLayout>

  <div className="mb-8">

    <h1 className="text-3xl font-bold text-gray-800">

      Kitchen Dashboard

    </h1>

    <p className="text-gray-500 mt-2">

      Monitor and manage restaurant orders.

    </p>

  </div>

  {loading ? (

    <div className="bg-white rounded-xl shadow p-10 text-center">

      Loading Dashboard...

    </div>

  ) : (

    <>

      {/* Statistics */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-yellow-500">

          <p className="text-gray-500">

            Pending Orders

          </p>

          <h2 className="text-4xl font-bold text-gray-800 mt-3">

            {statistics.pending_orders}

          </h2>

        </div>

        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-600">

          <p className="text-gray-500">

            Preparing Orders

          </p>

          <h2 className="text-4xl font-bold text-gray-800 mt-3">

            {statistics.preparing_orders}

          </h2>

        </div>

        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-600">

          <p className="text-gray-500">

            Ready Orders

          </p>

          <h2 className="text-4xl font-bold text-gray-800 mt-3">

            {statistics.ready_orders}

          </h2>

        </div>

        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-indigo-600">

          <p className="text-gray-500">

            Active Orders

          </p>

          <h2 className="text-4xl font-bold text-gray-800 mt-3">

            {statistics.total_active_orders}

          </h2>

        </div>

      </div>

      {/* Pending Orders */}

      <div className="mt-10">

        <h2 className="text-2xl font-bold text-gray-800 mb-6">

          Pending Orders

          <span className="ml-2 text-yellow-600">

            ({pendingOrders.length})

          </span>

        </h2>

        {pendingOrders.length === 0 ? (

          <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">

            No pending orders.

          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {pendingOrders.map((order) => (

              <div

                key={order.order_id}

                className="bg-white rounded-xl shadow p-6"

              >

                <div className="flex justify-between items-center">

                  <h3 className="text-xl font-bold">

                    Table {order.table_number}

                  </h3>

                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">

                    Pending

                  </span>

                </div>

                <div className="mt-5 space-y-2">

  <p>

    <strong>Total Items:</strong> {order.total_items}

  </p>

  <p>

    <strong>Total Amount:</strong> Rs. {order.total_amount}

  </p>

</div>

<div className="mt-6 space-y-3">

  <button

    onClick={() => {

      setSelectedOrderId(order.order_id);

      setShowOrderModal(true);

    }}

    className="w-full bg-gray-200 hover:bg-gray-300 py-3 rounded-lg"

  >

    View Details

  </button>

  <button

    onClick={() =>

      updateOrderStatus(

        order.order_id,

        "Preparing"

      )

    }

    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"

  >

    Start Preparing

  </button>

</div>

              </div>

            ))}

          </div>

        )}

      </div>
      {/* Preparing Orders */}

<div className="mt-10">

  <h2 className="text-2xl font-bold text-gray-800 mb-6">

    Preparing Orders

    <span className="ml-2 text-blue-600">

      ({preparingOrders.length})

    </span>

  </h2>

  {preparingOrders.length === 0 ? (

    <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">

      No preparing orders.

    </div>

  ) : (

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

      {preparingOrders.map((order) => (

        <div

          key={order.order_id}

          className="bg-white rounded-xl shadow p-6"

        >

          <div className="flex justify-between items-center">

            <h3 className="text-xl font-bold">

              Table {order.table_number}

            </h3>

            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">

              Preparing

            </span>

          </div>

          <div className="mt-5 space-y-2">

            <p>

              <strong>Total Items:</strong> {order.total_items}

            </p>

            <p>

              <strong>Total Amount:</strong> Rs. {order.total_amount}

            </p>

          </div>

          <div className="mt-6 space-y-3">

  <button

    onClick={() => {

      setSelectedOrderId(order.order_id);

      setShowOrderModal(true);

    }}

    className="w-full bg-gray-200 hover:bg-gray-300 py-3 rounded-lg"

  >

    View Details

  </button>

  <button

    onClick={() =>

      updateOrderStatus(

        order.order_id,

        "Ready"

      )

    }

    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"

  >

    Mark Ready

  </button>

</div>

        </div>


      ))}

    </div>

  )}

</div>
{/* Ready Orders */}

<div className="mt-10">

  <h2 className="text-2xl font-bold text-gray-800 mb-6">

    Ready Orders

    <span className="ml-2 text-green-600">

      ({readyOrders.length})

    </span>

  </h2>

  {readyOrders.length === 0 ? (

    <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">

      No ready orders.

    </div>

  ) : (

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

      {readyOrders.map((order) => (

        <div

          key={order.order_id}

          className="bg-white rounded-xl shadow p-6"

        >

          <div className="flex justify-between items-center">

            <h3 className="text-xl font-bold">

              Table {order.table_number}

            </h3>

            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">

              Ready

            </span>

          </div>

          <div className="mt-5 space-y-2">

            <p>

              <strong>Total Items:</strong> {order.total_items}

            </p>

            <p>

              <strong>Total Amount:</strong> Rs. {order.total_amount}

            </p>

          </div>

          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-3">

            <p className="text-green-700 text-center font-medium">

              Waiting for Manager to Serve

            </p>
            <button

  onClick={() => {

    setSelectedOrderId(order.order_id);

    setShowOrderModal(true);

  }}

  className="w-full mt-6 bg-green-100 hover:bg-green-200 py-3 rounded-lg"

>

  View Details

</button>

          </div>

        </div>

      ))}

    </div>

  )}

</div>
{/* Completed Orders */}

<div className="mt-10">

  <h2 className="text-2xl font-bold text-gray-800 mb-6">

    Completed Orders

    <span className="ml-2 text-gray-600">

      ({completedOrders.length})

    </span>

  </h2>

  {completedOrders.length === 0 ? (

    <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">

      No completed orders.

    </div>

  ) : (

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

      {completedOrders.map((order) => (

        <div

          key={order.order_id}

          className="bg-white rounded-xl shadow p-6"

        >

          <div className="flex justify-between items-center">

            <h3 className="text-xl font-bold">

              Table {order.table_number}

            </h3>

            <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">

              Completed

            </span>

          </div>

          <div className="mt-5 space-y-2">

            <p>

              <strong>Total Items:</strong> {order.total_items}

            </p>

            <p>

              <strong>Total Amount:</strong> Rs. {order.total_amount}

            </p>

          </div>

          <button

            onClick={() => {

              setSelectedOrderId(order.order_id);

              setShowOrderModal(true);

            }}

            className="w-full mt-6 bg-gray-200 hover:bg-gray-300 py-3 rounded-lg"

          >

            View Details

          </button>

        </div>

      ))}

    </div>

  )}

</div>

    </>
    

  )}
  <OrderDetailsModal

  isOpen={showOrderModal}

  onClose={() => setShowOrderModal(false)}

  orderId={selectedOrderId}

/>

</KitchenLayout>

  );

}

export default Dashboard;