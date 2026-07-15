import { useEffect, useState } from "react";
import ManagerLayout from "../../layouts/ManagerLayout";
import api from "../../services/api";
import toast from "react-hot-toast";

function TabletConfiguration() {

  const [tablets, setTablets] = useState([]);
  const [tables, setTables] = useState([]);
  const [tableNumber, setTableNumber] = useState("");


  const availableTables = tables.filter((table) => {

  return !tablets.some(

    (tablet) =>

      tablet.is_active &&

      tablet.table_number === table.table_number

  );

});

  

  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  

  const fetchData = async () => {

    try {

      const [tabletResponse, tableResponse] = await Promise.all([

        api.get("/manager/tablets"),

        api.get("/manager/tables")

      ]);

      setTablets(tabletResponse.data.tablets);
      setTables(tableResponse.data.tables);

    }

    catch {

      toast.error("Failed to load tablet configuration.");

    }

    finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchData();

  }, []);

  const handleRegister = async () => {

    if (!tableNumber) {

      toast.error("Please select a table.");

      return;

    }

    try {

      setRegistering(true);

      const deviceId = `TAB-${String(tablets.length + 1).padStart(3, "0")}`;

      const response = await api.post(

        "/manager/tablets",

        {

          device_id: deviceId,

          table_number: Number(tableNumber)

        }

      );

      toast.success(response.data.message);

      setTableNumber("");

      fetchData();

    }

    catch (error) {

      toast.error(

        error.response?.data?.detail ||

        "Failed to register tablet."

      );

    }

    finally {

      setRegistering(false);

    }

  };

  const deactivateTablet = async (tablet) => {

    const confirmDelete = window.confirm(

      `Deactivate ${tablet.device_id}?`

    );

    if (!confirmDelete) return;

    try {

      const response = await api.delete(

        `/manager/tablets/${tablet.id}`

      );

      toast.success(response.data.message);

      fetchData();

    }

    catch (error) {

      toast.error(

        error.response?.data?.detail ||

        "Failed to deactivate tablet."

      );

    }

  };
  const activateTablet = async (tablet) => {

  const confirmActivate = window.confirm(

    `Activate ${tablet.device_id}?`

  );

  if (!confirmActivate) return;

  try {

    const response = await api.put(

      `/manager/tablets/${tablet.id}/activate`

    );

    toast.success(response.data.message);

    fetchData();

  }

  catch (error) {

    toast.error(

      error.response?.data?.detail ||

      "Failed to activate tablet."

    );

  }

};

  return (

    <ManagerLayout>

      <div className="max-w-6xl mx-auto">

        <div className="flex justify-between items-center mb-8">

          <div>

            <h1 className="text-4xl font-bold">

              Tablet Configuration

            </h1>

            <p className="text-gray-500 mt-2">

              Register and manage restaurant tablets.

            </p>

          </div>

        </div>

        <div className="bg-white rounded-xl shadow p-6 mb-8">

          <h2 className="text-2xl font-bold mb-5">

            Register Tablet

          </h2>

          <div className="grid grid-cols-2 gap-5">

            <div>

              <label className="block mb-2 font-medium">

                Assign Table

              </label>

              <select

                value={tableNumber}

                onChange={(e) => setTableNumber(e.target.value)}

                className="w-full border rounded-lg px-4 py-3"

              >

                <option value="">

                  Select Table

                </option>

                {availableTables.map((table) => (

                  <option

                    key={table.id}

                    value={table.table_number}

                  >

                    Table {table.table_number}

                  </option>

                ))}

              </select>

            </div>

          </div>

          <button

            onClick={handleRegister}

            disabled={registering}

            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"

          >

            {registering

              ? "Registering..."

              : "Register Tablet"}

          </button>

        </div>

        <div className="bg-white rounded-xl shadow">

          <table className="w-full">

            <thead>

              <tr className="border-b bg-gray-100">

                <th className="p-4 text-left">Device ID</th>

                <th className="p-4 text-left">Assigned Table</th>

                <th className="p-4 text-left">Status</th>

                <th className="p-4 text-center">Actions</th>

              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>

                  <td colSpan="4" className="text-center py-10">

                    Loading...

                  </td>

                </tr>

              ) : (

                tablets.map((tablet) => (

                  <tr

                    key={tablet.id}

                    className="border-b"

                  >

                    <td className="p-4 font-semibold">

                      {tablet.device_id}

                    </td>

                    <td className="p-4">

                      Table {tablet.table_number}

                    </td>

                    <td className="p-4">

                      <span className={`px-3 py-1 rounded-full text-sm ${tablet.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                        }`}>

                        {tablet.is_active ? "Active" : "Inactive"}

                      </span>

                    </td>

                    <td className="p-4 text-center">

  {tablet.is_active ? (

    <button

      onClick={() => deactivateTablet(tablet)}

      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"

    >

      Deactivate

    </button>

  ) : (

    <button

      onClick={() => activateTablet(tablet)}

      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"

    >

      Activate

    </button>

  )}

</td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </ManagerLayout>

  );

}

export default TabletConfiguration;