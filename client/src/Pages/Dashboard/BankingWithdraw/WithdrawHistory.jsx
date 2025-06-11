import { IoIosSearch } from "react-icons/io";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  useGetWithdrawsQuery,
  useUpdateWithdrawStatusMutation,
} from "../../../redux/features/allApis/withdrawsApi/withdrawsApi";
import ReasonModal from "../../../Components/Shared/ReasonModal";

const WithdrawHistory = () => {
  const { data: allWithdraws, isLoading, isError } = useGetWithdrawsQuery();
  const [updateWithdrawStatus] = useUpdateWithdrawStatusMutation();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedWithdraw, setSelectedWithdraw] = useState(null);
  const [status, setStatus] = useState("");

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const sortedWithdraws = allWithdraws
    ? [...allWithdraws].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
    : [];
  const totalPages = Math.ceil(sortedWithdraws?.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedWithdraws?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleStatusClick = (withdraw, selectedStatus) => {
    if (selectedStatus === "rejected") {
      setSelectedWithdraw(withdraw);
      setStatus("rejected");
      setModalOpen(true);
    } else {
      // directly update status without reason
      updateWithdrawStatus({
        id: withdraw._id,
        data: {
          status: selectedStatus,
          reason: "",
        },
      })
        .unwrap()
        .then((res) => {
          if (res.modifiedCount > 0) {
            toast.success("Status updated!");
          }
        })
        .catch(() => {
          toast.error("Error updating status");
        });
    }
  };

  const handleSubmit = async (reason) => {
    const statusInfo = {
      id: selectedWithdraw?._id,
      data: {
        status: status,
        reason: reason,
      },
    };
    try {
      const { data } = await updateWithdrawStatus(statusInfo);
      if (data.modifiedCount > 0) {
        toast.success("Status updated!");
        setModalOpen(false);
      }
    } catch (error) {
      toast.error("Error updating status");
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" }); // April
    const year = date.getFullYear();

    const hours = date.getHours();
    const minutes = date.getMinutes();

    // 12-hour format
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // 0 => 12

    const formattedMinutes = minutes.toString().padStart(2, "0");

    // day এর সাথে th/st/nd/rd বসানো
    const getDaySuffix = (day) => {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return `${day}${getDaySuffix(
      day
    )} ${month} ${year} | ${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading withdrawals.</div>;

  return (
    <div>
      <div className="bg-[#172437] flex flex-row items-center justify-between p-4 mb-2">
        <h1 className="text-2xl text-white font-bold">Withdraw History</h1>
        <form className="w-1/2 md:w-1/4 flex flex-row items-center">
          <input
            type="text"
            placeholder="Type Name or Receiver A/C Number..."
            className="py-2 px-1 w-full outline-none"
          />
          <button className="bg-white p-3">
            <IoIosSearch />
          </button>
        </form>
      </div>
      <div className="relative overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg text-sm">
          <thead className="bg-blue-500 text-white text-lg">
            <tr className="text-center border-l border-l-blue-300">
              <th className="p-3 border-r border-r-blue-300">Receiver Name</th>
              <th className="p-3 border-r border-r-blue-300">
                Withdraw Method
              </th>

              <th className="p-3 border-r border-r-blue-300">Amount</th>
              <th className="p-3 border-r border-r-blue-300">
                Receiver Number
              </th>
              <th className="p-3 border-r border-r-blue-300">Date & Time</th>
              <th className="p-3 border-r border-r-blue-300">Status</th>
              <th className="p-3">Reason</th>
            </tr>
          </thead>
          <tbody>
            {currentItems?.map((withdraw) => (
              <tr
                key={withdraw._id}
                className="border-b border-b-blue-300 hover:bg-blue-200 text-center"
              >
                <td className="p-3 border-x border-x-blue-300">
                  {withdraw.userInfo?.username || "N/A"}
                </td>
                <td className="p-3 border-r border-r-blue-300 capitalize">
                  {withdraw.paymentMethod}
                </td>

                <td className="p-3 border-r border-r-blue-300">
                  {withdraw.amount} ৳
                </td>
                <td className="p-3 border-r border-r-blue-300">
                  <div className="space-y-1">
                    {withdraw.userInputs
                      ? Object.entries(withdraw.userInputs).map(
                          ([key, value]) => (
                            <p key={key}>
                              <span className="font-medium capitalize">
                                {key.replace(/([A-Z])/g, " $1")}:
                              </span>{" "}
                              {value || "N/A"}
                            </p>
                          )
                        )
                      : "No data"}
                  </div>
                </td>
                {/* <td className="p-3">
                  <div>
                    <p>
                      <span className="font-medium">
                        {withdraw.userInputs?.withdrawNumber && "Number"}:
                      </span>{" "}
                      {withdraw.userInputs?.withdrawNumber || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">
                        {withdraw.userInputs?.transactionId && "Trnx ID"}:
                      </span>{" "}
                      {withdraw.userInputs?.transactionId || "N/A"}
                    </p>
                  </div>
                </td> */}
                <td className="p-3 border-r border-r-blue-300">
                  {formatDate(withdraw.createdAt)}
                </td>
                <td className="p-3 border-r border-r-blue-300">
                  <select
                    value={withdraw.status}
                    onChange={(e) =>
                      handleStatusClick(withdraw, e.target.value)
                    }
                    className={`px-2 py-1 rounded border text-sm ${
                      withdraw.status === "pending"
                        ? "border-yellow-600 text-yellow-600"
                        : withdraw.status === "completed"
                        ? "border-green-600 text-green-600"
                        : "border-red-600 text-red-600"
                    }`}
                  >
                    <option value="pending" className="text-yellow-600">
                      Pending
                    </option>
                    <option value="completed" className="text-green-600">
                      Completed
                    </option>
                    <option value="rejected" className="text-red-600">
                      Rejected
                    </option>
                  </select>
                </td>

                <td className="p-3 border-r border-r-blue-300">
                  {withdraw.reason || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => paginate(page)}
            className={`px-4 py-2 mx-1 ${
              currentPage === page ? "bg-blue-500 text-white" : "bg-gray-300"
            } rounded`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
      {/* Reason Modal */}
      <ReasonModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        status={status}
      />
    </div>
  );
};
export default WithdrawHistory;
