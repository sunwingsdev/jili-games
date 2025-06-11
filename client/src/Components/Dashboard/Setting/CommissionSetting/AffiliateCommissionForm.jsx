import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  // useAddCommissionMutation,
  useGetAllCommissionsQuery,
  useUpdateCommissionMutation,
} from "../../../../redux/features/allApis/commissionApi/commissionApi";

const AffiliateCommissionForm = () => {
  const { user } = useSelector((state) => state.auth);
  const { data: allCommissions } = useGetAllCommissionsQuery();
  //   const [addCommission, { isLoading }] = useAddCommissionMutation();
  const [updateCommission, { isLoading }] = useUpdateCommissionMutation();
  const firstCommission = allCommissions?.[0];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const category = "ac";
    try {
      //   await addCommission({ ...data, category }).unwrap();
      await updateCommission({
        userId: user?._id,
        id: firstCommission?._id,
        updatedData: { ...data, category },
      }).unwrap();
      toast.success("Commission updated successfully!");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update commission");
    }
  };

  return (
    <div className="p-6 bg-white border rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 ps-3 text-left border-s-8 border-[#114d3a]">
        Set Affiliate Commission
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Commission Value */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Commission Value (%)
          </label>
          <input
            type="number"
            {...register("commissionValue", {
              required: "Commission value is required",
              min: { value: 1, message: "Minimum value should be 1%" },
              max: { value: 100, message: "Maximum value is 100%" },
            })}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter commission value"
            defaultValue={firstCommission?.commissionValue}
          />
          {errors.commissionValue && (
            <p className="text-red-500 text-sm mt-1">
              {errors.commissionValue.message}
            </p>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Status</label>
          <select
            {...register("status")}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            defaultValue={firstCommission?.status}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full p-3 rounded-lg text-white transition duration-200 ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#114d3a] hover:bg-[#186d52]"
          }`}
        >
          {isLoading ? "Saving..." : "Save Commission"}
        </button>
      </form>
    </div>
  );
};

export default AffiliateCommissionForm;
