import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useManagerAuth } from "../../context/ManagerAuthContext";
import api from "../../services/api";
import toast from "react-hot-toast";

function ManagerLogin() {

  const navigate = useNavigate();
  const { login } = useManagerAuth();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const validateEmail = (email) => {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill all fields.");
      return;
    }

    if (!validateEmail(formData.email)) {
      toast.error("Enter a valid email address.");
      return;
    }

    try {

      setLoading(true);

      const response = await api.post(
        "/manager/login",
        formData
      );

      login(
        response.data.access_token,
        "manager"
      );

      toast.success(response.data.message);

      navigate("/manager/dashboard", {
        replace: true
      });

    } catch (error) {

      toast.error(
        error.response?.data?.detail ||
        "Login failed."
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white shadow-xl rounded-xl w-full max-w-md p-8">

        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold text-blue-600">
            Restaurant Management System
          </h1>

          <p className="text-gray-500 mt-2">
            Manager Login
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div>

            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

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
                placeholder="Enter your password"
                className="w-full border rounded-lg px-4 py-3 pr-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3 text-blue-600"
              >
                {showPassword ? "Hide" : "Show"}
              </button>

            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition disabled:bg-gray-400"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

      </div>

    </div>

  );

}

export default ManagerLogin;