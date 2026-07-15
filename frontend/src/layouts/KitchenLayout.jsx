function KitchenLayout({ children }) {

  return (

    <div className="min-h-screen bg-gray-100">

      <header className="bg-white shadow">

        <div className="max-w-7xl mx-auto px-6 py-4">

          <h1 className="text-3xl font-bold text-black-600">

            RMS Kitchen

          </h1>

          <p className="text-gray-500 mt-1">

            Restaurant Kitchen Dashboard

          </p>

        </div>

      </header>

      <main className="max-w-7xl mx-auto p-6">

        {children}

      </main>

    </div>

  );

}

export default KitchenLayout;