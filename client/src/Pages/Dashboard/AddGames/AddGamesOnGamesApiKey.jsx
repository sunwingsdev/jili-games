import { useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useOutletContext } from "react-router";
import { useGetAllCategoriesQuery } from "../../../redux/features/allApis/categoryApi/categoryApi";
import {
  useAddGameMutation,
  useDeleteHomeGameMutation,
  useGetAllHomeGamesQuery,
  useUpdateHomeGameMutation,
} from "../../../redux/features/allApis/homeGamesApi/homeGamesApi";
import { useGetAllSubCategoriesQuery } from "../../../redux/features/allApis/categoryApi/subCategoryApi";
import { useUploadImageMutation } from "../../../redux/features/allApis/uploadApi/uploadApi";
import Modal from "../../../Components/Shared/Modal";

const AddGamesOnGamesApiKey = () => {
  const { submenus } = useOutletContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [iconFile, setIconFile] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [gameName, setGameName] = useState("");
  const [gameLink, setGameLink] = useState("");
  const [gameDemoLink, setGameDemoLink] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [gameApi, setGameApi] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: allCategories } = useGetAllCategoriesQuery();
  const { data: allHomeGames } = useGetAllHomeGamesQuery();
  console.log(allHomeGames);
  const { data: allSubCategories } = useGetAllSubCategoriesQuery();
  const [updateHomeGame] = useUpdateHomeGameMutation();
  const [deleteHomeGame] = useDeleteHomeGameMutation();

  const [uploadImage] = useUploadImageMutation();
  const [addGame] = useAddGameMutation();

  const handleEdit = (game) => {
    setGameId(game._id);
    setGameName(game.name);
    setGameLink(game.link);
    setGameDemoLink(game.demoLink);
    setSelectedCategory(game.category);
    setSelectedSubCategory(game.subCategory);
    setGameApi(game.gameApi);
    setImagePreview(`${import.meta.env.VITE_BASE_API_URL}${game.image}`);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

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
    setLoading(true);

    try {
      let imagePath = imagePreview;

      if (iconFile) {
        const formData = new FormData();
        formData.append("image", iconFile);
        const { data } = await uploadImage(formData);
        if (data.filePath) {
          imagePath = data.filePath;
        }
      }

      const gameInfo = {
        name: gameName,
        link: gameLink,
        demoLink: gameDemoLink,
        category: selectedCategory,
        subCategory: selectedSubCategory,
        gameApi: gameApi,
        image: imagePath,
      };

      if (isEditMode) {
        // Updating existing game
        const result = await updateHomeGame({ id: gameId, data: gameInfo });
        if (result.data.modifiedCount > 0) {
          toast.success("Game updated successfully");
        }
      } else {
        // Creating a new game
        const result = await addGame(gameInfo);
        if (result.data.insertedId) {
          toast.success("Game created successfully");
        }
      }

      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      toast.error(error || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setGameId(null);
    setGameName("");
    setGameLink("");
    setGameDemoLink("");
    setSelectedCategory("");
    setSelectedSubCategory("");
    setGameApi("");
    setIconFile(null);
    setImagePreview(null);
    setIsEditMode(false);
  };

  const handleDelete = async (gameId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await deleteHomeGame(gameId);
        if (response.data.deletedCount > 0) {
          toast.success("Game deleted successfully");
        } else {
          toast.error("Failed to delete the game");
        }
      } catch (error) {
        toast.error(error || "Error deleting game");
      }
    }
  };

  return (
    <div>
      <div className="bg-[#172437] py-4 px-2 flex items-center justify-between">
        <h1 className="text-white text-3xl font-bold">Add Games</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-yellow-400 text-black px-4 py-1 text-xl"
        >
          Add+
        </button>
      </div>
      <div className="mt-6">
        <Tabs>
          {/* Main Category Tabs */}
          <TabList className="flex gap-4 border-b border-gray-300 overflow-x-auto scrollbar-hide px-2 md:px-0 mb-4">
            {allCategories?.map((category, i) => (
              <Tab
                key={i}
                className="px-4 py-2 text-base md:text-lg font-semibold text-gray-600 hover:text-gray-900 border-b-2 border-transparent transition-all duration-300 ease-in-out focus:outline-none data-[selected]:border-blue-500 data-[selected]:text-blue-500 whitespace-nowrap cursor-pointer"
              >
                {category.name}
              </Tab>
            ))}
          </TabList>

          {allCategories?.map((category, i) => (
            <TabPanel key={i}>
              {category.name === "এক্সক্লুসিভ" ? (
                // এক্সক্লুসিভ ক্যাটাগরির জন্য সরাসরি গেম দেখাবে
                <div className="grid grid-cols-5 gap-4 mt-4">
                  {allHomeGames
                    ?.filter((game) => game.category === category.name)
                    .map((game) => (
                      <div
                        key={game._id}
                        className="relative group border rounded-md shadow-md bg-white"
                      >
                        <img
                          src={`${import.meta.env.VITE_BASE_API_URL}${
                            game.image
                          }`}
                          alt={game.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                        <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            className="bg-blue-500 text-white p-2 rounded-full mr-2"
                            onClick={() => handleEdit(game)}
                          >
                            Edit
                          </button>
                          <button
                            className="bg-red-500 text-white p-2 rounded-full"
                            onClick={() => handleDelete(game._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : // অন্যান্য ক্যাটাগরির জন্য সাব-ক্যাটাগরি অনুযায়ী ট্যাব দেখাবে
              allSubCategories?.filter(
                  (subCategory) => subCategory.category === category.name
                ).length > 0 ? (
                <Tabs>
                  <TabList className="flex gap-4 border-b border-gray-300 overflow-x-auto scrollbar-hide px-2 md:px-0">
                    {allSubCategories
                      ?.filter(
                        (subCategory) => subCategory.category === category.name
                      )
                      .map((subCategory, j) => (
                        <Tab
                          key={j}
                          className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 border-b-2 border-transparent transition-all duration-300 ease-in-out focus:outline-none data-[selected]:border-blue-500 data-[selected]:text-blue-500 whitespace-nowrap cursor-pointer"
                        >
                          {subCategory.name}
                        </Tab>
                      ))}
                  </TabList>

                  {allSubCategories
                    ?.filter(
                      (subCategory) => subCategory.category === category.name
                    )
                    .map((subCategory, j) => (
                      <TabPanel key={j}>
                        <div className="grid grid-cols-5 gap-4 mt-4">
                          {allHomeGames?.filter(
                            (game) =>
                              game.category === category.name &&
                              game.subCategory === subCategory.name
                          ).length > 0 ? (
                            allHomeGames
                              ?.filter(
                                (game) =>
                                  game.category === category.name &&
                                  game.subCategory === subCategory.name
                              )
                              .map((game) => (
                                <div
                                  key={game._id}
                                  className="relative group border rounded-md shadow-md bg-white"
                                >
                                  <img
                                    src={`${import.meta.env.VITE_BASE_API_URL}${
                                      game.image
                                    }`}
                                    alt={game.name}
                                    className="w-full h-full object-cover rounded-md"
                                  />
                                  <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <button
                                      className="bg-blue-500 text-white p-2 rounded-full mr-2"
                                      onClick={() => handleEdit(game)}
                                    >
                                      Edit
                                    </button>
                                    <button
                                      className="bg-red-500 text-white p-2 rounded-full"
                                      onClick={() => handleDelete(game._id)}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              ))
                          ) : (
                            <p className="text-gray-500 text-sm font-semibold col-span-5">
                              No games available
                            </p>
                          )}
                        </div>
                      </TabPanel>
                    ))}
                </Tabs>
              ) : (
                <h2>No subcategories available</h2>
              )}
            </TabPanel>
          ))}
        </Tabs>
      </div>

      {/* Modal */}
      <Modal
        title={isEditMode ? "Update Game" : "Create New Game"}
        isOpen={isModalOpen}
        onOpenChange={() => setIsModalOpen(false)}
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
              Game Demo Link
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md focus:ring focus:ring-green-300"
              placeholder="Enter game link"
              value={gameDemoLink}
              onChange={(e) => setGameDemoLink(e.target.value)}
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
              Games Api Key
            </label>
            <select
              name="gamesApiKey"
              className="w-full p-2 border rounded-md focus:ring focus:ring-green-300"
              value={gameApi}
              onChange={(e) => setGameApi(e.target.value)}
            >
              <option value="">Select one</option>
              {submenus?.map((submenu, i) => (
                <option key={i} value={submenu?.value}>
                  {submenu?.label}
                </option>
              ))}
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
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-md w-full"
              disabled={loading}
            >
              {isEditMode ? "Update Game" : "Create Game"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AddGamesOnGamesApiKey;
