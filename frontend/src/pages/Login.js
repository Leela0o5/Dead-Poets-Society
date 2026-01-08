import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Feather, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    toast.dismiss();

    try {
      await login(formData);
      toast.success("Welcome back, poet.");
      navigate('/feed'); // Redirect to Feed
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed. Please check your credentials.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      
      {/* Login Card */}
      <div className="bg-white w-full max-w-md p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 animate-fadeIn relative overflow-hidden">
        
        {/* Decorative Top Bar  */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-900"></div>

        {/* Header */}
        <div className="text-center mb-10 mt-2">
          <div className="flex justify-center mb-4 text-gray-800">
            <Feather size={48} strokeWidth={1.5} />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 font-serif mb-3 tracking-tight">Welcome Back</h2>
          <p className="text-gray-500 italic font-serif">
            "The powerful play goes on, and you may contribute a verse."
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wide">Email</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-blue-600 transition" size={20} />
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
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wide">Password</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-blue-600 transition" size={20} />
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 rounded-lg text-white font-bold text-lg shadow-md transition-all flex items-center justify-center gap-2 ${
              loading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-gray-900 hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5"
            }`}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Enter Society</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            New to the society?{' '}
            <Link 
              to="/register" 
              className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition"
            >
              Start your journal
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;