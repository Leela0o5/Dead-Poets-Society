import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Feather, Mail, Lock, User, Loader2, ArrowRight } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    toast.dismiss();

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    setLoading(true);

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      toast.success("Membership approved. Please log in.");
      navigate("/login");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      {/* Registration Card */}
      <div className="bg-white w-full max-w-md p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 animate-fadeIn relative overflow-hidden">
        {/* Decorative Top Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-900"></div>

        {/* Header */}
        <div className="text-center mb-8 mt-2">
          <div className="flex justify-center mb-4 text-gray-800">
            <Feather size={48} strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-serif mb-3 tracking-tight">
            Join the Society
          </h2>
          <p className="text-gray-500 italic font-serif">
            "To live deep and suck out all the marrow of life."
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-wide">
              Username
            </label>
            <div className="relative group">
              <User
                className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-blue-600 transition"
                size={20}
              />
              <input
                type="text"
                name="username"
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition placeholder-gray-400"
                placeholder="WaltWhitman"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-wide">
              Email
            </label>
            <div className="relative group">
              <Mail
                className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-blue-600 transition"
                size={20}
              />
              <input
                type="email"
                name="email"
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition placeholder-gray-400"
                placeholder="poet@society.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-wide">
              Password
            </label>
            <div className="relative group">
              <Lock
                className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-blue-600 transition"
                size={20}
              />
              <input
                type="password"
                name="password"
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition placeholder-gray-400"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-wide">
              Confirm Password
            </label>
            <div className="relative group">
              <Lock
                className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-blue-600 transition"
                size={20}
              />
              <input
                type="password"
                name="confirmPassword"
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition placeholder-gray-400"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 rounded-lg text-white font-bold text-lg shadow-md transition-all flex items-center justify-center gap-2 mt-2 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gray-900 hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5"
            }`}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Become a Member</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            Already a member?{" "}
            <Link
              to="/login"
              className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
