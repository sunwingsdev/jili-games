import { IoMdMenu, IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { Link, Navigate } from "react-router";
import { FaRegUserCircle, FaRegCircle } from "react-icons/fa";

import toast from "react-hot-toast";
import { useGetHomeControlsQuery } from "../../../redux/features/allApis/homeControlApi/homeControlApi";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../redux/slices/authSlice";

const DashboardMobilMenu = ({ open, menuItems, logOutPath, dashboardLink }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { data: homeControls } = useGetHomeControlsQuery();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const logoHomeControl = homeControls?.find(
    (control) => control.category === "logo" && control.isSelected === true
  );

  // Toggle the sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close the sidebar
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Toggle the submenu and close sidebar when a submenu item is clicked
  const toggleSubmenu = (menu) => {
    setOpenSubmenu(openSubmenu === menu ? null : menu); // If the clicked submenu is already open, close it; otherwise, open it
  };

  // Handle click on a submenu item (close the sidebar after selecting)
  const handleSubmenuClick = () => {
    closeSidebar();
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    toast.success("Logout successful");

    Navigate(logOutPath);
  };

  return (
    <div>
      <div
        className={`bg-[#172437] p-4 fixed left-0 right-0 z-20 duration-300  ${
          !open ? "md:ml-16" : "md:ml-64"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="">
            <div className="md:hidden text-yellow-300" onClick={toggleSidebar}>
              <IoMdMenu className="text-3xl sm:text-3xl" />
            </div>
          </div>

          <div className="text-white text-2xl flex justify-end items-center relative select-none">
            <FaRegUserCircle
              onClick={toggleDropdown}
              className="cursor-pointer"
            />
            {isDropdownOpen && (
              <div className="absolute top-8 right-0 mt-2 w-48 bg-blue-500 rounded-md shadow-lg z-10">
                <ul className="py-2">
                  <li>
                    <Link
                      to={`${dashboardLink}/profile/${user?._id}`}
                      className="block px-4 py-2 text-sm text-white hover:bg-blue-200 hover:text-black"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-blue-200 hover:text-black"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 w-full h-screen overflow-y-auto backdrop-blur bg-[#172437] z-30 md:hidden transform transition-transform duration-500 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between bg-[#172437]">
          <div className="m-2 mb-6 mt-6 w-3/5">
            <div className="rounded-lg">
              <div className="flex items-center rounded-tl-lg rounded-tr-lg">
                <Link
                  to={"/"}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-lg"
                >
                  {logoHomeControl?.image ? (
                    <img
                      className="w-20"
                      src={`${import.meta.env.VITE_BASE_API_URL}${
                        logoHomeControl?.image
                      }`}
                      alt="Logo"
                    />
                  ) : (
                    <div className="h-10"></div>
                  )}
                </Link>
              </div>
            </div>
          </div>
          <div
            className="text-white cursor-pointer mt-1"
            onClick={closeSidebar}
          >
            <IoClose size={36} />
          </div>
        </div>

        {/* Menu Items with Fixed Icons and Dynamic Submenu */}
        <div className="text-white bg-[#172437]">
          {menuItems.map((item) => (
            <div key={item.label}>
              <div
                className={`py-2.5 px-4 flex items-center justify-between border-b border-gray-400 ${
                  item.submenu?.length > 0 ? "cursor-pointer" : ""
                }`}
                onClick={() =>
                  item.submenu?.length > 0 && toggleSubmenu(item.label)
                }
              >
                <div className="flex items-center">
                  {item.icon}
                  <Link
                    to={item.to}
                    className="ml-2 block"
                    onClick={handleSubmenuClick}
                  >
                    {item.label}
                  </Link>
                </div>
                {item.submenu?.length > 0 && (
                  <div>
                    {openSubmenu === item.label ? (
                      <IoIosArrowDown size={20} />
                    ) : (
                      <IoIosArrowForward size={20} />
                    )}
                  </div>
                )}
              </div>
              {openSubmenu === item.label && (
                <div className="pl-4">
                  {item.submenu.map((submenuItem) => (
                    <div
                      key={submenuItem.label}
                      className="py-2.5 pl-6 text-sm flex items-center gap-2"
                    >
                      <FaRegCircle className="text-gray-400" />
                      <Link
                        to={submenuItem.to}
                        className="block"
                        onClick={handleSubmenuClick}
                      >
                        {submenuItem.label}
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardMobilMenu;
