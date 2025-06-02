const StatsCard = ({ title, count, Icon, bgColor }) => (
  <div
    className={`flex items-center justify-between p-4 rounded-md shadow-md ${bgColor} text-white`}
  >
    <div>
      <p className="text-2xl font-bold">{count}</p>
      <h3 className="text-sm">{title}</h3>
    </div>
    {Icon && <Icon className="text-6xl text-black opacity-15" />}{" "}
    {/* Render the icon dynamically */}
  </div>
);

export default StatsCard;
