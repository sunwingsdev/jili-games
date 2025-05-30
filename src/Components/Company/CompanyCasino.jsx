import exampleImage from "../../assets/Images/role.png";
import image1 from "../../assets/Logos/Icon awesome-heart.png";
import image2 from "../../assets/Logos/Icon ionic-ios-flag.png";
import image3 from "../../assets/Logos/Icon material-attach-money.png";

const CompanyCasino = () => {
  const imagesData = [
    {
      image: image1,
      title: "INNOVATIVE MECHANICS",
    },
    {
      image: image2,
      title: "EASY & FAST INTEGRATION",
    },
    {
      image: image3,
      title: "TOURNAMENTS & JACKPOTS",
    },
  ];
  return (
    <div id="company" className="">
      <div className="flex flex-col-reverse lg:flex-row items-center md:items-stretch gap-6 md:gap-12 p-6 xl:px-0 lg:px-4 md:px-4 max-w-7xl mx-auto">
        {/* Left part */}

        <div className="lg:flex-1 flex flex-col justify-center w-full text-center md:text-left">
          <h2 className="text-2xl text-textYellow xl:text-5xl  lg:text-4xl  lg:text-balance md:text-center  font-bold mb-4 w-full">
            <span className="lg:block text-center w-full hidden">
              JILI Games - ONLINE
            </span>
            <span className="lg:hidden ">JILI Games - ONLINE </span>
            CASINO GAMES PROVIDER
          </h2>
          <p className="text-[#8B8B8B] mb-6 leading-relaxed">
            JILI Gaming is a group of well-experienced gaming developers
            dedicated to creating the best and most original games in pursuit of
            excellence and innovation, which are our core values. We design
            exciting online video slots, bingo, table games, and fishing games,
            stay ahead of the competition and keep releasing innovative games.
          </p>
          {/* 🔽 Image Section */}
          <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
              {imagesData.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center lg:items-start text-center lg:text-left"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className=" md:h-12  mb-4 rounded-lg shadow-md"
                  />
                  <p className="text-[#8B8B8B]  text-base md:text-lg lg:text-xl font-medium">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right part */}
        <div className="lg:flex-1 md:h-auto h-68 lg:h-auto w-full lg:w-auto">
          <img
            src={exampleImage}
            alt="JILI Games"
            className="object-cover h-full w-full rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default CompanyCasino;
