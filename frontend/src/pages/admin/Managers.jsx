import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";
import AddManagerModal from "../../components/manager/AddManagerModal";
import EditManagerModal from "../../components/manager/EditManagerModal";
import DeleteManagerModal from "../../components/manager/DeleteManagerModal";

function Managers() {

  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedManager, setSelectedManager] = useState(null);

  const fetchManagers = async () => {

    try {

      const response = await api.get("/admin/managers");

      setManagers(response.data.managers);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchManagers();

  }, []);

  const handleEdit = (manager) => {

    setSelectedManager(manager);

    setShowEditModal(true);

  };
  const handleDelete = (manager) => {

  setSelectedManager(manager);

  setShowDeleteModal(true);

};

  return (

    <DashboardLayout>

      {/* Header */}

      <div className="flex justify-between items-center mb-6">

        <div>

          <h1 className="text-3xl font-bold">
            Manager Management
          </h1>

          <p className="text-gray-500 mt-1">
            Total Managers: {managers.length}
          </p>

        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg transition"
        >
          + Add Manager
        </button>

      </div>

      {loading ? (

        <p>Loading...</p>

      ) : (

        <div className="bg-white rounded-xl shadow-md overflow-hidden">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="text-left p-4">Name</th>

                <th className="text-left p-4">Email</th>

                <th className="text-left p-4">Phone</th>

                <th className="text-left p-4">Status</th>

                <th className="text-center p-4">Actions</th>

              </tr>

            </thead>

            <tbody>

              {managers.map((manager) => (

                <tr
                  key={manager.id}
                  className="border-t"
                >

                  <td className="p-4">
                    {manager.full_name}
                  </td>

                  <td className="p-4">
                    {manager.email}
                  </td>

                  <td className="p-4">
                    {manager.phone}
                  </td>

                  <td className="p-4">

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        manager.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {manager.is_active ? "Active" : "Inactive"}
                    </span>

                  </td>

                  <td className="p-4 text-center">

                    <button
                      onClick={() => handleEdit(manager)}
                      className="text-blue-600 hover:underline mr-4"
                    >
                      Edit
                    </button>

                    <button className="text-red-600 hover:underline"
                      onClick={() => handleDelete(manager)}>
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

      <AddManagerModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        refreshManagers={fetchManagers}
      />

      <EditManagerModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        manager={selectedManager}
        refreshManagers={fetchManagers}
      />
      <DeleteManagerModal
  isOpen={showDeleteModal}
  onClose={() => setShowDeleteModal(false)}
  manager={selectedManager}
  refreshManagers={fetchManagers}
/>

    </DashboardLayout>

  );

}

export default Managers;