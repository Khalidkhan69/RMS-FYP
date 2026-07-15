import { useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

function CancelOrderModal({

  isOpen,

  onClose,

  selectedOrder,

  refreshOrders

}) {

  const [loading, setLoading] = useState(false);

  if (!isOpen || !selectedOrder) {

    return null;

  }

    const handleCancel = async () => {

    try {

      setLoading(true);

      const response = await api.delete(

        `/manager/orders/${selectedOrder.id}`

      );

      toast.success(
        response.data.message
      );

      await refreshOrders();

      onClose();

    }

    catch (error) {

      toast.error(

        error.response?.data?.detail ||

        "Failed to cancel order."

      );

    }

    finally {

      setLoading(false);

    }

  };

    return (

    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">

      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">

        {/* Header */}

        <div className="border-b p-6">

          <h2 className="text-2xl font-bold text-red-600">

            Cancel Order

          </h2>

        </div>

        {/* Body */}

        <div className="p-6">

          <p className="text-gray-700">

            Are you sure you want to cancel the order for

            <span className="font-semibold">

              {" "}Table {selectedOrder.table_number}

            </span>

            ?

          </p>

          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">

            <p className="text-red-700 text-sm">

              This action will change the order status to <strong>Cancelled</strong>.
              Only Pending and Preparing orders can be cancelled.

            </p>

          </div>

        </div>

        {/* Footer */}

        <div className="border-t p-6 flex justify-end gap-3">

          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200"
          >
            Close
          </button>

          <button
            onClick={handleCancel}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:bg-gray-400"
          >
            {loading ? "Cancelling..." : "Cancel Order"}
          </button>

        </div>

      </div>

    </div>

  );

}

export default CancelOrderModal;