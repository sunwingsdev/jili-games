import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Swal from "sweetalert2";
import { useGetAllCategoriesQuery } from "../../../../redux/features/allApis/categoryApi/categoryApi";
import {
  useAddSubCategoryMutation,
  useDeleteSubCategoryMutation,
  useGetAllSubCategoriesQuery,
} from "../../../../redux/features/allApis/categoryApi/subCategoryApi";
import { useUploadImageMutation } from "../../../../redux/features/allApis/uploadApi/uploadApi";
import Modal from "../../../Shared/Modal";

const SubCategories = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [subCategoryName, setSubCategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [iconFile, setIconFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { data: allCategories } = useGetAllCategoriesQuery();
  const { data: allSubCategories } = useGetAllSubCategoriesQuery();

  const [uploadImage] = useUploadImageMutation();
  const [addSubCategory] = useAddSubCategoryMutation();
  const [deleteSubCategory] = useDeleteSubCategoryMutation();

  const filteredCategories = allCategories?.filter(
    (category) => category.name !== "এক্সক্লুসিভ"
  );

  const filteredSubCategory = allSubCategories?.filter(
    (game) => game.category !== "এক্সক্লুসিভ"
  );

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setIconFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDeleteIcon = () => {
    setIconFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (iconFile) {
      const formData = new FormData();
      formData.append("image", iconFile);
      try {
        setLoading(true);
        const { data } = await uploadImage(formData);
        if (data.filePath) {
          const categoryInfo = {
            name: subCategoryName,
            category: selectedCategory,
            image: data?.filePath,
          };
          const result = await addSubCategory(categoryInfo);
          if (result.data.insertedId) {
            toast.success("Sub Category created successfully");
            setImagePreview(null);
            setIconFile(null);
            setSubCategoryName("");
            setSelectedCategory("");
            setLoading(false);
            setIsModalOpen(false);
          }
        }
      } catch (error) {
        setLoading(false);
        toast.error(error || "Failed to create sub category");
      }
    } else {
      toast.error("Failed to create sub category");
    }
  };

  const handleDeleteSubCategory = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteSubCategory(id);

          if (res?.data?.deletedSubCategory?.deletedCount > 0) {
            toast.success(
              "Sub Category and its games has been deleted successfully"
            );
          }
        } catch (err) {
          toast.error(err || "Failed to delete sub category");
        }
      }
    });
  };

  return (
    <div>
      <div className="bg-[#172437] py-4 px-2 flex items-center justify-between">
        <h1 className="text-white text-3xl font-bold">Sub Categories</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-yellow-400 text-black px-4 py-1 text-xl"
        >
          Add+
        </button>
      </div>

      <div className="mt-6">
        <Tabs>
          {/* Tab List with Mobile Scroll */}
          <TabList className="flex gap-4 border-b border-gray-300 overflow-x-auto scrollbar-hide px-2 md:px-0">
            {filteredCategories?.map((category, i) => (
              <Tab
                key={i}
                className="px-4 py-2 text-base md:text-lg font-semibold text-gray-600 hover:text-gray-900 border-b-2 border-transparent transition-all duration-300 ease-in-out focus:outline-none data-[selected]:border-blue-500 data-[selected]:text-blue-500 whitespace-nowrap"
              >
                {category?.name}
              </Tab>
            ))}
          </TabList>

          {filteredCategories?.map((category, i) => {
            const subCategories = filteredSubCategory?.filter(
              (game) => game.category === category.name
            );

            return (
              <TabPanel key={i} className="mt-4">
                {subCategories?.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {subCategories?.map((subCat) => (
                      <div
                        key={subCat._id}
                        className="relative group border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                      >
                        <img
                          src={`${import.meta.env.VITE_BASE_API_URL}${
                            subCat.image
                          }`}
                          alt="Game"
                          className="w-20 h-20 md:w-24 md:h-24 object-contain mx-auto mt-4"
                        />
                        <div className="p-3 text-center font-medium text-gray-700">
                          {subCat.name}
                        </div>
                        {/* Action buttons on hover */}
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {/* Delete button */}
                          <button
                            onClick={() => handleDeleteSubCategory(subCat?._id)}
                            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full"
                            title="Delete"
                          >
                            <AiOutlineDelete className="text-xl" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 text-lg font-semibold mt-6">
                    No sub categories available
                  </p>
                )}
              </TabPanel>
            );
          })}
        </Tabs>
      </div>
      {/* Modal */}
      <Modal
        title={"Create New Sub Category"}
        isOpen={isModalOpen}
        onOpenChange={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Sub Category Name
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md focus:ring focus:ring-green-300"
              placeholder="Enter sub category name"
              value={subCategoryName}
              onChange={(e) => setSubCategoryName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Under Which Category
            </label>
            <select
              name="category"
              className="w-full p-2 border rounded-md focus:ring focus:ring-green-300"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">select one</option>
              {filteredCategories?.map((category, i) => (
                <option key={i} value={category?.name}>
                  {category?.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Icon</label>
            <input
              type="file"
              accept="image/*"
              className="w-full p-2 border rounded-md focus:ring focus:ring-green-300"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="mt-3 relative w-16 h-16 rounded-full border overflow-hidden group">
                <img
                  src={imagePreview}
                  alt="Icon Preview"
                  className="w-full h-full object-cover rounded-full"
                />
                <button
                  type="button"
                  onClick={handleDeleteIcon}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-600 text-black rounded-full w-16 h-16 flex items-center justify-center text-sm opacity-0 bg-opacity-25 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <IoMdCloseCircleOutline className="text-3xl" />
                </button>
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="bg-gray-400 hover:bg-gray-500 text-white py-1 px-4 rounded-md"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white py-1 px-4 rounded-md"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin w-5 h-5 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      strokeWidth="4"
                      className="text-white"
                    />
                  </svg>
                  Saving...
                </span>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SubCategories;
