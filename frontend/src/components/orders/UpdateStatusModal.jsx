import { useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

function UpdateStatusModal({

  isOpen,

  onClose,

  selectedOrder,

  refreshOrders

}) {

  const [loading, setLoading] = useState(false);

  if (!isOpen || !selectedOrder) {

    return null;

  }

  let nextStatus = "";

  let buttonText = "";

  if (selectedOrder.status === "Ready") {

    nextStatus = "Served";

    buttonText = "Serve Order";

  }

  else if (selectedOrder.status === "Served") {

    nextStatus = "Completed";

    buttonText = "Complete Order";

  }

  else {

    return null;

  }

    const handleUpdate = async () => {

    try {

      setLoading(true);

      const response = await api.put(

        `/manager/orders/${selectedOrder.id}/status`,

        {
          status: nextStatus
        }

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

        "Failed to update order."

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

          <h2 className="text-2xl font-bold">

            Update Order Status

          </h2>

        </div>

        {/* Body */}

        <div className="p-6">

          <p className="text-gray-700">

            Are you sure you want to update

            <span className="font-semibold">

              {" "}Table {selectedOrder.table_number}

            </span>

            {" "}from

            <span className="font-semibold">

              {" "}{selectedOrder.status}

            </span>

            {" "}to

            <span className="font-semibold text-blue-600">

              {" "}{nextStatus}

            </span>

            ?

          </p>

        </div>

        {/* Footer */}

        <div className="border-t p-6 flex justify-end gap-3">

          <button

            onClick={onClose}

            disabled={loading}

            className="px-5 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"

          >

            Cancel

          </button>

          <button

            onClick={handleUpdate}

            disabled={loading}

            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400"

          >

            {loading ? "Updating..." : buttonText}

          </button>

        </div>

      </div>

    </div>

  );

}

export default UpdateStatusModal;