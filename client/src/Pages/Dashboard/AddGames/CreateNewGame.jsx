import { useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useOutletContext } from "react-router";
import { useGetAllCategoriesQuery } from "../../../redux/features/allApis/categoryApi/categoryApi";
import { useAddGameMutation } from "../../../redux/features/allApis/homeGamesApi/homeGamesApi";
import { uploadImage } from "../../../hooks/files";
import toast from "react-hot-toast";

const CreateNewGame = () => {
  const [gameName, setGameName] = useState("");
  const [gameLink, setGameLink] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [gameApi, setGameApi] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [gameImage, setGameImage] = useState(null);
  const [specialFeatures, setSpecialFeatures] = useState([""]);
  const [maxWin, setMaxWin] = useState("");
  const [volatility, setVolatility] = useState("");
  const [paylines, setPaylines] = useState("");
  const [publishTime, setPublishTime] = useState("");
  const [description, setDescription] = useState("");
  const [supportedLanguages, setSupportedLanguages] = useState([""]);
  const [gameTrailerLink, setGameTrailerLink] = useState("");
  const [gameFeatureImages, setGameFeatureImages] = useState([]);
  const [gameFeatureImagePreviews, setGameFeatureImagePreviews] = useState([]);

  const { submenus } = useOutletContext();

  const [createGame, { isLoading }] = useAddGameMutation();

  const { data: allCategories } = useGetAllCategoriesQuery();

  const filteredCategories = allCategories?.filter(
    (cat) => !cat?.name?.toLowerCase().includes("all")
  );

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setGameImage(file);
    }
  };

  const handleDeleteImage = () => {
    setImagePreview("");
  };

  const resetForm = () => {
    setGameName("");
    setGameLink("");
    setSelectedCategory("");
    setGameApi("");
    setImagePreview("");
    setGameImage(null);
    setSpecialFeatures([""]);
    setMaxWin("");
    setVolatility("");
    setPaylines("");
    setPublishTime("");
    setDescription("");
    setSupportedLanguages([""]);
    setGameTrailerLink("");
    setGameFeatureImages([]);
    setGameFeatureImagePreviews([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imagePath = "";
      let featureImagePaths = [];

      // Upload main game image
      if (gameImage) {
        const { filePath } = await uploadImage(gameImage);
        imagePath = filePath;
      }

      // Upload feature images
      if (gameFeatureImages.length > 0) {
        for (let image of gameFeatureImages) {
          const { filePath } = await uploadImage(image);
          featureImagePaths.push(filePath);
        }
      }

      // Prepare final game data
      const newGameData = {
        name: gameName,
        link: gameLink,
        category: selectedCategory,
        apiKey: gameApi,
        maxWin,
        volatility,
        paylines,
        publishTime,
        image: imagePath,
        features: specialFeatures.filter((f) => f.trim() !== ""),
        languages: supportedLanguages.filter((l) => l.trim() !== ""),
        gameTrailerLink: gameTrailerLink,
        gameFeatureImages: featureImagePaths,
        description,
      };

      const res = await createGame(newGameData);

      if (res?.data?.insertedId) {
        toast.success("Game created successfully!");
        resetForm();
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      console.error("Submit Error:", error);
      toast.error(error?.message || "Failed to create game!");
    }
  };

  const languageOptions = [
    {
      label: "English",
      value: "en",
      flag: "https://flagcdn.com/gb.svg",
    },
    {
      label: "Bangla",
      value: "bn",
      flag: "https://flagcdn.com/bd.svg",
    },
    {
      label: "Hindi",
      value: "hi",
      flag: "https://flagcdn.com/in.svg",
    },
    {
      label: "Arabic",
      value: "ar",
      flag: "https://flagcdn.com/sa.svg",
    },
    {
      label: "Spanish",
      value: "es",
      flag: "https://flagcdn.com/es.svg",
    },
    {
      label: "French",
      value: "fr",
      flag: "https://flagcdn.com/fr.svg",
    },
    {
      label: "German",
      value: "de",
      flag: "https://flagcdn.com/de.svg",
    },
    {
      label: "Chinese",
      value: "zh",
      flag: "https://flagcdn.com/cn.svg",
    },
    {
      label: "Japanese",
      value: "ja",
      flag: "https://flagcdn.com/jp.svg",
    },
    {
      label: "Korean",
      value: "ko",
      flag: "https://flagcdn.com/kr.svg",
    },
    {
      label: "Russian",
      value: "ru",
      flag: "https://flagcdn.com/ru.svg",
    },
    {
      label: "Portuguese",
      value: "pt",
      flag: "https://flagcdn.com/pt.svg",
    },
    {
      label: "Italian",
      value: "it",
      flag: "https://flagcdn.com/it.svg",
    },
    {
      label: "Turkish",
      value: "tr",
      flag: "https://flagcdn.com/tr.svg",
    },
    {
      label: "Urdu",
      value: "ur",
      flag: "https://flagcdn.com/pk.svg",
    },
    {
      label: "Persian",
      value: "fa",
      flag: "https://flagcdn.com/ir.svg",
    },
  ];

  const convertToEmbedURL = (url) => {
    const match = url.match(/(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : "";
  };

  return (
    <div>
      <div className="bg-[#172437] py-4 px-2 flex items-center justify-between">
        <h1 className="text-white text-3xl font-bold">Create New Game</h1>
      </div>

      <div className="mt-6 max-w-4xl mx-auto p-4 text-white">
        <form onSubmit={handleSubmit}>
          {/* Game Basic Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Game Name"
              value={gameName}
              onChange={setGameName}
            />
            <InputField
              label="Game Link"
              value={gameLink}
              onChange={setGameLink}
            />
            {/* <InputField
              label="Game Demo Link"
              value={gameDemoLink}
              onChange={setGameDemoLink}
            /> */}
            <SelectField
              label="Category"
              value={selectedCategory}
              onChange={setSelectedCategory}
              options={filteredCategories?.map((c) => c.name)}
            />
            {/* <SelectField
              label="Sub Category"
              value={selectedSubCategory}
              onChange={setSelectedSubCategory}
              options={allSubCategories
                .filter((sc) => sc.category === selectedCategory)
                .map((sc) => sc.name)}
              fallback="No sub category available"
            /> */}
            <SelectField
              label="Games API Key"
              value={gameApi}
              onChange={setGameApi}
              options={submenus?.map((s) => s.value)}
            />
            <InputField label="Max Win" value={maxWin} onChange={setMaxWin} />
            <InputField
              label="Volatility"
              value={volatility}
              onChange={setVolatility}
            />
            <InputField
              label="Paylines"
              value={paylines}
              onChange={setPaylines}
            />
            <InputField
              label="Publish Time"
              value={publishTime}
              onChange={setPublishTime}
            />
          </div>

          {/* Image Upload */}
          <div className="mt-4">
            <label className="block mb-1 font-medium text-black">
              Game Image
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full p-2 border border-gray-400 rounded text-black"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="mt-3 relative w-28 h-28 border border-gray-400 overflow-hidden group">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleDeleteImage}
                  className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100"
                >
                  <IoMdCloseCircleOutline className="text-white text-3xl" />
                </button>
              </div>
            )}
          </div>

          {/* Special Features */}
          <div className="mt-4">
            <label className="block mb-1 font-medium text-black">
              Special Features
            </label>
            {specialFeatures.map((feature, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder={`Feature ${i + 1}`}
                  value={feature}
                  onChange={(e) => {
                    const newFeatures = [...specialFeatures];
                    newFeatures[i] = e.target.value;
                    setSpecialFeatures(newFeatures);
                  }}
                  className="w-full p-2 border border-gray-400 rounded text-black"
                />
                {specialFeatures.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newFeatures = specialFeatures.filter(
                        (_, idx) => idx !== i
                      );
                      setSpecialFeatures(newFeatures);
                    }}
                    className="text-red-500 text-sm"
                  >
                    ✖
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              className="text-sm text-black hover:underline"
              onClick={() => setSpecialFeatures([...specialFeatures, ""])}
            >
              + Add More
            </button>
          </div>

          {/* Supported Languages */}
          <div className="mt-4">
            <label className="block mb-1 font-medium text-black">
              Supported Languages
            </label>
            <div className="grid grid-cols-2 gap-2">
              {languageOptions.map((lang) => (
                <label
                  key={lang.value}
                  className="flex items-center gap-2 bg-gray-100 text-black p-2 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={supportedLanguages.includes(lang.flag)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSupportedLanguages([
                          ...supportedLanguages,
                          lang.flag,
                        ]);
                      } else {
                        setSupportedLanguages(
                          supportedLanguages.filter((l) => l !== lang.flag)
                        );
                      }
                    }}
                  />
                  <img
                    src={lang.flag}
                    alt={lang.label}
                    className="w-5 h-5 rounded"
                  />
                  <span>{lang.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* YouTube Video Link */}
          <div className="mt-4">
            <label className="block mb-1 font-medium text-black">
              Game Trailer Video Link
            </label>
            <input
              type="text"
              value={gameTrailerLink}
              onChange={(e) => setGameTrailerLink(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=XXXX"
              className="w-full p-2 border border-gray-400 rounded text-black"
            />
            {gameTrailerLink && (
              <div className="mt-2">
                <iframe
                  width="100%"
                  height="315"
                  src={convertToEmbedURL(gameTrailerLink)}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>

          {/* Extra Game Images */}
          <div className="mt-4">
            <label className="block mb-1 font-medium text-black">
              Game Feature Images
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files);
                const previews = files.map((file) => URL.createObjectURL(file));
                setGameFeatureImages([...gameFeatureImages, ...files]);
                setGameFeatureImagePreviews([
                  ...gameFeatureImagePreviews,
                  ...previews,
                ]);
              }}
              className="w-full p-2 border border-gray-400 rounded text-black"
            />
            <div className="flex flex-wrap gap-4 mt-2">
              {gameFeatureImagePreviews.map((img, i) => (
                <div
                  key={i}
                  className="relative w-24 h-24 border border-gray-300"
                >
                  <img
                    src={img}
                    alt={`Extra ${i}`}
                    className="w-full h-full object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newPreviews = [...gameFeatureImagePreviews];
                      const newImages = [...gameFeatureImages];
                      newPreviews.splice(i, 1);
                      newImages.splice(i, 1);
                      setGameFeatureImagePreviews(newPreviews);
                      setGameFeatureImages(newImages);
                    }}
                    className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1 rounded-full"
                  >
                    ✖
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="mt-4">
            <label className="block mb-1 font-medium text-black">
              Game Description
            </label>
            <textarea
              rows={4}
              className="w-full p-2 border border-gray-400 rounded text-black"
              placeholder="Enter description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Submit */}
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-2 rounded-md"
            >
              {isLoading ? "Loading..." : "Create Game"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Reusable Input
const InputField = ({ label, value, onChange }) => (
  <div>
    <label className="block mb-1 font-medium text-black">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2 border border-gray-400 rounded text-black"
    />
  </div>
);

// Reusable Select
const SelectField = ({
  label,
  value,
  onChange,
  options = [],
  fallback = "No options available",
}) => (
  <div>
    <label className="block mb-1 font-medium text-black">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2 border border-gray-400 rounded text-black"
    >
      <option value="">Select one</option>
      {options.length > 0 ? (
        options.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))
      ) : (
        <option disabled>{fallback}</option>
      )}
    </select>
  </div>
);

export default CreateNewGame;
