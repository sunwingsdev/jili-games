import companyBannerImage from "../../assets/Images/banner.jpg";

const CompanyHeader = () => {
  const stats = [
    { number: "100+", label: "HTML GAMES" },
    { number: "10+", label: "GAMES CERTIFICATIONS" },
    { number: "50+", label: "CURRENCIES SUPPORTED" },
    { number: "12+", label: "LANGUAGES SUPPORTED" },
  ];
  return (
    <div>
      <img src={companyBannerImage} alt="" />
      <div className="w-full flex flex-wrap justify-center items-center lg:gap-10 gap-y-8 py-8">
        {stats.map((item) => (
          <div
            key={item.label}
            className="w-1/2 lg:w-auto flex flex-col  justify-center items-center text-white"
          >
            <div className="text-4xl lg:text-5xl text-white font-bold">
              {item.number}
            </div>
            <div className="text-lg h-12 md:h-auto md:text-xl text-center">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyHeader;
