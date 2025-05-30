import { useParams, useLocation, useOutletContext } from "react-router-dom";
import { useState } from "react";

import chillImage from "../assets/Images/chill.png";
import pcImage from "../assets/Images/pc.png";
import tabletImage from "../assets/Images/tablet.png";
import rotateImage from "../assets/Images/phone_horizon.png";
import image1 from "../assets/Images/flag_ENG.png";
import image2 from "../assets/Images/flag_CN.png";
import image3 from "../assets/Images/flag_THAI.png";

import featureImage1 from "../assets/Images/r5yOJ6JmPK54rJngTVnmgw9VEwdGiI1qbFczYhpi.png";
import featureImage2 from "../assets/Images/75ds61PdELcDAiLyBJWA0UJzM2vAYNdKeUDLVkE3.png";
import featureImage3 from "../assets/Images/kUKHyX6AOh3Q1B2d9lWgXDc5inP5aVNqm9QRgyuv.png";
import featureImage4 from "../assets/Images/B6j2mNWxNftUEnUQuRaleUeVpaLjvEP0mUyeqwu5.png";
import featureImage5 from "../assets/Images/yGii1X3PxDXTSzql5C323VZkZtFTZwX2guJ4868F.png";


const GameInfo = () => {
  const { id } = useParams();
  const location = useLocation();
  const { images, tabImages, setModalData } = useOutletContext();

  const source = location.state?.source || "images";

  let game;

  if (source === "tabImages") {
    const allTabGames = Object.values(tabImages).flat();
    game = allTabGames.find((item) => item.id === id);
  } else {
    game = images.find((item) => item.id === id);
  }

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!game) return <p className="text-center text-white">Game not found</p>;

  // Dummy data for illustration (can replace with props/context if needed)
  const extraImages = [pcImage, tabletImage, rotateImage];
  const specialFeatures = [
    "3x3 grid with fast-paced gameplay",
    "5 paylines for easy wins",
    "Fortune Coin symbol triggers prize collection & Lock & Respin",
    "Jackpot prizes up to 1000x Grand reward",
    "Bonus Game offers unlimited prize accumulation!",
  ];
  const supportedLanguages = [image1, image2, image3, image2, image1, image3];
  const carouselImages = [
    featureImage1,
    featureImage2,
    featureImage3,
    featureImage4,
    featureImage5,
  ];

  return (
    <div className=" pt-20  text-white">
      <div className="flex flex-col max-w-5xl mx-auto lg:flex-row justify-center gap-20 p-4">
        {/* Left Side */}
        <div className=" ">
          <div className="flex justify-center">
            <img
              src={game.image}
              alt={game.name}
              className="lg:w-full w-[80%] md:w-[30%] rounded-lg mb-4"
            />
          </div>
          <div className="flex flex-col items-center gap-4 lg:flex-row justify-center">
            <h1 className="text-3xl  lg:hidden font-bold text-white">
              {game.name}
            </h1>
            <button
              className="lg:w-[60%] w-[60%] md:w-[20%] bg-bgYellow py-3 rounded-xl text-black text-lg font-medium mb-4  hover:bg-opacity-80"
              onClick={() => setModalData(game)}
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
            {game.name}
          </h1>
          <div className="lg:flex  gap-4 space-y-4 lg:space-y-0 ">
            <div className="border border-white border-opacity-30 px-2 py-4 bg-bgGameTab rounded lg:w-full w-[80%] mx-auto  text-center">
              <p className="text-sm ">MAX WIN</p>
              <p className="text-xl text-textYellow font-bold">3000X</p>
            </div>
            <div className="border border-white border-opacity-30 px-2 py-4 bg-bgGameTab rounded lg:w-full w-[80%] text-center mx-auto">
              <p className="text-sm ">VOLATILITY</p>
              <div className="flex gap-1 justify-center items-center">
              
              <p className="text-xl text-textYellow font-bold">LOW-MED</p>
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
              {game.category || "N/A"}
            </p>
          </div>

          <div className="border-b py-2 flex gap-12 ">
            <p className="text-textYellow w-full font-bold  whitespace-nowrap   md:w-[30%]">
              Special Features
            </p>
            <ul className="list-disc list-inside text-left w-full">
              {specialFeatures.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
          </div>

          <div className="border-b py-2 flex gap-12">
            <p className="text-textYellow font-bold  w-full  whitespace-nowrap   md:w-[30%]">
              Paylines
            </p>
            <p className="font-semibold w-full text-left">5 lines</p>
          </div>

          <div className="border-b py-2 flex gap-12">
            <p className="text-textYellow font-bold  w-full  whitespace-nowrap   md:w-[30%]">
              Publish Time
            </p>
            <p className="font-semibold w-full text-left">2025.03</p>
          </div>

          <div className=" py-4 text-center rounded-md bg-[#F0E4DF59] space-y-2">
            <p className="text-white font-semibold ">Supported Languages</p>
            <div className="flex flex-wrap justify-center gap-2">
              {supportedLanguages.map((img, idx) => (
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
            Enter the royal palace and spin Fortune Coins for up to 1000x wins!
            Collect coin symbols, trigger Lock & Respin or Bonus Game, and watch
            your fortune grow! Join now for luxury and rewards!
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameInfo;
