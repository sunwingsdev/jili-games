import BannerUpload from "../../../Components/Dashboard/HomeControl/BannerUpload";
import LogoSelectionSection from "../../../Components/Dashboard/HomeControl/LogoSelectionSection";
import LogoUploadSection from "../../../Components/Dashboard/HomeControl/LogoUploadSection";
import SliderSelectionSection from "../../../Components/Dashboard/HomeControl/SliderSelectionSection";
import SliderUploadSection from "../../../Components/Dashboard/HomeControl/SliderUploadSection";

const HomeControl = () => {
  return (
    <div className="">
      <LogoUploadSection />
      <LogoSelectionSection />
      <SliderUploadSection />
      <SliderSelectionSection />
      <BannerUpload />
    </div>
  );
};

export default HomeControl;
