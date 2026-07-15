import { useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

function DeleteCategoryModal({
  isOpen,
  onClose,
  category,
  refreshCategories
}) {

  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {

    try {

      setLoading(true);

      const response = await api.delete(
        `/manager/category/${category.id}`
      );

      toast.success(response.data.message);

      await refreshCategories();

      onClose();

    } catch (error) {

      toast.error(
        error.response?.data?.detail ||
        "Failed to delete category."
      );

    } finally {

      setLoading(false);

    }

  };

  if (!isOpen || !category) return null;

  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">

        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Delete Category
        </h2>

        <p className="text-gray-700">

          Are you sure you want to delete

          <span className="font-semibold">
            {" "}{category.name}
          </span>

          ?

        </p>

        <p className="text-gray-500 text-sm mt-2">
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3 mt-8">

          <button
            onClick={onClose}
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

export default DeleteCategoryModal;