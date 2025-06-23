import { MdOutlineRadioButtonChecked } from "react-icons/md";
import {
  useDeletePackageMutation,
  useGetAllPackagesQuery,
} from "../../../../redux/features/allApis/packagesApi/packagesApi";
import { Link } from "react-router";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const AllPackages = () => {
  const { data: allPackages } = useGetAllPackagesQuery();
  const [deletePackage, { isLoading }] = useDeletePackageMutation();

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Confirm Deletion",
      text: "This action cannot be undone. Do you want to Delete?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      focusCancel: true,

      // Custom button colors
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",

      // Custom styling
      customClass: {
        popup: "rounded-xl p-6",
        title: "text-lg font-semibold text-gray-800",
        htmlContainer: "text-sm text-gray-600",
        actions: "flex justify-end gap-4 mt-4",
        confirmButton:
          "bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600",
        cancelButton:
          "bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300",
      },

      buttonsStyling: false,
      backdrop: true,
      background: "#f9fafb",
    });

    if (!result.isConfirmed) return;

    try {
      await deletePackage(id).unwrap();
      toast.success("Package Deleted successfully");
    } catch (error) {
      toast.error(error || "Failed to delete package");
    }
  };

  return (
    <div className=" bg-gradient-to-br from-indigo-50 via-white to-indigo-100 min-h-screen">
      <div className="bg-[#222222] flex flex-col md:flex-row items-start md:items-center justify-between p-4 mb-2">
        <div className="w-full">
          <h1 className="text-2xl text-white font-bold">All Packages</h1>
        </div>
      </div>
      <div className="my-8">
        {allPackages?.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No packages available.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allPackages?.map((pkg) => (
              <div
                key={pkg?._id}
                className="bg-white rounded-xl shadow-xl border border-indigo-300 hover:shadow-2xl transition-shadow duration-300 p-8 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl text-black font-bold tracking-tight capitalize">
                      {pkg?.type} Package
                    </h3>
                    <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-indigo-100 text-indigo-700">
                      {pkg?.duration}
                    </span>
                  </div>

                  <p className="text-indigo-700 text-3xl font-bold mb-6">
                    {pkg?.price.toLocaleString()}{" "}
                    <span className="text-base font-normal">USDT</span>
                  </p>

                  <div className="space-y-2 text-sm text-black font-medium">
                    <p
                      className={`flex items-center gap-1 ${
                        pkg?.allGamingAccess ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      <span className="font-semibold flex items-center gap-1 text-indigo-600">
                        <MdOutlineRadioButtonChecked /> All Gaming Access:
                      </span>{" "}
                      {pkg?.allGamingAccess ? "Yes" : "No"}
                    </p>
                    <p className="flex items-center gap-1">
                      <span className="font-semibold flex items-center gap-1 text-indigo-600">
                        <MdOutlineRadioButtonChecked /> Casino Share:
                      </span>{" "}
                      {pkg?.casinoShare}%
                    </p>
                    <p className="flex items-center gap-1">
                      <span className="font-semibold flex items-center gap-1 text-indigo-600">
                        <MdOutlineRadioButtonChecked /> Sports Share:
                      </span>{" "}
                      {pkg?.sportsShare}%
                    </p>
                    <p className="flex items-center gap-1">
                      <span className="font-semibold flex items-center gap-1 text-indigo-600">
                        <MdOutlineRadioButtonChecked /> Slot Share:
                      </span>{" "}
                      {pkg?.slotShare}%
                    </p>
                    <p className="flex items-center gap-1">
                      <span className="font-semibold flex items-center gap-1 text-indigo-600">
                        <MdOutlineRadioButtonChecked /> Crash Share:
                      </span>{" "}
                      {pkg?.crashShare}%
                    </p>
                    <p className="flex items-center gap-1">
                      <span className="font-semibold flex items-center gap-1 text-indigo-600">
                        <MdOutlineRadioButtonChecked /> GCB Board Fee:
                      </span>{" "}
                      {pkg?.gcbBoardFee}%
                    </p>
                    <p
                      className={`flex items-center gap-1 ${
                        pkg?.upcomingGamingFree
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      <span className="font-semibold flex items-center gap-1 text-indigo-600">
                        <MdOutlineRadioButtonChecked /> Upcoming Gaming Free:
                      </span>{" "}
                      {pkg?.upcomingGamingFree ? "Yes" : "No"}
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex gap-4">
                  <Link
                    to={`/dashboard/editpackage/${pkg?._id}`}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white flex-1 text-center"
                  >
                    <button
                      className="py-3 rounded-lg text-lg font-semibold shadow-md transform hover:scale-105 transition-transform"
                      aria-label={`Edit ${pkg.type} package`}
                    >
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(pkg?._id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg text-lg font-semibold shadow-md transform hover:scale-105 transition-transform"
                    aria-label={`Delete ${pkg.type} package`}
                    disabled={isLoading}
                  >
                    {isLoading ? "Deleteing..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllPackages;
