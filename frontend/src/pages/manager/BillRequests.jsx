import { useEffect, useState } from "react";
import ManagerLayout from "../../layouts/ManagerLayout";
import api from "../../services/api";

import ViewBillModal from "../../components/bills/ViewBillModal";

function BillRequests() {

  const [billRequests, setBillRequests] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showBillModal, setShowBillModal] = useState(false);

  const [selectedBill, setSelectedBill] = useState(null);

  const fetchBillRequests = async () => {

    try {

      const response = await api.get(
        "/manager/bill-requests"
      );

      setBillRequests(
        response.data.bill_requests
      );

    }

    catch (error) {

      console.error(error);

    }

    finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchBillRequests();

  }, []);

  const handleViewBill = (bill) => {

    setSelectedBill(bill);

    setShowBillModal(true);

  };

    return (

    <ManagerLayout>

      <div className="flex justify-between items-center mb-6">

        <div>

          <h1 className="text-3xl font-bold">

            Bill Requests

          </h1>

          <p className="text-gray-500 mt-1">

            Total Requests: {billRequests.length}

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
                  Amount
                </th>

                <th className="p-4 text-left">
                  Requested At
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

                <th className="p-4 text-center">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {billRequests.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="text-center py-10 text-gray-500"
                  >

                    No Bill Requests Found

                  </td>

                </tr>

              ) : (

                billRequests.map((bill) => (

                  <tr
                    key={bill.order_id}
                    className="border-t"
                  >

                    <td className="p-4">

                      Table {bill.table_number}

                    </td>

                    <td className="p-4">

                      {bill.total_items}

                    </td>

                    <td className="p-4">

                      Rs. {bill.total_amount}

                    </td>

                    <td className="p-4">

                      {new Date(
                        bill.requested_at
                      ).toLocaleString()}

                    </td>

                    <td className="p-4">

                      <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm">

                        {bill.status}

                      </span>

                    </td>

                    <td className="p-4 text-center">

                      <button

                        onClick={() => handleViewBill(bill)}

                        className="text-blue-600 hover:underline"

                      >

                        View Bill

                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      )}

      <ViewBillModal

        isOpen={showBillModal}

        onClose={() => setShowBillModal(false)}

        selectedBill={selectedBill}

        refreshBills={fetchBillRequests}

      />

    </ManagerLayout>

  );

}

export default BillRequests;