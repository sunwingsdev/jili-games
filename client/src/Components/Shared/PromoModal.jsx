import { IoClose } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
import manImg from "../../assets/gonzo.png";

const PromoModal = ({ isOpen, onClose, onSwitchToSignIn }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
      <div className="relative bg-white rounded-lg w-full max-w-md p-6 text-center">
        {/* Character Image */}
        <div className="absolute -top-24 left-1/2 transform -translate-x-1/2">
          <img
            src={manImg}
            alt="Character"
            className="w-32 h-32 object-contain"
          />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-5 -right-5 w-10 h-10 text-3xl text-white bg-blue-500 rounded-full flex items-center justify-center"
        >
          <IoClose />
        </button>

        <h2 className="text-xl font-semibold mt-10">
          Don&apos;t forget to register!
        </h2>
        <p className="text-gray-600 mb-5">
          As an Jili customer, you&apos;ll get early access to everything you
          need
        </p>

        <ul className="text-left text-sm text-gray-700 space-y-2 mb-4">
          {[
            "Promotion packs",
            "Game previews",
            "Roadmaps & release notes",
            "Integration and implementation guides",
            "Technical documentation",
          ].map((item, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <FaCheckCircle className="text-blue-500" />
              {item}
            </li>
          ))}
        </ul>

        <p className="text-sm text-gray-500">
          Already have an account?{" "}
          <span
            onClick={() => {
              onClose();
              onSwitchToSignIn();
            }}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
};

export default PromoModal;
