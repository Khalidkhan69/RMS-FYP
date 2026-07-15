function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow-md border-l-4 border-blue-600 p-5">

      <h3 className="text-gray-500 text-sm font-medium">
        {title}
      </h3>

      <p className="text-3xl font-bold mt-3">
        {value}
      </p>

    </div>
  );
}

export default StatCard;