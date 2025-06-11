import { useState } from "react";
import { IoAdd } from "react-icons/io5";
import toast from "react-hot-toast";
import { useUploadImageMutation } from "../../../redux/features/allApis/uploadApi/uploadApi";
import { useAddHomeControlMutation } from "../../../redux/features/allApis/homeControlApi/homeControlApi";
import { Button } from "../../ui/button";
import SpinLoader from "../../Shared/Loader/SpinLoader";

const LogoUploadForm = ({ closeModal }) => {
  const [uploadImage] = useUploadImageMutation();
  const [addHomeControl] = useAddHomeControlMutation();
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
      setLogoFile(file);
    }
  };

  const handleRemove = () => {
    setLogoPreview(null);
    setLogoFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (logoFile) {
      const formData = new FormData();
      formData.append("image", logoFile);
      try {
        setLoading(true);
        const { data } = await uploadImage(formData);
        if (data.filePath) {
          const logoInfo = {
            page: "home",
            section: "navbar",
            category: "logo",
            image: data?.filePath,
          };
          const result = await addHomeControl(logoInfo);
          if (result.data.insertedId) {
            toast.success("Logo uploaded successfully");
            setLogoPreview(null);
            setLogoFile(null);
            setLoading(false);
            closeModal();
          }
        }
      } catch (error) {
        setLoading(false);

        toast.error("Failed to upload logo");
      }
    } else {
      toast.error("Failed to upload image");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
          {!logoPreview ? (
            <label className="w-full h-full flex flex-col items-center text-center cursor-pointer relative">
              <div className="text-gray-400 text-4xl mb-4">📤</div>
              <p className="text-gray-500">Select a logo to upload</p>
              <p className="text-gray-400 text-sm">or drag and drop it here</p>
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
            </label>
          ) : (
            <div className="flex flex-col items-center">
              <img
                src={logoPreview}
                alt="Preview"
                className="w-full h-auto object-cover rounded-md mb-4"
              />
              <button
                type="button"
                onClick={handleRemove}
                className="text-red-500 text-sm hover:underline"
              >
                Remove Logo
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center justify-center">
          <Button
            disabled={loading || !logoFile}
            type="submit"
            className="bg-[#14805e] hover:bg-[#19614a] flex items-center gap-2 disabled:bg-slate-600 disabled:cursor-not-allowed"
          >
            {loading ? (
              <SpinLoader />
            ) : (
              <>
                <IoAdd /> Upload
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LogoUploadForm;
