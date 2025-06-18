import { useState } from "react";
import Modal from "../../Shared/Modal";
import SliderUploadForm from "./SliderUploadForm";

const OtherImageUploadSection = ({ title, modalTitle, other }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div>
        <div className="bg-[#172437] py-2 px-2 flex items-center justify-between">
          <h1 className="text-white text-2xl font-bold">{title} Image</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-yellow-400 text-black px-4 py-1 text-xl"
          >
            Add+
          </button>
        </div>
      </div>
      <Modal
        title={modalTitle}
        isOpen={isModalOpen}
        onOpenChange={() => setIsModalOpen(false)}
      >
        <SliderUploadForm
          version={title.toLowerCase()}
          category={other}
          closeModal={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  );
};

export default OtherImageUploadSection;
