import { useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import useTablet from "../../hooks/useTablet";

function AddToCartModal({

  isOpen,

  onClose,

  selectedItem

}) {

  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(false);

  const {

    tablet,

    loading: tabletLoading,

    error

  } = useTablet();

  if (!isOpen || !selectedItem) {

    return null;

  }

  const handleAddToCart = async () => {

    if (!tablet) {

      toast.error("Tablet configuration not found.");

      return;

    }

    try {

      setLoading(true);

      const response = await api.post(

        "/customer/cart/add",

        {

          table_number: tablet.table_number,

          menu_id: selectedItem.id,

          quantity: quantity

        }

      );

      toast.success(

        response.data.message

      );

      setQuantity(1);

      onClose();

    }

    catch (error) {

      toast.error(

        error.response?.data?.detail ||

        "Failed to add item to cart."

      );

    }

    finally {

      setLoading(false);

    }

  };

  return (

    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">

      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">

        <div className="border-b p-6">

          <h2 className="text-2xl font-bold">

            Add To Cart

          </h2>

        </div>

        <div className="p-6">

          {tabletLoading ? (

            <div className="text-center py-6">

              Loading tablet...

            </div>

          ) : error ? (

            <div className="text-center text-red-600 py-6">

              {error}

            </div>

          ) : (

            <>

              <div className="mb-5">

                <label className="block mb-2 font-medium">

                  Item

                </label>

                <input

                  type="text"

                  value={selectedItem.name}

                  disabled

                  className="w-full border rounded-lg px-4 py-3 bg-gray-100"

                />

              </div>

              <div className="mb-5">

                <label className="block mb-2 font-medium">

                  Table

                </label>

                <input

                  type="text"

                  value={`Table ${tablet.table_number}`}

                  disabled

                  className="w-full border rounded-lg px-4 py-3 bg-gray-100"

                />

              </div>

              <div>

                <label className="block mb-2 font-medium">

                  Quantity

                </label>

                <div className="flex items-center gap-4">

                  <button

                    onClick={() =>
                      quantity > 1 &&
                      setQuantity(quantity - 1)
                    }

                    className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300"

                  >

                    -

                  </button>

                  <span className="text-xl font-semibold">

                    {quantity}

                  </span>

                  <button

                    onClick={() =>
                      setQuantity(quantity + 1)
                    }

                    className="w-10 h-10 rounded-lg bg-blue-600 text-white hover:bg-blue-700"

                  >

                    +

                  </button>

                </div>

              </div>

            </>

          )}

        </div>

        <div className="border-t p-6 flex justify-end gap-3">

          <button

            onClick={onClose}

            disabled={loading}

            className="px-5 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"

          >

            Cancel

          </button>

          <button

            onClick={handleAddToCart}

            disabled={loading || tabletLoading || !tablet}

            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400"

          >

            {loading ? "Adding..." : "Add To Cart"}

          </button>

        </div>

      </div>

    </div>

  );

}

export default AddToCartModal;