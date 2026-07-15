import { NavLink } from "react-router-dom";
import {
  HiHome,
  HiTable,
  HiViewGrid,
  HiShoppingBag,
  HiClipboardList,
  HiReceiptTax,
  HiDeviceTablet,
} from "react-icons/hi";
function ManagerSidebar({ isOpen }) {

  const linkClass = ({ isActive }) =>
    `flex items-center gap-4 px-6 py-3 rounded-lg mx-3 transition-all duration-300 ${
      isActive
        ? "bg-blue-600 text-white shadow-lg"
        : "text-gray-300 hover:bg-slate-800 hover:text-white"
    }`;

  return (

    <aside
      className={`bg-slate-900 transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >

      {/* Logo */}

      <div className="h-16 flex items-center justify-center border-b border-slate-700">

        <h1
          className={`text-2xl font-bold text-white ${
            isOpen ? "block" : "hidden"
          }`}
        >
          RMS Manager
        </h1>

      </div>

      {/* Navigation */}

      <nav className="flex flex-col gap-2 py-5">

        <NavLink
          to="/manager/dashboard"
          className={linkClass}
        >
          <HiHome size={24} />
          {isOpen && <span>Dashboard</span>}
        </NavLink>

        <NavLink
          to="/manager/tables"
          className={linkClass}
        >
          <HiTable size={24} />
          {isOpen && <span>Tables</span>}
        </NavLink>

        <NavLink
          to="/manager/categories"
          className={linkClass}
        >
          <HiViewGrid size={24} />
          {isOpen && <span>Categories</span>}
        </NavLink>

        <NavLink
          to="/manager/menu"
          className={linkClass}
        >
          <HiShoppingBag size={24} />
          {isOpen && <span>Menu</span>}
        </NavLink>

        <NavLink
          to="/manager/orders"
          className={linkClass}
        >
          <HiClipboardList size={24} />
          {isOpen && <span>Orders</span>}
        </NavLink>
        <NavLink
          to="/manager/bill-requests"
          className={linkClass}
        >
          <HiClipboardList size={24} />
          {isOpen && <span>Bill Requests</span>}
        </NavLink>
        <NavLink
  to="/manager/tablet-configuration"
  className={linkClass}
>
  <HiDeviceTablet size={24} />
  {isOpen && <span>Tablet Configuration</span>}
</NavLink>

      </nav>

    </aside>

  );

}

export default ManagerSidebar;