import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Feather, BookOpen, Users } from "lucide-react";

const LandingPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#f8f5f2] text-gray-800 font-serif">
      {/* HERO SECTION  */}
      <div className="container mx-auto px-6 py-24 text-center">
        <div className="mb-6 flex justify-center">
          <Feather size={64} className="text-gray-800" />
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          Dead Poets Society
        </h1>

        <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto italic leading-relaxed">
          "Medicine, law, business, engineering, these are noble pursuits... But
          poetry, beauty, romance, love, these are what we stay alive for!"
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {user ? (
            // LOGGED IN VIEW
            <>
              <Link
                to="/feed"
                className="px-8 py-4 bg-gray-900 text-white rounded-lg text-lg font-semibold hover:bg-gray-800 transition flex items-center gap-2"
              >
                <BookOpen size={20} /> Enter the Society
              </Link>
              <Link
                to="/create"
                className="px-8 py-4 bg-transparent border-2 border-gray-900 text-gray-900 rounded-lg text-lg font-semibold hover:bg-gray-100 transition"
              >
                Write a Poem
              </Link>
            </>
          ) : (
            // GUEST VIEW
            <>
              <Link
                to="/register"
                className="px-8 py-4 bg-blue-700 text-white rounded-lg text-lg font-semibold hover:bg-blue-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Join the Society
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 bg-white border border-gray-300 text-gray-700 rounded-lg text-lg font-semibold hover:bg-gray-50 transition"
              >
                Log In
              </Link>
            </>
          )}
        </div>
      </div>

      {/* FEATURES SECTION  */}
      <div className="bg-white py-20 border-t border-gray-200">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="p-6">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Read & Discover</h3>
              <p className="text-gray-600">
                Explore a curated feed of poems from modern voices and hidden
                gems.
              </p>
            </div>

            <div className="p-6">
              <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Feather size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Express Yourself</h3>
              <p className="text-gray-600">
                Share your verses with the world, or keep them private in your
                digital journal.
              </p>
            </div>

            <div className="p-6">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Connect</h3>
              <p className="text-gray-600">
                Follow your favorite poets, discuss interpretations, and build
                your circle.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER  */}
      <footer className="bg-gray-900 text-gray-400 py-10 text-center">
        <p>&copy; {new Date().getFullYear()} Dead Poets Society. Carpe Diem.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
