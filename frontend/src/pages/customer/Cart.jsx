import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomerLayout from "../../layouts/CustomerLayout";
import api from "../../services/api";
import toast from "react-hot-toast";
import useTablet from "../../hooks/useTablet";

function Cart() {

  const navigate = useNavigate();

  const {

    tablet,

    loading: tabletLoading,

    error

  } = useTablet();

  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loadingCart, setLoadingCart] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const fetchCart = async () => {

    if (!tablet) return;

    try {

      const response = await api.get(

        `/customer/cart/${tablet.table_number}`

      );

      setCart(response.data.cart);

      setTotalAmount(response.data.total_amount);

    }

    catch (error) {

      console.error(error);

      toast.error(

        error.response?.data?.detail ||

        "Failed to load cart."

      );

    }

    finally {

      setLoadingCart(false);

    }

  };

  useEffect(() => {

    if (tablet) {

      fetchCart();

    }

  }, [tablet]);

  const updateQuantity = async (cartId, quantity) => {

    try {

      await api.put(

        `/customer/cart/update/${cartId}`,

        {

          quantity

        }

      );

      fetchCart();

    }

    catch (error) {

      toast.error(

        error.response?.data?.detail ||

        "Failed to update cart."

      );

    }

  };

  const removeItem = async (cartId) => {

    try {

      const response = await api.delete(

        `/customer/cart/remove/${cartId}`

      );

      toast.success(response.data.message);

      fetchCart();

    }

    catch (error) {

      toast.error(

        error.response?.data?.detail ||

        "Failed to remove item."

      );

    }

  };

  const placeOrder = async () => {

    if (!tablet) {

      toast.error("Tablet configuration not found.");

      return;

    }

    try {

      setPlacingOrder(true);

      const response = await api.post(

        "/customer/place-order",

        {

          table_number: tablet.table_number

        }

      );

      toast.success(response.data.message);

      navigate("/customer/order");

    }

    catch (error) {

      toast.error(

        error.response?.data?.detail ||

        "Failed to place order."

      );

    }

    finally {

      setPlacingOrder(false);

    }

  };

  if (tabletLoading || loadingCart) {

    return (

      <CustomerLayout>

        <div className="text-center py-20">

          Loading Cart...

        </div>

      </CustomerLayout>

    );

  }

  if (error) {

    return (

      <CustomerLayout>

        <div className="text-center py-20 text-red-600">

          {error}

        </div>

      </CustomerLayout>

    );

  }

  return (

    <CustomerLayout>

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-4xl font-bold">

            My Cart

          </h1>

          <p className="text-gray-500 mt-2">

            Table {tablet.table_number}

          </p>

        </div>

      </div>

      {cart.length === 0 ? (

        <div className="bg-white rounded-xl shadow p-10 text-center">

          <h2 className="text-2xl font-semibold">

            Your cart is empty

          </h2>

        </div>

      ) : (

        <>

          <div className="space-y-5">

            {cart.map((item) => (

              <div

                key={item.cart_id}

                className="bg-white rounded-xl shadow p-6 flex justify-between items-center"

              >

                <div>

                  <h2 className="text-xl font-bold">

                    {item.item_name}

                  </h2>

                  <p className="text-gray-500">

                    Rs. {item.price}

                  </p>

                </div>

                <div className="flex items-center gap-4">

                  <button

                    onClick={() =>
                      updateQuantity(
                        item.cart_id,
                        item.quantity - 1
                      )
                    }

                    className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300"

                  >

                    -

                  </button>

                  <span className="text-xl font-bold">

                    {item.quantity}

                  </span>

                  <button

                    onClick={() =>
                      updateQuantity(
                        item.cart_id,
                        item.quantity + 1
                      )
                    }

                    className="w-10 h-10 rounded-lg bg-blue-600 text-white hover:bg-blue-700"

                  >

                    +

                  </button>

                </div>

                <div className="text-right">

                  <h3 className="text-xl font-bold text-green-600">

                    Rs. {item.subtotal}

                  </h3>

                  <button

                    onClick={() => removeItem(item.cart_id)}

                    className="mt-2 text-red-600 hover:underline"

                  >

                    Remove

                  </button>

                </div>

              </div>

            ))}

          </div>

          <div className="bg-white rounded-xl shadow p-6 mt-6">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold">

                Total

              </h2>

              <h2 className="text-2xl font-bold text-blue-600">

                Rs. {totalAmount}

              </h2>

            </div>

            <button

              onClick={placeOrder}

              disabled={placingOrder}

              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold disabled:bg-gray-400"

            >

              {placingOrder

                ? "Placing Order..."

                : "Place Order"}

            </button>

          </div>

        </>

      )}

    </CustomerLayout>

  );

}

export default Cart;