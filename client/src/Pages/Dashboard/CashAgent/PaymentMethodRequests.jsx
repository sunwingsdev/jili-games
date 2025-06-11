import { ClipLoader } from "react-spinners";
import { Link } from "react-router";
import { IoIosSearch } from "react-icons/io";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  useGetAllPaymentNumbersQuery,
  useUpdatePaymentNumberStatusMutation,
} from "../../../redux/features/allApis/paymentNumberApi/paymentNumberApi";
import TablePagination from "../../../Components/Shared/TablePagination";

const PaymentMethodRequests = () => {
  const {
    data: allPaymentNumbers,
    isLoading,
    error,
  } = useGetAllPaymentNumbersQuery();

  const [updatePaymentNumberStatus, { isLoading: isPaymentNumberLoading }] =
    useUpdatePaymentNumberStatusMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNumbers = allPaymentNumbers
    ?.filter((payNum) => payNum?.channel !== "apay")
    ?.filter((payNum) =>
      payNum?.userInfo?.username
        ?.toLowerCase()
        ?.includes(searchQuery?.toLowerCase())
    );

  const paginatedNumbers = filteredNumbers?.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const formattedDate = (date) => {
    if (!date) return "N/A";

    const d = new Date(date);
    const options = { year: "numeric", month: "short", day: "numeric" };

    return d.toLocaleDateString("en-US", options);
  };

  const handlePaymentNumberStatus = async (numberId, newStatus) => {
    if (!newStatus) return;

    try {
      const response = await updatePaymentNumberStatus({
        id: numberId,
        status: newStatus,
      });

      if (response?.data?.message) {
        toast.success(response.data.message);
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error(error || "An error occurred while updating the status.");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-[#222222] flex flex-col md:flex-row items-start md:items-center justify-between p-4 mb-2">
        <div className="flex flex-row items-start justify-between w-full mb-4 md:mb-0">
          <h1 className="text-2xl text-white font-bold">
            Payment Method Add Requests
          </h1>
        </div>

        <div className="flex w-1/2 gap-4">
          <form className="w-full hidden md:flex flex-row items-center">
            <input
              type="text"
              placeholder="Search by Agent UserName..."
              className="py-2 px-1 w-full outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="bg-white p-3">
              <IoIosSearch />
            </button>
          </form>
        </div>
        <form className="w-full flex flex-row items-center md:hidden">
          <input
            type="text"
            placeholder="Search by Agent UserName..."
            className="py-2 px-1 w-full outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="bg-white p-3">
            <IoIosSearch />
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="">
        {isLoading ? (
          <div className="text-center py-10 text-gray-500">
            Data is loading...
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">
            Failed to load data.
          </div>
        ) : (
          <div className="overflow-x-scroll">
            <table className="w-full border-collapse border border-blue-600">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="px-4 py-2 whitespace-nowrap border border-blue-600">
                    Agent UserName
                  </th>
                  <th className="px-4 py-2 whitespace-nowrap border border-blue-600">
                    Request Date
                  </th>
                  <th className="px-4 py-2 whitespace-nowrap border border-blue-600">
                    Approval Date
                  </th>
                  <th className="px-4 py-2 whitespace-nowrap border border-blue-600">
                    Number
                  </th>
                  <th className="px-4 py-2 whitespace-nowrap border border-blue-600">
                    Method
                  </th>

                  <th className="px-4 py-2 whitespace-nowrap border border-blue-600">
                    Category
                  </th>

                  <th className="px-4 py-2 whitespace-nowrap border border-blue-600">
                    Status
                  </th>
                  <th className="px-4 py-2 whitespace-nowrap border border-blue-600">
                    Update Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedNumbers?.map((payNum, index) => (
                  <tr
                    key={index}
                    className={`text-center border-b border-blue-600 ${
                      index % 2 === 0 ? "bg-gray-100" : "bg-[#cacaca]"
                    } text-black`}
                  >
                    <td className="px-4 py-2 border border-blue-600 text-blue-500 hover:text-blue-600 whitespace-nowrap">
                      <Link
                        to={`/dashboard/agentprofile/${payNum?.userInfo?._id}`}
                      >
                        {payNum?.userInfo?.username}
                      </Link>
                    </td>
                    <td className="px-4 py-2 border border-blue-600 whitespace-nowrap">
                      {formattedDate(payNum?.createdAt) || "N/A"}
                    </td>
                    <td className="px-4 py-2 border border-blue-600 whitespace-nowrap">
                      {formattedDate(payNum?.updatedAt) || "N/A"}
                    </td>
                    <td className="px-4 py-2 border border-blue-600 whitespace-nowrap">
                      {payNum?.paymentNumber}
                    </td>

                    <td className="px-4 py-2 border border-blue-600 whitespace-nowrap">
                      {payNum?.paymentNumberMethod}
                    </td>

                    <td className="px-4 py-2 border border-blue-600 whitespace-nowrap">
                      {payNum?.numberCategory}
                    </td>

                    <td className="px-4 py-2 border border-blue-600">
                      {isPaymentNumberLoading ? (
                        <ClipLoader size={18} color="#000000" />
                      ) : (
                        <span
                          className={`px-2 py-1 text-white size-20 rounded-2xl ${
                            payNum?.status?.toLowerCase() === "approve"
                              ? "bg-green-500"
                              : payNum?.status?.toLowerCase() === "reject"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                          }`}
                        >
                          {payNum?.status?.toLowerCase() === "approve"
                            ? "Approved"
                            : payNum?.status?.toLowerCase() === "pending"
                            ? "Pending"
                            : "Rejected"}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2 border border-blue-600">
                      <select
                        name="status"
                        className="px-3 py-1 border border-gray-300 rounded-sm bg-white text-black outline-none hover:border-blue-500 transition-all ease-in-out"
                        onChange={(e) =>
                          handlePaymentNumberStatus(payNum._id, e.target.value)
                        }
                      >
                        <option value="" className="text-gray-400">
                          Select Status
                        </option>
                        <option value="approve" className="text-green-500">
                          Approve
                        </option>
                        <option value="reject" className="text-red-500">
                          Reject
                        </option>
                      </select>
                    </td>
                  </tr>
                ))}
                {paginatedNumbers?.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center py-4 text-gray-500">
                      No payment request data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      <TablePagination
        totalItems={filteredNumbers?.length || 0}
        itemsPerPage={rowsPerPage}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default PaymentMethodRequests;
