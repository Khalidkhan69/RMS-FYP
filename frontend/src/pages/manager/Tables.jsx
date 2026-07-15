import { useEffect, useState } from "react";
import ManagerLayout from "../../layouts/ManagerLayout";
import api from "../../services/api";

import AddTableModal from "../../components/table/AddTableModal";
import EditTableModal from "../../components/table/EditTableModal";
import DeleteTableModal from "../../components/table/DeleteTableModal";

function Tables() {

  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedTable, setSelectedTable] = useState(null);

  const fetchTables = async () => {

    try {

      const response = await api.get("/manager/tables");

      setTables(response.data.tables);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchTables();

  }, []);

  const handleEdit = (table) => {

    setSelectedTable(table);

    setShowEditModal(true);

  };

  const handleDelete = (table) => {

    setSelectedTable(table);

    setShowDeleteModal(true);

  };

  return (

    <ManagerLayout>

      <div className="flex justify-between items-center mb-6">

        <div>

          <h1 className="text-3xl font-bold">
            Table Management
          </h1>

          <p className="text-gray-500 mt-1">
            Total Tables: {tables.length}
          </p>

        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"
        >
          + Add Table
        </button>

      </div>

      {loading ? (

        <p>Loading...</p>

      ) : (

        <div className="bg-white rounded-xl shadow-md overflow-hidden">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="text-left p-4">Table No.</th>

                <th className="text-left p-4">Capacity</th>

                <th className="text-left p-4">Status</th>

                <th className="text-center p-4">Actions</th>

              </tr>

            </thead>

            <tbody>

              {tables.map((table) => (

                <tr
                  key={table.id}
                  className="border-t"
                >

                  <td className="p-4">
                    {table.table_number}
                  </td>

                  <td className="p-4">
                    {table.capacity} Persons
                  </td>

                  <td className="p-4">

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        table.status === "Available"
                          ? "bg-green-100 text-green-700"
                          : table.status === "Occupied"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {table.status}
                    </span>

                  </td>

                  <td className="p-4 text-center">

                    <button
                      onClick={() => handleEdit(table)}
                      className="text-blue-600 hover:underline mr-4"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(table)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

      <AddTableModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        refreshTables={fetchTables}
      />

      <EditTableModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        table={selectedTable}
        refreshTables={fetchTables}
      />

      <DeleteTableModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        table={selectedTable}
        refreshTables={fetchTables}
      />

    </ManagerLayout>

  );

}

export default Tables;