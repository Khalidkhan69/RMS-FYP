function LeastSellingItems({ items }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-xl font-semibold mb-6">
        📉 Least Selling Items
      </h2>

      <div className="space-y-4">

        {items.slice(0, 5).map((item, index) => (

          <div
            key={index}
            className="flex justify-between items-center border-b pb-3"
          >

            <div>

              <p className="font-semibold">
                {index + 1}. {item.item_name}
              </p>

              <p className="text-sm text-gray-500">
                Revenue: Rs. {item.total_revenue}
              </p>

            </div>

            <span className="font-bold text-red-600">
              {item.total_quantity_sold}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}

export default LeastSellingItems;