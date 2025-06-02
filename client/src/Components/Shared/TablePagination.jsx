const TablePagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  return (
    <div className="flex justify-center mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-blue-300 hover:bg-blue-500 disabled:bg-gray-100 disabled:text-gray-400 hover:text-white transition-all ease-in-out duration-300"
      >
        Previous
      </button>
      <span className="px-4 py-2">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-blue-300 hover:bg-blue-500 disabled:bg-gray-100 disabled:text-gray-400 hover:text-white transition-all ease-in-out duration-300"
      >
        Next
      </button>
    </div>
  );
};

export default TablePagination;
