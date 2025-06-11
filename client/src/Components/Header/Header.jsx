import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Link as ScrollLink } from "react-scroll";
import { FiMenu, FiX } from "react-icons/fi";
import languageImage from "../../assets/Logos/world_white.svg";
import { useGetHomeControlsQuery } from "../../redux/features/allApis/homeControlApi/homeControlApi";

const Header = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: homeControls } = useGetHomeControlsQuery();

  const logoHomeControl = homeControls?.find(
    (control) => control.category === "logo" && control.isSelected === true
  );

  // React Router location for active link detection
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Check active path
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full bg-white bg-opacity-10 backdrop-blur-md shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/">
              {/* <img src={mainLogo} alt="Logo" className="h-8 md:h-10" /> */}
              {logoHomeControl?.image ? (
                <img
                  className="h-8 md:h-10"
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

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center text-lg uppercase text-white gap-6">
            <Link
              to="/"
              className={`hover:text-textYellow transition ${
                isActive("/") ? "text-textYellow" : ""
              }`}
            >
              Home
            </Link>
            <Link
              to="/company-details"
              className={`hover:text-textYellow transition ${
                isActive("/company-details") ? "text-textYellow" : ""
              }`}
            >
              Company
            </Link>
            <Link
              to="/games"
              className={`hover:text-textYellow transition ${
                isActive("/games") ? "text-textYellow" : ""
              }`}
            >
              Games
            </Link>
            <ScrollLink
              to="contact"
              smooth={true}
              duration={500}
              offset={-80} // Offset so content not hidden behind fixed header
              className="cursor-pointer hover:text-textYellow"
            >
              Contact Us
            </ScrollLink>

            {/* Language Dropdown */}
            <div className="">
              <img src={languageImage} alt="" className="h-7 w-7 " />
            </div>
          </nav>

          {/* Mobile Menu */}
          <div className="lg:hidden flex items-center gap-3">
            {/* Language Icon */}
            {/* <div className="relative">
              <button >
                <div
                  style={{
                    WebkitMaskImage: `url(${languageImage})`,
                    WebkitMaskRepeat: "no-repeat",
                    WebkitMaskSize: "contain",
                    WebkitMaskPosition: "center",
                  }}
                  className="h-7 w-7 bg-[#ffffff] hover:bg-bgYellow transition duration-300"
                ></div>
              </button>
              
            </div> */}
            <div className="">
              <img src={languageImage} alt="" className="h-7 w-7 " />
            </div>

            {/* Menu Icon */}
            <button
              onClick={toggleSidebar}
              className="text-[#351A07] border border-[#351A07] text-4xl focus:outline-none"
              aria-label={sidebarOpen ? "Close menu" : "Open menu"}
            >
              {sidebarOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </header>

      {/* SIDEBAR */}
      <div
        className={`fixed top-14 right-0 h-full w-full  bg-black bg-opacity-80 text-white z-50 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="flex flex-col items-center gap-6 uppercase text-lg mt-6">
          <Link
            to="/"
            onClick={toggleSidebar}
            className={`hover:text-textYellow transition ${
              isActive("/") ? "text-textYellow" : ""
            }`}
          >
            Home
          </Link>
          <Link
            to="/company-details"
            onClick={toggleSidebar}
            className={`hover:text-textYellow transition ${
              isActive("/company-details") ? "text-textYellow" : ""
            }`}
          >
            Company
          </Link>
          <Link
            to="/games"
            onClick={toggleSidebar}
            className={`hover:text-textYellow transition ${
              isActive("/games") ? "text-textYellow" : ""
            }`}
          >
            Games
          </Link>
          <ScrollLink
            to="contact"
            smooth={true}
            duration={500}
            offset={-80}
            onClick={toggleSidebar}
            className="cursor-pointer hover:text-textYellow"
          >
            Contact Us
          </ScrollLink>
        </nav>
      </div>
    </>
  );
};

export default Header;
