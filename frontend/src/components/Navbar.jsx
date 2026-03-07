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
    <nav className="w-full bg-white bg-opacity-95 backdrop-blur-sm border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50 font-sans transition-all duration-300">
      <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 group">
        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shadow-sm transform transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span className="text-xl font-bold text-gray-900 tracking-tight transition-colors duration-300">
          TaskFlow
        </span>
      </Link>

      <div className="flex items-center gap-5">
        {user ? (
          <>
            {/* User Profile Info */}
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-gray-700 text-sm font-semibold">
                {user.name}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${user.role === "admin"
                  ? "bg-purple-50 text-purple-700 border-purple-200"
                  : "bg-gray-100 text-gray-700 border-gray-200"
                }`}>
                {user.role}
              </span>
            </div>

            <div className="h-4 w-px bg-gray-200 hidden sm:block"></div>

            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-black font-semibold transition-colors"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            {location.pathname !== "/login" && (
              <Link to="/login" className="text-sm text-gray-500 hover:text-gray-900 font-bold transition-colors">
                Log In
              </Link>
            )}
            {location.pathname !== "/register" && (
              <Link to="/register" className="text-sm bg-black hover:bg-gray-900 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-sm active:scale-95 flex items-center justify-center">
                Sign Up
              </Link>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
