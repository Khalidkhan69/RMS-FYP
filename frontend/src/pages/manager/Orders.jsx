import { useEffect, useState } from "react";
import ManagerLayout from "../../layouts/ManagerLayout";
import api from "../../services/api";
import ViewOrderModal from "../../components/orders/ViewOrderModal";
import UpdateStatusModal from "../../components/orders/UpdateStatusModal";
import CancelOrderModal from "../../components/orders/CancelOrderModal";

function Orders() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {

    try {

      const response = await api.get(
        "/manager/orders"
      );

      setOrders(response.data.orders);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchOrders();

  }, []);

  const handleView = (order) => {

    setSelectedOrder(order);

    setShowViewModal(true);

  };
  const handleUpdateStatus = (order) => {

  setSelectedOrder(order);

  setShowUpdateModal(true);

};
const handleCancelOrder = (order) => {

  setSelectedOrder(order);

  setShowCancelModal(true);

};

  const getStatusColor = (status) => {

    switch (status) {

      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Preparing":
        return "bg-blue-100 text-blue-700";

      case "Ready":
        return "bg-green-100 text-green-700";

      case "Served":
        return "bg-purple-100 text-purple-700";

      case "Completed":
        return "bg-gray-200 text-gray-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";

    }

  };

  return (

    <ManagerLayout>

      <div className="flex justify-between items-center mb-6">

        <div>

          <h1 className="text-3xl font-bold">
            Order Management
          </h1>

          <p className="text-gray-500 mt-1">
            Total Orders: {orders.length}
          </p>

        </div>

      </div>

      {loading ? (

        <div className="text-center py-10">

          Loading...

        </div>

      ) : (

        <div className="bg-white rounded-xl shadow-md overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-4 text-left">
                  Table
                </th>

                <th className="p-4 text-left">
                  Items
                </th>

                <th className="p-4 text-left">
                  Total
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

                <th className="p-4 text-left">
                  Ordered At
                </th>

                <th className="p-4 text-center">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {orders.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="text-center py-10 text-gray-500"
                  >

                    No Orders Found

                  </td>

                </tr>

              ) : (

                orders.map((order) => (

                  <tr
                    key={order.id}
                    className="border-t"
                  >

                    <td className="p-4">

                      Table {order.table_number}

                    </td>

                    <td className="p-4">

                      {order.items.length}

                    </td>

                    <td className="p-4">

                      Rs. {order.total_amount}

                    </td>

                    <td className="p-4">

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
                      >

                        {order.status}

                      </span>

                    </td>

                    <td className="p-4">

                      {new Date(
                        order.created_at
                      ).toLocaleString()}

                    </td>

                    <td className="p-4 text-center">

 <div className="flex justify-center gap-4">

  <button
    onClick={() => handleView(order)}
    className="text-blue-600 hover:underline"
  >
    View
  </button>

  {(order.status === "Ready" ||
    order.status === "Served") && (

    <button
      onClick={() => handleUpdateStatus(order)}
      className="text-green-600 hover:underline"
    >
      {order.status === "Ready"
        ? "Serve"
        : "Complete"}
    </button>

  )}

  {(order.status === "Pending" ||
    order.status === "Preparing") && (

    <button
      onClick={() => handleCancelOrder(order)}
      className="text-red-600 hover:underline"
    >
      Cancel
    </button>

  )}

</div>

</td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      )}
        
      <ViewOrderModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        selectedOrder={selectedOrder}
      />
      <UpdateStatusModal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        selectedOrder={selectedOrder}
        refreshOrders={fetchOrders}
    />
        <CancelOrderModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        selectedOrder={selectedOrder}
        refreshOrders={fetchOrders}
    />

    </ManagerLayout>

  );

}

export default Orders;