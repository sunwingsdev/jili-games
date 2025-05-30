import { Outlet, useNavigation } from "react-router-dom";
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import ScrollToTop from "../Components/Common/ScrollToTop";
import { useState } from "react";
import GameModal from "../Components/Home/GamesParts/GameModal";
import image1 from "../assets/Images/DtP4ZtTTSFMSTUxfRBlChuvPSaZ7F6AUlyCPF9HQ.png";
import image2 from "../assets/Images/j1Wsrf65POcVebSWX2lFMmGgonc1uvrB6pEtGX5q.png";
import image3 from "../assets/Images/2DBG4VFxCy7icorMGJ3dvQVNBjKOzpcbDfVlBt2R.png";
import image4 from "../assets/Images/FIS6fMldZFwpzL5HvXez8hWvPWHRvnpaa863glpm.png";
import image5 from "../assets/Images/aMXdTiIdARFCVBmSuqp0e3SFOZmHnsOqyPvQfU10.png";
import image6 from "../assets/Images/3qiY2geP8G221Ud6zB5yxVlAoUzOpHFYD8ipLWoz.png";


import popularImage1 from "../assets/tabImages/2Ei8qPFF53hybulWPGQuOk6TYHsvQhueu3ZplieP.png";
import popularImage2 from "../assets/tabImages/8lYBJBMzSLs2Rb6DTsHe4h8jmBfVeeUElsE8qbWa.png";
import popularImage3 from "../assets/tabImages/kmTzTiVNTv9UDZFLw95QWGCO7kSFSCWLsuNKVqdl.png";

import slotImage1 from "../assets/tabImages/LzuboAeJAO7Wb6aaiOq64g7ACPVRclVQ76dEFLOl.png";
import slotImage2 from "../assets/tabImages/D3h7E0lfqlRgy0lmjPhZoHfp7DMH1HIo3poT00Ar.png";
import slotImage3 from "../assets/tabImages/rXvP8Jy0A3nRhuzK9ceAiU93fULEdpQK5DhxJ5kN.png";
import slotImage4 from "../assets/tabImages/fCf9BfgHmfHuppyg0Dg4NJNIPutSi4qsDEJAz7A3.png";

import fishingImage1 from "../assets/tabImages/XHKFtdoKMlVElWILsVAdS7LPV3keTYZAAYOi7Ws5.png";
import fishingImage2 from "../assets/tabImages/UUw0SMTzIp3UV3uJzzPdtoD5nbgo1mFlO8eSLI9P.png";

import tableImage1 from "../assets/tabImages/SGHoo70Ox2KHTqqWqXYJTKGzEs9rT96vGLFQQy6u.png";
import tableImage2 from "../assets/tabImages/n15whhGC87uxxMEjDLjeKQzoPUm39DXqYEebavum.png";
import tableImage3 from "../assets/tabImages/NVJ4ZZKj5qmLinIQYKX194xxCaufYFGirTOxAEKZ.png";

import bingoImage1 from "../assets/tabImages/GaYPdqyPSYpJWdyHXYp1wQ8wsant7E0TRXFs2La0.png";
import bingoImage2 from "../assets/tabImages/iJyqbHeciHGt8Qp53a0GRoIwyWaBZEQNrnWJFUUv.png";
import bingoImage3 from "../assets/tabImages/G7LNRaSrmOyCh70Zzb8yqT68Rp4Xj9xRBm6nQ5W6.png";

import casinoImage1 from "../assets/tabImages/rjFusGL5veaYfxqZVPyMFn5CTy6Mx1utbSNJXpnz.png";
import casinoImage2 from "../assets/tabImages/JzxGm7hWKwjorfl4rETZZYycV40zRBwy1GukE55o.png";
import casinoImage3 from "../assets/tabImages/yDKwOvjqDSJfyGly7t0xh9V0oWXk98FLnLYDcz5i.png";
import Loader from "../Components/Loader/Loader";

