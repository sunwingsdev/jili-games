import { useEffect } from "react";
import AllGames from "../Components/Home/GamesParts/AllGames";
import ImageSlider from "../Components/Home/ImageSlider";
import JiliGamesOnline from "../Components/Home/JiliGamesOnline";
import OurGames from "../Components/Home/OurGames";
import OurService from "../Components/Home/OurService";
import Unique from "../Components/Home/Unique";
import { useLocation } from "react-router-dom";


const Home = () => {
    const location = useLocation();

  useEffect(() => {
    const scrollToId = location.state?.scrollToId;
    if (scrollToId) {
      const el = document.getElementById(scrollToId);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100); // wait till render
      }
    }
  }, [location]);
    return (
        <div>
           <ImageSlider/>
           <OurGames/>
           <AllGames/>
           <JiliGamesOnline/>
           <Unique/>
           <OurService/>
            
           
        </div>
    );
};

export default Home;