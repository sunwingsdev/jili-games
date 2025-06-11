import { useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
// import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

import toast from "react-hot-toast";
import { useGetAllCategoriesQuery } from "../../../redux/features/allApis/categoryApi/categoryApi";
import {
  useAddGameMutation,
  useGetAllHomeGamesQuery,
} from "../../../redux/features/allApis/homeGamesApi/homeGamesApi";
import { useGetAllSubCategoriesQuery } from "../../../redux/features/allApis/categoryApi/subCategoryApi";
import { useUploadImageMutation } from "../../../redux/features/allApis/uploadApi/uploadApi";
import Modal from "../../../Components/Shared/Modal";

const AddGames = ({ isOpen, setIsOpen, selectedApiName }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [iconFile, setIconFile] = useState(null);
  const [gameName, setGameName] = useState("");
  const [gameLink, setGameLink] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: allCategories } = useGetAllCategoriesQuery();
  const { data: allHomeGames } = useGetAllHomeGamesQuery();
  console.log(allHomeGames);
  const { data: allSubCategories } = useGetAllSubCategoriesQuery();

  const [uploadImage] = useUploadImageMutation();
  const [addGame] = useAddGameMutation();

  const selectedApi = selectedApiName?.replace(/API/gi, "").trim();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setIconFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDeleteImage = () => {
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
          const gameInfo = {
            name: gameName,
            link: gameLink,
            category: selectedCategory,
            image: data?.filePath,
          };
          const result = await addGame(gameInfo);
          if (result.data.insertedId) {
            toast.success("Game created successfully");
            setImagePreview(null);
            setIconFile(null);
            setGameName("");
            setGameLink("");
            setSelectedCategory("");
            setSelectedSubCategory("");
            setLoading(false);
            setIsOpen(false);
          }
        }
      } catch (error) {
        setLoading(false);
        toast.error("Failed to create game");
      }
    } else {
      toast.error("Failed to create game");
    }
  };

  return (
    <div>
      <div className="mt-6">
        <h3 className="bg-green-600 text-white p-3 rounded-md flex justify-between items-center font-medium shadow-md">
          {selectedApi} Games
        </h3>
        <div>
          <div className="mt-4">
            {allHomeGames?.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {allHomeGames
                  ?.filter((homeGame) => homeGame.category === "এক্সক্লুসিভ")
                  .map((homeGame) => (
                    <div
                      key={homeGame._id}
                      className="border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                      <img
                        src={`${import.meta.env.VITE_BASE_API_URL}${
                          homeGame.image
                        }`}
                        alt="Game"
                      />
                      <div className="p-3 text-center font-medium text-gray-700">
                        {homeGame.name}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 text-lg font-semibold mt-6">
                No games available
              </p>
            )}
          </div>
          {/* );
          })} */}
        </div>
      </div>

      {/* Modal */}
      <Modal
        title={"Create New Game"}
        isOpen={isOpen}
        onOpenChange={() => setIsOpen(false)}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Game Name
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md focus:ring focus:ring-green-300"
              placeholder="Enter game name"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Game Link
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md focus:ring focus:ring-green-300"
              placeholder="Enter game link"
              value={gameLink}
              onChange={(e) => setGameLink(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Category
            </label>
            <select
              name="category"
              className="w-full p-2 border rounded-md focus:ring focus:ring-green-300"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">select one</option>
              {allCategories?.map((category, i) => (
                <option key={i} value={category?.name}>
                  {category?.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Sub Category
            </label>
            <select
              name="subCategory"
              className="w-full p-2 border rounded-md focus:ring focus:ring-green-300"
              value={selectedSubCategory}
              onChange={(e) => setSelectedSubCategory(e.target.value)}
            >
              <option value="">select one</option>
              {allSubCategories?.filter(
                (subCategory) => subCategory.category === selectedCategory
              ).length > 0 ? (
                allSubCategories
                  ?.filter(
                    (subCategory) => subCategory.category === selectedCategory
                  )
                  .map((subCategory, i) => (
                    <option key={i} value={subCategory?.name}>
                      {subCategory?.name}
                    </option>
                  ))
              ) : (
                <option value="" disabled>
                  No sub category available
                </option>
              )}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Game Image
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full p-2 border rounded-md focus:ring focus:ring-green-300"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="mt-3 relative w-28 h-28 border overflow-hidden group">
                <img
                  src={imagePreview}
                  alt="Icon Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleDeleteImage}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-600 text-black w-28 h-28 flex items-center justify-center text-sm opacity-0 bg-opacity-25 group-hover:opacity-100 transition-opacity duration-200"
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
              onClick={() => setIsOpen(false)}
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

export default AddGames;
