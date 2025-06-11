import { useForm } from "react-hook-form";
import AddPaymentMethodandNumberforAgent from "./AddPaymentMethodandNumberforAgent";
import { useLocation } from "react-router";
import toast from "react-hot-toast";

const CashAgentProfileUserInfo = ({
  id,
  singleUser,
  updateUser,
  isLoading,
}) => {
  const location = useLocation();
  const isAdminAgentProfilePage = location.pathname.includes(
    "/dashboard/agentprofile/"
  );

  const isAgentProfilePage = location.pathname.includes("/cashagent/profile/");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const { password, confirmPassword, ...updatedUser } = data;

    // Validate password and confirm password
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      // Call mutation
      await updateUser({
        id,
        data: { ...updatedUser, ...(password && { password }) }, // Conditionally include password
      }).unwrap();
      toast.success("Information updated successfully!");
    } catch (error) {
      toast.error(
        error?.data?.message || "Failed to update Info. Please try again."
      );
    }
  };
  return (
    <>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500"
                {...register("fullName", {
                  required: "Full Name is required",
                })}
                defaultValue={singleUser?.fullName}
              />
              {errors.fullName && (
                <p className="text-red-500">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email format",
                  },
                })}
                defaultValue={singleUser?.email}
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="flex items-center border border-gray-300 rounded-md p-2">
              <div className="flex items-center ps-1 pe-7">
                <img
                  src="https://flagcdn.com/w40/bd.png"
                  alt="Bangladesh Flag"
                  className="w-6 h-4"
                />
                <span className="ml-2">+880</span>
              </div>
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                className="w-full outline-none"
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9]{10,11}$/,
                    message: "Invalid phone number",
                  },
                })}
                defaultValue={singleUser?.phone}
              />
            </div>
            {errors.phone && (
              <p className="text-red-500">{errors.phone.message}</p>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500 cursor-not-allowed"
                defaultValue={singleUser?.username}
                readOnly
                title="Username not allowed to update"
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="New Password"
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
            </div>
            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                })}
              />
              {errors.confirmPassword && (
                <p className="text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-[#6b7699f1] text-white py-3 rounded-md hover:bg-green-600 transition-all"
        >
          {isLoading ? "Updating..." : "Update Info"}
        </button>
      </form>
      {(isAgentProfilePage || isAdminAgentProfilePage) && (
        <AddPaymentMethodandNumberforAgent id={id} />
      )}
    </>
  );
};

export default CashAgentProfileUserInfo;
