import { Link } from "react-router";
import { useGetAllHomeGamesQuery } from "../../redux/features/allApis/homeGamesApi/homeGamesApi";

const RelatedGames = ({ category, gameId }) => {
  const { data: allHomeGames = [] } = useGetAllHomeGamesQuery();
  const relatedGames = allHomeGames?.filter(
    (game) => game.category === category && game._id !== gameId
  );

  if (relatedGames?.length === 0) return null;

  return (
    <div className="md:w-2/3 mx-auto px-2 md:px-0 py-6">
      <h1 className="text-3xl text-white font-bold mb-6">Related Games</h1>

      {relatedGames?.length === 0 ? (
        <div className="text-center text-gray-300 text-lg py-10">
          No related games found.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {relatedGames?.map((game) => (
            <div
              key={game?._id}
              className="bg-white rounded-lg overflow-hidden shadow hover:scale-[1.03] transition-transform duration-200"
            >
              <img
                src={`${import.meta.env.VITE_BASE_API_URL}${game?.image}`}
                alt={game?.name}
                className="w-full h-32 md:h-40 object-cover"
              />
              <div className="text-center p-2">
                <Link
                  to={`/game/${game?._id}`}
                  className="text-gray-800 hover:text-blue-500"
                >
                  <h2 className="text-sm font-medium">{game?.name}</h2>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RelatedGames;
