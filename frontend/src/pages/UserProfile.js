import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import PoemCard from "../components/poemCard";
import Avatar from "../components/Avatar";

const UserProfile = () => {
  const { userId } = useParams();
  const [userPoems, setUserPoems] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Fetch the User's Public Poems
        const { data } = await api.get(`/poems/user/${userId}`);
        setUserPoems(data);

        if (data.length > 0) {
          setUserInfo(data[0].author || data[0].user);
        }
      } catch (err) {
        console.error("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [userId]);

  if (loading) return <div className="text-center mt-20">Loading Poet...</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
          <Avatar user={userInfo.username} size="l"></Avatar>
        </div>
        <h1 className="text-3xl font-bold text-gray-800">
          {userInfo ? `@${userInfo.username}` : "Poet Profile"}
        </h1>
        <p className="text-gray-500 mt-2">
          Author of {userPoems.length} public poems
        </p>
        <p className="text-gray-500 mt-2"> {userInfo.bio}</p>
      </div>

      {/* Poems Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {userPoems.length > 0 ? (
          userPoems.map((poem) => <PoemCard key={poem._id} poem={poem} />)
        ) : (
          <div className="col-span-full text-center text-gray-500">
            This user hasn't published any public poems yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
