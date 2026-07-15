import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

function DashboardLayout({ children }) {

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">

      <Sidebar isOpen={isSidebarOpen} />

      <div className="flex flex-col flex-1">

        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;