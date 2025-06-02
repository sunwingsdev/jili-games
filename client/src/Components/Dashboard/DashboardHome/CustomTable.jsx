import { useState } from "react";

const CustomTable = ({ title, headers, data, borderColor }) => {
  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = data?.slice(startIndex, startIndex + itemsPerPage);

  const handleClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Helper for rendering pagination numbers with ellipsis
  const renderPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages.map((page, index) =>
      page === "..." ? (
        <span key={index} className="px-2 text-gray-500">
          ...
        </span>
      ) : (
        <button
          key={index}
          onClick={() => handleClick(page)}
          className={`px-3 py-1 rounded-md border ${
            page === currentPage
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700"
          }`}
        >
          {page}
        </button>
      )
    );
  };

  return (
    <>
      <div className="bg-gradient-to-r from-[#397ef1] via-[#2463ec] to-[#2044b4] p-2 mb-4 mt-16 rounded-sm shadow-md">
        <h1 className="text-2xl text-white font-semibold text-center">
          {title}
        </h1>
      </div>
      <div className="bg-white rounded-sm shadow-md">
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse">
            <thead className="bg-[#2563ea]">
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className="border p-3 text-left font-medium text-sm text-white"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentData?.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`hover:bg-gray-100 ${
                    rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  {Object.values(row).map((value, colIndex) => (
                    <td
                      key={colIndex}
                      className="border p-3 text-sm text-gray-700 whitespace-nowrap"
                    >
                      {typeof value === "object"
                        ? JSON.stringify(value)
                        : value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 py-4">
          <button
            onClick={() => handleClick(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md border ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700"
            }`}
          >
            Previous
          </button>
          {renderPageNumbers()}
          <button
            onClick={() => handleClick(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md border ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default CustomTable;
