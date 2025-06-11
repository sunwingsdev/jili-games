import { useEffect, useRef, useState } from "react";
import { MdOutlineArrowBackIos, MdCloseFullscreen } from "react-icons/md";
import desktopImage from "../../../assets/Logos/icon_pc.png";
import mobileImage from "../../../assets/Logos/icon_mobile-p.png";
import rotateImage from "../../../assets/Logos/icon_mobile-l.png";

const GameModal = ({ modalData, onClose }) => {
  const modalRef = useRef(null);
  const videoRef = useRef(null);
  const [orientation, setOrientation] = useState("landscape");

  useEffect(() => {
    // Disable scroll on modal open
    document.body.style.overflow = "hidden";

    return () => {
      // Enable scroll again when modal closes
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    // Auto set orientation based on screen width
    const updateOrientation = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setOrientation("portrait"); // Small devices
      } else if (width < 1024) {
        setOrientation("rotate"); // Medium devices
      } else {
        setOrientation("landscape"); // Large devices
      }
    };

    updateOrientation();
    window.addEventListener("resize", updateOrientation);
    return () => window.removeEventListener("resize", updateOrientation);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (video) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        video.requestFullscreen();
      }
    }
  };

  const getVideoWrapperClass = () => {
    switch (orientation) {
      case "portrait":
        return "lg:w-[280px] lg:h-[480px] w-[250px] h-[400px]";
      case "rotate":
        return "lg:w-[600px] lg:h-[250px] md:w-[480px] md:h-[270px] ";
      default:
        return "w-[800px] h-[450px]";
    }
  };

  const isCompactView = orientation === "portrait" || orientation === "rotate";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-md z-50 flex items-center justify-center px-2">
      <div ref={modalRef}>
        <div className="bg-black text-white p-4 rounded-3xl relative">
          {/* Video */}
          <div
            className={`flex justify-center items-center mx-auto transition-all duration-500 rounded overflow-hidden ${getVideoWrapperClass()}`}
          >
            {modalData?.link && (
              <iframe
                src={modalData.link}
                ref={videoRef}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Game Video"
              ></iframe>
            )}
          </div>

          {/* Footer Buttons */}
          <div
            className={`flex justify-between items-center mt-4 ${
              isCompactView ? "text-sm gap-2" : "text-lg"
            }`}
          >
            <button
              onClick={onClose}
              className={`flex gap-1 items-center text-white font-semibold ${
                isCompactView ? "py-1 px-2" : "py-1 px-4"
              } rounded-md`}
            >
              <MdOutlineArrowBackIos
                className={isCompactView ? "text-base" : "text-xl"}
              />
              {isCompactView ? "Back" : "Back to Games"}
            </button>

            <button
              onClick={toggleFullscreen}
              className={`flex gap-1  items-center text-white ${
                isCompactView ? "py-1 px-2" : "py-1 px-4"
              } rounded-md`}
            >
              <MdCloseFullscreen
                className={isCompactView ? "text-base" : "text-xl"}
              />
              {isCompactView ? "Full" : "Fullscreen"}
            </button>
          </div>
        </div>

        {/* View Switcher - Only show on large screens */}
        <div className="hidden lg:flex justify-center gap-4 py-1">
          {/* Desktop */}
          <button
            title="Desktop View"
            onClick={() => setOrientation("landscape")}
            className="flex items-center justify-center transition duration-300"
          >
            <div
              style={{
                WebkitMaskImage: `url(${desktopImage})`,
                WebkitMaskRepeat: "no-repeat",
                WebkitMaskSize: "contain",
                WebkitMaskPosition: "center",
              }}
              className="w-12 h-12 bg-[#333333] hover:bg-white"
            />
          </button>

          {/* Mobile */}
          <button
            title="Mobile View"
            onClick={() => setOrientation("portrait")}
            className="flex items-center justify-center transition duration-300"
          >
            <div
              style={{
                WebkitMaskImage: `url(${mobileImage})`,
                WebkitMaskRepeat: "no-repeat",
                WebkitMaskSize: "contain",
                WebkitMaskPosition: "center",
              }}
              className="w-12 h-12 bg-[#333333] hover:bg-white"
            />
          </button>

          {/* Rotate */}
          <button
            title="Rotate"
            onClick={() => setOrientation("rotate")}
            className="flex items-center justify-center transition duration-300"
          >
            <div
              style={{
                WebkitMaskImage: `url(${rotateImage})`,
                WebkitMaskRepeat: "no-repeat",
                WebkitMaskSize: "contain",
                WebkitMaskPosition: "center",
              }}
              className="w-12 h-12 bg-[#333333] hover:bg-white"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameModal;
