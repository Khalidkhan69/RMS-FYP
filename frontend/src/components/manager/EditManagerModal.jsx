import { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

function EditManagerModal({
  isOpen,
  onClose,
  manager,
  refreshManagers
}) {

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    is_active: true
  });

  useEffect(() => {

    if (manager) {

      setFormData({
        full_name: manager.full_name,
        email: manager.email,
        phone: manager.phone,
        is_active: manager.is_active
      });

    }

  }, [manager]);

  const handleChange = (e) => {

    const { name, value } = e.target;

    if (name === "phone") {

      const phone = value.replace(/\D/g, "");

      setFormData({
        ...formData,
        phone
      });

      return;

    }

    setFormData({
      ...formData,
      [name]: value
    });

  };

  const handleUpdate = async () => {

    const fullName = formData.full_name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();

    if (!fullName || !email || !phone) {
      toast.error("Please fill all fields.");
      return;
    }

    if (fullName.length < 3) {
      toast.error("Full name must be at least 3 characters.");
      return;
    }

    if (!/^[A-Za-z ]+$/.test(fullName)) {
      toast.error("Full name can contain only letters and spaces.");
      return;
    }

    const emailRegex =
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const phoneRegex = /^03\d{9}$/;

    if (!phoneRegex.test(phone)) {
      toast.error(
        "Phone number must be in the format 03XXXXXXXXX."
      );
      return;
    }

    try {

      setLoading(true);

      const response = await api.put(
        `/admin/managers/${manager.id}`,
        {
          full_name: fullName,
          email,
          phone,
          is_active: formData.is_active
        }
      );

      toast.success(response.data.message);

      await refreshManagers();

      onClose();

    } catch (error) {

      const errorMessage =
        error.response?.data?.detail?.[0]?.msg ||
        error.response?.data?.detail ||
        "Failed to update manager.";

      toast.error(errorMessage);

    } finally {

      setLoading(false);

    }

  };

  if (!isOpen) return null;

  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">

        <h2 className="text-2xl font-bold mb-6">
          Edit Manager
        </h2>

        <div className="space-y-5">

          <div>

            <label className="block mb-2 font-medium">
              Full Name
            </label>

            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              maxLength={11}
              placeholder="03XXXXXXXXX"
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Status
            </label>

            <select
              value={formData.is_active ? "true" : "false"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  is_active: e.target.value === "true"
                })
              }
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>

          </div>

        </div>

        <div className="flex justify-end gap-3 mt-8">

          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Updating..." : "Update Manager"}
          </button>

        </div>

      </div>

    </div>

  );

}

export default EditManagerModal;