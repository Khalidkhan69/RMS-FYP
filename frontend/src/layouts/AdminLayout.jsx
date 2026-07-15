function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Temporary Navbar */}
      <div className="h-16 bg-blue-700 text-white flex items-center px-6 text-xl font-semibold">
        Admin Panel
      </div>

      {/* Temporary Content */}
      <div className="p-6">
        {children}
      </div>

    </div>
  );
}

export default AdminLayout;