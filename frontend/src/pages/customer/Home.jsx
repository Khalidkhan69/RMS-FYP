import { useNavigate } from "react-router-dom";
import CustomerLayout from "../../layouts/CustomerLayout";

function Home() {

  const navigate = useNavigate();

  return (

    <CustomerLayout>

      {/* Hero Section */}

      <div className="bg-gradient-to-r from-blue-500 to-indigo-700 text-white rounded-2xl p-12">

        <h1 className="text-5xl font-bold">

          Welcome to RMS Restaurant

        </h1>

        <p className="mt-5 text-lg text-blue-100">

          Fresh food, fast service and an unforgettable dining experience.

        </p>

        <button

          onClick={() => navigate("/customer/menu")}

          className="mt-8 bg-white text-blue-700 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100"

        >

          Browse Menu

        </button>

      </div>

      {/* Categories */}

      <div className="mt-12">

        <h2 className="text-3xl font-bold mb-6">

          Popular Categories

        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          <div className="bg-white rounded-xl shadow p-6 text-center">

            <div className="text-5xl">🍔</div>

            <h3 className="mt-3 font-semibold">

              Burgers

            </h3>

          </div>

          <div className="bg-white rounded-xl shadow p-6 text-center">

            <div className="text-5xl">🍕</div>

            <h3 className="mt-3 font-semibold">

              Pizza

            </h3>

          </div>

          <div className="bg-white rounded-xl shadow p-6 text-center">

            <div className="text-5xl">🥤</div>

            <h3 className="mt-3 font-semibold">

              Drinks

            </h3>

          </div>

          <div className="bg-white rounded-xl shadow p-6 text-center">

            <div className="text-5xl">🍰</div>

            <h3 className="mt-3 font-semibold">

              Desserts

            </h3>

          </div>

        </div>

      </div>

      {/* Features */}

      <div className="mt-14">

        <h2 className="text-3xl font-bold mb-6">

          Why Choose Us?

        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          <div className="bg-white rounded-xl shadow p-6">

            ✅ Fresh Ingredients

          </div>

          <div className="bg-white rounded-xl shadow p-6">

            ⚡ Fast Service

          </div>

          <div className="bg-white rounded-xl shadow p-6">

            ⭐ Premium Quality

          </div>

          <div className="bg-white rounded-xl shadow p-6">

            💰 Affordable Prices

          </div>

        </div>

      </div>

    </CustomerLayout>

  );

}

export default Home;