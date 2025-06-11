import { useState } from "react";
import toast from "react-hot-toast";
import {
  useGetDepositsQuery,
  useUpdateDepositStatusMutation,
} from "../../../redux/features/allApis/depositsApi/depositsApi";
import ReasonModal from "../../../Components/Shared/ReasonModal";

const DepositHistory = () => {
  const { data: allDeposits, isLoading, isError } = useGetDepositsQuery();
  const [updateStatus] = useUpdateDepositStatusMutation();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [status, setStatus] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8); // Number of items per page

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Sort state
  const [sortOrder, setSortOrder] = useState("latest"); // 'latest' or 'oldest'

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading deposits.</div>;

  // Handle status update
  const handleStatusClick = (deposit, selectedStatus) => {
    if (selectedStatus === "rejected") {
      setSelectedDeposit(deposit);
      setStatus("rejected");
      setModalOpen(true);
    } else {
      // directly update status without reason
      updateStatus({
        id: deposit._id,
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
      id: selectedDeposit?._id,
      data: {
        status: status,
        reason: reason,
      },
    };
    try {
      const res = await updateStatus(statusInfo).unwrap();
      console.log(res);
      if (res.modifiedCount > 0) {
        toast.success("Status updated!");
        setModalOpen(false);
      }
    } catch (error) {
      toast.error(error || "Error updating status");
    }
  };

  // Sort deposits based on createdAt
  const sortedDeposits = [...(allDeposits || [])].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
  });

  // Filter deposits based on search query
  const filteredDeposits = sortedDeposits?.filter((deposit) => {
    const username = deposit?.userInfo?.username?.toLowerCase() || "";
    const accountNumber = deposit?.accountNumber?.toLowerCase() || "";
    return (
      username.includes(searchQuery.toLowerCase()) ||
      accountNumber.includes(searchQuery.toLowerCase())
    );
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDeposits?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredDeposits?.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle sort order change
  const handleSortChange = (order) => {
    setSortOrder(order);
    setCurrentPage(1); // Reset to the first page when sorting changes
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

  return (
    <div>
      <div className="bg-[#172437] flex flex-row items-center justify-between p-4 mb-2">
        <h1 className="text-2xl text-white font-bold">Deposit History</h1>
        <div className="flex items-center gap-4">
          <form className="w-1/2 md:w-1/2 flex flex-row items-center">
            <input
              type="text"
              placeholder="Type User Name or Account Number..."
              className="py-2 px-1 w-full outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <div className="flex items-center gap-2">
            <label className="text-white">Sort by:</label>
            <select
              value={sortOrder}
              onChange={(e) => handleSortChange(e.target.value)}
              className="py-2 px-2 rounded"
            >
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg text-sm">
          <thead className="bg-blue-500 text-center text-white text-lg">
            <tr className="border border-blue-300">
              <th className="p-3 border-r border-r-blue-300">Sender Name</th>
              <th className="p-3 border-r border-r-blue-300">Deposit Method</th>
              <th className="p-3 border-r border-r-blue-300">Channel</th>
              <th className="p-3 border-r border-r-blue-300">Amount</th>
              <th className="p-3 border-r border-r-blue-300">Sender Info</th>
              <th className="p-3 border-r border-r-blue-300">Date & Time</th>
              <th className="p-3 border-r border-r-blue-300">Status</th>
              <th className="p-3 border-r border-r-blue-300">Reason</th>
              <th className="p-3">Promotion</th>
            </tr>
          </thead>
          <tbody>
            {currentItems?.map((deposit) => (
              <tr
                key={deposit._id}
                className="border-b border-b-blue-300 hover:bg-blue-200 text-center border border-blue-300"
              >
                <td className="p-3 border-r border-r-blue-300">
                  {deposit.userInfo?.username || "N/A"}
                </td>
                <td className="p-3 border-r border-r-blue-300 capitalize">
                  {deposit.paymentMethod}
                </td>
                <td className="p-3 border-r border-r-blue-300 capitalize">
                  {deposit.depositChannel}
                </td>
                <td className="p-3 border-r border-r-blue-300">
                  {deposit.amount} ৳
                </td>
                <td className="p-3 border-r border-r-blue-300">
                  <div className="space-y-1">
                    {deposit.userInputs
                      ? Object.entries(deposit.userInputs).map(
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
                <td className="p-3 border-r border-r-blue-300">
                  {formatDate(deposit.createdAt)}
                </td>
                <td className="p-3 border-r border-r-blue-300">
                  <select
                    value={deposit.status}
                    onChange={(e) => handleStatusClick(deposit, e.target.value)}
                    className={`px-2 py-1 rounded border text-sm ${
                      deposit.status === "pending"
                        ? "border-yellow-600 text-yellow-600"
                        : deposit.status === "completed"
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
                  {deposit.reason || "N/A"}
                </td>

                <td className="p-3 text-center">
                  {deposit.promotion ? (
                    <div>{deposit.promotion.title}</div>
                  ) : (
                    "N/A"
                  )}
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

      <ReasonModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        status={status}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default DepositHistory;
