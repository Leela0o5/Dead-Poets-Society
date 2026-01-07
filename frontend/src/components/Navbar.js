import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, PenTool, User, BookOpen } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600 font-serif tracking-tight"
        >
          Poetic Odyssey
        </Link>
        <div className="flex items-center gap-6">
          {user ? (
            <>
              <Link
                to="/"
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                Feed
              </Link>

              <Link
                to="/my-poems"
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium"
              >
                <BookOpen size={18} />
                <span className="hidden sm:inline">My Poems</span>
              </Link>

              <Link
                to="/create"
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium"
              >
                <PenTool size={18} />
                <span className="hidden sm:inline">Write</span>
              </Link>

              <div className="h-6 w-px bg-gray-300 mx-2"></div>

              <Link
                to="/profile"
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
              >
                <User size={20} />
                <span className="font-semibold">{user.username}</span>
              </Link>

              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700 ml-2"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
