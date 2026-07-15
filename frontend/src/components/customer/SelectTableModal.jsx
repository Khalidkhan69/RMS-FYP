import { useState } from "react";
import toast from "react-hot-toast";

function SelectTableModal({ isOpen, onClose }) {

  const [tableNumber, setTableNumber] = useState("");

  if (!isOpen) {
    return null;
  }

  const handleContinue = () => {

    if (!tableNumber) {
      toast.error("Please select a table.");
      return;
    }

    localStorage.setItem("tableNumber", tableNumber);

    toast.success(`Table ${tableNumber} selected.`);

    onClose();

  };

  return (

    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">

      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">

        <div className="border-b p-6">

          <h2 className="text-2xl font-bold">
            Select Your Table
          </h2>

          <p className="text-gray-500 mt-2">
            Please select your table before ordering.
          </p>

        </div>

        <div className="p-6">

          <label className="block mb-2 font-medium">
            Table Number
          </label>

          <select

            value={tableNumber}

            onChange={(e) => setTableNumber(e.target.value)}

            className="w-full border rounded-lg px-4 py-3"

          >

            <option value="">
              Select Table
            </option>

            {Array.from({ length: 20 }, (_, index) => (

              <option
                key={index + 1}
                value={index + 1}
              >

                Table {index + 1}

              </option>

            ))}

          </select>

        </div>

        <div className="border-t p-6 flex justify-end">

          <button

            onClick={handleContinue}

            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"

          >

            Continue

          </button>

        </div>

      </div>

    </div>

  );

}

export default SelectTableModal;