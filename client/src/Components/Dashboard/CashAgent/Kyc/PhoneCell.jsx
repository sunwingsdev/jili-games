import toast from "react-hot-toast";
import { IoCopyOutline } from "react-icons/io5";

const PhoneCell = ({ phone }) => {
  const formatPhoneForDisplay = (phone) => {
    if (!phone) return "N/A";
    return `0${phone}`.slice(0, 5) + "...";
  };

  const handleCopyPhone = () => {
    if (phone) {
      const formattedPhone = `0${phone}`;
      navigator.clipboard.writeText(formattedPhone);

      toast.success("Phone number copied to clipboard!");
    }
  };

  return (
    <td
      title={phone ? `0${phone}` : "N/A"}
      className="px-4 py-2 border border-blue-600 cursor-pointer"
    >
      <div className="flex flex-row items-center">
        <span>{formatPhoneForDisplay(phone)}</span>
        {phone && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopyPhone();
            }}
            className="ml-2 text-blue-500 underline"
            title="Copy phone number"
          >
            <IoCopyOutline />
          </button>
        )}
      </div>
    </td>
  );
};

export default PhoneCell;
