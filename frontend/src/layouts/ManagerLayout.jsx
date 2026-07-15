import { useState } from "react";
import ManagerNavbar from "../components/manager/ManagerNavbar";
import ManagerSidebar from "../components/manager/ManagerSidebar";

function ManagerLayout({ children }) {

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">

      <ManagerSidebar isOpen={isSidebarOpen} />

      <div className="flex flex-col flex-1">

        <ManagerNavbar
          toggleSidebar={() =>
            setIsSidebarOpen(!isSidebarOpen)
          }
        />

        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>

      </div>

    </div>
  );
}

export default ManagerLayout;