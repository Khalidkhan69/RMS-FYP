import { Routes, Route, Navigate } from "react-router-dom";

// Auth
import AdminLogin from "../pages/auth/AdminLogin";
import ManagerLogin from "../pages/auth/ManagerLogin";

// Admin
import AdminDashboard from "../pages/admin/Dashboard";
import Managers from "../pages/admin/Managers";

// Manager
import ManagerDashboard from "../pages/manager/Dashboard";
import Tables from "../pages/manager/Tables";
import Categories from "../pages/manager/Categories";
import ManagerMenu from "../pages/manager/Menu";
import Orders from "../pages/manager/Orders";
import BillRequests from "../pages/manager/BillRequests";
import TabletConfiguration from "../pages/manager/TabletConfiguration";

// Kitchen
import KitchenDashboard from "../pages/kitchen/Dashboard";


// Customer
import TabletSetup from "../pages/customer/TabletSetup";
import CurrentOrder from "../pages/customer/CurrentOrder";
import Home from "../pages/customer/Home";
import Menu from "../pages/customer/Menu";
import Cart from "../pages/customer/Cart";

// Protected Routes
import ProtectedRoute from "../components/layout/ProtectedRoute";
import ManagerProtectedRoute from "../components/layout/ManagerProtectedRoute";

export default function AppRoutes() {

  return (

    <Routes>

      <Route
        path="/"
        element={<Navigate to="/customer" replace />}
      />

      {/* Customer */}

      <Route path="/customer" element={<Home />} />
      <Route path="/customer/menu" element={<Menu />} />
      <Route path="/customer/cart" element={<Cart />} />

      {/* Login */}

      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />

      <Route
        path="/manager/login"
        element={<ManagerLogin />}
      />

      {/* Admin */}

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/managers"
        element={
          <ProtectedRoute allowedRole="admin">
            <Managers />
          </ProtectedRoute>
        }
      />

      {/* Manager */}

      <Route
        path="/manager/dashboard"
        element={
          <ManagerProtectedRoute>
            <ManagerDashboard />
          </ManagerProtectedRoute>
        }
      />

      <Route
        path="/manager/tables"
        element={
          <ManagerProtectedRoute>
            <Tables />
          </ManagerProtectedRoute>
        }
      />

      <Route
        path="/manager/categories"
        element={
          <ManagerProtectedRoute>
            <Categories />
          </ManagerProtectedRoute>
        }
      />
      <Route
        path="/manager/menu"
        element={
          <ManagerProtectedRoute>
              <ManagerMenu />
          </ManagerProtectedRoute>
        }
        
      />
      <Route
  path="/manager/orders"
  element={
    <ManagerProtectedRoute>
      <Orders />
    </ManagerProtectedRoute>
  }
/>
  <Route
     path="/manager/bill-requests"
    element={
    <ManagerProtectedRoute>
      <BillRequests />
    </ManagerProtectedRoute>
  }
/>
<Route
  path="/manager/tablet-configuration"
  element={
    <ManagerProtectedRoute>
      <TabletConfiguration />
    </ManagerProtectedRoute>
  }
/>
  {/* Customer */}
    <Route
      path="/customer/order"
      element={<CurrentOrder />}
    />
    <Route
  path="/customer/setup"
  element={<TabletSetup />}
/>

      {/* Kitchen */}

      <Route
  path="/kitchen"
  element={<KitchenDashboard />}
/>
    </Routes>

  );

}