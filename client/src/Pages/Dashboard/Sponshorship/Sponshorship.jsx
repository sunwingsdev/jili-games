const Sponshorship = () => {
  const sponsorships = [1, 2, 3, 4, 5, 6, 7];
  const ambassadors = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      {/* Header Section */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Add Sponsorship and Brand Ambassador
        </h1>
      </div>

      {/* Sponsorship Section */}
      <div className="p-6 mb-6 bg-white rounded-lg shadow-lg">
        <h1 className="mb-4 text-2xl font-semibold text-gray-700">
          Sponsorship
        </h1>

        {/* Horizontal Scroll Container for Sponsorship */}
        <div className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth">
          {sponsorships.map((item) => (
            <div
              key={item}
              className="flex-shrink-0 w-96 p-2 bg-gray-50 rounded-lg shadow-md flex items-center gap-4 h-20"
            >
              {/* Left Side - Icon */}
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                S
              </div>

              {/* Right Side - Details */}
              <div className="space-y-1">
                <p className="text-lg font-medium text-gray-800">Name {item}</p>
                <p className="text-gray-600">Date: 2024-12-25</p>
                <p className="text-gray-700 font-semibold">Title {item}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Brand Ambassador Section */}
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h1 className="mb-4 text-2xl font-semibold text-gray-700">
          Brand Ambassador
        </h1>

        {/* Horizontal Scroll Container for Ambassadors */}
        <div className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth">
          {ambassadors.map((item) => (
            <div
              key={item}
              className="flex-shrink-0 w-96 p-2 bg-gray-50 rounded-lg shadow-md flex items-center gap-4 h-20"
            >
              {/* Left Side - Icon */}
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                A
              </div>

              {/* Right Side - Details */}
              <div className="space-y-1">
                <p className="text-lg font-medium text-gray-800">Name {item}</p>
                <p className="text-gray-600">Date: 2024-12-25</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Section */}
      <div className="grid grid-cols-1 gap-6 mt-8 lg:grid-cols-2">
        {/* Footer Text 1 */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h1 className="mb-4 text-lg font-semibold text-gray-700">
            Add Footer Text 1
          </h1>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Enter text..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600">
              Add
            </button>
          </div>
          <p className="mt-4 text-gray-500">Show footer text of input</p>
        </div>

        {/* Footer Text 2 */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h1 className="mb-4 text-lg font-semibold text-gray-700">
            Add Footer Text 2
          </h1>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Enter text..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600">
              Add
            </button>
          </div>
          <p className="mt-4 text-gray-500">Show footer text of input</p>
        </div>
      </div>
    </div>
  );
};

export default Sponshorship;
