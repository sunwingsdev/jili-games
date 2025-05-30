import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import GameTabContent from "./GameTabContent";

// Icon imports
import allGamesIcon from "../../assets/Logos/icon-All.png";
import hotIcon from "../../assets/Logos/icon-Hot.png";
import slotIcon from "../../assets/Logos/icon-Slots.png";
import fishIcon from "../../assets/Logos/icon-Fish.png";
import pokerIcon from "../../assets/Logos/icon-Poker.png";
import bingoIcon from "../../assets/Logos/icon-Bingo.png";
import fastIcon from "../../assets/Logos/icon-Fast.png";

const menuItems = [
  { id: "all", key: "All Games", name: "All Games", icon: allGamesIcon },
  { id: "popular", key: "Popular", name: "Popular", icon: hotIcon },
  { id: "slot", key: "Slot", name: "Slot", icon: slotIcon },
  { id: "fishing", key: "Fishing", name: "Fishing", icon: fishIcon },
  { id: "tableAndCard", key: "TableAndCard", name: "Table and Card", icon: pokerIcon },
  { id: "bingo", key: "Bingo", name: "Bingo", icon: bingoIcon },
  { id: "casino", key: "Casino", name: "Casino", icon: fastIcon },
];

const GameTabs = () => {
  const location = useLocation();
  const [activeKey, setActiveKey] = useState(menuItems[0].key);
  const tabRefs = useRef({});
  const tabBarRef = useRef(null);

  // ✅ Sets the active tab based on route state (if scrollToId is provided)
  useEffect(() => {
    const scrollToId = location.state?.scrollToId;
    const matched = menuItems.find(tab => tab.id === scrollToId);
    if (matched) setActiveKey(matched.key);
  }, [location.state]);

  // ✅ Scrolls the page to the content section corresponding to scrollToId
  useEffect(() => {
    const scrollToId = location.state?.scrollToId;
    const el = scrollToId && document.getElementById(scrollToId);
    if (el) {
      setTimeout(() => {
        const offset = 520;
        const targetY = el.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: targetY, behavior: "smooth" });
      }, 100);
    }
  }, [location]);

  // ✅ Scrolls the tab bar to bring the active tab into horizontal center view specially in phone screen, where tabs are in overflow-x-auto
  useEffect(() => {
    const tabEl = tabRefs.current[activeKey];
    const container = tabBarRef.current;

    if (tabEl && container) {
      const scrollX = tabEl.offsetLeft - (container.offsetWidth / 2) + (tabEl.offsetWidth / 2);
      container.scrollTo({ left: scrollX, behavior: "smooth" });
    }
  }, [activeKey]);

  return (
    <div className="-mt-16">
      {/* Sticky Tab Bar */}
      <div
        ref={tabBarRef}
        className="flex sticky top-14 md:top-16 bg-black bg-opacity-80 backdrop-blur-md z-10 flex-row justify-start md:justify-center items-center gap-x-4 overflow-x-auto shadow-md md:px-4 lg:px-8 pl-4 scroll-smooth"
      >
        {menuItems.map(({ id, key, name, icon }) => {
          const isActive = key === activeKey;
          return (
            <div
              key={key}
              id={id}
              ref={el => (tabRefs.current[key] = el)}
              onClick={() => setActiveKey(key)}
              className={`flex flex-col items-center cursor-pointer relative transition-all duration-200 py-1 md:py-1 md:px-4 md:w-[88px] lg:w-full group
                ${isActive ? "bg-bgYellow px-2 text-black" : "hover:bg-[#FCC40D] px-2 text-white"}`}
            >
              <div className="relative w-20 md:w-24 lg:w-[80%] group">
                <img src={icon} alt={name} className="object-contain w-full" />
                <div
                  className={`absolute inset-0 transition duration-300 ${isActive ? "bg-black" : "group-hover:bg-black"}`}
                  style={{
                    WebkitMaskImage: `url(${icon})`,
                    WebkitMaskRepeat: "no-repeat",
                    WebkitMaskSize: "contain",
                    WebkitMaskPosition: "center",
                    maskImage: `url(${icon})`,
                    maskRepeat: "no-repeat",
                    maskSize: "contain",
                    maskPosition: "center",
                  }}
                />
              </div>
              <p className={`text-xs 2xl:text-2xl whitespace-nowrap mt-1 ${isActive ? "font-bold" : ""}`}>
                {name}
              </p>
            </div>
          );
        })}
      </div>

      {/* Tab Header and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 px-4 md:px-6 lg:px-8 mt-4">
        <h2 className="text-textYellow text-2xl md:text-4xl lg:text-5xl uppercase font-bold">
          {menuItems.find(item => item.key === activeKey)?.name}
        </h2>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search..."
            className="w-48 md:w-60 lg:w-56 px-3 py-2 rounded-full bg-white border border-gray-600 text-black text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <AiOutlineSearch className="text-yellow-400 text-4xl cursor-pointer" />
        </div>
      </div>

      {/* Tab Content */}
      <GameTabContent activeKey={activeKey} />
    </div>
  );
};

export default GameTabs;
