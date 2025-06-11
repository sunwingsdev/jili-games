import AfDepositCommissionForm from "../../../../Components/Dashboard/Setting/CommissionSetting/AfDepositCommissionForm";
import AffiliateCommissionForm from "../../../../Components/Dashboard/Setting/CommissionSetting/AffiliateCommissionForm";
import AfSignUpCommissionForm from "../../../../Components/Dashboard/Setting/CommissionSetting/AfSignUpCommissionForm";
import UserReferCommissionForm from "../../../../Components/Dashboard/Setting/CommissionSetting/UserReferCommissionForm";

const CommissionSetting = () => {
  return (
    <div>
      {/* Header */}
      <div className="bg-[#222222] flex flex-col md:flex-row items-start md:items-center justify-between p-4 mb-4">
        <div className="flex flex-row items-start justify-between w-full mb-4 md:mb-0">
          <h1 className="text-2xl text-white font-bold">Commission Settings</h1>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AffiliateCommissionForm />
        <AfDepositCommissionForm />
        <AfSignUpCommissionForm />
        <UserReferCommissionForm />
      </div>
    </div>
  );
};

export default CommissionSetting;
