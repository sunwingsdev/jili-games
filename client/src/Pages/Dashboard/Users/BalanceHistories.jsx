import { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { useGetAllUsersBalanceHistoryQuery } from "../../../redux/features/allApis/usersApi/usersApi";
import BalanceHistoryTable from "../../../Components/Dashboard/Users/BalanceHistories/BalanceHistoryTable";

const BalanceHistories = () => {
  const {
    data: allBalanceHistory = [],
    isLoading,
    error,
  } = useGetAllUsersBalanceHistoryQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPageAdd, setCurrentPageAdd] = useState(1);
  const [currentPageSubtract, setCurrentPageSubtract] = useState(1);
  const rowsPerPage = 10;

  // Common filtered + sorted histories
  const filteredHistories = allBalanceHistory
    ?.filter((item) =>
      item.username?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Separate into 'add' and 'subtract' types
  const addedHistories = filteredHistories.filter(
    (item) => item.type === "add"
  );
  const subtractedHistories = filteredHistories.filter(
    (item) => item.type === "subtract"
  );

  const paginatedAdd = addedHistories.slice(
    (currentPageAdd - 1) * rowsPerPage,
    currentPageAdd * rowsPerPage
  );

  const paginatedSubtract = subtractedHistories.slice(
    (currentPageSubtract - 1) * rowsPerPage,
    currentPageSubtract * rowsPerPage
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-[#222222] flex flex-col md:flex-row items-start md:items-center justify-between p-4 mb-2">
        <div className="flex flex-row items-start justify-between w-full mb-4 md:mb-0">
          <h1 className="text-2xl text-white font-bold">Balance Histories</h1>
        </div>

        <form className="w-full md:w-1/2 flex flex-row items-center">
          <input
            type="text"
            placeholder="Search by Username..."
            className="py-2 px-1 w-full outline-none"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPageAdd(1); // Reset page
              setCurrentPageSubtract(1);
            }}
          />
          <button className="bg-white p-3" type="button">
            <IoIosSearch />
          </button>
        </form>
      </div>

      {/* Table for Added Balances */}
      <BalanceHistoryTable
        title="Added Balance Histories"
        isLoading={isLoading}
        error={error}
        paginatedHistories={paginatedAdd}
        currentPage={currentPageAdd}
        totalItems={addedHistories.length}
        rowsPerPage={rowsPerPage}
        setCurrentPage={setCurrentPageAdd}
      />

      {/* Table for Subtracted Balances */}
      <BalanceHistoryTable
        title="Subtracted Balance Histories"
        isLoading={isLoading}
        error={error}
        paginatedHistories={paginatedSubtract}
        currentPage={currentPageSubtract}
        totalItems={subtractedHistories.length}
        rowsPerPage={rowsPerPage}
        setCurrentPage={setCurrentPageSubtract}
      />
    </div>
  );
};

export default BalanceHistories;
