import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAddPromotionCategoryMutation } from "../../../redux/features/allApis/promotionApi/promotionCategoryApi";
import { Button } from "../../ui/button";

const CategoryUploadForm = ({ closeModal }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [addPromotionCategory, { isLoading }] =
    useAddPromotionCategoryMutation();

  const onSubmit = async (data) => {
    const categoryInfo = {
      ...data,
      categoryType: "promotion",
    };
    try {
      const { data } = await addPromotionCategory(categoryInfo);
      if (data.insertedId) {
        toast.success("Category added successfully");

        closeModal();
      }
    } catch (error) {
      toast.error("Failed to add category");
    }
  };

  return (
    <div className="bg-white rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Add Category</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Title Input */}
        <label htmlFor="label" className="block mb-2">
          Title:
          <input
            {...register("label", { required: "Title is required" })}
            type="text"
            placeholder="Enter title"
            className="w-full bg-[#d0caeb] px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-600 mb-1"
          />
          {errors.label && (
            <span className="text-red-500 text-sm">{errors.label.message}</span>
          )}
        </label>

        {/* Value Input */}
        <label htmlFor="value" className="block mb-2">
          Value:
          <input
            {...register("value", {
              required: "Value is required",
              pattern: {
                value: /^[a-z-]*$/,
                message: "Only lowercase letters are allowed (no spaces)",
              },
            })}
            type="text"
            placeholder="Enter value (only lowercase letters and no spaces)"
            className="w-full bg-[#d0caeb] px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-600 mb-1"
          />
          {errors.value && (
            <span className="text-red-500 text-sm">{errors.value.message}</span>
          )}
        </label>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-4">
          <button
            type="button"
            onClick={closeModal}
            className="p-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
          >
            Close
          </button>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-yellow-500 disabled:bg-gray-500 hover:bg-yellow-600 transition-all ease-in-out duration-300 text-black py-2 px-4 rounded whitespace-nowrap"
          >
            {isLoading ? "..." : "Add"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CategoryUploadForm;
