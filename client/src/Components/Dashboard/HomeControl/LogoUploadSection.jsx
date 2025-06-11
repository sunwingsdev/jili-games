import { useState } from "react";
import Modal from "../../Shared/Modal";
import LogoUploadForm from "./LogoUploadForm";

const LogoUploadSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div>
        <div className="bg-[#172437] py-4 px-2 flex items-center justify-between">
          <h1 className="text-white text-3xl font-bold">Logo Upload</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-yellow-400 text-black px-4 py-1 text-xl"
          >
            Add+
          </button>
        </div>
        {/* <div className="flex items-center justify-between border-2 bg-gray-400 rounded-lg">
          <p className="text-lg md:text-xl font-semibold px-3">Upload Logo</p>
          <Button
            className="bg-[#14805e] text-[#fde047]"
            onClick={() => setIsModalOpen(true)}
          >
            <IoAdd /> Add
          </Button>
        </div> */}
      </div>
      <Modal
        title={"Uplaod logo"}
        isOpen={isModalOpen}
        onOpenChange={() => setIsModalOpen(false)}
      >
        <LogoUploadForm closeModal={() => setIsModalOpen(false)} />
      </Modal>
    </>
  );
};

export default LogoUploadSection;
