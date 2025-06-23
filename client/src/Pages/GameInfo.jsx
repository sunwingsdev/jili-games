import { useContext, useState } from "react";
import { useParams, useOutletContext } from "react-router";
import chillImage from "../assets/Images/chill.png";
import pcImage from "../assets/Images/pc.png";
import tabletImage from "../assets/Images/tablet.png";
import rotateImage from "../assets/Images/phone_horizon.png";
import { useGetHomeGameByIdQuery } from "../redux/features/allApis/homeGamesApi/homeGamesApi";
import { ImFilesEmpty } from "react-icons/im";
import { FaLock, FaLockOpen } from "react-icons/fa";
import { useSelector } from "react-redux";
import { ModalContext } from "../providers/ModalProvider";
import RelatedGames from "../Components/GameInfo/RelatedGames";

const GameInfo = () => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);

  const { setIsPromoModalOpen } = useContext(ModalContext);

  const { data: singleGame } = useGetHomeGameByIdQuery(id);

  const { setModalData } = useOutletContext();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!singleGame)
    return <p className="text-center text-white">Game not found</p>;

  const extraImages = [pcImage, tabletImage, rotateImage];

  const carouselImages =
    singleGame?.gameFeatureImages?.map(
      (imgPath) => `${import.meta.env.VITE_BASE_API_URL}${imgPath}`
    ) || [];

  const convertToEmbedURL = (url) => {
    const match = url.match(/(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : "";
  };

  const dummyData = [
    { category: "Animation" },
    { category: "Banners" },
    { category: "Cut-Outs" },
    { category: "Factsheets" },
    { category: "Guidelines" },
    { category: "Images" },
    { category: "Logos" },
    { category: "Poster" },
    { category: "Thumbnails" },
    { category: "Videos" },
  ];

  return (
    <div className=" pt-20  text-white">
      <div className="flex flex-col max-w-5xl mx-auto lg:flex-row justify-center gap-20 p-4">
        {/* Left Side */}
        <div className=" ">
          <div className="flex justify-center">
            <img
              src={`${import.meta.env.VITE_BASE_API_URL}${singleGame?.image}`}
              alt={singleGame?.name}
              className="lg:w-full w-[80%] md:w-[30%] rounded-lg mb-4"
            />
          </div>
          <div className="flex flex-col items-center gap-4 lg:flex-row justify-center">
            <h1 className="text-3xl  lg:hidden font-bold text-white">
              {singleGame?.name}
            </h1>
            <button
              className="lg:w-[60%] w-[60%] md:w-[20%] bg-bgYellow py-3 rounded-xl text-black text-lg font-medium mb-4  hover:bg-opacity-80"
              onClick={() => setModalData(singleGame)}
            >
              Play Now
            </button>
          </div>
          <div className="flex justify-center gap-2">
            {extraImages.map((img, idx) => (
              <img key={idx} src={img} alt="extra" className=" " />
            ))}
          </div>
        </div>

        {/* Right Side */}
        <div className="flex-1 space-y-4">
          <h1 className="text-4xl hidden lg:block font-bold text-white">
            {singleGame?.name}
          </h1>
          <div className="lg:flex  gap-4 space-y-4 lg:space-y-0 ">
            <div className="border border-white border-opacity-30 px-2 py-4 bg-bgGameTab rounded lg:w-full w-[80%] mx-auto  text-center">
              <p className="text-sm ">MAX WIN</p>
              <p className="text-xl text-textYellow font-bold">
                {singleGame?.maxWin}X
              </p>
            </div>
            <div className="border border-white border-opacity-30 px-2 py-4 bg-bgGameTab rounded lg:w-full w-[80%] text-center mx-auto">
              <p className="text-sm ">VOLATILITY</p>
              <div className="flex gap-1 justify-center items-center">
                <p className="text-xl text-textYellow font-bold">
                  {singleGame?.volatility}
                </p>
                <img src={chillImage} alt="" />
                <img src={chillImage} alt="" />
              </div>
            </div>
          </div>

          <div className="border-b py-2 flex gap-12">
            <p className="text-textYellow font-bold whitespace-nowrap w-full   md:w-[30%]">
              Type of Game
            </p>
            <p className="font-semibold text-left w-full ">
              {singleGame?.category || "N/A"}
            </p>
          </div>

          <div className="border-b py-2 flex gap-12 ">
            <p className="text-textYellow w-full font-bold  whitespace-nowrap   md:w-[30%]">
              Special Features
            </p>
            <ul className="list-disc list-inside text-left w-full">
              {singleGame?.features?.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
          </div>

          <div className="border-b py-2 flex gap-12">
            <p className="text-textYellow font-bold  w-full  whitespace-nowrap   md:w-[30%]">
              Paylines
            </p>
            <p className="font-semibold w-full text-left">
              {singleGame?.paylines || "0"} lines
            </p>
          </div>

          <div className="border-b py-2 flex gap-12">
            <p className="text-textYellow font-bold  w-full  whitespace-nowrap   md:w-[30%]">
              Publish Time
            </p>
            <p className="font-semibold w-full text-left">
              {singleGame?.publishTime || "N/A"}
            </p>
          </div>

          <div className=" py-4 text-center rounded-md bg-[#F0E4DF59] space-y-2">
            <p className="text-white font-semibold ">Supported Languages</p>
            <div className="flex flex-wrap justify-center gap-2">
              {singleGame?.languages?.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="lang"
                  className="w-7 h-7 object-cover rounded-md"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {singleGame?.gameTrailerLink?.trim() && (
        <div className="flex justify-center my-16 px-2 md:px-0">
          <div className="w-full max-w-4xl aspect-video">
            <iframe
              className="w-full h-full"
              src={convertToEmbedURL(singleGame.gameTrailerLink)}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {/* Carousel section */}
      <div className="bg-[#4F557759] mt-10 py-32  p-6 rounded-lg">
        <div className="flex flex-col items-center justify-center mb-4">
          <img
            src={carouselImages[selectedImageIndex]}
            alt="carousel"
            className="lg:w-full lg:h-[500px] w-[30%] max-w-xs rounded shadow"
          />
          <p className="uppercase font-bold text-textYellow mt-2 text-lg">
            Game Feature
          </p>
        </div>
        <div className="flex justify-center gap-2">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`w-4 h-4 rounded-full  transition-all duration-300 ${
                selectedImageIndex === index ? "w-8 bg-bgYellow" : "bg-black"
              }`}
            ></button>
          ))}
        </div>
        <div className="max-w-6xl mx-auto mt-8">
          <h3 className="text-textYellow text-3xl">DESCRIPTION</h3>
          <p className=" text-xl mt-2 text-[#C6BDBD]">
            {singleGame?.description}
          </p>
        </div>
      </div>

      <div className="md:w-2/3 mx-auto px-2 md:px-0 py-4 flex flex-col gap-4">
        {dummyData?.map((data, i) => (
          <div
            key={i}
            onClick={!user ? () => setIsPromoModalOpen(true) : undefined}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 flex items-center justify-between p-4 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="bg-gray-500 w-8 h-8 rounded-full flex items-center justify-center">
                <ImFilesEmpty className="text-lg text-white" />
              </div>
              <p className="text-xl">{data?.category}</p>
            </div>
            {user ? <FaLockOpen /> : <FaLock />}
          </div>
        ))}
      </div>

      <RelatedGames category={singleGame?.category} gameId={singleGame?._id} />
    </div>
  );
};

export default GameInfo;
