import { useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { AiOutlineDelete } from "react-icons/ai";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import {
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useGetAllCategoriesQuery,
} from "../../../redux/features/allApis/categoryApi/categoryApi";
import { useUploadImageMutation } from "../../../redux/features/allApis/uploadApi/uploadApi";
// import SubCategories from "../../../Components/Dashboard/GameCategory/GameCategories/SubCategories";
import Modal from "../../../Components/Shared/Modal";

const GameCategories = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [iconFile, setIconFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { data: allCategories } = useGetAllCategoriesQuery();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [uploadImage] = useUploadImageMutation();
  const [addCategory] = useAddCategoryMutation();

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
            name: categoryName,
            image: data?.filePath,
          };
          const result = await addCategory(categoryInfo);
          if (result.data.insertedId) {
            toast.success("Category created successfully");
            setImagePreview(null);
            setIconFile(null);
            setCategoryName("");
            setLoading(false);
            setIsModalOpen(false);
          }
        }
      } catch (error) {
        setLoading(false);
        toast.error(error || "Failed to create category");
      }
    } else {
      toast.error("Failed to create category");
    }
  };

  const handleDeleteCategory = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await deleteCategory(id);

        if (response?.data?.deletedCategory?.deletedCount > 0) {
          await Swal.fire(
            "Deleted!",
            "Category and its sub categories and games have been deleted.",
            "success"
          );
        } else {
          await Swal.fire("Oops!", "Nothing was deleted.", "info");
        }
      } catch (error) {
        console.error(error);
        await Swal.fire("Error!", "Failed to delete category.", "error");
      }
    }
  };

  return (
    <div>
      <div>
        <div className="bg-[#172437] py-4 px-2 flex items-center justify-between">
          <h1 className="text-white text-3xl font-bold">Game Categories</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-yellow-400 text-black px-4 py-1 text-xl"
          >
            Add+
          </button>
        </div>

        <div className="w-full my-6 p-4 bg-white shadow-lg rounded-lg">
          <div className="">
            {/* Main Categories */}
            <div>
              <h3 className="bg-green-600 text-white p-3 rounded-md flex justify-between items-center font-medium shadow-md">
                All Categories
              </h3>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-4">
                {allCategories?.length > 0 ? (
                  allCategories.map((category, i) => (
                    <div
                      key={i}
                      className="relative group flex items-center p-3 border rounded-lg shadow-sm hover:shadow-md bg-gray-100 transition"
                    >
                      <img
                        className="w-12 h-12 mr-4 rounded-full object-cover"
                        src={`${import.meta.env.VITE_BASE_API_URL}${
                          category?.image
                        }`}
                        alt={category?.name}
                      />
                      <h4 className="text-lg font-semibold text-gray-800 capitalize">
                        {category?.name}
                      </h4>

                      {/* Action buttons on hover */}
                      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Delete button */}
                        <button
                          onClick={() => handleDeleteCategory(category?._id)}
                          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full"
                          title="Delete"
                        >
                          <AiOutlineDelete className="text-xl" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-1 md:col-span-4 text-center text-gray-500 py-5">
                    No data available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <SubCategories /> */}
      {/* Modal */}
      <Modal
        title="Create New Category"
        isOpen={isModalOpen}
        onOpenChange={() => {
          setIsModalOpen(false);
          setCategoryName("");
          setIconFile(null);
          setImagePreview(null);
        }}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Category Name
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md focus:ring focus:ring-green-300"
              placeholder="Enter category name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
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

export default GameCategories;
