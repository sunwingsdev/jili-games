import { Link } from "react-router";
import { Link as ScrollLink } from "react-scroll";
import mainLogo from "../../assets/Logos/logo_jili_us-en.png";
import youtubeLogo from "../../assets/Logos/yt_icon (1).png";
import LICENSESLogo1 from "../../assets/Logos/glc-logo-wb.png";
import LICENSESLogo2 from "../../assets/Logos/bmm_testlabs.png";

const FooterLastPart = () => {
  return (
    <div className="bg-black text-white pb-8 px-4 md:max-w-4xl md:mx-16  2xl:mx-auto py-8 ">
      <div className="flex flex-col lg:flex-row justify-around  ">
        {/* Part 1 */}
        <div className="text-center lg:mb-0 mb-8 ">
          <img
            src={mainLogo}
            alt="Logo"
            className="w-16  md:w-20 mx-auto mb-2 md:mb-6"
          />
          <Link>
            <img
              src={youtubeLogo}
              alt="Linked image"
              className="w-8 mx-auto "
            />
          </Link>
        </div>

        {/* Part 2 */}

        <div className="text-center lg:block hidden">
          <h3 className="text-xl font-semibold mb-4">DISCOVER</h3>
          <div className="flex flex-col gap-6 text-[#7A7A7D] text-lg text-left md:ml-8 ">
            <Link
              to="/"
              className="cursor-pointer hover:underline hover:text-textYellow"
            >
              Home
            </Link>
            <Link
              to="/"
              state={{ scrollToId: "company" }}
              className="cursor-pointer hover:underline hover:text-textYellow"
            >
              Company
            </Link>
            <Link
              to="/games"
              className="  cursor-pointer hover:underline hover:text-textYellow"
            >
              Games
            </Link>
            <ScrollLink
              to="contact"
              smooth={true}
              duration={500}
              className="cursor-pointer hover:underline hover:text-textYellow"
            >
              Contact us
            </ScrollLink>
          </div>
        </div>

        {/* Part 3 */}
        <div className="text-center lg:block hidden">
          <p className="mb-4 text-xl font-bold w-[80%]">
            LICENSES &amp; CERTIFICATES
          </p>
          <img
            src={LICENSESLogo1}
            alt="Image 1"
            className="w-32 mx-auto mb-6"
          />
          <img src={LICENSESLogo2} alt="Image 2" className="w-32 mx-auto" />
        </div>

        {/*Small and Medium device 
         Wrapper for Part 2 and Part 3 */}
        <div className="w-full flex lg:hidden  justify-around items-start gap-8">
          {/* Part 2 */}
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">DISCOVER</h3>
            <div className="flex flex-col gap-6 text-[#7A7A7D] text-lg text-left sm:ml-8">
              <Link
                to="/"
                className="cursor-pointer hover:underline hover:text-textYellow"
              >
                Home
              </Link>
              <Link
                to="/"
                state={{ scrollToId: "company" }}
                className="cursor-pointer hover:underline hover:text-textYellow"
              >
                Company
              </Link>
              <Link
                to="/games"
                className="cursor-pointer hover:underline hover:text-textYellow"
              >
                Games
              </Link>
              <ScrollLink
                to="contact"
                smooth={true}
                duration={500}
                className="cursor-pointer hover:underline hover:text-textYellow"
              >
                Contact us
              </ScrollLink>
            </div>
          </div>

          {/* Part 3 */}
          <div className="text-center">
            <p className="mb-4 text-xl font-bold ">
              LICENSES &amp; CERTIFICATES
            </p>
            <img
              src={LICENSESLogo1}
              alt="Image 1"
              className="w-32 mx-auto mb-6"
            />
            <img src={LICENSESLogo2} alt="Image 2" className="w-32 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterLastPart;
