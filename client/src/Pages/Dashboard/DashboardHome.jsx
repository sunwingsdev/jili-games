import {
  FaGamepad,
  FaUser,
  FaUsers,
  FaPuzzlePiece,
  FaUniversity,
  FaCreditCard,
} from "react-icons/fa";
import { TiGroup } from "react-icons/ti";
import { FiUsers } from "react-icons/fi";
import { MdBatteryAlert, MdRequestPage } from "react-icons/md";
import { BiDownload, BiMoneyWithdraw, BiSolidGame } from "react-icons/bi";
import { FaMoneyBillWave } from "react-icons/fa6";
import { RiWallet3Fill, RiBankCardLine } from "react-icons/ri";
import { GiJoystick } from "react-icons/gi";
import { TbApi } from "react-icons/tb";
import { PiHandWithdrawBold } from "react-icons/pi";
import { HiOutlineBanknotes } from "react-icons/hi2";
import { useGetUsersQuery } from "../../redux/features/allApis/usersApi/usersApi";
import { useGetAllCategoriesQuery } from "../../redux/features/allApis/categoryApi/categoryApi";
import { useGetAllHomeGamesQuery } from "../../redux/features/allApis/homeGamesApi/homeGamesApi";
import { useGetDepositsQuery } from "../../redux/features/allApis/depositsApi/depositsApi";
import { useGetWithdrawsQuery } from "../../redux/features/allApis/withdrawsApi/withdrawsApi";
import StatsCard from "../../Components/Dashboard/DashboardHome/StatsCard";
import CustomTable from "../../Components/Dashboard/DashboardHome/CustomTable";

