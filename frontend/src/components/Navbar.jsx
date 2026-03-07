import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { showSuccess } from "../utils/toast";
import api from "../api/axiosInstance";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (_) { }
    logout();
    showSuccess("Logged out successfully");
    navigate("/login");
  };

  return (
    <nav className="w-full fixed top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 flex items-center justify-between px-8 py-4 transition-all duration-300">
      <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-3 group">
        <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-linear-to-tr from-gray-900 to-gray-700 shadow-md transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-lg">
          <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span className="text-xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-gray-900 to-gray-600 tracking-tight transition-all duration-300">
          TaskFlow
        </span>
      </Link>

      <div className="flex items-center gap-6">
        {user ? (
          <>
            <div className="hidden md:flex items-center gap-4">
              {user.role === "admin" && (
                <Link
                  to="/admin/dashboard"
                  className="text-xs font-semibold tracking-wide text-indigo-600 bg-indigo-50/80 hover:bg-indigo-100 px-4 py-1.5 rounded-full transition-all border border-indigo-100 shadow-sm"
                >
                  Admin Portal
                </Link>
              )}
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-gray-800">
                  {user.name}
                </span>
                <span className={`text-[10px] px-2 py-0.5 mt-0.5 rounded border tracking-widest uppercase font-semibold ${user.role === "admin"
                  ? "bg-indigo-50/50 text-indigo-600 border-indigo-100"
                  : "bg-gray-50/50 text-gray-500 border-gray-200"
                  }`}>
                  {user.role}
                </span>
              </div>
            </div>

            <div className="h-5 w-px bg-gray-200 hidden md:block"></div>

            <button
              onClick={handleLogout}
              className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              Sign out
            </button>
          </>
        ) : (
          <div className="flex items-center gap-4">
            {location.pathname !== "/login" && (
              <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Log In
              </Link>
            )}
            {location.pathname !== "/register" && (
              <Link to="/register" className="text-sm font-medium bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-full shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] transition-all active:scale-95 flex items-center justify-center">
                Get Started
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