const MainLayout = () => {
  const navigation = useNavigation();
  
    const [modalData, setModalData] = useState(null);

    const images = [
      {
        id: "game1",
        name: "Ocean King Jackpot",
        image: image1,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        category:"Bingo",  
      },
      {
        id: "game2",
        name: "Jackpot Fishing",
        image: image2,
        videoUrl: "https://www.youtube.com/embed/tVj0ZTS4WF4",
        category:"Popular",  
      },
      {
        id: "game3",
        name: "Fortune Games2",
        image: image3,
        videoUrl: "https://www.youtube.com/embed/L_jWHffIx5E",
        category:"Slot",  
      },
      {
        id: "game4",
        name: "Super Ace Deluxe",
        image: image4,
        videoUrl: "https://www.youtube.com/embed/ZZ5LpwO-An4",
        category:"Table", 
      },
      {
        id: "game5",
        name: "Money Coming",
        image: image5,
        videoUrl: "https://www.youtube.com/embed/9bZkp7q19f0",
        category:"Casino",  
      },
      {
        id: "game6",
        name: "Golden Bank2",
        image: image6,
        videoUrl: "https://www.youtube.com/embed/3JZ_D3ELwOQ",
        category:"Bingo",  
      },
    ];
    const tabImages = {
    Popular: [
      {
        id:"popular1",
        name:"3 Coin Treasures",
        image: popularImage1,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        category:"Popular",
      },
      {
        id:"popular2",
        name:"Fortune Games 3",
        image: popularImage2,
        videoUrl: "https://www.youtube.com/embed/tVj0ZTS4WF4",
        category:"Popular",
      },
      {
        id:"popular3",
        name:"Jackpot Joker",
        image: popularImage3,
        videoUrl: "https://www.youtube.com/embed/L_jWHffIx5E",
        category:"Popular",
      },
    ],
    Slot: [
      {
        id:"slot1",
        name:"3 Coin Treasures 2",
        image: slotImage1,
        videoUrl: "https://www.youtube.com/embed/ZZ5LpwO-An4",
        category:"Slot",
      },
      {
        id:"slot2",
        name:"Fortune Coins",
        image: slotImage2,
        videoUrl: "https://www.youtube.com/embed/9bZkp7q19f0",
        category:"Slot",
      },
      {
        id:"slot3",
        name:"3 Charge Buffalo",
        image: slotImage3,
        videoUrl: "https://www.youtube.com/embed/3JZ_D3ELwOQ",
        category:"Slot",
      },
      {
        id:"slot4",
        name:"Super Ace Joker",
        image: slotImage4,
        videoUrl: "https://www.youtube.com/embed/5NV6Rdv1a3I",
        category:"Slot",
      },
    ],
    
    Fishing: [
      {
        id:"fishing1",
        name:"Fortune King Jackpot",
        image: fishingImage1,
        videoUrl: "https://www.youtube.com/embed/oHg5SJYRHA0",
        category:"Fishing",
      },
      {
         id:"fishing2",
         name:"Royal Fishing",
        image: fishingImage2,
        videoUrl: "https://www.youtube.com/embed/eVTXPUF4Oz4",
        category:"Fishing",
      },
      {
         id:"fishing3",
         name: "Ocean King Jackpot",
        image: image1,
        videoUrl: "https://www.youtube.com/embed/60ItHLz5WEA",
        category:"Fishing",
      },
    ],
    TableAndCard: [
      {
        id:"table1",
        name:"Ultimate Texas Hold'em",
        image: tableImage1,
        videoUrl: "https://www.youtube.com/embed/oHg5SJYRHA0",
        category:"Table",
      },
      {
         id:"table2",
         name:"Jhandi Munda",
        image: tableImage2,
        videoUrl: "https://www.youtube.com/embed/eVTXPUF4Oz4",
        category:"Table",
      },
      {
         id:"table3",
         name: "Speed Baccarat",
        image: tableImage3,
        videoUrl: "https://www.youtube.com/embed/60ItHLz5WEA",
        category:"Table",
      },
    ],
    Bingo: [
      {
        id:"bingo1",
        name:"Fortune Games Scratch",
        image: bingoImage1,
        videoUrl: "https://www.youtube.com/embed/oHg5SJYRHA0",
        category:"Bingo",
      },
      {
         id:"bingo2",
         name:"Go For Champion",
        image: bingoImage2,
        videoUrl: "https://www.youtube.com/embed/eVTXPUF4Oz4",
        category:"Bingo",
      },
      {
         id:"bingo3",
         name: "Boxing Extravaganza",
        image: bingoImage3,
        videoUrl: "https://www.youtube.com/embed/60ItHLz5WEA",
        category:"Bingo",
      },
    ],
    Casino: [
      {
        id:"casino1",
        name:"Domino Go",
        image: casinoImage1,
        videoUrl: "https://www.youtube.com/embed/oHg5SJYRHA0",
        category:"Casino",
      },
      {
         id:"casino2",
         name:"Keno Extra Bet",
        image: casinoImage2,
        videoUrl: "https://www.youtube.com/embed/eVTXPUF4Oz4",
        category:"Casino",
      },
      {
         id:"casino3",
         name: "Keno Super Chance",
        image: casinoImage3,
        videoUrl: "https://www.youtube.com/embed/60ItHLz5WEA",
        category:"Casino",
      },
    ],
  };
  return (
    <>
    <div>
        {/* globalLoader */}
        {navigation.state === "loading" && <Loader />} {/* 👈 show loader */}
      </div>
      <ScrollToTop />
      <div>
        <Header />
        <main className="pt-16 bg-black">
          <Outlet context={{tabImages, images, modalData, setModalData }} />
        </main>
        <div className="bg-black">
          <Footer />
        </div>
      </div>

      {/* Modal */}
      {modalData && <GameModal modalData={modalData} onClose={() => setModalData(null)} />}
    </>
  );
};

export default MainLayout;
