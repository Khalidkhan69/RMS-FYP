import { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

function AddMenuModal({
  isOpen,
  onClose,
  refreshMenu,
}) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    is_available: true,
    image: null,
  });

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/manager/categories");
      setCategories(response.data.categories);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setFormData({
      ...formData,
      image: file,
    });

    setPreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category_id: "",
      is_available: true,
      image: null,
    });

    setPreview(null);
  };

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.price ||
      !formData.category_id ||
      !formData.image
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("category_id", formData.category_id);
      data.append("is_available", formData.is_available);
      data.append("image", formData.image);

      const response = await api.post(
        "/manager/menu",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(response.data.message);

      await refreshMenu();

      resetForm();

      onClose();

    } catch (error) {
      toast.error(
        error.response?.data?.detail ||
          "Failed to create menu item."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">

        {/* Header */}

        <div className="p-6 border-b">

          <h2 className="text-2xl font-bold">
            Add Menu Item
          </h2>

        </div>

        {/* Scrollable Content */}

        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          <div>

            <label className="block mb-2 font-medium">
              Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Description
            </label>

            <textarea
              rows="4"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Price
            </label>

            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Category
            </label>

            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            >

              <option value="">
                Select Category
              </option>

              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              ))}

            </select>

          </div>

          <div className="flex items-center gap-3">

            <input
              type="checkbox"
              name="is_available"
              checked={formData.is_available}
              onChange={handleChange}
            />

            <label className="font-medium">
              Available
            </label>

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Upload Image
            </label>

            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handleImage}
              className="w-full"
            />

          </div>

          {preview && (

            <div>

              <p className="font-medium mb-2">
                Image Preview
              </p>

              <img
                src={preview}
                alt="Preview"
                className="w-40 h-40 rounded-lg object-cover border"
              />

            </div>

          )}

        </div>

        {/* Footer */}

        <div className="border-t p-6 flex justify-end gap-3">

          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="px-5 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400"
          >
            {loading ? "Creating..." : "Create Menu"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default AddMenuModal;