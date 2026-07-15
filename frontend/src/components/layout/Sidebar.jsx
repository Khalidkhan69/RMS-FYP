import { NavLink } from "react-router-dom";
import {
  HiHome,
  HiUsers,
  HiChatAlt2,
} from "react-icons/hi";

function Sidebar({ isOpen }) {

  const linkClass = ({ isActive }) =>
    `flex items-center gap-4 px-6 py-3 rounded-lg mx-3 transition-all duration-300 ${
      isActive
        ? "bg-blue-600 text-white shadow-lg"
        : "text-gray-300 hover:bg-slate-800 hover:text-white"
    }`;

  return (

    <aside
      className={`bg-slate-900 shadow-xl transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >

      {/* Logo */}

      <div className="h-16 flex items-center justify-center border-b border-slate-700">

        <h1
          className={`text-2xl font-bold text-white transition-all duration-300 ${
            isOpen ? "opacity-100" : "opacity-0 hidden"
          }`}
        >
          RMS Admin
        </h1>

      </div>

      {/* Navigation */}

      <nav className="flex flex-col py-5 gap-2">

        <NavLink
          to="/admin/dashboard"
          className={linkClass}
        >
          <HiHome size={24} />

          {isOpen && <span>Dashboard</span>}
        </NavLink>

        <NavLink
          to="/admin/managers"
          className={linkClass}
        >
          <HiUsers size={24} />

          {isOpen && <span>Managers</span>}
        </NavLink>

      </nav>

    </aside>

  );

}

export default Sidebar;