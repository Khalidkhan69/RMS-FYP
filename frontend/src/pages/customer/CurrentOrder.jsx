import { useEffect, useState } from "react";
import CustomerLayout from "../../layouts/CustomerLayout";
import api from "../../services/api";
import toast from "react-hot-toast";
import useTablet from "../../hooks/useTablet";

function CurrentOrder() {

  const {

    tablet,

    loading: tabletLoading,

    error

  } = useTablet();

  const [order, setOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [requestingBill, setRequestingBill] = useState(false);

  const fetchOrder = async () => {

    if (!tablet) return;

    try {

      const response = await api.get(

        `/customer/order-status/${tablet.table_number}`

      );

      setOrder(response.data);

    }

    catch (error) {

      if (error.response?.status !== 404) {

        toast.error("Failed to load order.");

      }

      setOrder(null);

    }

    finally {

      setLoadingOrder(false);

    }

  };

  useEffect(() => {

    if (!tablet) return;

    fetchOrder();

    const interval = setInterval(() => {

      fetchOrder();

    }, 5000);

    return () => clearInterval(interval);

  }, [tablet]);

  const requestBill = async () => {

    if (!tablet) {

      toast.error("Tablet configuration not found.");

      return;

    }

    try {

      setRequestingBill(true);

      const response = await api.post(

        `/customer/request-bill/${tablet.table_number}`

      );

      toast.success(response.data.message);

      fetchOrder();

    }

    catch (error) {

      toast.error(

        error.response?.data?.detail ||

        "Failed to request bill."

      );

    }

    finally {

      setRequestingBill(false);

    }

  };

  const statusColor = (status) => {

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

      default:
        return "bg-gray-100 text-gray-700";

    }

  };

  if (tabletLoading || loadingOrder) {

    return (

      <CustomerLayout>

        <div className="text-center py-20">

          Loading...

        </div>

      </CustomerLayout>

    );

  }

  if (error) {

    return (

      <CustomerLayout>

        <div className="text-center py-20 text-red-600">

          {error}

        </div>

      </CustomerLayout>

    );

  }

  return (

    <CustomerLayout>

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-4xl font-bold">

            Current Order

          </h1>

          <p className="text-gray-500 mt-2">

            Table {tablet.table_number}

          </p>

        </div>

      </div>

      {!order ? (

        <div className="bg-white rounded-xl shadow p-10 text-center">

          <h2 className="text-2xl font-semibold">

            No Active Order

          </h2>

        </div>

      ) : (

        <div className="bg-white rounded-xl shadow p-6">

          <div className="flex justify-between items-center mb-6">

            <div>

              <h2 className="text-2xl font-bold">

                Order Status

              </h2>

              <p className="text-gray-500 mt-2">

                Ordered{" "}
                {new Date(order.ordered_at).toLocaleString()}

              </p>

            </div>

            <span

              className={`px-4 py-2 rounded-full font-semibold ${statusColor(order.status)}`}

            >

              {order.status}

            </span>

          </div>

          <div className="space-y-4">

            {order.items.map((item, index) => (

              <div

                key={index}

                className="flex justify-between border-b pb-3"

              >

                <div>

                  <h3 className="font-semibold">

                    {item.item_name}

                  </h3>

                  <p className="text-gray-500">

                    Qty: {item.quantity}

                  </p>

                </div>

                <div className="font-semibold">

                  Rs. {item.subtotal}

                </div>

              </div>

            ))}

          </div>

          <div className="flex justify-between mt-8 text-2xl font-bold">

            <span>Total</span>

            <span className="text-green-600">

              Rs. {order.total_amount}

            </span>

          </div>

          {order.status === "Served" && (

            <button

              onClick={requestBill}

              disabled={requestingBill}

              className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold disabled:bg-gray-400"

            >

              {requestingBill

                ? "Requesting..."

                : "Request Bill"}

            </button>

          )}

        </div>

      )}

    </CustomerLayout>

  );

}

export default CurrentOrder;