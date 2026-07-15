import { NavLink, useLocation } from "react-router-dom";
import {
  HiHome,
  HiMenuAlt2,
  HiShoppingCart,
  HiClipboardList,
} from "react-icons/hi";

function CustomerNavbar() {

  const location = useLocation();

  if (location.pathname === "/customer/setup") {
    return null;
  }

  const navClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-gray-200"
    }`;

  return (

    <header className="bg-white shadow">

      <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">

        <div className="flex items-center gap-2">

          <span className="text-2xl">🍽️</span>

          <h1 className="text-xl font-bold text-black-700">

            RMS Restaurant

          </h1>

        </div>

        <nav className="flex items-center gap-3">

          <NavLink to="/customer" end className={navClass}>
            <div className="flex items-center gap-2">
              <HiHome />
              <span>Home</span>
            </div>
          </NavLink>

          <NavLink to="/customer/menu" className={navClass}>
            <div className="flex items-center gap-2">
              <HiMenuAlt2 />
              <span>Menu</span>
            </div>
          </NavLink>

          <NavLink to="/customer/cart" className={navClass}>
            <div className="flex items-center gap-2">
              <HiShoppingCart />
              <span>Cart</span>
            </div>
          </NavLink>

          <NavLink to="/customer/order" className={navClass}>
            <div className="flex items-center gap-2">
              <HiClipboardList />
              <span>Current Order</span>
            </div>
          </NavLink>

        </nav>

      </div>

    </header>

  );

}

export default CustomerNavbar;