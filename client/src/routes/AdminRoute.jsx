import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const AdminRoute = ({ children }) => {
  const { token, user } = useSelector((state) => state.auth);
  const [showError, setShowError] = useState(false);

  const isAdmin = token && user && user.role === "admin";

  useEffect(() => {
    if (!isAdmin) {
      toast.error("Please first login as an admin");
      setShowError(true);
    }
  }, [isAdmin]);

  if (showError) {
    return <Navigate to="/admin" />;
  }

  return children;
};

export default AdminRoute;
