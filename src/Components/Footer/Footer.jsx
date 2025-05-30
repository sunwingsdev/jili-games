import ContactFooter from "./ContactFooter";
import FooterLastPart from "./FooterLastPart";
import FooterMiddlePart from "./FooterMiddlePart";

const Footer = () => {
  return (
    <div className="">
      <ContactFooter />
      <FooterMiddlePart />
      <FooterLastPart />

      {/* Horizontal Line & Text */}
      <div className="text-center space-y-5 py-4">
        <hr className="border-t border-[#351A07] mx-[10%]"  />

        <p className="text-sm text-[#929292]" >
          © 2025 YourCompanyName. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
