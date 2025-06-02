import { createBrowserRouter } from "react-router";
import MainLayout from "../Layouts/MainLayout";
import Home from "../Pages/Home";
import Games from "../Pages/Games";
import Company from "../Pages/Company";
import GameInfo from "../Pages/GameInfo";
import DashboardLayout from "../Layouts/DashboardLayout";
import DashboardHome from "../Pages/Dashboard/DashboardHome";
import AllUsers from "../Pages/Dashboard/Users/AllUsers";

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
          await new Promise((resolve) => setTimeout(resolve, 2000));
          return null;
        },
      },
      {
        path: "/game/:id",
        element: <GameInfo />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "",
        element: <DashboardHome />,
      },
      {
        path: "users",
        element: <AllUsers />,
      },
    ],
  },
]);

export default router;
