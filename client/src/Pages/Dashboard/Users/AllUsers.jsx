import { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { Link } from "react-router";
import moment from "moment";
import { useGetUsersQuery } from "../../../redux/features/allApis/usersApi/usersApi";
import TablePagination from "../../../Components/Shared/TablePagination";

const AllUsers = () => {
  const { data: usersData, isLoading, error } = useGetUsersQuery();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Filtered users based on search query
  const filteredUsers = usersData
    ?.filter((user) => user.role === "user")
    ?.filter(
      (user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.phone &&
          user.phone.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.email &&
          user.email.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const paginatedUsers = filteredUsers?.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div>
      {/* Header */}
      <div className="bg-[#222222] flex flex-col md:flex-row items-start md:items-center justify-between p-4 mb-2">
        <div className="flex flex-row items-start justify-between w-full mb-4 md:mb-0">
          <h1 className="text-2xl text-white font-bold">All Users</h1>
          <button className="bg-yellow-500 hover:bg-yellow-600 transition-all ease-in-out duration-300 text-black py-2 px-4 rounded md:w-1/4 block md:hidden">
            Add User
          </button>
        </div>

        <div className="flex w-1/2 gap-4">
          <form className="md:w-3/4 hidden md:flex flex-row items-center">
            <input
              type="text"
              placeholder="Type Username / Phone / Email..."
              className="py-2 px-1 w-full outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="bg-white p-3">
              <IoIosSearch />
            </button>
          </form>
          <button className="bg-yellow-500 hover:bg-yellow-600 transition-all ease-in-out duration-300 text-black py-2 px-4 rounded md:w-1/4 hidden md:block">
            Add User
          </button>
        </div>

        <form className="w-full flex flex-row items-center md:hidden">
          <input
            type="text"
            placeholder="Type Username or Phone Number or Email..."
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
          <table className="w-full border-collapse border border-blue-600 text-center">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="px-4 py-2 whitespace-nowrap border border-blue-600">
                  Username
                </th>
                <th className="px-4 py-2 whitespace-nowrap border border-blue-600">
                  Phone
                </th>
                <th className="px-4 py-2 whitespace-nowrap border border-blue-600">
                  Email
                </th>
                <th className="px-4 py-2 whitespace-nowrap border border-blue-600">
                  Joined At
                </th>
                <th className="px-4 py-2 whitespace-nowrap border border-blue-600">
                  Last Login
                </th>
                <th className="px-4 py-2 whitespace-nowrap border border-blue-600">
                  Balance
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers?.map((user, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-gray-100" : "bg-[#cacaca]"
                  } text-black`}
                >
                  <td className="px-4 py-2 whitespace-nowrap text-blue-500 hover:text-blue-600 border border-blue-600 hover:underline transition-all ease-in-out duration-300">
                    <Link to={`/dashboard/user-profile/${user?._id}`}>
                      {user.username}
                    </Link>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap border border-blue-600">
                    {user.phone}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap border border-blue-600">
                    {user.email || "N/A"}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap border border-blue-600">
                    {moment(user.createdAt).format("MMMM Do YYYY, h:mm")}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap border border-blue-600">
                    {user.lastLoginAt
                      ? moment(user.lastLoginAt).format("MMMM Do YYYY, h:mm:ss")
                      : "N/A"}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap border border-blue-600">
                    {user.balance || 0}
                  </td>
                </tr>
              ))}
              {paginatedUsers?.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
        <TablePagination
          currentPage={currentPage}
          totalItems={filteredUsers?.length || 0}
          itemsPerPage={rowsPerPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default AllUsers;
