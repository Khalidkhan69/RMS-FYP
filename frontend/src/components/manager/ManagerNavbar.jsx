import { HiMenu } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useManagerAuth } from "../../context/ManagerAuthContext";

function ManagerNavbar({ toggleSidebar }) {

  const navigate = useNavigate();
  const { logout } = useManagerAuth();

  const handleLogout = () => {

    logout();

    navigate("/manager/login", {
      replace: true,
    });

  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (

    <header className="h-16 bg-white shadow flex justify-between items-center px-6">

      <div className="flex items-center gap-4">

        <button
          onClick={toggleSidebar}
          className="text-3xl text-gray-700 hover:text-blue-600 transition"
        >
          <HiMenu />
        </button>

        <div>

          <h1 className="text-2xl font-bold">
            Manager Dashboard
          </h1>

          <p className="text-sm text-gray-500">
            {today}
          </p>

        </div>

      </div>

      <div className="flex items-center gap-4">

        <div className="text-right">

          <p className="font-semibold">
            Welcome
          </p>

          <p className="text-gray-500 text-sm">
            Manager
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

export default ManagerNavbar;