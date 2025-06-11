import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { AiOutlineSearch } from "react-icons/ai";
import GameTabContent from "./GameTabContent";
import { useGetAllCategoriesQuery } from "../../redux/features/allApis/categoryApi/categoryApi";

const GameTabs = () => {
  const location = useLocation();
  const { data: allCategories } = useGetAllCategoriesQuery();
  const [activeKey, setActiveKey] = useState("");
  const tabRefs = useRef({});
  const tabBarRef = useRef(null);

  useEffect(() => {
    if (allCategories?.length > 0 && !activeKey) {
      setActiveKey(allCategories[0].name);
    }
  }, [allCategories, activeKey]);

  // ✅ Sets the active tab based on route state (if scrollToId is provided)
  useEffect(() => {
    const scrollToId = location.state?.scrollToId;
    const matched = allCategories?.find((tab) => tab.id === scrollToId);
    if (matched) setActiveKey(matched.name);
  }, [location.state, allCategories]);

  // ✅ Scrolls the page to the content section corresponding to scrollToId
  useEffect(() => {
    const scrollToId = location.state?.scrollToId;
    const el = scrollToId && document.getElementById(scrollToId);
    if (el) {
      setTimeout(() => {
        const offset = 520;
        const targetY =
          el.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: targetY, behavior: "smooth" });
      }, 100);
    }
  }, [location]);

  // ✅ Scrolls the tab bar to bring the active tab into horizontal center view specially in phone screen, where tabs are in overflow-x-auto
  useEffect(() => {
    const tabEl = tabRefs.current[activeKey];
    const container = tabBarRef.current;

    if (tabEl && container) {
      const scrollX =
        tabEl.offsetLeft - container.offsetWidth / 2 + tabEl.offsetWidth / 2;
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
        {allCategories?.map(({ _id, name, image }) => {
          const isActive = name === activeKey;
          return (
            <div
              key={_id}
              id={_id}
              ref={(el) => (tabRefs.current[_id] = el)}
              onClick={() => setActiveKey(name)}
              className={`flex flex-col items-center cursor-pointer relative transition-all duration-200 py-1 md:py-1 md:px-4 md:w-[88px] lg:w-full group
                ${
                  isActive
                    ? "bg-bgYellow px-2 text-black"
                    : "hover:bg-[#FCC40D] px-2 text-white"
                }`}
            >
              <div className="relative w-20 md:w-24 lg:w-[80%] group flex items-center justify-center">
                <img
                  src={`${import.meta.env.VITE_BASE_API_URL}${image}`}
                  alt={name}
                  className=""
                />
                <div
                  className={`absolute inset-0 transition duration-300 ${
                    isActive ? "bg-black" : "group-hover:bg-black"
                  }`}
                  style={{
                    WebkitMaskImage: `url(${`${
                      import.meta.env.VITE_BASE_API_URL
                    }${image}`})`,
                    WebkitMaskRepeat: "no-repeat",
                    WebkitMaskSize: "contain",
                    WebkitMaskPosition: "center",
                    maskImage: `url(${`${
                      import.meta.env.VITE_BASE_API_URL
                    }${image}`})`,
                    maskRepeat: "no-repeat",
                    maskSize: "contain",
                    maskPosition: "center",
                  }}
                />
              </div>
              <p
                className={`text-xs 2xl:text-2xl whitespace-nowrap mt-1 ${
                  isActive ? "font-bold" : ""
                }`}
              >
                {name}
              </p>
            </div>
          );
        })}
      </div>

      {/* Tab Header and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 px-4 md:px-6 lg:px-8 mt-4">
        <h2 className="text-textYellow text-2xl md:text-4xl lg:text-5xl uppercase font-bold">
          {allCategories?.find((item) => item?.name === activeKey)?.name}
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
