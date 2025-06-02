import { useCallback, useEffect, useRef } from "react";

import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import { useNavigate, useOutletContext } from "react-router";

const AllGames = () => {
  const navigate = useNavigate();
  const { images, setModalData } = useOutletContext();
  const scrollRef = useRef();
  const scrollRefSmall = useRef();
  const autoScrollInterval = useRef(null);
  const timeoutRef = useRef(null);

  const isLargeDevice = () => window.innerWidth >= 1024;

  const scrollLeft = () => {
    if (isLargeDevice()) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    } else {
      scrollRefSmall.current.scrollBy({
        left: -window.innerWidth,
        behavior: "smooth",
      });
    }
    pauseAutoScrollTemporarily();
  };

  const scrollRight = () => {
    if (isLargeDevice()) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    } else {
      scrollRefSmall.current.scrollBy({
        left: window.innerWidth,
        behavior: "smooth",
      });
    }
    pauseAutoScrollTemporarily();
  };

  const startAutoScroll = useCallback(() => {
    autoScrollInterval.current = setInterval(() => {
      const scrollContainer = isLargeDevice()
        ? scrollRef.current
        : scrollRefSmall.current;

      if (
        scrollContainer.scrollLeft + scrollContainer.clientWidth >=
        scrollContainer.scrollWidth
      ) {
        scrollContainer.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollContainer.scrollBy({
          left: isLargeDevice() ? 300 : window.innerWidth,
          behavior: "smooth",
        });
      }
    }, 3000);
  }, []);

  const pauseAutoScrollTemporarily = () => {
    clearInterval(autoScrollInterval.current);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      startAutoScroll();
    }, 5000); // 5 seconds pause
  };

  useEffect(() => {
    startAutoScroll();
    return () => {
      clearInterval(autoScrollInterval.current);
      clearTimeout(timeoutRef.current);
    };
  }, [startAutoScroll]);

  return (
    <div className="md:px-4 py-8">
      {/* ✅ Large device */}
      <div className="relative w-full hidden lg:block">
        <div
          ref={scrollRef}
          className="flex flex-row md:gap-6 overflow-x-auto scroll-smooth py-4 hide-scrollbar w-full md:w-[85%] md:mx-auto"
        >
          {images.map((img) => (
            <div
              key={img.id}
              className="relative group min-w-full md:min-w-[40%] lg:min-w-[25%] bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={img.image}
                alt={img.name}
                className="w-full object-cover"
              />
              <div
                className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white text-center px-2
              pointer-events-none group-hover:pointer-events-auto"
              >
                <h3 className="xl:text-2xl lg:text-xl text-lg uppercase font-bold mb-3">
                  {img.name}
                </h3>
                <button
                  onClick={() => setModalData(img)}
                  className="mb-2 bg-bgYellow text-black font-semibold py-1 w-[60%] text-lg rounded-md"
                >
                  Play Now
                </button>
                <button
                  onClick={() =>
                    navigate(`/game/${img.id}`, {
                      state: { source: "images" }, // 👈 passing source
                    })
                  }
                  className="bg-black whitespace-nowrap w-[60%] text-lg font-semibold py-1 px-4 rounded-md"
                >
                  Game Info
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Buttons - Large */}
        <button
          onClick={scrollLeft}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-80 transition"
        >
          <FaCaretLeft className="text-3xl md:text-5xl" />
        </button>
        <button
          onClick={scrollRight}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-80 transition"
        >
          <FaCaretRight className="text-3xl md:text-5xl" />
        </button>
      </div>

      {/* ✅ Small device */}
      <div className="relative w-full lg:hidden">
        <div
          ref={scrollRefSmall}
          className="flex gap-0 mx-auto w-[80%] overflow-x-auto scroll-smooth hide-scrollbar snap-x snap-mandatory"
        >
          {images.map((img) => (
            <div
              key={img.id}
              className="snap-start relative group mx-auto md:min-w-[40vw] min-w-[80vw] rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={img.image}
                alt={img.name}
                className="w-[80%] mx-auto object-contain"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white text-center px-2 pointer-events-none group-hover:pointer-events-auto">
                <h3 className="  uppercase font-bold mb-3">{img.name}</h3>
                <button
                  onClick={() => setModalData(img)}
                  className="mb-2 bg-bgYellow text-black font-semibold py-1 w-[60%]  rounded-md"
                >
                  Play Now
                </button>
                <button
                  onClick={() =>
                    navigate(`/game/${img.id}`, {
                      state: { source: "images" }, // 👈 passing source
                    })
                  }
                  className="bg-black whitespace-nowrap w-[60%]  font-semibold py-1 px-4 rounded-md"
                >
                  Game Info
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Buttons - Small */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 text-white transition"
        >
          <FaCaretLeft className="text-4xl" />
        </button>
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 text-white transition"
        >
          <FaCaretRight className="text-4xl" />
        </button>
      </div>
    </div>
  );
};

export default AllGames;
