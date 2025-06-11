import { FaTrash } from "react-icons/fa";

const PromotionOfferCard = ({ offer, hidden, handleDeleteButtonClick }) => {
  const { image, title, subtitle } = offer;
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden relative transition-transform hover:scale-[1.02] duration-300 border border-green-400">
      {hidden && (
        <div
          onClick={() => handleDeleteButtonClick(offer)}
          className="absolute top-3 right-3 p-2 group rounded-full bg-red-500 hover:bg-white duration-200 cursor-pointer shadow-md"
        >
          <FaTrash className="text-white group-hover:text-red-500 text-lg" />
        </div>
      )}

      <img
        className={`w-full object-cover ${
          !hidden ? "max-h-48" : "max-h-36"
        } transition-all duration-300`}
        src={`${import.meta.env.VITE_BASE_API_URL}${image}`}
        alt={title}
      />

      <div className="bg-gradient-to-br from-green-600 to-green-700 px-4 pb-4 pt-5">
        <div className="relative mb-4">
          <div className="absolute -top-3 w-full h-3 border-gray-400"></div>
        </div>

        <h2 className="text-xl font-semibold text-white border-l-4 border-yellow-400 pl-3 mb-2">
          {title}
        </h2>
        <p className="text-sm text-white mb-4 pl-5">{subtitle}</p>

        {!hidden && (
          <div className="flex items-center gap-3">
            <button className="flex-1 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-md shadow transition duration-300">
              Apply Now
            </button>
            <button className="flex-1 py-2 bg-white hover:bg-gray-100 text-green-700 font-medium border border-green-400 rounded-md transition duration-300">
              Detail
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotionOfferCard;
