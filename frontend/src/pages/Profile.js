import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import PoemCard from "../components/poemCard";
import EditProfileModal from "../components/EditProfileModal";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import toast from "react-hot-toast";
import { Calendar, Edit3, Feather, Star } from "lucide-react";
import Avatar from "../components/Avatar";

const Profile = () => {
  const { user } = useAuth();

  // Data State
  const [profileData, setProfileData] = useState(null);
  const [myPoems, setMyPoems] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // UI State
  const [activeTab, setActiveTab] = useState("poems");
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);

  //  Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) return;

        // Parallel fetching for speed
        const [userRes, poemsRes, favRes] = await Promise.all([
          api.get("/auth/me"),
          api.get(`/poems/user/${user._id}`),
          api.get("/favorites"),
        ]);

        setProfileData(userRes.data);
        setMyPoems(poemsRes.data);
        setFavorites(favRes.data);
      } catch (err) {
        toast.error("Could not retrieve your archives.");
        console.error("Profile load error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) return <LoadingSpinner />;

  if (!profileData)
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-serif text-gray-800">Poet not found.</h2>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      {/* Header Section   */}
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-8 mb-10 relative overflow-hidden animate-fadeIn">
        {/* Decorative Ink Strip */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-900"></div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Avatar Area */}
          <div className="relative group">
            <div className="w-28 h-28 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 shrink-0 border-4 border-white shadow-sm">
              <Avatar user={profileData.username} size="l" />
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-4 mb-3">
              <h1 className="text-4xl font-bold text-gray-900 font-serif tracking-tight">
                @{profileData.username}
              </h1>
              <button
                onClick={() => setShowEdit(true)}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest border border-gray-300 px-4 py-1.5 rounded-full hover:bg-gray-900 hover:text-white hover:border-gray-900 transition"
              >
                <Edit3 size={12} /> Edit Profile
              </button>
            </div>

            {/* Bio */}
            <div className="mb-6 relative">
              <p className="text-gray-600 text-lg font-serif italic leading-relaxed max-w-2xl">
                {profileData.bio ? (
                  `"${profileData.bio}"`
                ) : (
                  <span className="text-gray-400">
                    "This poet has not yet written a bio..."
                  </span>
                )}
              </p>
            </div>

            {/* Meta Info */}
            <div className="flex items-center justify-center md:justify-start gap-6 text-sm text-gray-500 font-medium">
              <span className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400" />
                Member since{" "}
                {new Date(
                  profileData.joinedDate || profileData.createdAt
                ).toLocaleDateString(undefined, {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-8 md:gap-12 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-2 md:pl-8 mt-6 md:mt-0">
            <div className="text-center">
              <div className="text-3xl font-bold font-serif text-gray-900">
                {myPoems.length}
              </div>
              <div className="text-xs uppercase tracking-widest text-gray-500 mt-1">
                Poems
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold font-serif text-gray-900">
                {favorites.length}
              </div>
              <div className="text-xs uppercase tracking-widest text-gray-500 mt-1">
                Favorites
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*  Tabs Navigation  */}
      <div className="flex items-center justify-center border-b border-gray-200 mb-10">
        <button
          onClick={() => setActiveTab("poems")}
          className={`flex items-center gap-2 px-8 py-4 font-serif text-lg transition relative ${
            activeTab === "poems"
              ? "text-gray-900 font-bold"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <Feather size={20} /> My Anthology
          {activeTab === "poems" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("favorites")}
          className={`flex items-center gap-2 px-8 py-4 font-serif text-lg transition relative ${
            activeTab === "favorites"
              ? "text-gray-900 font-bold"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <Star size={20} /> Favorites Collection
          {activeTab === "favorites" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900"></span>
          )}
        </button>
      </div>

      {/*  Content Grid  */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {activeTab === "poems" ? (
          myPoems.length > 0 ? (
            myPoems.map((poem) => (
              <div key={poem._id} className="animate-fadeIn">
                <PoemCard poem={poem} />
              </div>
            ))
          ) : (
            <div className="col-span-full py-10">
              <EmptyState
                message="Your pages are blank."
                subMessage="Pick up your pen and write your first masterpiece."
              />
            </div>
          )
        ) : favorites.length > 0 ? (
          favorites.map((poem) => (
            <div key={poem._id} className="animate-fadeIn">
              <PoemCard poem={poem} />
            </div>
          ))
        ) : (
          <div className="col-span-full py-10">
            <EmptyState
              message="No favorites yet."
              subMessage="Explore the feed and find verses that speak to you."
            />
          </div>
        )}
      </div>

      {/*Modal */}
      {showEdit && (
        <EditProfileModal
          user={profileData}
          onClose={() => setShowEdit(false)}
          onUpdate={setProfileData}
        />
      )}
    </div>
  );
};

export default Profile;
