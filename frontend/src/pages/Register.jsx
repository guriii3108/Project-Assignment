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
    <div className="min-h-screen bg-white flex items-center justify-center font-sans">
      <main className="w-full max-w-[400px] px-6">
        {/* Header Section */}
        <div className="mb-10 text-center mt-8">
          <h1 className="text-[32px] font-bold text-gray-900 tracking-tight mb-2">
            Create an account
          </h1>
          <p className="text-gray-500 text-sm font-medium">
            Join us and start managing your tasks
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Input */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-900 ml-1">
              Name
            </label>
            <input
              {...register("name", { required: "Name is required" })}
              placeholder="Full Name"
              className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all placeholder:text-gray-400 font-medium shadow-sm"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.name.message}</p>
            )}
          </div>

          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-900 ml-1">
              Email
            </label>
            <input
              {...register("email", { required: "Email is required" })}
              type="email"
              placeholder="Email Address"
              className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all placeholder:text-gray-400 font-medium shadow-sm"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.email.message}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-900 ml-1">
              Password
            </label>
            <div className="relative">
              <input
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Min 6 characters" },
                })}
                type="password"
                placeholder="••••••••"
                className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all placeholder:text-gray-400 font-medium shadow-sm"
              />
              {/* Static Eye Crossed Icon */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-300">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </div>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.password.message}</p>
            )}
          </div>

          {/* Role Input */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-900 ml-1">
              Role
            </label>
            <div className="relative">
              <select
                {...register("role")}
                className="w-full appearance-none bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all font-medium cursor-pointer shadow-sm"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#0A0A0A] hover:bg-black text-white font-semibold py-3.5 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-sm"
          >
            {isSubmitting ? "Signing up..." : "Sign up"}
          </button>


        </form>

        {/* Footer Link */}
        <p className="text-center text-gray-500 text-sm mt-10 mb-8">
          Already have an account?{" "}
          <Link to="/login" className="text-gray-900 font-bold hover:underline">
            Log In
          </Link>
        </p>
      </main>
    </div>
  );
};

export default Register;
