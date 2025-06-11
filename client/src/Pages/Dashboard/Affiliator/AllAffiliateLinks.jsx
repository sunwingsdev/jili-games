import { IoIosSearch } from "react-icons/io";
import { useState } from "react";
import { Link } from "react-router";
import { ClipLoader } from "react-spinners";
import { GiCheckMark } from "react-icons/gi";
import { FaRegCopy } from "react-icons/fa";

import toast from "react-hot-toast";
import { useGetAllReferCodesQuery } from "../../../redux/features/allApis/referCodesApi/referCodesApi";
import { useUpdateAffiliateStatusMutation } from "../../../redux/features/allApis/usersApi/affiliatesApi";
import TablePagination from "../../../Components/Shared/TablePagination";

const AllAffiliateLinks = () => {
  const { data: allReferLinks, isLoading, error } = useGetAllReferCodesQuery();

  const [updateStatus] = useUpdateAffiliateStatusMutation();
  const [loadingStates, setLoadingStates] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [copied, setCopied] = useState(null);
  const rowsPerPage = 10;

  const [searchQuery, setSearchQuery] = useState("");

  // Filtered links based on search query
  const filteredReferLinks = allReferLinks?.filter((referLink) =>
    referLink?.userInfo?.username
      ?.toLowerCase()
      ?.includes(searchQuery?.toLowerCase())
  );

  const paginatedReferLinks = filteredReferLinks?.slice(
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

  // Function to copy the referral code or link to clipboard
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(text);

    // Show success toast for copying
    toast.success("Link copied to clipboard!");

    setTimeout(() => setCopied(null), 2000);
  };
  return (
    <div>
      {/* Header */}
      <div className="bg-[#222222] flex flex-col md:flex-row items-start md:items-center justify-between p-4 mb-2">
        <div className="flex flex-row items-start justify-between w-full mb-4 md:mb-0">
          <h1 className="text-2xl text-white font-bold">All Affiliate Links</h1>
        </div>

        <div className="flex w-1/2 gap-4">
          <form className="md:w-full hidden md:flex flex-row items-center">
            <input
              type="text"
              placeholder="search by affiliate username..."
              className="py-2 px-1 w-full outline-none"
              //   value={searchQuery}
              //   onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="bg-white p-3">
              <IoIosSearch />
            </button>
          </form>
        </div>
        <form className="w-full flex flex-row items-center md:hidden">
          <input
            type="text"
            placeholder="search by affiliate username..."
            className="py-2 px-1 w-full outline-none"
            // value={searchQuery}
            // onChange={(e) => setSearchQuery(e.target.value)}
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
                {/* <th className="px-4 py-2 whitespace-nowrap border border-blue-600">
                  Login
                </th> */}
                <th className="px-4 py-2 whitespace-nowrap border border-blue-600">
                  Refer Link
                </th>
                <th className="px-4 py-2 whitespace-nowrap border border-blue-600">
                  Refer Code
                </th>
                {/* <th className="px-4 py-2 whitespace-nowrap border border-blue-600">
                  A-D-C
                </th>
                <th className="px-4 py-2 whitespace-nowrap border border-blue-600">
                  A-W-C
                </th> */}
                {/* <th className="px-4 py-2 whitespace-nowrap border border-blue-600">
                  Commission
                </th> */}
                <th className="px-4 py-2 whitespace-nowrap border border-blue-600">
                  Status
                </th>
                <th className="px-4 py-2 whitespace-nowrap border border-blue-600">
                  Update Status
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedReferLinks?.map((referLink, index) => (
                <tr
                  key={index}
                  className={`text-center border-b border-blue-600 ${
                    index % 2 === 0 ? "bg-gray-100" : "bg-[#cacaca]"
                  } text-black`}
                >
                  <td className="px-4 py-2 text-blue-500 hover:text-blue-600 whitespace-nowrap">
                    <Link to={`/dashboard/affiliateprofile/${referLink?._id}`}>
                      {referLink?.userInfo?.username}
                    </Link>
                  </td>
                  {/* <td className="px-4 py-2 border border-blue-600 text-blue-500 hover:text-blue-600">
                    <Link
                      to={`/dashboard/viewaffiliateprofile/${referLink?._id}`}
                    >
                      <BiLogInCircle className="cursor-pointer text-2xl" />
                    </Link>
                  </td> */}
                  <td className="px-4 py-2 border border-blue-600">
                    {referLink?.referralLink || "N/A"}
                    <button
                      onClick={() => handleCopy(referLink.referralLink)}
                      className="ml-2 px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                      {copied === referLink.referralLink ? (
                        <GiCheckMark title="Copied" />
                      ) : (
                        <FaRegCopy title="Copy" />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-2 border border-blue-600">
                    {referLink?.referralCode || "N/A"}
                    <button
                      onClick={() => handleCopy(referLink.referralCode)}
                      className="ml-2 px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                      {copied === referLink.referralCode ? (
                        <GiCheckMark title="Copied" />
                      ) : (
                        <FaRegCopy title="Copy" />
                      )}
                    </button>
                  </td>
                  {/* <td className="px-4 py-2 border border-blue-600">
                    {referLink?.A_U_C || "N/A"}
                  </td>
                  <td className="px-4 py-2 border border-blue-600">
                    {referLink?.A_D_C || "N/A"}
                  </td> */}
                  {/* <td className="px-4 py-2 border border-blue-600">
                    {referLink?.balance || "N/A"}
                  </td> */}
                  <td className="px-4 py-2 border border-blue-600">
                    {loadingStates[referLink?._id] ? (
                      <ClipLoader size={18} color="#000000" />
                    ) : (
                      <span
                        className={`px-2 py-1 text-white size-20 rounded-2xl ${
                          referLink?.status?.toLowerCase() === "approve"
                            ? "bg-green-500"
                            : referLink?.status?.toLowerCase() === "pending"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      >
                        <>
                          {referLink?.status?.toLowerCase() === "approve"
                            ? "Approved"
                            : referLink?.status?.toLowerCase() === "pending"
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
                          referLink?._id,
                          e.target.value,
                          referLink?.email
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
              {paginatedReferLinks?.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-gray-500">
                    No links found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
        <TablePagination
          currentPage={currentPage}
          totalItems={filteredReferLinks?.length || 0}
          itemsPerPage={rowsPerPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default AllAffiliateLinks;
