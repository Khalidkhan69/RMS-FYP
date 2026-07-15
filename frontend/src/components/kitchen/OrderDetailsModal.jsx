import { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

function OrderDetailsModal({

  isOpen,

  onClose,

  orderId

}) {

  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {

    if (!isOpen || !orderId) return;

    fetchOrder();

  }, [isOpen, orderId]);

  const fetchOrder = async () => {

    try {

      setLoading(true);

      const response = await api.get(

        `/kitchen/order/${orderId}`

      );

      setOrder(response.data);

    }

    catch (error) {

      toast.error(

        error.response?.data?.detail ||

        "Failed to load order."

      );

    }

    finally {

      setLoading(false);

    }

  };

  if (!isOpen) {

    return null;

  }

  return (

    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">

      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">

        <div className="border-b p-6">

          <h2 className="text-2xl font-bold">

            Order Details

          </h2>

        </div>

        {loading ? (

          <div className="p-10 text-center">

            Loading...

          </div>

        ) : order && (

          <div className="p-6">

            <div className="mb-6">

              <h3 className="text-xl font-bold">

                Table {order.table_number}

              </h3>

              <p className="text-gray-500 mt-1">

                Status: {order.status}

              </p>

            </div>

            <div className="space-y-4">

              {order.items.map((item, index) => (

                <div

                  key={index}

                  className="flex justify-between border-b pb-3"

                >

                  <div>

                    <h4 className="font-semibold">

                      {item.item_name}

                    </h4>

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

            <div className="flex justify-between mt-8 text-xl font-bold">

              <span>Total</span>

              <span className="text-green-600">

                Rs. {order.total_amount}

              </span>

            </div>

          </div>

        )}

        <div className="border-t p-6 flex justify-end">

          <button

            onClick={onClose}

            className="bg-gray-300 hover:bg-gray-400 px-5 py-2 rounded-lg"

          >

            Close

          </button>

        </div>

      </div>

    </div>

  );

}

export default OrderDetailsModal;