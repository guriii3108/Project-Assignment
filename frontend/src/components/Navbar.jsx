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
    <nav className="w-full fixed top-0 z-50 bg-white/60 backdrop-blur-2xl border-b border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.03)] flex items-center justify-between px-6 lg:px-10 py-3.5 transition-all duration-300">
      {/* Decorative top glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-indigo-500/20 to-transparent"></div>

      <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-3 group relative">
        <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-linear-to-tr from-gray-900 via-gray-800 to-gray-600 shadow-[0_2px_10px_rgba(0,0,0,0.15)] transform transition-all duration-500 group-hover:scale-105 group-hover:rotate-3 overflow-hidden">
          {/* Inner metallic reflection */}
          <div className="absolute inset-0 bg-linear-to-tr from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          <svg className="w-4 h-4 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span className="text-xl font-black text-transparent bg-clip-text bg-linear-to-r from-gray-900 to-gray-600 tracking-tighter transition-all duration-300">
          TaskFlow
        </span>
      </Link>

      <div className="flex items-center gap-6">
        {user ? (
          <>
            <div className="hidden md:flex items-center gap-5">
              {user.role === "admin" && (
                <Link
                  to="/admin/dashboard"
                  className="group relative flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-indigo-600 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full transition-all border border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50/50 shadow-[0_2px_8px_rgba(79,70,229,0.08)] overflow-hidden"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-indigo-500/0 via-indigo-500/5 to-indigo-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <span className="relative z-10 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-[pulse_2s_ease-in-out_infinite]"></span>
                    Admin Panel
                  </span>
                </Link>
              )}

              {/* Sophisticated User Profile Bubble */}
              <div className="flex items-center gap-3 pl-3 border-l border-gray-200/60">
                <div className="flex flex-col items-end">
                  <span className="text-[13px] font-bold text-gray-800 tracking-tight">
                    {user.name}
                  </span>
                  <span className={`text-[9px] px-1.5 py-0.5 mt-0.5 rounded-sm font-black tracking-[0.15em] uppercase border ${user.role === "admin"
                    ? "bg-indigo-500/10 text-indigo-700 border-indigo-500/20"
                    : "bg-gray-500/10 text-gray-600 border-gray-400/20"
                    }`}>
                    {user.role}
                  </span>
                </div>
                {/* Minimalist Avatar */}
                <div className="w-9 h-9 rounded-full bg-linear-to-tr from-gray-100 to-gray-50 border border-gray-200/60 flex items-center justify-center shadow-inner text-gray-600 font-bold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="group relative text-xs font-semibold tracking-wide text-gray-500 hover:text-red-500 transition-colors px-3 py-2 rounded-lg hover:bg-red-50/50"
            >
              Sign out
            </button>
          </>
        ) : (
          <div className="flex items-center gap-5">
            {location.pathname !== "/login" && (
              <Link to="/login" className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">
                Log In
              </Link>
            )}
            {location.pathname !== "/register" && (
              <Link to="/register" className="relative group text-sm font-bold bg-gray-900 text-white px-6 py-2.5 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)] transition-all active:scale-95 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <span className="relative z-10">Get Started</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
