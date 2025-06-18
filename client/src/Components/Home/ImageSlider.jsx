import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useGetHomeControlsQuery } from "../../redux/features/allApis/homeControlApi/homeControlApi";

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("next");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const { data: homeControls } = useGetHomeControlsQuery();

  const desktopSlides = homeControls?.filter(
    (control) =>
      control.category === "slider" &&
      control.version === "desktop" &&
      control.isSelected === true
  );

  const mobileSlides = homeControls?.filter(
    (control) =>
      control.category === "slider" &&
      control.version === "mobile" &&
      control.isSelected === true
  );

  const currentSlides = isMobile ? mobileSlides : desktopSlides;

  const prevSlide = () => {
    setDirection("prev");
    setCurrentIndex((prev) =>
      prev === 0 ? currentSlides?.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setDirection("next");
    setCurrentIndex((prev) =>
      prev === currentSlides?.length - 1 ? 0 : prev + 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection("next");
      setCurrentIndex((prev) =>
        prev === currentSlides?.length - 1 ? 0 : prev + 1
      );
    }, 6000);

    return () => clearInterval(interval);
  }, [currentSlides?.length]);

  return (
    <div className="w-full bg-black flex flex-col items-center">
      <div className="relative w-full h-full group overflow-hidden">
        {currentSlides?.length === 0 && (
          <div className="text-white text-center py-10">
            No slider images available
          </div>
        )}

        {currentSlides?.map((slide, index) =>
          index === currentIndex ? (
            <div
              key={slide._id || index}
              className={`w-full ${
                direction === "next"
                  ? "animate-slide-left"
                  : "animate-slide-right"
              } h-full relative transition-all duration-700 ease-in-out overflow-hidden`}
            >
              <div className="absolute inset-0 bg-white opacity-20 animate-fade-in z-10 pointer-events-none" />

              <img
                src={`${import.meta.env.VITE_BASE_API_URL}${slide.image}`}
                alt={`Slide ${index}`}
                className="w-full hidden md:block object-cover"
              />

              <img
                src={`${import.meta.env.VITE_BASE_API_URL}${
                  mobileSlides?.[index]?.image || slide.image
                }`}
                alt={`Slide ${index} - mobile`}
                className="w-full h-[380px] object-cover md:hidden"
              />
            </div>
          ) : null
        )}

        {/* Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white text-2xl md:text-4xl px-3 py-1 opacity-0 group-hover:opacity-100 transition duration-300 z-10"
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-2xl md:text-4xl px-3 py-1 opacity-0 group-hover:opacity-100 transition duration-300 z-10"
        >
          <FaChevronRight />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {currentSlides?.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? "bg-bgYellow scale-110"
                  : "bg-bgYellow bg-opacity-50 hover:scale-110"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageSlider;
