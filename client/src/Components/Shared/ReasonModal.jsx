import { useState } from "react";

const ReasonModal = ({ isOpen, onClose, onSubmit, status }) => {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    onSubmit(reason);
    setReason(""); // Reset the reason after submit
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-[#172437] bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-[#172437] p-6 rounded-lg w-[95%] md:w-1/3">
        <h2 className="text-xl font-bold mb-4 capitalize text-white">{`${status} reason`}</h2>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4 bg-slate-400 outline-none"
          placeholder="Enter reason for the status"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-400 text-white py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-red-500 text-white py-2 px-4 rounded"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReasonModal;
