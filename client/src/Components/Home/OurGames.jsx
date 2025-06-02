import { Link } from "react-router";
import image from "../../assets/Images/ourgame_top.png";

const OurGames = () => {
  const gameTabs = [
    { id: "slot", name: "Slot", link: "/games" },
    { id: "fishing", name: "Fishing", link: "/games" },
    { id: "tableAndCard", name: "Table and Card", link: "/games" },
    { id: "bingo", name: "Bingo", link: "/games" },
    { id: "casino", name: "Casino", link: "/games" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 ">
      {/* Heading */}
      <h3 className="text-2xl text-left md:text-5xl font-semibold text-textYellow mb-6 ">
        Our Games
      </h3>

      {/* Image */}
      <img
        src={image}
        alt="Our Games"
        className="mx-auto  rounded-lg shadow-lg w-[80%]"
      />

      {/* Tab Buttons */}
      <div className="flex flex-wrap justify-around items-center bg-[#4A250C] md:bg-transparent py-2 md:py-0 gap-6 -mt-4 rounded-b-md md:-mt-20">
        {gameTabs.map((tab) => (
          <Link
            key={tab.name}
            to={tab.link}
            state={{ scrollToId: tab.id }}
            className="relative inline-block w-[80%] md:w-[20%] lg:w-[18%] py-2 text-white text-center font-semibold uppercase overflow-hidden group rounded-full border bg-tabGradient border-yellow-400"
          >
            <span className="absolute inset-0 bg-bgYellow translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
            <span className="relative z-10 text-[#B45D00] group-hover:text-black transition-colors duration-300">
              {tab.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default OurGames;
