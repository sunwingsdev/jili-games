import image1 from "../../assets/Images/ourService-item1.png";
import image2 from "../../assets/Images/ourService-item2.png";
import image3 from "../../assets/Images/ourService-item3.png";
import image4 from "../../assets/Images/ourService-item4.png";
import image5 from "../../assets/Images/ourService-item5.png";




const serviceData = [
  {
    name: "Multi-Platform",
    img: image1,
    text: "Desktop, tablet, or smartphone, All of our games delivered in HTML5 for flawless performance on any device.",
  },
  {
    name: "Back Office",
    img: image2,
    text: "Our back-office tools are user-friendly, customizable and highly effective.Secure, Stable, and Simple.",
  },
  {
    name: "Engagement Tools",
    img: image3,
    text: "We build great games and we also have many tools for promoting.Tournament, ust-Hit By, Linking Jackpots, etc.",
  },
  {
    name: "24/7 Support",
    img: image4,
    text: "The most appropriate services, 24/7, caring about all of our customers.",
  },
  {
    name: "Multilingual",
    img: image5,
    text: "Support different languages and currencies you need. We are now global.",
  },
  
];

const OurService = () => {
  return (
    <div className="py-10 px-4">
      <h2 className="text-5xl font-bold text-center text-yellow-400 mb-8">
        Our Service
      </h2>

      <div className="lg:flex flex-wrap gap-6 justify-center hidden ">
        {serviceData.map((item) => (
          <div
            key={item.name}
            className="xl:w-[220px]  lg:w-[170px] h-[420px] bg-[#1a1a1a] border border-textYellow my-auto text-white rounded-lg p-4 flex flex-col items-center  text-center shadow-lg"
          >
            <img
              src={item.img}
              alt={item.name}
              className="w-28 h-28 object-contain mb-3"
            />
            <h3 className="text-2xl font-semibold mb-2">{item.name}</h3>
            <p className="xl:text-base lg:text-sm">{item.text}</p>
          </div>
        ))}
      </div>

      {/* Mobile / Medium screen: horizontal scroll */}
      <div className="lg:hidden overflow-x-auto">
        <div className="flex gap-4 px-1 w-max">
          {serviceData.map((item) => (
            <div
              key={item.name}
              className="min-w-[240px] max-w-[240px] h-[280px] bg-[#1a1a1a] border border-textYellow text-white rounded-lg p-4 flex-shrink-0 flex flex-col items-center text-center shadow-lg"
            >
              <img
                src={item.img}
                alt={item.name}
                className="w-16 h-16 object-contain mb-3"
              />
              <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
              <p className="text-sm">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurService;
