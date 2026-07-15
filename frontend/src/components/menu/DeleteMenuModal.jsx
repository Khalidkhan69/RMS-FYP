import { useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

function DeleteMenuModal({
  isOpen,
  onClose,
  selectedItem,
  refreshMenu,
}) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);

      const response = await api.delete(
        `/manager/menu/${selectedItem.id}`
      );

      toast.success(response.data.message);

      await refreshMenu();

      onClose();

    } catch (error) {

      toast.error(
        error.response?.data?.detail ||
        "Failed to delete menu item."
      );

    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !selectedItem) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">

        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-red-600">
            Delete Menu Item
          </h2>
        </div>

        <div className="p-6">
          <p className="text-gray-700">
            Are you sure you want to delete
            <span className="font-semibold"> {selectedItem.name}</span>?
          </p>

          {selectedItem.image && (
            <img
              src={selectedItem.image}
              alt={selectedItem.name}
              className="w-32 h-32 object-cover rounded-lg border mt-4"
            />
          )}

          <p className="text-sm text-gray-500 mt-4">
            This action cannot be undone.
          </p>
        </div>

        <div className="border-t p-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default DeleteMenuModal;
