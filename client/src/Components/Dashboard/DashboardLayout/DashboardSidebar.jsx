// import Modal from "@/components/shared/Modal";
// import { useGetHomeControlsQuery } from "@/redux/features/allApis/homeControlApi/homeControlApi";
import { useState } from "react";
import { FaAngleDown, FaRegCircle } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";

import { Link } from "react-router";

const DashboardSidebar = ({ open, setOpen, menuItems }) => {
  //   const { data: homeControls } = useGetHomeControlsQuery();
  //   const [isModalOpen, setIsModalOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState({
    GamesControl: false,
    GamesApikey: false,
    OracleTechnology: false, // Track submenu state for Games Control
    Bonuses: false, // Track submenu state for Games Control
    gameHistory: false, // Track submenu state for Games Control
    Fontend: false, // Track submenu state for Games Control
    BankingDeposit: false, // Track submenu state for Games Control
    BankingWithdrow: false, // Track submenu state for Games Control
    Settings: false, // Track submenu state for Games Control
  });

  //   const logoHomeControl = homeControls?.find(
  //     (control) => control.category === "logo" && control.isSelected === true
  //   );

  // Toggle submenu visibility
  const toggleSubmenu = (menu) => {
    setSubmenuOpen((prevMenu) => (prevMenu === menu ? "" : menu));
  };
  // Handle toggle sidebar visibility
  const handleToggleSidebar = () => {
    setOpen((prev) => !prev);
  };

  // Open modal
  const handleModalOpen = () => {
    // setIsModalOpen(true);
  };

  // Close modal
  //   const handleModalClose = () => {
  //     setIsModalOpen(false);
  //   };

  return (
    <div>
      <div
        className={`${
          open ? "w-64" : "w-16"
        } hidden md:block duration-300 h-screen fixed`}
      >
        {/* Start Top collapse */}
        <div className={`bg-primary-primaryColor py-3 ${!open && "py-5"}`}>
          <div className="flex gap-x-3 items-center justify-center">
            <div className={`flex gap-1 ${!open && "hidden"}`}>
              <Link
                to={"/"}
                className="flex items-center gap-1 px-2 py-0.5 rounded-lg"
              >
                {/* {logoHomeControl?.image ? (
                  <img
                    className="w-20"
                    src={`${import.meta.env.VITE_BASE_API_URL}${
                      logoHomeControl?.image
                    }`}
                    alt="Logo"
                  />
                ) : (
                  <div className="h-10"></div>
                )} */}
              </Link>
            </div>
            <div>
              <IoIosArrowBack
                className={`m-auto text-center w-10 h-7 p-1 bg-yellow-400 hover:bg-yellow-500 rounded-full cursor-pointer ${
                  !open && "rotate-180"
                } `}
                onClick={handleToggleSidebar}
              />
            </div>
          </div>
        </div>
        {/* End Top collapse */}
      </div>

      {/* Start Menu bar */}
      <div
        className={`bg-primary-primaryColorTwo overflow-y-auto fixed mt-[62px] hidden md:block pb-16 ${
          open ? "w-64" : "w-16"
        } text-sm text-white duration-300 font-semibold h-full scrollbar-hide`}
      >
        {/* Dynamic Menu Rendering */}
        {menuItems.map((item, index) => (
          <div key={index}>
            <Link
              onClick={!item.to && !item.submenu && handleModalOpen}
              to={item.to || "#"}
            >
              <div
                className={`px-4 py-3 flex items-center gap-2 border-b border-gray-700 duration-300 hover:bg-bottomNavBgColor hover:border-l-4 hover:border-l-slate-400 ${
                  !open && "justify-center"
                }`}
                onClick={() => item.submenu && toggleSubmenu(item.label)}
              >
                {/* Only show icon for menu items with submenus */}
                {item.icon}
                <p className={`${!open && "hidden"}`}>{item.label}</p>
                {/* Show arrow for submenu toggle */}
                {item.submenu && open && (
                  <FaAngleDown className={`text-white ${!open && "hidden"}`} />
                )}
              </div>
            </Link>

            {/* Only show submenu when "Games Control" is clicked */}
            {item.submenu && submenuOpen === item.label && open && (
              <div className="pl-8 text-white text-sm font-semibold bg-primary-primaryColor duration-300">
                {item.submenu.map((subItem, subIndex) => (
                  <Link
                    onClick={!subItem.to && !subItem.submenu && handleModalOpen}
                    key={subIndex}
                    to={subItem.to || "#"}
                    className="py-2.5 flex gap-2"
                  >
                    <FaRegCircle size={22} className="text-yellow-300" />
                    {subItem.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {/* <Modal
        title={"Oops!!!"}
        isOpen={isModalOpen}
        onOpenChange={handleModalClose}
      >
        <p>Please contact your developer team to connect API!!!</p>
      </Modal> */}
    </div>
  );
};

export default DashboardSidebar;
