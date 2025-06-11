import { useState } from "react";
import Modal from "../../Shared/Modal";
import SliderUploadForm from "./SliderUploadForm";

const SliderUploadSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div>
        <div className="bg-[#172437] py-4 px-2 flex items-center justify-between">
          <h1 className="text-white text-3xl font-bold">
            Home Slider Image Upload
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-yellow-400 text-black px-4 py-1 text-xl"
          >
            Add+
          </button>
        </div>
        {/* <div className="flex items-center justify-between border-2 bg-gray-400 rounded-lg">
          <p className="text-lg md:text-xl font-semibold px-3">
            Upload Home Slider Image
          </p>
          <Button
            className="bg-[#14805e] text-[#fde047]"
            onClick={() => setIsModalOpen(true)}
          >
            <IoAdd /> Add
          </Button>
        </div> */}
      </div>
      <Modal
        title={"Uplaod Home Slider Image"}
        isOpen={isModalOpen}
        onOpenChange={() => setIsModalOpen(false)}
      >
        <SliderUploadForm closeModal={() => setIsModalOpen(false)} />
      </Modal>
    </>
  );
};

export default SliderUploadSection;
