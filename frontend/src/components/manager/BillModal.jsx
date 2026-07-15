import { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

function BillModal({

  isOpen,

  onClose,

  orderId

}) {

  const [bill, setBill] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {

    if (isOpen && orderId) {

      fetchBill();

    }

  }, [isOpen, orderId]);

  const fetchBill = async () => {

    try {

      setLoading(true);

      const response = await api.get(

        `/manager/bill/${orderId}`

      );

      setBill(response.data);

    }

    catch (error) {

      toast.error(

        error.response?.data?.detail ||

        "Failed to load bill."

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

      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">

        <div className="border-b p-6">

          <h2 className="text-2xl font-bold">

            Generate Bill

          </h2>

        </div>

        {loading ? (

          <div className="p-10 text-center">

            Loading Bill...

          </div>

        ) : bill && (

          <div className="p-6">

            <div className="mb-6">

              <h2 className="text-3xl font-bold text-center">

                {bill.restaurant_name}

              </h2>

            </div>

            <div className="flex justify-between mb-6">

              <div>

                <p>

                  <strong>Table:</strong>

                  {" "}

                  {bill.table_number}

                </p>

                <p>

                  <strong>Status:</strong>

                  {" "}

                  {bill.status}

                </p>

              </div>

              <div>

                <p>

                  <strong>Payment:</strong>

                  {" "}

                  {bill.payment_status}

                </p>

              </div>

            </div>

            <table className="w-full border">

              <thead className="bg-gray-100">

                <tr>

                  <th className="p-3 text-left">

                    Item

                  </th>

                  <th className="p-3">

                    Qty

                  </th>

                  <th className="p-3">

                    Price

                  </th>

                  <th className="p-3">

                    Total

                  </th>

                </tr>

              </thead>

              <tbody>

                {bill.items.map((item, index) => (

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

                      Rs. {item.unit_price}

                    </td>

                    <td className="p-3 text-center">

                      Rs. {item.subtotal}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

            <div className="flex justify-end mt-6">

              <h2 className="text-2xl font-bold">

                Total: Rs. {bill.total_amount}

              </h2>

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

export default BillModal;