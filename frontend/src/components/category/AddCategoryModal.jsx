import { useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

function AddCategoryModal({
  isOpen,
  onClose,
  refreshCategories
}) {

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async () => {

    if (!formData.name.trim()) {
      toast.error("Category name is required.");
      return;
    }

    if (formData.name.trim().length < 2) {
      toast.error("Category name must contain at least 2 characters.");
      return;
    }

    try {

      setLoading(true);

      const response = await api.post(
        "/manager/category",
        {
          name: formData.name.trim(),
          description: formData.description.trim()
        }
      );

      toast.success(response.data.message);

      await refreshCategories();

      setFormData({
        name: "",
        description: ""
      });

      onClose();

    } catch (error) {

      toast.error(
        error.response?.data?.detail ||
        "Failed to create category."
      );

    } finally {

      setLoading(false);

    }

  };

  if (!isOpen) return null;

  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">

        <h2 className="text-2xl font-bold mb-6">
          Add Category
        </h2>

        <div className="space-y-5">

          <div>

            <label className="block mb-2 font-medium">
              Category Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter category name"
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Enter category description"
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

        </div>

        <div className="flex justify-end gap-3 mt-8">

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Creating..." : "Create Category"}
          </button>

        </div>

      </div>

    </div>

  );

}

export default AddCategoryModal;