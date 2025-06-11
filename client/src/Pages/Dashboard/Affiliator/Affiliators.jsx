import { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { Link } from "react-router";
import { BiLogInCircle } from "react-icons/bi";
import { ClipLoader } from "react-spinners";
import {
  useGetAffiliatesQuery,
  useUpdateAffiliateStatusMutation,
} from "../../../redux/features/allApis/usersApi/affiliatesApi";
import { useGetAllCommissionsQuery } from "../../../redux/features/allApis/commissionApi/commissionApi";
import { useGetDepositsQuery } from "../../../redux/features/allApis/depositsApi/depositsApi";
import { useGetWithdrawsQuery } from "../../../redux/features/allApis/withdrawsApi/withdrawsApi";
import TablePagination from "../../../Components/Shared/TablePagination";

const Affiliators = () => {
  const { data: allAffiliatesData, isLoading, error } = useGetAffiliatesQuery();
  const { data: allCommissions } = useGetAllCommissionsQuery();
  const { data: allDeposites } = useGetDepositsQuery();
  const { data: allWithdrawals } = useGetWithdrawsQuery();
  const affiliateDeposits = allDeposites?.reduce((acc, deposit) => {
    if (deposit?.userId) {
      acc[deposit.userId] = (acc[deposit.userId] || 0) + deposit.amount;
    }
    return acc;
  }, {});
  const affiliateWithdrawals = allWithdrawals?.reduce((acc, withdraw) => {
    if (withdraw?.userId) {
      acc[withdraw.userId] = (acc[withdraw.userId] || 0) + withdraw.amount;
    }
    return acc;
  }, {});
  const firstCommission = allCommissions?.[0];
  const secondCommission = allCommissions?.[1];
  const thirdCommission = allCommissions?.[2];

  const [updateStatus] = useUpdateAffiliateStatusMutation();
  const [loadingStates, setLoadingStates] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const [searchQuery, setSearchQuery] = useState("");

  // Filtered affiliates based on search query
  const filteredAffiliates = allAffiliatesData?.filter((affiliate) =>
    affiliate?.username?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  const paginatedAffiliates = filteredAffiliates?.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleStatusUpdate = async (affiliateId, newStatus, email) => {
    setLoadingStates((prev) => ({ ...prev, [affiliateId]: true })); // Set loading for specific affiliate
    try {
      await updateStatus({
        id: affiliateId,
        status: newStatus,
        email: email,
      }).unwrap();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [affiliateId]: false })); // Reset loading
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-[#222222] flex flex-col md:flex-row items-start md:items-center justify-between p-4 mb-2">
        <div className="flex flex-row items-start justify-between w-full mb-4 md:mb-0">
          <h1 className="text-2xl text-white font-bold">Affiliates</h1>
          <button className="bg-yellow-500 hover:bg-yellow-600 transition-all ease-in-out duration-300 text-black py-2 px-4 rounded md:w-1/4 block md:hidden whitespace-nowrap">
            Add
          </button>
        </div>

        <div className="flex w-1/2 gap-4">
          <form className="md:w-3/4 hidden md:flex flex-row items-center">
            <input
              type="text"
              placeholder="search by affiliate username..."
              className="py-2 px-1 w-full outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="bg-white p-3">
              <IoIosSearch />
            </button>
          </form>
          <button
            className="bg-yellow-500 hover:bg-yellow-600 transition-all ease-in-out duration-300 text-black py-2 px-4 rounded md:w-1/4 hidden md:block whitespace-nowrap"
            // onClick={handleAddaffiliate}
          >
            Add
          </button>
        </div>
        <form className="w-full flex flex-row items-center md:hidden">
          <input
            type="text"
            placeholder="search by affiliate username..."
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
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="text-center py-10 text-gray-500">
            Data is loading...
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">
            Failed to load data.
          </div>
        ) : (
          <table className="w-full border-collapse border border-blue-600">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="px-4 py-2 whitespace-nowrap border border-blue-600">
                  UserName
                </th>
                <th className="px-4 py-2 whitespace-nowrap border border-blue-600">
                  Login
                </th>
                <th className="px-4 py-2 whitespace-nowrap border border-blue-600">
                  W-B
                </th>
                <th className="px-4 py-2 whitespace-nowrap border border-blue-600">
                  D-B
                </th>
                <th className="px-4 py-2 whitespace-nowrap border border-blue-600">
                  A-D-C
                </th>
                <th className="px-4 py-2 whitespace-nowrap border border-blue-600">
                  A-S-C
                </th>
                <th className="px-4 py-2 whitespace-nowrap border border-blue-600">
                  Comm..
                </th>
                <th className="px-4 py-2 whitespace-nowrap border border-blue-600">
                  Balance
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
              {paginatedAffiliates?.map((affiliate, index) => (
                <tr
                  key={index}
                  className={`text-center border-b border-blue-600 ${
                    index % 2 === 0 ? "bg-gray-100" : "bg-[#cacaca]"
                  } text-black`}
                >
                  <td className="px-4 py-2 text-blue-500 hover:text-blue-600 whitespace-nowrap">
                    <Link to={`/dashboard/affiliateprofile/${affiliate?._id}`}>
                      {affiliate?.username}
                    </Link>
                  </td>
                  <td className="px-4 py-2 border border-blue-600 text-blue-500 hover:text-blue-600">
                    <Link
                      to={`/dashboard/viewaffiliateprofile/${affiliate?._id}`}
                    >
                      <BiLogInCircle className="cursor-pointer text-2xl" />
                    </Link>
                  </td>
                  <td className="px-4 py-2 border border-blue-600">
                    {Number(
                      affiliateWithdrawals?.[affiliate?._id] || 0
                    ).toLocaleString()}{" "}
                    tk
                  </td>
                  <td className="px-4 py-2 border border-blue-600">
                    {affiliateDeposits?.[affiliate?._id] || "0"} tk
                  </td>
                  <td className="px-4 py-2 border border-blue-600">
                    {secondCommission?.commissionValue || "N/A"} tk
                  </td>
                  <td className="px-4 py-2 border border-blue-600">
                    {thirdCommission?.commissionValue || "N/A"} tk
                  </td>
                  <td className="px-4 py-2 border border-blue-600">
                    {firstCommission?.commissionValue || "N/A"}%
                  </td>
                  <td className="px-4 py-2 border border-blue-600">
                    {affiliate?.balance || "N/A"}
                  </td>
                  <td className="px-4 py-2 border border-blue-600">
                    {loadingStates[affiliate?._id] ? (
                      <ClipLoader size={18} color="#000000" />
                    ) : (
                      <span
                        className={`px-2 py-1 text-white size-20 rounded-2xl ${
                          affiliate?.status?.toLowerCase() === "approve"
                            ? "bg-green-500"
                            : affiliate?.status?.toLowerCase() === "pending"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      >
                        <>
                          {affiliate?.status?.toLowerCase() === "approve"
                            ? "Approved"
                            : affiliate?.status?.toLowerCase() === "pending"
                            ? "Pending"
                            : "Rejected"}
                        </>
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 border border-blue-600">
                    <select
                      name="status"
                      className="px-3 py-1 border border-gray-300 rounded-sm bg-white text-black outline-none hover:border-blue-500 transition-all ease-in-out"
                      onChange={(e) =>
                        handleStatusUpdate(
                          affiliate?._id,
                          e.target.value,
                          affiliate?.email
                        )
                      }
                    >
                      <option value="" className="text-gray-400">
                        Select status
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
              {paginatedAffiliates?.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-gray-500">
                    No affiliates found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
        <TablePagination
          currentPage={currentPage}
          totalItems={filteredAffiliates?.length || 0}
          itemsPerPage={rowsPerPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default Affiliators;
