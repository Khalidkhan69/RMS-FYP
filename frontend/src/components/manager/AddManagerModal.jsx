import { useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

function AddManagerModal({
  isOpen,
  onClose,
  refreshManagers
}) {

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: ""
  });

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

  const handleSubmit = async () => {

    const fullName = formData.full_name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const password = formData.password;

    // Required Fields
    if (!fullName || !email || !phone || !password) {
      toast.error("Please fill all fields.");
      return;
    }

    // Full Name Validation
    if (fullName.length < 3) {
      toast.error("Full name must be at least 3 characters.");
      return;
    }

    if (!/^[A-Za-z ]+$/.test(fullName)) {
      toast.error("Full name can contain only letters and spaces.");
      return;
    }

    // Email Validation
    const emailRegex =
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Pakistani Phone Validation
    const phoneRegex = /^03\d{9}$/;

    if (!phoneRegex.test(phone)) {
      toast.error("Phone number must be in the format 03XXXXXXXXX.");
      return;
    }

    // Password Validation
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must contain at least one uppercase letter, one lowercase letter and one number."
      );
      return;
    }

    try {

      setLoading(true);

      const response = await api.post(
        "/admin/create-manager",
        {
          full_name: fullName,
          email: email,
          phone: phone,
          password: password
        }
      );

      toast.success(response.data.message);

      if (refreshManagers) {
        await refreshManagers();
      }

      setFormData({
        full_name: "",
        email: "",
        phone: "",
        password: ""
      });

      setShowPassword(false);

      onClose();

    } catch (error) {

      const errorMessage =
        error.response?.data?.detail?.[0]?.msg ||
        error.response?.data?.detail ||
        "Failed to create manager.";

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
          Add Manager
        </h2>

        <div className="space-y-5">

          {/* Full Name */}

          <div>

            <label className="block mb-2 font-medium">
              Full Name
            </label>

            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Enter full name"
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

          </div>

          {/* Email */}

          <div>

            <label className="block mb-2 font-medium">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="manager@example.com"
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

          </div>

          {/* Phone */}

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
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

            <p className="text-xs text-gray-500 mt-1">
              Example: 03001234567
            </p>

          </div>

          {/* Password */}

          <div>

            <label className="block mb-2 font-medium">
              Password
            </label>

            <div className="relative">

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                className="w-full border rounded-lg px-4 py-3 pr-20 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600 font-medium"
              >
                {showPassword ? "Hide" : "Show"}
              </button>

            </div>

            <p className="text-xs text-gray-500 mt-1">
              Password must contain uppercase, lowercase and a number.
            </p>

          </div>

        </div>

        <div className="flex justify-end gap-3 mt-8">

          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Creating..." : "Create Manager"}
          </button>

        </div>

      </div>

    </div>

  );
}

export default AddManagerModal;