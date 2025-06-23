import { useState, useEffect } from "react";
import {
  useGetPackageByIdQuery,
  useUpdatePackageMutation,
} from "../../../../redux/features/allApis/packagesApi/packagesApi";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";

const EditPackage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: singlePackage, isLoading: isFetching } =
    useGetPackageByIdQuery(id);
  const [updatePackage, { isLoading }] = useUpdatePackageMutation();

  const [formData, setFormData] = useState({
    type: "postpaid",
    price: "",
    duration: "yearly",
    allGamingAccess: true,
    casinoShare: "",
    sportsShare: "",
    slotShare: "",
    crashShare: "",
    gcbBoardFee: "",
    upcomingGamingFree: true,
  });

  useEffect(() => {
    if (singlePackage) {
      setFormData(singlePackage);
    }
  }, [singlePackage]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { _id, ...cleanData } = formData;

    try {
      const response = await updatePackage({ id, data: cleanData });

      if (response?.data?.modifiedCount > 0 || response?.data?.success) {
        toast.success("Package updated successfully!");
        navigate("/dashboard/allpackages");
      } else {
        toast.error("No changes detected or update failed.");
      }
    } catch (error) {
      console.error("Error updating package:", error);
      toast.error(
        error?.data?.message || "Failed to update package. Please try again."
      );
    }
  };

  if (isFetching)
    return <p className="text-white p-4">Loading package data...</p>;

  return (
    <div>
      <div className="bg-[#222222] flex flex-col md:flex-row items-start md:items-center justify-between p-4 mb-2">
        <div className="w-full">
          <h1 className="text-2xl text-white font-bold">Edit Package</h1>
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 max-w-4xl mx-auto p-4 text-black"
      >
        {/* Package Type */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Package Type
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="postpaid">postpaid</option>
            <option value="prepaid">prepaid</option>
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Price (USDT)
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter price"
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Duration
          </label>
          <select
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="yearly">yearly</option>
            <option value="monthly">monthly</option>
          </select>
        </div>

        {/* Casino Share */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Casino Share (%)
          </label>
          <input
            type="number"
            name="casinoShare"
            value={formData.casinoShare}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        {/* Sports Share */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Sports Share (%)
          </label>
          <input
            type="number"
            name="sportsShare"
            value={formData.sportsShare}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        {/* Slot Share */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Slot Share (%)
          </label>
          <input
            type="number"
            name="slotShare"
            value={formData.slotShare}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        {/* Crash Share */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Crash Share (%)
          </label>
          <input
            type="number"
            name="crashShare"
            value={formData.crashShare}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        {/* GCB Board Fee */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            GCB Board Fee (%)
          </label>
          <input
            type="number"
            name="gcbBoardFee"
            value={formData.gcbBoardFee}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        {/* Checkboxes */}
        <div className="md:col-span-2 space-y-4 mt-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="allGamingAccess"
              checked={formData.allGamingAccess}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <span className="ml-2 text-gray-700">All Gaming Access</span>
          </label>
          <br />
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="upcomingGamingFree"
              checked={formData.upcomingGamingFree}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <span className="ml-2 text-gray-700">Upcoming Gaming Free</span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 font-bold rounded-md text-white text-lg transition ${
              isLoading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Updating..." : "Update Package"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPackage;
