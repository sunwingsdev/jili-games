import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import {
  useDeleteHomeControlMutation,
  useGetHomeControlsQuery,
  useUpdateSelectionMutation,
} from "../../../redux/features/allApis/homeControlApi/homeControlApi";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import SliderUploadSection from "./SliderUploadSection";
import OtherImageUploadSection from "./OtherImageUploadSection";
import OtherImageSelectionSection from "./OtherImageSelectionSection";

const SliderSelectionSection = () => {
  const { data: homeControls, refetch } = useGetHomeControlsQuery();
  const [updateSelection] = useUpdateSelectionMutation();
  const [deleteHomeControl] = useDeleteHomeControlMutation();

  const desktopSliderControls = homeControls?.filter(
    (control) =>
      control.page === "home" &&
      control.category === "slider" &&
      control.version === "desktop"
  );

  const mobileSliderControls = homeControls?.filter(
    (control) =>
      control.page === "home" &&
      control.category === "slider" &&
      control.version === "mobile"
  );

  const handleCheckboxChange = async (id) => {
    try {
      const result = await updateSelection(id);
      if (result.data) {
        toast.success(result.data.message);
      }
      refetch();
    } catch (error) {
      toast.error(error || "Failed to update selection");
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
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
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

  const renderSliderCards = (controls) => (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4 mb-10">
      {controls?.map((control) => (
        <div
          className="relative border border-[#14805e] p-2 rounded-md w-96"
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
            onChange={() => handleCheckboxChange(control._id)}
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

  return (
    <div className="mt-6">
      <Tabs>
        <TabList className="flex gap-4 border-b border-gray-300 overflow-x-auto scrollbar-hide px-2 md:px-0">
          <Tab className="px-4 py-2 text-base md:text-lg font-semibold text-gray-600 hover:text-gray-900 border-b-2 border-transparent transition-all duration-300 ease-in-out focus:outline-none data-[selected]:border-blue-500 data-[selected]:text-blue-500 whitespace-nowrap cursor-pointer">
            Desktop Slider
          </Tab>
          <Tab className="px-4 py-2 text-base md:text-lg font-semibold text-gray-600 hover:text-gray-900 border-b-2 border-transparent transition-all duration-300 ease-in-out focus:outline-none data-[selected]:border-blue-500 data-[selected]:text-blue-500 whitespace-nowrap cursor-pointer">
            Mobile Slider
          </Tab>
          <Tab className="px-4 py-2 text-base md:text-lg font-semibold text-gray-600 hover:text-gray-900 border-b-2 border-transparent transition-all duration-300 ease-in-out focus:outline-none data-[selected]:border-blue-500 data-[selected]:text-blue-500 whitespace-nowrap cursor-pointer">
            Our Games
          </Tab>
          <Tab className="px-4 py-2 text-base md:text-lg font-semibold text-gray-600 hover:text-gray-900 border-b-2 border-transparent transition-all duration-300 ease-in-out focus:outline-none data-[selected]:border-blue-500 data-[selected]:text-blue-500 whitespace-nowrap cursor-pointer">
            Jili Games Section
          </Tab>
        </TabList>

        <TabPanel className="mt-4">
          <SliderUploadSection
            title="Desktop"
            uploadCategory="slider"
            modalTitle="Uplaod Desktop Slider Image"
          />
          {renderSliderCards(desktopSliderControls)}
        </TabPanel>
        <TabPanel className="mt-4">
          <SliderUploadSection
            title="Mobile"
            uploadCategory="slider"
            modalTitle="Uplaod Mobile Slider Image"
          />
          {renderSliderCards(mobileSliderControls)}
        </TabPanel>
        <TabPanel className="mt-4">
          <OtherImageUploadSection
            title="Our Games"
            modalTitle="Uplaod Our Games Image"
            other="other"
          />
          <OtherImageSelectionSection category="other" version="our games" />
        </TabPanel>
        <TabPanel className="mt-4">
          <OtherImageUploadSection
            title="Jili Games"
            modalTitle="Uplaod Jili Games Image"
            other="other1"
          />
          <OtherImageSelectionSection category="other1" version="jili games" />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default SliderSelectionSection;
