import { createBrowserRouter } from "react-router";
import MainLayout from "../Layouts/MainLayout";
import Home from "../Pages/Home";
import Games from "../Pages/Games";
import Company from "../Pages/Company";
import GameInfo from "../Pages/GameInfo";
import DashboardLayout from "../Layouts/DashboardLayout";
import DashboardHome from "../Pages/Dashboard/DashboardHome";
import AllUsers from "../Pages/Dashboard/Users/AllUsers";
import BalanceHistories from "../Pages/Dashboard/Users/BalanceHistories";
import CashAgent from "../Pages/Dashboard/CashAgent/CashAgent";
import Kyc from "../Pages/Dashboard/CashAgent/Kyc";
import PaymentMethodRequests from "../Pages/Dashboard/CashAgent/PaymentMethodRequests";
import Affiliators from "../Pages/Dashboard/Affiliator/Affiliators";
import AllAffiliateLinks from "../Pages/Dashboard/Affiliator/AllAffiliateLinks";
import GameCategories from "../Pages/Dashboard/GameCategory/GameCategories";
import AddGamesOnGamesApiKey from "../Pages/Dashboard/AddGames/AddGamesOnGamesApiKey";
import GamesApi from "../Pages/Dashboard/GamesApi/GamesApi";
import HomeControl from "../Pages/Dashboard/HomeControl/HomeControl";
import PromotionOffer from "../Pages/Dashboard/PromotionOffer/PromotionOffer";
import ManagePages from "../Pages/Dashboard/ManagePages/ManagePages";
import Sponshorship from "../Pages/Dashboard/Sponshorship/Sponshorship";
import DepositMethod from "../Pages/Dashboard/BankingDeposit/DepositMethod";
import EditDepositMethodForm from "../Pages/Dashboard/BankingDeposit/EditDepositMethodForm";
import DepositHistory from "../Pages/Dashboard/BankingDeposit/DepositHistory";
import WithdrawMethod from "../Pages/Dashboard/BankingWithdraw/WithdrawMethod";
import EditWithdrawMethodForm from "../Pages/Dashboard/BankingWithdraw/EditWithdrawMethodForm";
import WithdrawHistory from "../Pages/Dashboard/BankingWithdraw/WithdrawHistory";
import CommissionSetting from "../Pages/Dashboard/Setting/CommissionSetting/CommissionSetting";
import AdminProfile from "../Pages/Dashboard/AdminProfile/AdminProfile";
import AgentProfile from "../Pages/Dashboard/AgentProfile/AgentProfile";
import UserDetailsPage from "../Pages/Dashboard/UserDetailsPage/UserDetailsPage";
import AdminRoute from "./AdminRoute";
import AdminLogin from "../Pages/AdminLogin/AdminLogin";

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
    element: (
      <AdminRoute>
        <DashboardLayout />
      </AdminRoute>
    ),
    children: [
      { path: "", element: <DashboardHome /> },
      { path: "users", element: <AllUsers /> },
      { path: "balance-histories", element: <BalanceHistories /> },
      { path: "profile/:id", element: <AdminProfile /> },
      { path: "cashagent", element: <CashAgent /> },
      { path: "kyc", element: <Kyc /> },
      { path: "paymentmethodrequests", element: <PaymentMethodRequests /> },
      { path: "agentprofile/:id", element: <AgentProfile /> },
      { path: "affiliators", element: <Affiliators /> },
      { path: "allaffiliatelinks", element: <AllAffiliateLinks /> },
      { path: "user-profile/:id", element: <UserDetailsPage /> },
      { path: "gameCategories", element: <GameCategories /> },
      { path: "addGames", element: <AddGamesOnGamesApiKey /> },
      { path: "gamesApi/:id", element: <GamesApi /> },
      { path: "home-controls", element: <HomeControl /> },
      { path: "promotion-offer", element: <PromotionOffer /> },
      { path: "manage-pages", element: <ManagePages /> },
      { path: "sponsorship", element: <Sponshorship /> },
      { path: "depositmethod", element: <DepositMethod /> },
      { path: "edit-depositmethod/:id", element: <EditDepositMethodForm /> },
      { path: "deposithistory", element: <DepositHistory /> },
      { path: "withdrawmethod", element: <WithdrawMethod /> },
      { path: "edit-withdrawmethod/:id", element: <EditWithdrawMethodForm /> },
      { path: "withdraws", element: <WithdrawHistory /> },
      { path: "commissionsetting", element: <CommissionSetting /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLogin />,
  },
]);

export default router;
