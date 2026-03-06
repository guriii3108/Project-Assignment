import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { showSuccess } from "../utils/toast";
import api from "../api/axiosInstance";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (_) { }
    logout();
    showSuccess("Logged out successfully");
    navigate("/login");
  };

  return (
    <nav className="w-full bg-[#0A0A0A]/80 backdrop-blur-md border-b border-[#222222] px-6 py-4 flex items-center justify-between sticky top-0 z-50 font-sans">
      <Link to="/dashboard" className="flex items-center gap-2 group">
        <div className="w-8 h-8 bg-[#EDEDED] rounded-lg flex items-center justify-center text-black font-bold rotate-3 group-hover:-rotate-3 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.15)]">
          TF
        </div>
        <span className="text-xl font-semibold text-[#EDEDED] tracking-tight">
          TaskFlow
        </span>
      </Link>

      <div className="flex items-center gap-5">
        {user ? (
          <>
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-[#A1A1A1] text-sm font-medium">
                {user.name}
              </span>
              <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider ${user.role === "admin"
                  ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                  : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                }`}>
                {user.role}
              </span>
            </div>
            <div className="h-5 w-px bg-[#333333] hidden sm:block"></div>
            <button
              onClick={handleLogout}
              className="text-sm text-[#A1A1A1] hover:text-[#EDEDED] font-medium transition-colors"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm text-[#A1A1A1] hover:text-[#EDEDED] font-medium transition-colors">
              Log in
            </Link>
            <Link to="/register" className="text-sm bg-[#EDEDED] text-black px-4 py-2 rounded-lg font-semibold hover:bg-white transition-all active:scale-95 shadow-[0_0_10px_rgba(255,255,255,0.05)]">
              Get started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
