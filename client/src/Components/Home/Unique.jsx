import unique1 from "../../assets/Images/excl-task.png";
import unique2 from "../../assets/Images/excl-props.png";
import unique3 from "../../assets/Images/excl-event.png";
import unique4 from "../../assets/Images/excl-return.png";
import unique5 from "../../assets/Images/excl-signIn.png";
import unique6 from "../../assets/Images/excl-gift.png";

const items = [
  { img: unique1, text: "Tournament", backText:"Easily for operators to set up and update, allow more interactions between players and keep them excited and engaged." },
  { img: unique2, text: "Missions &amp; Rich Card" , backText:"Provide customized missions and Win cards according to player's habits, setting different level goals to pursue. Fun and exciting." },
  { img: unique3, text: "Sign-in" , backText:"The sign-in event will give prizes to different players, and enjoy the game more." },
  { img: unique4, text: "Must Hit By" , backText:"The “Must Hit By” is our unique feature that makes the Jackpots more fun and exciting. It must be drawn when it reaches the target." },
  { img: unique5, text: "Linking Jackpot" , backText:"Through the joint Linking Jackpot, all players have the same goal of pursuing super prizes. More interactions and excitement." },
  { img: unique6, text: "AI & Datamining" , backText:"Use the operating mechanism to analyze the bets and retention daily to improve performance. Offers each player-favorite games and events to meet the different interests." },
];

const Unique = () => {
  return (
    <div className="py-10 px-4 text-center">
      <h2 className="text-3xl font-bold text-textYellow mb-10">Our Unique</h2>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-6 justify-items-center  md:w-[50%] lg:w-[80%]  xl:w-[65%]  mx-auto">
        {items.map((item, index) => (
          <div
            key={index}
            className="w-full h-[200px] md:h-[220px]  lg:w-full lg:h-[280px] flip-card"
          >
            <div className="flip-card-inner">
              {/* Front */}
              <div className="flip-card-front flex flex-col items-center justify-center py-2 lg:py-0 border border-textYellow space-y-2">
                <img
                  src={item.img}
                  alt="Unique"
                  className="w-[60%]  object-contain rounded-lg"
                />
                <p className="text-white w-[90%]  text-sm md:text-2xl leading-tight">{item.text}</p>
              </div>

              {/* Back */}
              <div className="flip-card-back bg-bgYellow text-black  text-xs lg:text-base font-semibold">
                <p>{item.backText}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default Unique;
