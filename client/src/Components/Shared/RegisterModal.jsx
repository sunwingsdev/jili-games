import { IoClose } from "react-icons/io5";
import { useGetHomeControlsQuery } from "../../redux/features/allApis/homeControlApi/homeControlApi";
import { useState } from "react";
import {
  useAddUserMutation,
  useLazyGetAuthenticatedUserQuery,
  useLoginUserMutation,
} from "../../redux/features/allApis/usersApi/usersApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/slices/authSlice";
import toast from "react-hot-toast";

const RegisterModal = ({ isOpen, onClose, onSwitchToSignIn }) => {
  const dispatch = useDispatch();

  const { data: homeControls } = useGetHomeControlsQuery();
  const logoHomeControl = homeControls?.find(
    (control) => control.category === "logo" && control.isSelected
  );

  const [addUser] = useAddUserMutation();
  const [loginUser] = useLoginUserMutation();
  const [getUser] = useLazyGetAuthenticatedUserQuery();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const { fullName, email, password, confirmPassword } = formData;

    if (!fullName || !email || !password || !confirmPassword) {
      return toast.error("Please fill in all required fields.");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);

      const { data: result } = await addUser({
        fullName,
        email,
        password,
      });

      if (result?.insertedId) {
        // Auto login
        const { data: loginData } = await loginUser({
          email,
          password,
        });

        if (loginData?.token) {
          const { data: userData } = await getUser(loginData.token);
          dispatch(setCredentials({ token: loginData.token, user: userData }));
        }

        toast.success("Registration successful");
        onClose();
      }
    } catch (err) {
      toast.error(err?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-sm rounded-lg p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-5 -right-5 w-10 h-10 text-3xl text-white bg-blue-500 rounded-full flex items-center justify-center"
        >
          <IoClose />
        </button>

        {/* Logo */}
        <div className="flex flex-col items-center gap-2 mb-6">
          {logoHomeControl?.image ? (
            <img
              className="w-20"
              src={`${import.meta.env.VITE_BASE_API_URL}${
                logoHomeControl?.image
              }`}
              alt="Logo"
            />
          ) : (
            <div className="h-10"></div>
          )}
          <h1 className="text-lg italic text-black">Register</h1>
        </div>

        <p className=" text-sm italic text-black mb-4 text-center">
          Please note that only Evolution customers can create an account.
        </p>
        <form onSubmit={handleRegister}>
          {/* Full Name Field */}
          <input
            type="text"
            name="fullName"
            placeholder="Your full name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-4 py-2 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* Email Field */}
          <input
            type="email"
            name="email"
            placeholder="Your email address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* Password Field */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* Confirm Password Field */}
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* Forgot Password */}
          <div className="text-right text-sm text-blue-500 mb-4 cursor-pointer hover:underline">
            Forgot your password?
          </div>

          {/* Register Button */}
          <button
            disabled={loading}
            className="w-full bg-blue-400 hover:bg-blue-500 text-white font-semibold py-2 rounded-full"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Bottom Text */}
        <div className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <span
            onClick={() => {
              onClose();
              onSwitchToSignIn();
            }}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Sign in
          </span>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
