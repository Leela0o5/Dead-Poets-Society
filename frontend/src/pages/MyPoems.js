import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import PoemCard from "../components/poemCard";
import { Link } from "react-router-dom";
import { PenTool } from "lucide-react";

const MyPoems = () => {
  const [poems, setPoems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMyPoems = async () => {
      try {
        const { data } = await api.get(`/poems/user/${user._id}`); // Pass ID from context
        setPoems(data);
      } catch (err) {
        console.error("Failed to load your poems");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchMyPoems();
  }, [user]);

  if (loading)
    return <div className="text-center mt-20">Loading your library...</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 font-serif">
            My Collection
          </h1>
          <p className="text-gray-500 mt-1">
            You have written {poems.length} poem{poems.length !== 1 && "s"}.
          </p>
        </div>

        <Link
          to="/create"
          className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition flex items-center gap-2"
        >
          <PenTool size={18} /> Write New
        </Link>
      </div>

      {poems.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {poems.map((poem) => (
            <PoemCard key={poem._id} poem={poem} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <h3 className="text-xl font-medium text-gray-600 mb-2">
            You haven't written any poems yet.
          </h3>
          <p className="text-gray-500 mb-6">
            The world is waiting for your words.
          </p>
          <Link
            to="/create"
            className="text-blue-600 font-semibold hover:underline"
          >
            Start Writing Now &rarr;
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyPoems;
