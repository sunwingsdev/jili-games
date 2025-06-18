import BannerUpload from "../../../Components/Dashboard/HomeControl/BannerUpload";
import LogoSelectionSection from "../../../Components/Dashboard/HomeControl/LogoSelectionSection";
import LogoUploadSection from "../../../Components/Dashboard/HomeControl/LogoUploadSection";
import SliderSelectionSection from "../../../Components/Dashboard/HomeControl/SliderSelectionSection";

const HomeControl = () => {
  return (
    <div className="">
      <LogoUploadSection />
      <LogoSelectionSection />
      <div className="bg-[#172437] py-4 px-2 flex items-center justify-between">
        <h1 className="text-white text-3xl font-bold">Homepage Image Upload</h1>
      </div>
      <SliderSelectionSection />
      <BannerUpload />
    </div>
  );
};

export default HomeControl;
