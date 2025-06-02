import DashboardSidebar from "../Components/Dashboard/DashboardLayout/DashboardSidebar";
import DashboardMobilMenu from "../Components/Dashboard/DashboardLayout/DashboardMobilMenu";
import { useState } from "react";
import { BsBank, BsFront, BsPiggyBank, BsShop } from "react-icons/bs";
import { FaAffiliatetheme, FaUsers } from "react-icons/fa";
import { GiGamepadCross, GiRibbonMedal } from "react-icons/gi";
import { IoMdHome } from "react-icons/io";
import {
  IoGameController,
  IoLogoWechat,
  IoSettingsSharp,
} from "react-icons/io5";
import { PiCashRegister } from "react-icons/pi";
import { SlGameController } from "react-icons/sl";
import { Outlet } from "react-router";

const DashboardLayout = () => {
  const [open, setOpen] = useState(true);
  // Menu items with dynamic submenu
  const menuItems = [
    { label: "Dashboard", icon: <IoMdHome />, to: "/dashboard" },
    {
      label: "Users",
      icon: <FaUsers />,
      submenu: [
        { label: "All Users", to: "/dashboard/users" },
        { label: "Balance Histories", to: "/dashboard/balance-histories" },
      ],
    },
    {
      label: "Cash Agent",
      icon: <PiCashRegister />,
      submenu: [
        { label: "All Agents", to: "/dashboard/cashagent" },
        { label: "KYC", to: "/dashboard/kyc" },
        {
          label: "Payment Requests",
          to: "/dashboard/paymentmethodrequests",
        },
      ],
    },
    {
      label: "Affiliators",
      icon: <FaAffiliatetheme />,
      submenu: [
        { label: "All Affiliates", to: "/dashboard/affiliators" },
        { label: "All Affiliate Links", to: "/dashboard/allaffiliatelinks" },
      ],
    },
    {
      label: "Games Control",
      icon: <IoGameController />,
      submenu: [
        { label: "Categories", to: "/dashboard/gameCategories" },
        // { label: "Add Games", to: "/dashboard/addGames" },
        { label: "Active Games" },
        { label: "Inactive Games" },
      ],
    },
    {
      label: "Games Api key",
      icon: <GiGamepadCross />,
      submenu: [
        { label: "Add Games", to: "/dashboard/addGames" },
        { label: "Sprots Live TV", to: "/dashboard/gamesApi/sports-live-tv" },
        { label: "BetFair API", to: "/dashboard/gamesApi/betfair-api" },
        {
          label: "Sports Radar API",
          to: "/dashboard/gamesApi/sports-radar-api",
        },
        { label: "Odds Jam API", to: "/dashboard/gamesApi/odds-jam-api" },
        {
          label: "Bet Construct API",
          to: "/dashboard/gamesApi/bet-construct-api",
        },
        { label: "Kambi API", to: "/dashboard/gamesApi/kambi-api" },
        { label: "Pinnacle API", to: "/dashboard/gamesApi/pinnacle-api" },
        { label: "SoftSwiss API", to: "/dashboard/gamesApi/softswiss-api" },
        { label: "Betradar API", to: "/dashboard/gamesApi/betradar-api" },
        { label: "Evolution API", to: "/dashboard/gamesApi/evolution-api" },
        {
          label: "Pragmatic Play API",
          to: "/dashboard/gamesApi/pragmatic-play-api",
        },
        { label: "Playtech API", to: "/dashboard/gamesApi/playtech-api" },
        { label: "NetEnt API", to: "/dashboard/gamesApi/netent-api" },
        {
          label: "Betsoft Gaming API",
          to: "/dashboard/gamesApi/betsoft-gaming-api",
        },
      ],
    },
    {
      label: "Bonuses",
      icon: <GiRibbonMedal />,
      submenu: [
        { label: "Happy Hours" },
        { label: "Deposit Bonuses" },
        { label: "Reffer Bonuses" },
        { label: "WellCome Bonuses Bonuses" },
      ],
    },
    {
      label: "game History",
      icon: <SlGameController />,
      submenu: [
        { label: "Play Stats" },
        { label: "Win Game Stats" },
        { label: "Loss Game Stats" },
      ],
    },
    { label: "Tournament", icon: <BsShop /> },
    { label: "Jack Pot", icon: <BsShop /> },
    {
      label: "Fontend",
      icon: <BsFront />,
      submenu: [
        { label: "Home control", to: "/dashboard/home-controls" },
        { label: "Promotions", to: "/dashboard/promotion-offer" },
        { label: "Pages", to: "/dashboard/manage-pages" },
        // { label: "Notice", to: "/dashboard/notice" },
        // { label: "About Us" },
        // { label: "FQA" },
        { label: "Sponsorship", to: "/dashboard/sponsorship" },
        { label: "Brand Abmassador" },
      ],
    },
    {
      label: "Banking Deposit",
      icon: <BsPiggyBank />,
      submenu: [
        { label: "Deposit Methord", to: "/dashboard/depositmethod" },
        { label: "Deposit History", to: "/dashboard/deposithistory" },
      ],
    },
    {
      label: "Banking Withdrow",
      icon: <BsBank />,
      submenu: [
        { label: "Withdrow Methord", to: "/dashboard/withdrawmethod" },
        { label: "withdrow History", to: "/dashboard/withdraws" },
      ],
    },
    {
      label: "Settings",
      icon: <IoSettingsSharp />,
      submenu: [
        { label: "Commission", to: "/dashboard/commissionsetting" },
        { label: "Pincodes" },
        { label: "Activety Log" },
        { label: "Permissions" },
        { label: "Getway Api keys" },
        { label: "SMS" },
        { label: "Mailings" },
        { label: "Support" },
        { label: "Security" },
      ],
    },
    {
      label: "Oracle Technology",
      icon: <IoLogoWechat />,
      submenu: [
        { label: "Instant Support" },
        { label: "Normal Support" },
        { label: "Permissions" },
        { label: "Notice" },
        { label: "About Us" },
        { label: "Contact Us" },
      ],
    },
  ];

  const submenus = [
    {
      label: "Sprots Live TV",
      value: "sprots_live_tv",
      to: "/dashboard/gamesApi/sports-live-tv",
    },
    {
      label: "BetFair API",
      value: "betfair",
      to: "/dashboard/gamesApi/betfair-api",
    },
    {
      label: "Sports Radar API",
      value: "sports_radar",
      to: "/dashboard/gamesApi/sports-radar-api",
    },
    {
      label: "Odds Jam API",
      value: "odds_jam",
      to: "/dashboard/gamesApi/odds-jam-api",
    },
    {
      label: "Bet Construct API",
      value: "bet_construct",
      to: "/dashboard/gamesApi/bet-construct-api",
    },
    { label: "Kambi API", value: "kambi", to: "/dashboard/gamesApi/kambi-api" },
    {
      label: "Pinnacle API",
      value: "pinnacle",
      to: "/dashboard/gamesApi/pinnacle-api",
    },
    {
      label: "SoftSwiss API",
      value: "softswiss",
      to: "/dashboard/gamesApi/softswiss-api",
    },
    {
      label: "Betradar API",
      value: "betradar",
      to: "/dashboard/gamesApi/betradar-api",
    },
    {
      label: "Evolution API",
      value: "evolution",
      to: "/dashboard/gamesApi/evolution-api",
    },
    {
      label: "Pragmatic Play API",
      value: "pragmatic_play",
      to: "/dashboard/gamesApi/pragmatic-play-api",
    },
    {
      label: "Playtech API",
      value: "playtech",
      to: "/dashboard/gamesApi/playtech-api",
    },
    {
      label: "NetEnt API",
      value: "netent",
      to: "/dashboard/gamesApi/netent-api",
    },
    {
      label: "Betsoft Gaming API",
      value: "betsoft",
      to: "/dashboard/gamesApi/betsoft-gaming-api",
    },
  ];

  return (
    <div className="flex">
      {/* DashboardSidebar */}
      <DashboardSidebar open={open} setOpen={setOpen} menuItems={menuItems} />
      <div
        className={`flex-1 h-screen overflow-y-auto flex flex-col duration-300 ${
          !open ? "md:pl-20" : "md:pl-64"
        }`}
      >
        <DashboardMobilMenu
          open={open}
          menuItems={menuItems}
          dashboardLink="/dashboard"
          logOutPath="/admin"
        />
        <div className="mt-[62px] md:mt-14 p-3">
          <Outlet context={{ submenus }} />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
