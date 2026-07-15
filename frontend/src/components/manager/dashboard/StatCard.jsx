import {
  HiOutlineViewGrid,
  HiOutlineClipboardList,
  HiOutlineCollection,
  HiOutlineCheckCircle,
} from "react-icons/hi";

function StatCard({
  title,
  value,
  color,
  icon
}) {

  const icons = {
    table: <HiOutlineViewGrid size={34} />,
    order: <HiOutlineClipboardList size={34} />,
    menu: <HiOutlineCollection size={34} />,
    success: <HiOutlineCheckCircle size={34} />,
  };

  return (

    <div
      className={`rounded-2xl shadow-md p-6 text-white transition duration-300 hover:scale-105 hover:shadow-xl ${color}`}
    >

      <div className="flex justify-between items-center">

        <div>

          <p className="text-sm opacity-90">
            {title}
          </p>

          <h2 className="text-4xl font-bold mt-3">
            {value}
          </h2>

        </div>

        <div className="opacity-90">
          {icons[icon]}
        </div>

      </div>

    </div>

  );

}

export default StatCard;