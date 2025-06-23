import { IoClose } from "react-icons/io5";
import { useGetHomeControlsQuery } from "../../redux/features/allApis/homeControlApi/homeControlApi";
import { useDispatch } from "react-redux";
import {
  useLazyGetAuthenticatedUserQuery,
  useLoginUserMutation,
} from "../../redux/features/allApis/usersApi/usersApi";
import toast from "react-hot-toast";
import { setCredentials } from "../../redux/slices/authSlice";
import { useState } from "react";

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const [getUser] = useLazyGetAuthenticatedUserQuery();

  const { data: homeControls } = useGetHomeControlsQuery();
  const logoHomeControl = homeControls?.find(
    (control) => control.category === "logo" && control.isSelected === true
  );

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data: loginData } = await loginUser({ email, password });

      if (loginData.token) {
        const { data: userData } = await getUser(loginData.token);
        dispatch(setCredentials({ token: loginData.token, user: userData }));
        toast.success("Login successful");
        onClose();
      }
    } catch (error) {
      toast.error(
        error?.data?.error ||
          error?.message ||
          "Provide valid email and password"
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
      <div className="bg-white w-full max-w-5xl rounded-lg p-6 relative flex flex-col lg:flex-row gap-6 lg:items-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-5 -right-5 w-10 h-10 text-3xl text-white bg-blue-500 rounded-full flex items-center justify-center"
        >
          <IoClose />
        </button>

        {/* Embedded YouTube Video */}
        <div className="w-full lg:w-1/2">
          <div className="aspect-w-16 aspect-h-9 w-full">
            <iframe
              className="w-full h-full lg:h-96 rounded"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ" // Replace with your actual link
              title="Intro Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Login Form */}
        <div className="w-full lg:w-1/2">
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
            <h1 className="text-lg italic text-black">Login</h1>
          </div>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-sm text-blue-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <div className="text-right text-sm text-blue-500 mb-4 cursor-pointer hover:underline">
              Forgot your password?
            </div>

            <button
              disabled={isLoading}
              className="w-full bg-blue-400 hover:bg-blue-500 text-white font-semibold py-2 rounded-full"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="text-center text-sm text-gray-600 mt-4">
            Don’t have an account?{" "}
            <span
              onClick={() => {
                onClose();
                onSwitchToRegister();
              }}
              className="text-blue-500 hover:underline cursor-pointer"
            >
              Apply for client access
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
