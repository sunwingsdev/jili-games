import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import Swal from "sweetalert2";
import { useGetAllCategoriesQuery } from "../../../redux/features/allApis/categoryApi/categoryApi";
import {
  useAddHomeControlMutation,
  useDeleteHomeControlMutation,
  useGetHomeControlsQuery,
  useUpdateSelectionMutation,
} from "../../../redux/features/allApis/homeControlApi/homeControlApi";
import { useUploadImageMutation } from "../../../redux/features/allApis/uploadApi/uploadApi";
import Modal from "../../Shared/Modal";

const BannerUpload = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: allCategories } = useGetAllCategoriesQuery();
  const filteredCategories = allCategories?.filter(
    (category) => category.name !== "এক্সক্লুসিভ"
  );

  const { data: allHomeControls, refetch } = useGetHomeControlsQuery();
  const [updateSelection] = useUpdateSelectionMutation();

  const [addHomeControl] = useAddHomeControlMutation();
  const [deleteHomeControl] = useDeleteHomeControlMutation();
  const [uploadImage] = useUploadImageMutation();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDeleteIcon = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);
      try {
        setLoading(true);
        const { data } = await uploadImage(formData);
        if (data.filePath) {
          const bannerInfo = {
            page: categoryName,
            section: "banner",
            category: "slider",
            image: data?.filePath,
          };

          const result = await addHomeControl(bannerInfo);
          if (result.data.insertedId) {
            toast.success("Image uploaded successfully");

            setImagePreview(null);
            setImageFile(null);
            setCategoryName("");
            setLoading(false);
            setIsModalOpen(false);
          }
        }
      } catch (error) {
        setLoading(false);
        toast.error("Failed to upload image");
      }
    } else {
      toast.error("Failed to upload image");
    }
  };

  const handleCheckboxChange = async (id) => {
    try {
      const result = await updateSelection(id);
      if (result.data) {
        toast.success(result.data.message);
      }
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

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
      await deleteHomeControl(id).unwrap();
      toast.success("Deleted successfully");
      refetch();
    } catch (error) {
      toast.error(error || "Failed to delete");
    }
  };

  return (
    <div>
      <div className="bg-[#172437] py-4 px-2 flex items-center justify-between">
        <h1 className="text-white text-3xl font-bold">
          Category Pages Slider Image Upload
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-yellow-400 text-black px-4 py-1 text-xl"
        >
          Add+
        </button>
      </div>
      <div className="mt-10">
        <Tabs>
          {/* Tab List with Mobile Scroll */}
          <TabList className="flex gap-4 border-b border-gray-300 overflow-x-auto scrollbar-hide px-2 md:px-0">
            {filteredCategories?.map((category, i) => (
              <Tab
                key={i}
                className="px-4 py-2 text-base md:text-lg font-semibold text-gray-600 hover:text-gray-900 border-b-2 border-transparent transition-all duration-300 ease-in-out focus:outline-none data-[selected]:border-blue-500 data-[selected]:text-blue-500 whitespace-nowrap cursor-pointer"
              >
                {category?.name}
              </Tab>
            ))}
          </TabList>

          {filteredCategories?.map((category, i) => (
            <TabPanel key={i} className="mt-4">
              {allHomeControls?.filter((item) => item.page === category.name)
                ?.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                  {allHomeControls
                    .filter((item) => item.page === category.name)
                    .map((control) => (
                      <div
                        key={control._id}
                        className="relative group border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                      >
                        <img
                          src={`${import.meta.env.VITE_BASE_API_URL}${
                            control.image
                          }`}
                          alt="Banner"
                          className="w-full h-32 object-cover rounded-t"
                        />

                        <input
                          checked={control?.isSelected === true}
                          className="absolute top-2 left-2 size-6"
                          type="checkbox"
                          name=""
                          onChange={() => handleCheckboxChange(control._id)}
                          id={control?._id}
                        />

                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleDelete(control._id)}
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
                  No banner images available
                </p>
              )}
            </TabPanel>
          ))}
        </Tabs>
      </div>
      <Modal
        title="Upload Banner Image"
        isOpen={isModalOpen}
        onOpenChange={() => {
          setIsModalOpen(false);
          setCategoryName("");
          setImageFile(null);
          setImagePreview(null);
        }}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Category Name
            </label>
            <select
              className="w-full p-2 border rounded-md focus:ring focus:ring-green-300"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
            >
              <option value="">Select category</option>
              {filteredCategories?.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full p-2 border rounded-md focus:ring focus:ring-green-300"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="mt-3 relative w-full h-36 rounded border overflow-hidden group">
                <img
                  src={imagePreview}
                  alt="Icon Preview"
                  className="w-full h-full object-cover rounded"
                />
                <button
                  type="button"
                  onClick={handleDeleteIcon}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600 text-black rounded-full w-16 h-16 flex items-center justify-center text-sm opacity-0 bg-opacity-90 group-hover:opacity-100 transition-opacity duration-200"
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

export default BannerUpload;
