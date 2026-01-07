import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import PoemCard from "../components/poemCard";
import EditProfileModal from "../components/EditProfileModal";
import { User, Heart, BookOpen, Calendar, Edit3 } from "lucide-react";

const Profile = () => {
  const { user } = useAuth(); // Logged in user context

  // Data State
  const [profileData, setProfileData] = useState(null);
  const [myPoems, setMyPoems] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // UI State
  const [activeTab, setActiveTab] = useState("poems");
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);

  // 1. Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) return;
        const userRes = await api.get("/auth/me");
        setProfileData(userRes.data);

        //  Get My Poems
        const poemsRes = await api.get(`/poems/user/${user._id}`);
        setMyPoems(poemsRes.data);

        const favRes = await api.get("/favorites");
        setFavorites(favRes.data);
      } catch (err) {
        console.error("Failed to load profile data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading)
    return <div className="text-center mt-20">Loading Profile...</div>;
  if (!profileData)
    return <div className="text-center mt-20 text-red-500">User not found</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* --- Header Section --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar / Icon */}
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0">
            <User size={48} />
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-4 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                @{profileData.username}
              </h1>
              <button
                onClick={() => setShowEdit(true)}
                className="flex items-center gap-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition"
              >
                <Edit3 size={14} /> Edit Profile
              </button>
            </div>

            <p className="text-gray-600 mb-4 max-w-lg">
              {profileData.bio || "No bio yet. Click edit to tell your story!"}
            </p>

            <div className="flex items-center justify-center md:justify-start gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar size={16} /> Joined{" "}
                {new Date(
                  profileData.joinedDate || profileData.createdAt
                ).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 w-full md:w-auto mt-6 md:mt-0">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-xl font-bold text-blue-700">
                {myPoems.length}
              </div>
              <div className="text-xs text-blue-600 font-medium">Poems</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-xl font-bold text-red-700">
                {profileData.totalLikes || 0}
              </div>
              <div className="text-xs text-red-600 font-medium">Likes</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-xl font-bold text-yellow-700">
                {favorites.length}
              </div>
              <div className="text-xs text-yellow-600 font-medium">Favs</div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Tabs Navigation --- */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          onClick={() => setActiveTab("poems")}
          className={`flex items-center gap-2 px-6 py-3 font-medium transition ${
            activeTab === "poems"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <BookOpen size={18} /> My Poems
        </button>
        <button
          onClick={() => setActiveTab("favorites")}
          className={`flex items-center gap-2 px-6 py-3 font-medium transition ${
            activeTab === "favorites"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Heart size={18} /> Favorites
        </button>
      </div>

      {/* --- Content Area --- */}
      <div className="grid gap-6 md:grid-cols-2">
        {activeTab === "poems" ? (
          myPoems.length > 0 ? (
            myPoems.map((poem) => <PoemCard key={poem._id} poem={poem} />)
          ) : (
            <div className="col-span-full text-center py-10 text-gray-500">
              You haven't written any poems yet.
            </div>
          )
        ) : favorites.length > 0 ? (
          favorites.map((poem) => <PoemCard key={poem._id} poem={poem} />)
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            No favorites yet. Go explore the feed!
          </div>
        )}
      </div>

      {/* --- Modal --- */}
      {showEdit && (
        <EditProfileModal
          user={profileData}
          onClose={() => setShowEdit(false)}
          onUpdate={setProfileData} // Update local state instantly
        />
      )}
    </div>
  );
};

export default Profile;
