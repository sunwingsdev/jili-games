import { AiOutlinePlus, AiOutlineCamera } from "react-icons/ai";
import Swal from "sweetalert2";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { useState } from "react";
import Select from "react-select";
import toast from "react-hot-toast";
import { useAddPaymentMethodMutation } from "../../../redux/features/allApis/paymentMethodApi/paymentMethodApi";
import { uploadImage } from "../../../hooks/files";

const AddDepositMethodForm = () => {
  const [addPaymentMethod, { isLoading }] = useAddPaymentMethodMutation();
  const [formData, setFormData] = useState({
    method: "",
    gateway: [],
    color: "",
    userInputs: [],
  });
  const [uploadedImage, setUploadedImage] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [file, setFile] = useState(null);
  const [instruction, setInstruction] = useState("");
  // Temporary state for the popup form
  const [newField, setNewField] = useState({
    type: "",
    isRequired: "",
    label: "",
    width: "",
    fieldInstruction: "",
  });

  const [selectedChannels, setSelectedChannels] = useState([]);

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form input changes
  const changeFormData = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle popup form changes
  const handlePopupChange = (e) => {
    const { name, value } = e.target;
    setNewField((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle popup form submission
  const handlePopupSubmit = () => {
    setFormData((prevState) => ({
      ...prevState,
      userInputs: [...prevState.userInputs, newField],
    }));

    // Reset the popup form fields
    setNewField({
      type: "",
      isRequired: "",
      label: "",
      name: "",
      fieldInstruction: "",
    });

    setShowPopup(false);
    Swal.fire("Success!", "New field added successfully.", "success");
  };

  // Handle deletion of a field
  const handleDeleteField = (index) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This field will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        const deletedField = formData.userInputs[index];
        setFormData((prevState) => ({
          ...prevState,
          userInputs: prevState.userInputs.filter((_, i) => i !== index), // Remove the field
        }));
        console.log("Field Deleted:", deletedField);
        Swal.fire("Deleted!", "Field has been removed.", "success");
      }
    });
  };

  const customStyles = {
    control: (base, state) => ({
      ...base,
      border: "1px solid #D1D5DB", // Tailwind: border-gray-300
      borderRadius: "5px",
      marginTop: "5px",
      padding: "4px 8px",
      boxShadow: state.isFocused ? "0 0 0 1px #6366F1" : "none", // Tailwind indigo-500 ring
      borderColor: state.isFocused ? "#6366F1" : "#D1D5DB",
      "&:hover": {
        borderColor: "#6366F1",
      },
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#E0E7FF", // Tailwind indigo-100
      color: "#3730A3", // Tailwind indigo-800
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "#3730A3", // Tailwind indigo-800
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "#3730A3",
      ":hover": {
        backgroundColor: "#C7D2FE", // Tailwind indigo-200
        color: "#1E3A8A", // Tailwind indigo-900
      },
    }),
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (file) {
      const { filePath } = await uploadImage(file);
      if (filePath) {
        // Prepare the payload
        const payload = {
          ...formData,
          image: filePath,
          instruction,
          paymentType: "deposit",
        };
        const result = await addPaymentMethod(payload);
        if (result.error) {
          toast.error(result.error.data.error);
        }
        if (result.data.insertedId) {
          toast.success("Payment method added successfully.");
          setFormData({
            method: "",
            gateway: "apay",
            color: "",
            userInputs: [],
          });
          setUploadedImage(null);
          setFile(null);
          setInstruction("");
        }
      }
    }
  };

  // Modules for ReactQuill
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
      ["link"],
      ["clean"],
      ["image"],
      [{ font: [] }],
      [{ size: ["small", "medium", "large", "huge"] }],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "list",
    "bullet",
    "color",
    "background",
    "link",
    "image",
    "font",
    "size",
  ];

  return (
    <section className="px-[20px] py-[35px]">
      <div className="">
        <form
          onSubmit={handleSubmit}
          className="bg-white border-[1px] border-[#eee] p-4"
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">
              Add Manual Gateway / Deposit
            </h1>
          </div>

          {/* Image Upload */}
          <div className="mb-[60px] w-[20%] h-[200px]">
            <label className="font-medium text-gray-700 mb-2 block">
              Upload Image
            </label>
            <div className="relative border rounded-md px-4 py-2 h-full bg-gray-50 flex items-center justify-center">
              {uploadedImage ? (
                <img
                  src={uploadedImage}
                  alt="Uploaded"
                  className="w-32 h-32 object-cover rounded-md"
                />
              ) : (
                <AiOutlineCamera className="text-gray-500 text-4xl" />
              )}
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleImageUpload}
                required
              />
            </div>
          </div>

          {/* Gateway Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="flex flex-col">
              <label className="font-medium text-gray-700">
                Gateway Name *
              </label>
              <input
                required
                name="method"
                type="text"
                value={formData.method}
                onChange={changeFormData}
                className="border rounded-[5px] mt-[5px] px-4 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="mb-4">
              <label className="font-medium text-gray-700">
                Gateway Channel *
              </label>
              <Select
                isMulti
                placeholder="Select or create gateway channels"
                classNamePrefix="react-select"
                value={selectedChannels}
                onChange={(selectedOptions) => {
                  setSelectedChannels(selectedOptions);
                  setFormData((prev) => ({
                    ...prev,
                    gateway: selectedOptions.map((option) => option.value),
                  }));
                }}
                options={[
                  { value: "apay", label: "A-Pay (Admin Pay)" },
                  { value: "cpay", label: "C-Pay (Cash Agent Pay)" },
                ]}
                styles={customStyles}
              />
            </div>

            <div className="flex flex-col">
              <label className="font-medium text-gray-700">Color *</label>
              <div className="flex items-center border-[1px] border-[#eee] rounded-md">
                <input
                  name="color"
                  type="text"
                  value={formData.color}
                  onChange={changeFormData}
                  className="w-full h-full outline-none px-4 py-2"
                  placeholder="Enter color code"
                />
                <input
                  name="color"
                  type="color"
                  value={formData.color}
                  onChange={changeFormData}
                  className="w-[40px] h-full outline-none"
                />
              </div>
            </div>
          </div>

          {/* Deposit Instruction */}
          <div className="mb-6">
            <h2 className="bg-green-600 text-white py-2 px-4 rounded-md mb-2">
              Deposit Instruction
            </h2>
            <ReactQuill
              modules={modules}
              formats={formats}
              style={{ height: "250px" }}
              value={instruction}
              onChange={setInstruction}
              className="w-full mt-[8px] mb-[70px]"
            />
          </div>

          {/* User Data Table */}
          <div className="mb-6">
            <div className="flex justify-between items-center bg-green-600 px-[10px] py-[5px] rounded-t-[10px]">
              <h2 className="text-white py-2 px-4 rounded-md mb-2">
                User Data
              </h2>
              <div
                className="flex items-center cursor-pointer text-white border-[1px] border-white px-[10px] py-[6px] rounded-[5px] focus:outline-none"
                onClick={() => setShowPopup(true)}
              >
                <AiOutlinePlus className="mr-1" /> Add New
              </div>
            </div>
            <table className="table-auto w-full border-collapse border border-gray-200 mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 px-4 py-2">Type</th>
                  <th className="border border-gray-200 px-4 py-2">
                    Is Required
                  </th>
                  <th className="border border-gray-200 px-4 py-2">Label</th>
                  <th className="border border-gray-200 px-4 py-2">Name</th>
                  <th className="border border-gray-200 px-4 py-2">
                    Instruction
                  </th>
                  <th className="border border-gray-200 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {formData.userInputs.map((field, index) => (
                  <tr key={index} className="text-center">
                    <td className="border border-gray-200 px-4 py-2">
                      {field.type}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {field.isRequired}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {field.label}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {field.name}
                    </td>

                    <td className="border border-gray-200 px-4 py-2">
                      {field.fieldInstruction || "N/A"}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      <button
                        className="text-red-500 hover:text-red-600 focus:outline-none"
                        onClick={() => handleDeleteField(index)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-500 text-white py-3 rounded-md hover:bg-indigo-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit
          </button>
        </form>

        {/* Popup for Adding New Fields */}
        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center z-[10] justify-center">
            <div className="bg-white rounded-lg p-6 w-[30%]">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Generate Form
              </h3>
              <div className="mb-4">
                <label className="font-medium text-gray-700">Type *</label>
                <select
                  name="type"
                  className="border rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={newField.type}
                  onChange={handlePopupChange}
                >
                  <option value="">Select One</option>
                  <option value="file">File</option>
                  <option value="text">Text</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="font-medium text-gray-700">
                  Is Required *
                </label>
                <select
                  name="isRequired"
                  className="border rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={newField.isRequired}
                  onChange={handlePopupChange}
                >
                  <option value="">Select One</option>
                  <option value="required">Required</option>
                  <option value="optional">Optional</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="font-medium text-gray-700">Label *</label>
                <input
                  name="label"
                  type="text"
                  className="border rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={newField.label}
                  onChange={handlePopupChange}
                />
              </div>
              <div className="mb-4">
                <label className="font-medium text-gray-700">Name *</label>
                <input
                  name="name"
                  type="text"
                  className="border rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={newField.name}
                  onChange={handlePopupChange}
                />
              </div>

              <div className="mb-4">
                <label className="font-medium text-gray-700">
                  Instruction (if any)
                </label>
                <input
                  name="fieldInstruction"
                  type="text"
                  className="border rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={newField.fieldInstruction}
                  onChange={handlePopupChange}
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowPopup(false)}
                  className="text-gray-500 hover:text-gray-600 focus:outline-none mr-4"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePopupSubmit}
                  className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AddDepositMethodForm;
