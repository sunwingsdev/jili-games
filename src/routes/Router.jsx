import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layouts/MainLayout";
import Home from "../Pages/Home";
import Games from "../Pages/Games";
import Company from "../Pages/Company";
import GameInfo from "../Pages/GameInfo";



const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
        
      },
      {
        path: "/company-details",
        element: <Company />,
      },
      {
        path: "/games",
        element: <Games />,
        loader: async () => {
          await new Promise((resolve) => setTimeout(resolve, 2000)); // delay for 2 sec
          return null;
        },
      },
      {
        path: "/game/:id", // ✅ Dynamic route for Game Info
        element: <GameInfo />,
      },


      
    ],
  },
 
]);

export default router;