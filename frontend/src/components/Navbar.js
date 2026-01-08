import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Feather, LogOut, User, PlusCircle } from "lucide-react"; // Icons

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // Go back to landing page after logout
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* LOGO - Dead Poets Society */}
          <Link
            to="/"
            className="flex items-center gap-2 font-serif font-bold text-xl text-gray-800 hover:text-blue-600 transition"
          >
            <Feather size={24} />
            <span className="hidden md:block">Dead Poets Society</span>
          </Link>

          {/* RIGHT SIDE NAV */}
          <div className="flex items-center gap-6">
            <Link
              to="/rules"
              className="text-gray-600 hover:text-blue-600 font-medium transition"
            >
              Rules
            </Link>

            {user ? (
              // LOGGED IN MENU
              <>
                <Link
                  to="/feed"
                  className="text-gray-600 hover:text-blue-600 font-medium transition"
                >
                  Feed
                </Link>
                <Link
                  to="/create"
                  className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition"
                  title="Write Poem"
                >
                  <PlusCircle size={20} />
                  <span className="hidden sm:inline">Write</span>
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition"
                  title="My Profile"
                >
                  <User size={20} />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-600 transition"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              // GUEST MENU
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-bold"
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
