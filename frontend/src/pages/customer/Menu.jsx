import { useEffect, useState } from "react";
import CustomerLayout from "../../layouts/CustomerLayout";
import api from "../../services/api";
import AddToCartModal from "../../components/cart/AddToCartModal";
import useTablet from "../../hooks/useTablet";

function Menu() {

  const [menu, setMenu] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(true);

  const [showCartModal, setShowCartModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const {
    tablet,
    loading: loadingTablet
  } = useTablet();

  const fetchMenu = async () => {

    try {

      const response = await api.get("/customer/menu");

      setMenu(response.data.menu);

    }

    catch (error) {

      console.error(error);

    }

    finally {

      setLoadingMenu(false);

    }

  };

  useEffect(() => {

    fetchMenu();

  }, []);

  const handleAddToCart = (item) => {

    if (!tablet) return;

    setSelectedItem(item);

    setShowCartModal(true);

  };

  if (loadingTablet || loadingMenu) {

    return (

      <CustomerLayout>

        <div className="text-center py-20">

          Loading...

        </div>

      </CustomerLayout>

    );

  }

  return (

    <CustomerLayout>

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-4xl font-bold">

            Our Menu

          </h1>

          <p className="text-gray-500 mt-2">

            Table {tablet.table_number}

          </p>

        </div>

        <div className="text-gray-600 font-medium">

          Total Items: {menu.length}

        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        {menu.map((item) => (

          <div

            key={item.id}

            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition"

          >

            <img

              src={item.image}

              alt={item.name}

              className="w-full h-56 object-cover"

            />

            <div className="p-6">

              <div className="flex justify-between items-start">

                <h2 className="text-2xl font-bold">

                  {item.name}

                </h2>

                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">

                  {item.category_name}

                </span>

              </div>

              <p className="text-gray-600 mt-3">

                {item.description}

              </p>

              <div className="flex justify-between items-center mt-6">

                <h3 className="text-2xl font-bold text-green-600">

                  Rs. {item.price}

                </h3>

                <button

                  onClick={() => handleAddToCart(item)}

                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"

                >

                  Add to Cart

                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

      <AddToCartModal

        isOpen={showCartModal}

        onClose={() => setShowCartModal(false)}

        selectedItem={selectedItem}

      />

    </CustomerLayout>

  );

}

export default Menu;