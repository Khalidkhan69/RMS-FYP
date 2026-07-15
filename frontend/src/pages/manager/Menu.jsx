import { useEffect, useState } from "react";
import ManagerLayout from "../../layouts/ManagerLayout";
import api from "../../services/api";

import AddMenuModal from "../../components/menu/AddMenuModal";
import EditMenuModal from "../../components/menu/EditMenuModal";
import DeleteMenuModal from "../../components/menu/DeleteMenuModal";

function Menu() {

  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);

  const fetchMenu = async () => {
    try {
      const response = await api.get("/manager/menu");
      setMenuItems(response.data.menu);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleEdit = (item) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };
  const handleDelete = (item) => {
  setSelectedItem(item);
  setShowDeleteModal(true);
};

  return (
    <ManagerLayout>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Menu Management</h1>
          <p className="text-gray-500 mt-1">
            Total Items: {menuItems.length}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"
        >
          + Add Menu Item
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Image</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {menuItems.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="p-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg border"
                    />
                  </td>

                  <td className="p-4 font-medium">{item.name}</td>

                  <td className="p-4">{item.category_name}</td>

                  <td className="p-4">Rs. {item.price}</td>

                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      item.is_available
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {item.is_available ? "Available" : "Unavailable"}
                    </span>
                  </td>

                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:underline mr-4"
                    >
                      Edit
                    </button>

                    <button className="text-red-600 hover:underline"
                     onClick={() => handleDelete(item)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}

      <AddMenuModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        refreshMenu={fetchMenu}
      />

      <EditMenuModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        selectedItem={selectedItem}
        refreshMenu={fetchMenu}
      />
      <DeleteMenuModal
  isOpen={showDeleteModal}
  onClose={() => setShowDeleteModal(false)}
  selectedItem={selectedItem}
  refreshMenu={fetchMenu}
/>

    </ManagerLayout>
  );
}

export default Menu;
