function AnalyticsCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-5">

      <h3 className="text-gray-500 text-sm font-medium">
        {title}
      </h3>

      <p className="text-2xl font-bold text-blue-600 mt-3">
        {value}
      </p>

    </div>
  );
}

export default AnalyticsCard;