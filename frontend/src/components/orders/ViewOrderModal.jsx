function ViewOrderModal({
  isOpen,
  onClose,
  selectedOrder,
}) {

  if (!isOpen || !selectedOrder) return null;

  return (

    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">

      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">

        {/* Header */}

        <div className="border-b p-6 flex justify-between items-center">

          <h2 className="text-2xl font-bold">
            Order Details
          </h2>

          <button
            onClick={onClose}
            className="text-3xl text-gray-500 hover:text-black"
          >
            ×
          </button>

        </div>

        {/* Body */}

        <div className="flex-1 overflow-y-auto p-6">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">

            <div>

              <p className="text-gray-500">
                Table
              </p>

              <h3 className="text-lg font-semibold">
                {selectedOrder.table_number}
              </h3>

            </div>

            <div>

              <p className="text-gray-500">
                Status
              </p>

              <span
                className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm"
              >
                {selectedOrder.status}
              </span>

            </div>

            <div>

              <p className="text-gray-500">
                Payment
              </p>

              <h3 className="text-lg font-semibold">
                {selectedOrder.payment_status}
              </h3>

            </div>

            <div>

              <p className="text-gray-500">
                Bill Requested
              </p>

              <h3 className="text-lg font-semibold">
                {selectedOrder.bill_requested
                  ? "Yes"
                  : "No"}
              </h3>

            </div>

          </div>
                    {/* Items Table */}

          <h3 className="text-xl font-bold mb-4">
            Ordered Items
          </h3>

          <div className="overflow-x-auto">

            <table className="w-full border">

              <thead className="bg-gray-100">

                <tr>

                  <th className="p-3 text-left">
                    Item
                  </th>

                  <th className="p-3 text-center">
                    Qty
                  </th>

                  <th className="p-3 text-center">
                    Price
                  </th>

                  <th className="p-3 text-center">
                    Subtotal
                  </th>

                </tr>

              </thead>

              <tbody>

                {selectedOrder.items.map((item, index) => (

                  <tr
                    key={index}
                    className="border-t"
                  >

                    <td className="p-3">
                      {item.item_name}
                    </td>

                    <td className="p-3 text-center">
                      {item.quantity}
                    </td>

                    <td className="p-3 text-center">
                      Rs. {item.price}
                    </td>

                    <td className="p-3 text-center font-medium">
                      Rs. {item.subtotal}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {/* Order Summary */}

          <div className="mt-8 flex justify-end">

            <div className="w-72 border rounded-lg p-4 bg-gray-50">

              <div className="flex justify-between mb-3">

                <span className="font-medium">
                  Total Items
                </span>

                <span>
                  {selectedOrder.items.reduce(
                    (total, item) => total + item.quantity,
                    0
                  )}
                </span>

              </div>

              <div className="flex justify-between text-xl font-bold border-t pt-3">

                <span>
                  Grand Total
                </span>

                <span>
                  Rs. {selectedOrder.total_amount}
                </span>

              </div>

            </div>

          </div>

        </div>

                {/* Footer */}

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

export default ViewOrderModal;