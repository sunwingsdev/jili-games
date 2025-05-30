import { Link } from "react-router-dom";
import exampleImage from "../../assets/Images/aboutus.png"; // তুমি তোমার ইমেজ পাথ এডজাস্ট করো

const JiliGamesOnline = () => {
     const stats = [
    { number: "100+", label: "HTML GAMES" },
    { number: "10+", label: "GAMES CERTIFICATIONS" },
    { number: "50+", label: "CURRENCIES SUPPORTED" },
    { number: "12+", label: "LANGUAGES SUPPORTED" },
  ];
  return (
    <div className="pt-8" id="company">

   
    <div className="flex flex-col-reverse lg:flex-row items-center md:items-stretch gap-6 md:gap-12 p-6 xl:px-0 lg:px-4 md:px-4 max-w-7xl mx-auto">
      {/* Left Image */}
      <div className="lg:flex-1 md:h-auto h-64 lg:h-auto w-full lg:w-auto">
        <img
          src={exampleImage}
          alt="JILI Games"
          className="object-cover h-full w-full rounded-lg shadow-lg"
        />
      </div>

      {/* Right Text */}
      <div className="lg:flex-1 flex flex-col justify-center w-full text-center md:text-left">
        <h2 className="text-2xl text-textYellow xl:text-5xl  lg:text-4xl  lg:text-balance md:text-center  font-bold mb-4 w-full">
         <span className="lg:block text-center w-full hidden">JILI Games - ONLINE</span>
         <span className="lg:hidden ">JILI Games - ONLINE </span>
          CASINO GAMES PROVIDER
        </h2>
        <p className="text-[#8B8B8B] mb-6 leading-relaxed">
          JILI Gaming is a group of well-experienced gaming developers dedicated
          to creating the best and most original games in pursuit of excellence
          and innovation, which are our core values. We design exciting online
          video slots, bingo, table games, and fishing games, stay ahead of the
          competition and keep releasing innovative games.
        </p>
        <div className="lg:w-[40%] mx-auto ">
          <Link
            to="/company-details"
            className="inline-block bg-bgYellow hover:bg-opacity-60 text-black text-lg font-semibold px-6 py-3 rounded-full transition"
          >
            More About Us
          </Link>
        </div>
      </div>


    </div>

    <div className="w-full flex flex-wrap justify-center items-center lg:gap-10 gap-y-8 pb-8">
      {stats.map((item) => (
        <div
          key={item.label}
          className="w-1/2 lg:w-auto flex flex-col  justify-center items-center text-white"
        >
          <div className="text-4xl lg:text-5xl text-textYellow font-bold">{item.number}</div>
          <div className="text-lg h-12 md:h-auto md:text-xl text-center">{item.label}</div>
        </div>
      ))}
    </div>
     </div>
  );
};

export default JiliGamesOnline;
