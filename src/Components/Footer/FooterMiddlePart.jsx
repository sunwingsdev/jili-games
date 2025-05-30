import mailImage from "../../assets/Images/contact-mail.svg";
import qrImage1 from "../../assets/Images/QRcode_telegram.png";
import qrImage2 from "../../assets/Images/QRcode_skype.png";
import rightImage from "../../assets/Images/contactus_role.png";





const FooterMiddlePart = () => {
  return (
    <div className="text-white   px-6 md:px-10 lg:px-20 bg-black">
      <div className="flex flex-col lg:flex-row  justify-between items-start gap-10">
        

        {/* left Side Content */}
        <div className="w-full 2xl:ml-[22%]    lg:w-full flex flex-col items-start   md:items-center relative">
          {/* Gmail Row */}
          <div className="flex items-center gap-2 mb-3">
            <img
              src={mailImage}
              alt="Gmail Icon"
              className="w-12 h-12"
            />
            <span className="text-lg font-medium">jili-service@jiligames.com</span>
          </div>

          {/* Info Text */}
          <p className="text-lg  lg:text-lg md:text-base lg:w-[75%] font-bold text-center text-gray-300 mb-6">
            If you are interested in integrating our quality content, Friend our sales on SKYPE below
          </p>

          {/* Skype Contacts */}
          <div className="flex flex-col    lg:flex-row gap-6 ">
            <div className="flex flex-col items-center">
              <img
                src={qrImage1}
                alt="Skype Contact 1"
                className="w-28 h-28 object-contain "
              />
              <span className="text-lg">@Shila</span>
            </div>
            <div className="flex flex-col items-center">
              <img
                src={qrImage2}
                alt="Skype Contact 2"
                className="w-28 h-28 object-contain "
              />
              <span className="text-lg">@JA</span>
            </div>
           
          </div>

           {/* Right Side Image in phone and medium device */}
        <div className=" lg:hidden md:w-[30%]  w-[70%] flex justify-center lg:justify-end absolute bottom-0 md:bottom-5 right-0">
          <img
            src={rightImage}
            alt="Left Visual"
            className="max-w-[300px] w-full"
          />
        </div>
        </div>

        {/* Right Side Image */}
        <div className="w-full hidden 2xl:justify-start  lg:w-[40%] lg:flex justify-center lg:justify-end">
          <img
            src={rightImage}
            alt="Left Visual"
            className="max-w-[300px] w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default FooterMiddlePart;
