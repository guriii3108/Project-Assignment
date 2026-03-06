import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { showSuccess, showError } from "../utils/toast";

const Register = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await api.post("/auth/register", data);
      showSuccess("Account created! Please login.");
      navigate("/login");
    } catch (err) {
      showError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-[#0A0A0A] border border-[#222222] rounded-2xl p-8 sm:p-10 relative z-10 shadow-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[#EDEDED] tracking-tight mb-2">
            Create account
          </h1>
          <p className="text-[#A1A1A1] text-sm font-medium">
            Join TaskFlow layout to manage your tasks effortlessly
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#A1A1A1] uppercase tracking-wider">
              Name
            </label>
            <input
              {...register("name", { required: "Name is required" })}
              placeholder="Guri"
              className="w-full bg-[#111111] border border-[#333333] text-[#EDEDED] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#EDEDED] focus:ring-1 focus:ring-[#EDEDED] transition-all placeholder:text-[#444444]"
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

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
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Min 6 characters" },
              })}
              type="password"
              placeholder="••••••••"
              className="w-full bg-[#111111] border border-[#333333] text-[#EDEDED] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#EDEDED] focus:ring-1 focus:ring-[#EDEDED] transition-all placeholder:text-[#444444]"
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#A1A1A1] uppercase tracking-wider">
              Role
            </label>
            <div className="relative">
              <select
                {...register("role")}
                className="w-full appearance-none bg-[#111111] border border-[#333333] text-[#EDEDED] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#EDEDED] focus:ring-1 focus:ring-[#EDEDED] transition-all cursor-pointer"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              {/* Custom dropdown arrow */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#A1A1A1]">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#EDEDED] hover:bg-white text-black font-semibold py-3 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-6 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-center text-[#A1A1A1] text-sm mt-8 font-medium">
          Already have an account?{" "}
          <Link to="/login" className="text-[#EDEDED] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
