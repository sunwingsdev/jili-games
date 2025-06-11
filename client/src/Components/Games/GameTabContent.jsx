import { useEffect, useState } from "react";

import ImageGridSmall from "./ImageGridSmall";
import ImageGridLarge from "./ImageGridLarge";
import { useOutletContext } from "react-router";
import { useGetAllHomeGamesQuery } from "../../redux/features/allApis/homeGamesApi/homeGamesApi";

const GameTabContent = ({ activeKey }) => {
  const { setModalData } = useOutletContext();
  const { data: allHomeGames = [] } = useGetAllHomeGamesQuery();

  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredGames =
    activeKey === "All Games"
      ? allHomeGames
      : allHomeGames?.filter((game) => game.category === activeKey);

  const images = filteredGames?.map((game) => ({
    ...game,
    src: `${import.meta.env.VITE_BASE_API_URL}${game.image}`,
    title: game.name,
    link: game.link,
  }));

  return width < 768 ? (
    <ImageGridSmall images={images} setModalData={setModalData} />
  ) : (
    <ImageGridLarge images={images} setModalData={setModalData} />
  );
};

export default GameTabContent;
