import { Link } from "react-router";
import { useGetAllCategoriesQuery } from "../../redux/features/allApis/categoryApi/categoryApi";
import { useGetHomeControlsQuery } from "../../redux/features/allApis/homeControlApi/homeControlApi";

const OurGames = () => {
  const { data: allCategories } = useGetAllCategoriesQuery();

  const { data: homeControls } = useGetHomeControlsQuery();

  const ourGamesImage = homeControls?.find(
    (control) =>
      control.category === "other" &&
      control.version === "our games" &&
      control.isSelected === true
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Heading */}
      <h3 className="text-2xl text-left md:text-5xl font-semibold text-textYellow mb-6">
        Our Games
      </h3>

      {/* Image */}
      <img
        src={`${import.meta.env.VITE_BASE_API_URL}${ourGamesImage?.image}`}
        alt="Our Games"
        className="mx-auto rounded-lg shadow-lg w-[80%]"
      />

      {/* Tab Buttons */}
      <div className="flex flex-wrap justify-around items-center bg-[#4A250C] md:bg-transparent py-2 md:py-0 gap-6 -mt-4 rounded-b-md md:-mt-20">
        {allCategories?.map((tab) => (
          <Link
            key={tab._id}
            to={`/games?category=${tab.name
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
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