const DashboardHome = () => {
  const { data: users } = useGetUsersQuery();
  const { data: allCategories } = useGetAllCategoriesQuery();
  const { data: allHomeGames } = useGetAllHomeGamesQuery();
  const { data: deposits } = useGetDepositsQuery();
  const { data: withdraws } = useGetWithdrawsQuery();

  const today = new Date();
  const todayString = today.toISOString().slice(0, 10);

  const todaysDeposits =
    deposits?.filter((deposit) => {
      const depositDate = deposit.createdAt.slice(0, 10);
      return depositDate === todayString;
    }) || [];

  const todaysWithdraws =
    withdraws?.filter((withdraw) => {
      const withdrawDate = withdraw.createdAt.slice(0, 10);
      return withdrawDate === todayString;
    }) || [];

  const statsColor = {
    textColor1: "text-primary-primaryColorTwo",
    textColor2: "text-textSecondaryColor",
    countColor1: "text-white",
    countColor2: "text-white",
    backColor1: "bg-textSecondaryColor",
    backColor2: "bg-primary-primaryColorTwo",
  };

  const stats = [
    {
      title: "Total Active Players",
      count:
        users?.filter(
          (user) => user.role === "user" && user.status === "approve"
        ).length || 0,
      Icon: FaUser,
      bgColor: statsColor?.backColor1,
      titleColor: statsColor?.textColor1,
      dataColor: statsColor?.countColor1,
    },
    {
      title: "Total Deactive Players",
      count: users?.filter((user) => user.status === "reject").length || 0,
      Icon: FaUsers,
      bgColor: statsColor?.backColor2,
      titleColor: statsColor?.textColor2,
      dataColor: statsColor?.countColor2,
    },
    {
      title: "Total Affiliates",
      count:
        users?.filter(
          (user) => user.role === "affiliate" && user.status === "approve"
        ).length || 0,
      Icon: TiGroup,
      bgColor: statsColor?.backColor1,
      titleColor: statsColor?.textColor1,
      dataColor: statsColor?.countColor1,
    },
    {
      title: "Total Cash Agents",
      count:
        users?.filter(
          (user) => user.role === "agent" && user.status === "approve"
        ).length || 0,
      Icon: FiUsers,
      bgColor: statsColor?.backColor2,
      titleColor: statsColor?.textColor2,
      dataColor: statsColor?.countColor2,
    },
    {
      title: "Agent Low Balance",
      count: 0,
      Icon: MdBatteryAlert,
      bgColor: statsColor?.backColor1,
      titleColor: statsColor?.textColor1,
      dataColor: statsColor?.countColor1,
    },
    {
      title: "Total Deposits",
      count: 0,
      Icon: BiDownload,
      bgColor: statsColor?.backColor2,
      titleColor: statsColor?.textColor2,
      dataColor: statsColor?.countColor2,
    },
    {
      title: "Total A-Pay Deposits",
      count: 0,
      Icon: FaMoneyBillWave,
      bgColor: statsColor?.backColor1,
      titleColor: statsColor?.textColor1,
      dataColor: statsColor?.countColor1,
    },
    {
      title: "Total C-Pay Deposits",
      count: 0,
      Icon: RiWallet3Fill,
      bgColor: statsColor?.backColor2,
      titleColor: statsColor?.textColor2,
      dataColor: statsColor?.countColor2,
    },
    {
      title: "Total Withdrawals",
      count: 0,
      Icon: RiBankCardLine,
      bgColor: statsColor?.backColor1,
      titleColor: statsColor?.textColor1,
      dataColor: statsColor?.countColor1,
    },
    {
      title: "Today Withdrawals",
      count: 0,
      Icon: BiMoneyWithdraw,
      bgColor: statsColor?.backColor2,
      titleColor: statsColor?.textColor2,
      dataColor: statsColor?.countColor2,
    },
    {
      title: "Total Game Categories",
      count: allCategories?.length || 0,
      Icon: FaPuzzlePiece,
      bgColor: statsColor?.backColor1,
      titleColor: statsColor?.textColor1,
      dataColor: statsColor?.countColor1,
    },
    {
      title: "Total Games",
      count: allHomeGames?.length || 0,
      Icon: GiJoystick,
      bgColor: statsColor?.backColor2,
      titleColor: statsColor?.textColor2,
      dataColor: statsColor?.countColor2,
    },
    {
      title: "Total Gameimg API",
      count: 0,
      Icon: TbApi,
      bgColor: statsColor?.backColor1,
      titleColor: statsColor?.textColor1,
      dataColor: statsColor?.countColor1,
    },
    {
      title: "Total Active Games",
      count: 0,
      Icon: FaGamepad,
      bgColor: statsColor?.backColor2,
      titleColor: statsColor?.textColor2,
      dataColor: statsColor?.countColor2,
    },
    {
      title: "Total Deactive Games",
      count: 0,
      Icon: BiSolidGame,
      bgColor: statsColor?.backColor1,
      titleColor: statsColor?.textColor1,
      dataColor: statsColor?.countColor1,
    },
    {
      title: "Player Deposit Requests",
      count: 0,
      Icon: FaUniversity,
      bgColor: statsColor?.backColor2,
      titleColor: statsColor?.textColor2,
      dataColor: statsColor?.countColor2,
    },
    {
      title: "Player Withdrawal Requests",
      count: 0,
      Icon: PiHandWithdrawBold,
      bgColor: statsColor?.backColor1,
      titleColor: statsColor?.textColor1,
      dataColor: statsColor?.countColor1,
    },
    {
      title: "Agent Top-Up Requests",
      count: 0,
      Icon: MdRequestPage,
      bgColor: statsColor?.backColor2,
      titleColor: statsColor?.textColor2,
      dataColor: statsColor?.countColor2,
    },
    {
      title: "Affiliate Withdrawal Requests",
      count: 0,
      Icon: HiOutlineBanknotes,
      bgColor: statsColor?.backColor1,
      titleColor: statsColor?.textColor1,
      dataColor: statsColor?.countColor1,
    },
    {
      title: "Active Deposit Methods",
      count: 0,
      Icon: FaCreditCard,
      bgColor: statsColor?.backColor2,
      titleColor: statsColor?.textColor2,
      dataColor: statsColor?.countColor2,
    },
  ];

  const lastDepositHeaders = [
    "Player Name",
    "Deposit Method",
    "Deposit Channel",
    "Amount",
    "Sender Info",
    "Date & Time",
    "Promotion",
    "Reason",
    "Status",
  ];
  const lastWithdrawHeaders = [
    "Player Name",
    "Withdraw Method",
    "Withdraw Channel",
    "Amount",
    "Sender Info",
    "Date & Time",
    "Promotion",
    "Reason",
    "Status",
  ];

  const sortedDeposits =
    todaysDeposits
      ?.slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) || [];

  const sortedWithdraws =
    todaysWithdraws
      ?.slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) || [];

  const lastDepositsData = sortedDeposits?.map((deposit) => ({
    username: deposit?.userInfo?.username,
    paymentMethod: deposit?.paymentMethod,
    depositChannel: deposit?.depositChannel,
    amount: deposit?.amount,
    phone: deposit?.userInfo?.phone,
    createdAt: new Date(deposit.createdAt).toLocaleString(),
    promotion: deposit?.promotion?.title || "No Promotion",
    reason: deposit?.reason,
    status: deposit?.status,
  }));
  const lastWithdrawsData = sortedWithdraws?.map((withdraw) => ({
    username: withdraw?.userInfo?.username,
    paymentMethod: withdraw?.paymentMethod,
    depositChannel: withdraw?.depositChannel,
    amount: withdraw?.amount,
    phone: withdraw?.userInfo?.phone,
    createdAt: new Date(withdraw.createdAt).toLocaleString(),
    promotion: withdraw?.promotion,
    reason: withdraw?.reason,
    status: withdraw?.status,
  }));

  return (
    <div>
      {/* Top Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <CustomTable
        title="Today's last Deposit Requests"
        headers={lastDepositHeaders}
        data={lastDepositsData}
        borderColor="#30b779"
      />
      <CustomTable
        title="Today's last Withdraw Requests"
        headers={lastWithdrawHeaders}
        data={lastWithdrawsData}
        borderColor="#f39c12"
      />
    </div>
  );
};

export default DashboardHome;
