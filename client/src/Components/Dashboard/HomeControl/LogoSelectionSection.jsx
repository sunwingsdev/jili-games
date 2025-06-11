import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";

import Swal from "sweetalert2";
import {
  useDeleteHomeControlMutation,
  useGetHomeControlsQuery,
  useUpdateSelectionMutation,
} from "../../../redux/features/allApis/homeControlApi/homeControlApi";

const LogoSelectionSection = () => {
  const { data: homeControls, refetch } = useGetHomeControlsQuery();
  const [updateSelection] = useUpdateSelectionMutation();
  const [deleteHomeControl] = useDeleteHomeControlMutation();

  const logoHomeControls = homeControls?.filter(
    (control) => control.category === "logo"
  );

  const handleCheckboxChange = async (id) => {
    try {
      const result = await updateSelection(id);
      if (result.data) {
        toast.success(result.data.message);
      }
      refetch();
    } catch (error) {
      toast.error(error);
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
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 mb-10">
      {logoHomeControls?.map((control) => (
        <div
          className="relative border border-[#14805e] p-2 rounded-md w-80 h-36"
          key={control._id}
        >
          <img
            className="w-full h-full rounded-md"
            src={`${import.meta.env.VITE_BASE_API_URL}${control.image}`}
            alt=""
          />
          <input
            checked={control?.isSelected === true}
            className="absolute top-0 left-0 size-6"
            type="checkbox"
            name=""
            onChange={() => handleCheckboxChange(control._id)}
            id={control?._id}
          />
          <div
            onClick={() => handleDelete(control._id)}
            className="absolute -top-4 -right-4 p-2 group rounded-full hover:bg-red-600 duration-200 cursor-pointer"
          >
            <FaTrash className="text-2xl text-red-500 group-hover:text-white duration-200" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LogoSelectionSection;
