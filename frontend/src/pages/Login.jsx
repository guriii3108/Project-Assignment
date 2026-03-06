import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { showSuccess, showError } from "../utils/toast";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/auth/login", data);
      const { token, ...userData } = res.data.data;
      login(userData, token);
      showSuccess(`Welcome back, ${userData.name}!`);
      navigate("/dashboard");
    } catch (err) {
      showError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden font-sans">
      {/* Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-[#0A0A0A] border border-[#222222] rounded-2xl p-8 sm:p-10 relative z-10 shadow-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[#EDEDED] tracking-tight mb-2">
            Welcome back
          </h1>
          <p className="text-[#A1A1A1] text-sm font-medium">
            Log in to your TaskFlow account to continue
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#A1A1A1] uppercase tracking-wider">
              Email
            </label>
            <input
              {...register("email", { required: "Email is required" })}
              type="email"
              placeholder="guri@example.com"
              className="w-full bg-[#111111] border border-[#333333] text-[#EDEDED] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#EDEDED] focus:ring-1 focus:ring-[#EDEDED] transition-all placeholder:text-[#444444]"
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#A1A1A1] uppercase tracking-wider">
              Password
            </label>
            <input
              {...register("password", { required: "Password is required" })}
              type="password"
              placeholder="••••••••"
              className="w-full bg-[#111111] border border-[#333333] text-[#EDEDED] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#EDEDED] focus:ring-1 focus:ring-[#EDEDED] transition-all placeholder:text-[#444444]"
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#EDEDED] hover:bg-white text-black font-semibold py-3 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-[#A1A1A1] text-sm mt-8 font-medium">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#EDEDED] hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
