import moment from "moment";
import TablePagination from "../../../Shared/TablePagination";

const BalanceHistoryTable = ({
  title,
  isLoading,
  error,
  paginatedHistories,
  currentPage,
  totalItems,
  rowsPerPage,
  setCurrentPage,
}) => {
  return (
    <div>
      <div className="bg-[#222222] flex flex-col md:flex-row items-start md:items-center justify-between p-4 mb-2">
        <div className="flex flex-row items-start justify-between w-full mb-4 md:mb-0">
          <h1 className="text-2xl text-white font-bold">{title}</h1>
        </div>
      </div>
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
                <th className="px-4 py-2 border border-blue-600">Username</th>
                <th className="px-4 py-2 border border-blue-600">Amount</th>
                <th className="px-4 py-2 border border-blue-600">Type</th>
                <th className="px-4 py-2 border border-blue-600">Added By</th>
                <th className="px-4 py-2 border border-blue-600">
                  Date & Time
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedHistories.map((item, index) => (
                <tr
                  key={item._id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-100" : "bg-[#cacaca]"
                  } text-black`}
                >
                  <td className="px-4 py-2 border border-blue-600">
                    {item.username}
                  </td>
                  <td className="px-4 py-2 border border-blue-600">
                    {item.amount}
                  </td>
                  <td className="px-4 py-2 border border-blue-600 capitalize">
                    {item.type}
                  </td>
                  <td className="px-4 py-2 border border-blue-600">
                    {item.addedBy}
                  </td>
                  <td className="px-4 py-2 border border-blue-600">
                    {moment(item.createdAt).format("MMMM Do YYYY, h:mm:ss A")}
                  </td>
                </tr>
              ))}
              {paginatedHistories.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No balance histories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
        <TablePagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={rowsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default BalanceHistoryTable;
