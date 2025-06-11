import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import toast from "react-hot-toast";
import { useAddPromotionMutation } from "../../../redux/features/allApis/promotionApi/promotionApi";
import { useGetAllPromotionCategoriesQuery } from "../../../redux/features/allApis/promotionApi/promotionCategoryApi";
import { uploadImage } from "../../../hooks/files";
import { Button } from "../../ui/button";

const AddPromotionSection = () => {
  const { handleSubmit, control, register, reset, watch } = useForm();
  const [addPromotion, { isLoading: addPromoLoading }] =
    useAddPromotionMutation();
  const { data: categories, isLoading } = useGetAllPromotionCategoriesQuery();
  const [file, setFile] = useState(null);

  const promotionCategories = categories?.filter(
    (category) => category.categoryType === "promotion"
  );

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const onSubmit = async (data) => {
    if (file) {
      const { filePath } = await uploadImage(file);
      const formattedData = {
        ...data,
        image: filePath,
        categories: data.categories.map((category) => category.value),
      };
      try {
        const { data } = await addPromotion(formattedData);
        if (data.insertedId) {
          toast.success("Promotion added successfully");
          reset();
          setFile(null);
        }
      } catch (error) {
        toast.error("Failed to add promotion");
      }
    } else {
      toast.error("Please select an image");
    }
  };

  const watchBonus = watch("bonus"); // Watch the value of the bonus field

  return (
    <div className="w-full lg:w-2/3 rounded-lg px-3 py-1.5">
      <h2 className="text-base lg:text-lg font-bold px-2 py-3 mb-4 text-center text-white bg-[#222222] rounded-md">
        Add Promotion Details
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title Field */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            placeholder="Enter title"
            {...register("title", { required: "Title is required" })}
            className="w-full bg-white p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>

        {/* Subtitle Field */}
        <div>
          <label
            htmlFor="subtitle"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Subtitle
          </label>
          <input
            type="text"
            id="subtitle"
            placeholder="Enter subtitle"
            {...register("subtitle", { required: "Subtitle is required" })}
            className="w-full bg-white p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>

        {/* Categories Field */}
        {/* Categories Field */}
        <div>
          <label
            htmlFor="categories"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Categories
          </label>
          <Controller
            name="categories"
            control={control}
            defaultValue={[]}
            rules={{
              validate: (value) =>
                (value && value.length > 0) ||
                "At least one category is required",
            }}
            render={({ field, fieldState: { error } }) => (
              <>
                <Select
                  {...field}
                  options={
                    isLoading
                      ? [{ label: "Loading categories...", value: "loading" }]
                      : promotionCategories
                  }
                  isMulti
                  placeholder="Select categories"
                  className="text-gray-800"
                  classNamePrefix="react-select"
                  isDisabled={isLoading}
                />
                {error && (
                  <p className="text-sm text-red-500 mt-1">{error.message}</p>
                )}
              </>
            )}
          />
        </div>

        {/* Image Upload Field */}
        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Image Upload
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="w-full bg-white p-2 border border-gray-300 rounded focus:outline-none"
          />
        </div>

        {/* Bonus Option Field */}
        <div>
          <label
            htmlFor="bonus"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Bonus Option
          </label>
          <select
            id="bonus"
            {...register("bonus", { required: "Please select a bonus option" })}
            defaultValue="noBonus"
            className="w-full bg-white p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            <option value="noBonus">No Bonus</option>
            <option value="bonus">Bonus</option>
          </select>
        </div>

        {/* Conditional Fields for Bonus */}
        {watchBonus === "bonus" && (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="bonusTitle"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Bonus Title
              </label>
              <input
                type="text"
                id="bonusTitle"
                placeholder="Enter bonus title"
                {...register("bonusTitle", {
                  required: "Bonus Title is required",
                })}
                className="w-full bg-white p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
            <div>
              <label
                htmlFor="bonusType"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Bonus Type
              </label>
              <select
                id="bonusType"
                {...register("bonusType", {
                  required: "Bonus Type is required",
                })}
                className="w-full bg-white p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="">Select Bonus Type</option>
                <option value="percentage">Percentage</option>
                <option value="amount">Amount</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="bonusValue"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Bonus Value
              </label>
              <input
                type="number"
                id="bonusValue"
                placeholder="Enter bonus amount/percentage"
                {...register("bonusValue", {
                  required: "Bonus Value is required",
                  valueAsNumber: true, // Ensures the value is treated as a number
                  min: {
                    value: 0,
                    message: "Bonus Value must be greater than or equal to 0",
                  },
                  max: {
                    value: 100000,
                    message: "Bonus Value must be less than or equal to 100000",
                  },
                })}
                className="w-full bg-white p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
          </div>
        )}

        {/* Details Field */}
        <div>
          <label
            htmlFor="details"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Details
          </label>
          <Controller
            name="details"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <ReactQuill
                {...field}
                theme="snow"
                placeholder="Add description"
                className="bg-white border border-gray-300 rounded"
                modules={{
                  toolbar: [
                    [{ header: [1, 2, false] }],
                    ["bold", "italic", "underline", "strike"],
                    ["blockquote", "code-block"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    [{ script: "sub" }, { script: "super" }],
                    [{ indent: "-1" }, { indent: "+1" }],
                    [{ direction: "rtl" }],
                    [{ size: ["small", false, "large", "huge"] }],
                    [{ color: [] }, { background: [] }],
                    [{ font: [] }],
                    [{ align: [] }],
                    ["link", "image", "video"],
                    ["clean"],
                  ],
                }}
              />
            )}
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <Button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-600 transition-all ease-in-out duration-300 text-black py-2 px-6 rounded whitespace-nowrap"
          >
            {addPromoLoading ? "..." : "Publish Now"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddPromotionSection;
