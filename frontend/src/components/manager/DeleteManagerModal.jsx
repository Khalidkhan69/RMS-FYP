import { useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

function DeleteManagerModal({
  isOpen,
  onClose,
  manager,
  refreshManagers
}) {

  const [loading, setLoading] = useState(false);

  if (!isOpen || !manager) return null;

  const handleDelete = async () => {

    try {

      setLoading(true);

      const response = await api.delete(
        `/admin/delete-manager/${manager.id}`
      );

      toast.success(response.data.message);

      await refreshManagers();

      onClose();

    } catch (error) {

      toast.error(
        error.response?.data?.detail ||
        "Failed to delete manager."
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">

        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Delete Manager
        </h2>

        <p className="text-gray-600 mb-6">
          Are you sure you want to delete
          <span className="font-semibold">
            {" "} {manager.full_name}
          </span>
          ?
        </p>

        <p className="text-sm text-red-500 mb-6">
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">

          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
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

export default DeleteManagerModal;