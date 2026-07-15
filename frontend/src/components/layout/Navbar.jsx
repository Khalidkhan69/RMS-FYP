import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { HiMenu } from "react-icons/hi";

function Navbar({ isSidebarOpen, setIsSidebarOpen }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="h-16 bg-white shadow flex items-center justify-between px-6">

      <div className="flex items-center gap-4">

        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-3xl text-gray-700 hover:text-blue-600 transition"
        >
          <HiMenu />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Admin Dashboard
          </h1>

          <p className="text-sm text-gray-500">
            {today}
          </p>
        </div>

      </div>

      <div className="flex items-center gap-4">

        <div className="text-right">

          <p className="font-semibold text-gray-700">
            Welcome
          </p>

          <p className="text-sm text-gray-500">
            Administrator
          </p>

        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>

      </div>

    </header>
  );
}

export default Navbar;