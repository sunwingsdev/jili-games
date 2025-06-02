import React from "react";

import ImageGridSmall from "./ImageGridSmall";
import ImageGridLarge from "./ImageGridLarge";
import { useOutletContext } from "react-router";

const GameTabContent = ({ activeKey }) => {
  const { tabImages, setModalData } = useOutletContext();

  tabImages["All Games"] = [
    ...tabImages.Popular,
    ...tabImages.Slot,
    ...tabImages.Fishing,
    ...tabImages.TableAndCard,
    ...tabImages.Bingo,
    ...tabImages.Casino,
  ];

  const images = tabImages[activeKey] || [];

  const [width, setWidth] = React.useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  React.useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width < 768 ? (
    <ImageGridSmall images={images} setModalData={setModalData} />
  ) : (
    <ImageGridLarge images={images} setModalData={setModalData} />
  );
};

export default GameTabContent;
