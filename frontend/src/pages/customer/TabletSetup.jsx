import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";

function TabletSetup() {

  const navigate = useNavigate();

  const [deviceId, setDeviceId] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {

    const savedDevice = localStorage.getItem("deviceId");

    if (savedDevice) {

      navigate("/customer");

    }

  }, [navigate]);

  const handleSave = async () => {

    if (!deviceId.trim()) {

      toast.error("Please enter Device ID.");

      return;

    }

    try {

      setLoading(true);

      await api.get(
        `/customer/tablet-configuration/${deviceId}`
      );

      localStorage.setItem(
        "deviceId",
        deviceId
      );

      toast.success(
        "Tablet configured successfully."
      );

      navigate("/customer");

    }

    catch (error) {

      toast.error(

        error.response?.data?.detail ||

        "Invalid Device ID."

      );

    }

    finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen flex justify-center items-center bg-gray-100">

      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center">

          Tablet Setup

        </h1>

        <p className="text-gray-500 mt-3 text-center">

          Enter the device ID assigned by the manager.

        </p>

        <div className="mt-8">

          <label className="block mb-2 font-medium">

            Device ID

          </label>

          <input

            type="text"

            value={deviceId}

            onChange={(e) =>
              setDeviceId(e.target.value.toUpperCase())
            }

            placeholder="TAB-001"

            className="w-full border rounded-lg px-4 py-3"

          />

        </div>

        <button

          onClick={handleSave}

          disabled={loading}

          className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg disabled:bg-gray-400"

        >

          {loading
            ? "Verifying..."
            : "Configure Tablet"}

        </button>

      </div>

    </div>

  );

}

export default TabletSetup;