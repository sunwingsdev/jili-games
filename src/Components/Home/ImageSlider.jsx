import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import image1 from "../../assets/Images/Z8guBVJ9MZJi0JLAhA87DqYPIuDFGGjjHxNQ0YYL.jpg";
import imageSm1 from "../../assets/Images/VhVn7OyjuUacZbm2wn0DPbxVca2IzPyL0a2bZnBl.jpg";
import image2 from "../../assets/Images/3aiJyqMzIsqMCoGarHhw19twKMJBPDLscskCHIO5.jpg";
import imageSm2 from "../../assets/Images/f2nWuCXKcdgH6K7sC8dGxzX8ALgAqvjPLnCaI9sm.jpg";
import image3 from "../../assets/Images/2foLAqALmeV53fbB5jY3ACMLycpnUso3SqP8lm1Y.jpg";
import imageSm3 from "../../assets/Images/vDU7x1uxQFd0N0xbUzRrfQ3sXNIZ1vTQqpJ22OHD.jpg";
import image4 from "../../assets/Images/lHIn2rxdxmwmW6nHGrINNHsF05X5jXfatLNGCjir.jpg";
import imageSm4 from "../../assets/Images/XKMsslvB0bgiBJ41meWZH3mO02J0ysgOdnE8WMc5.jpg";
import image5 from "../../assets/Images/vnkIwdoVlvpaIB7XTnYgyUVTFUOjjkCwbeKP23jC.jpg";
import imageSm5 from "../../assets/Images/H8B3mKkGg3z8MxpJEXiMDJAIzPxhtpG9CDnvwHZj.jpg";
import image6 from "../../assets/Images/xrUZiMQ8p42Z7RBtC7PKssTrsNzalVaD79sZo56C.jpg";
import imageSm6 from "../../assets/Images/IDp2tMrI5awy7NUwsgyNrSvJRnifhYuRXLC02mEx.jpg";
import image7 from "../../assets/Images/eknlWaaB54VSanKXiAN2eP4hCnGRjPzzKUz4hB9J.jpg";
import imageSm7 from "../../assets/Images/07UTAXKN8CyhyZrQDE3cDh3QKGKwQjpM8lHYc4Sh.jpg";
import { Link } from "react-router-dom";

const slides = [
  {
    key: "slide1",
    image: image1,
    imageSm: imageSm1,
    link: "",
  },
  {
    key: "slide2",
    image: image2,
    imageSm: imageSm2,
  },
  {
    key: "slide3",
    image: image3,
    imageSm: imageSm3,
  },
  {
    key: "slide4",
    image: image4,
    imageSm: imageSm4,
    link: "",
  },
  {
    key: "slide5",
    image: image5,
    imageSm: imageSm5,
  },
  {
    key: "slide6",
    image: image6,
    imageSm: imageSm6,
  },
  {
    key: "slide7",
    image: image7,
    imageSm: imageSm7,
    link: "",
  },
];

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
   const [direction, setDirection] = useState("next");

  const prevSlide = () => {
     setDirection("prev");
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
     setDirection("next");
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="w-full bg-black flex flex-col items-center">
      <div className="relative w-full h-full group overflow-hidden">
        {slides.map((slide, index) =>
          index === currentIndex ? (
            <div
              key={currentIndex}
              className={`w-full ${direction === "next" ? "animate-slide-left" : "animate-slide-right"} h-full relative transition-all duration-700 ease-in-out overflow-hidden
       
  `}
               
            >
              <div className="absolute inset-0 bg-white opacity-20 animate-fade-in z-10 pointer-events-none" />

              {slide.link ? (
                <Link to={slide.link}>
                  <img
                    src={slide.image}
                    alt={slide.key}
                    className="w-full hidden md:block object-cover"
                  />
                  <img
                    src={slide.imageSm}
                    alt={`${slide.key}-mobile`}
                    className="w-full h-[380px] object-cover md:hidden"
                  />
                </Link>
              ) : (
                <>
                  <img
                    src={slide.image}
                    alt={slide.key}
                    className="w-full hidden md:block object-cover"
                  />
                  <img
                    src={slide.imageSm}
                    alt={`${slide.key}-mobile`}
                    className="w-full h-[380px] object-cover md:hidden"
                  />
                </>
              )}
            </div>
          ) : null
        )}

        {/* Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white lg:text-textColor-textPrimary text-2xl md:text-4xl px-3 py-1 opacity-0  group-hover:opacity-100 transition duration-300 z-10"
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white lg:text-textColor-textPrimary  text-2xl md:text-4xl px-3 py-1 opacity-0  group-hover:opacity-100 transition duration-300 z-10"
        >
          <FaChevronRight />
        </button>

        {/* Round Buttons (Dot Indicators) */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full ${
                currentIndex === index
                  ? "bg-bgYellow"
                  : "  bg-bgYellow bg-opacity-50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageSlider;
