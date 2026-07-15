import { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

function EditTableModal({
  isOpen,
  onClose,
  table,
  refreshTables
}) {

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    table_number: "",
    capacity: "",
    status: "Available"
  });

  useEffect(() => {

    if (table) {

      setFormData({
        table_number: table.table_number,
        capacity: table.capacity,
        status: table.status
      });

    }

  }, [table]);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async () => {

    if (
      !formData.table_number ||
      !formData.capacity
    ) {
      toast.error("Please fill all fields.");
      return;
    }

    if (
      Number(formData.table_number) < 1 ||
      Number(formData.table_number) > 999
    ) {
      toast.error("Table number must be between 1 and 999.");
      return;
    }

    if (
      Number(formData.capacity) < 1 ||
      Number(formData.capacity) > 20
    ) {
      toast.error("Capacity must be between 1 and 20.");
      return;
    }

    try {

      setLoading(true);

      const response = await api.put(
        `/manager/table/${table.id}`,
        {
          table_number: Number(formData.table_number),
          capacity: Number(formData.capacity),
          status: formData.status
        }
      );

      toast.success(response.data.message);

      await refreshTables();

      onClose();

    } catch (error) {

      const errorMessage =
        error.response?.data?.detail?.[0]?.msg ||
        error.response?.data?.detail ||
        "Failed to update table.";

      toast.error(errorMessage);

    } finally {

      setLoading(false);

    }

  };

  if (!isOpen) return null;

  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">

        <h2 className="text-2xl font-bold mb-6">
          Edit Table
        </h2>

        <div className="space-y-5">

          <div>

            <label className="block mb-2 font-medium">
              Table Number
            </label>

            <input
              type="number"
              name="table_number"
              min="1"
              max="999"
              value={formData.table_number}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Capacity
            </label>

            <input
              type="number"
              name="capacity"
              min="1"
              max="20"
              value={formData.capacity}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Available">Available</option>
              <option value="Reserved">Reserved</option>
              <option value="Occupied">Occupied</option>
            </select>

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
            {loading ? "Updating..." : "Update Table"}
          </button>

        </div>

      </div>

    </div>

  );

}

export default EditTableModal;