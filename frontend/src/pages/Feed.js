import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import PoemCard from "../components/poemCard";
import SearchBar from "../components/SearchBar";
import { PenTool, XCircle, Feather } from "lucide-react";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";

const Feed = () => {
  const [poems, setPoems] = useState([]);
  const [filteredPoems, setFilteredPoems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(9);

  const [isSearching, setIsSearching] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch Poems
  useEffect(() => {
    const fetchPoems = async () => {
      try {
        const { data } = await api.get("/poems");
        const poemsArray = Array.isArray(data) ? data : data.poems || [];
        setPoems(poemsArray);
        setFilteredPoems(poemsArray);
      } catch (err) {
        toast.error("Failed to load poems.");
      } finally {
        setLoading(false);
      }
    };
    fetchPoems();
  }, []);

  // SERVER-SIDE SEARCH
  const handleFilter = async (query, activeTags) => {
    setLoading(true);
    const isSearchEmpty =
      (!query || query.trim() === "") &&
      (!activeTags || activeTags.length === 0);

    try {
      if (isSearchEmpty) {
        const { data } = await api.get("/poems");
        const poemsArray = Array.isArray(data) ? data : data.poems || [];
        setFilteredPoems(poemsArray);
        setIsSearching(false);
      } else {
        const params = new URLSearchParams();
        if (query) params.append("query", query);
        if (activeTags.length > 0) params.append("tags", activeTags.join(","));

        const { data } = await api.get(`/poems/search?${params.toString()}`);
        setFilteredPoems(data);
        setIsSearching(true);
      }
    } catch (err) {
      toast.error("Search failed.");
    } finally {
      setLoading(false);
      setDisplayCount(9);
    }
  };

  const handleClear = () => {
    setFilteredPoems(poems);
    setIsSearching(false);
    setResetKey((prev) => prev + 1);
    setDisplayCount(9);
  };

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 6);
  };

  if (loading) return <LoadingSpinner />;

  return (
    // THEME: Uses the global paper background from Layout
    <div className="min-h-screen">
      {/*  SEARCH SECTION */}
      {/* THEME: Removed bg-white, added padding and font-serif */}
      <div className="pt-12 pb-10 px-4 mb-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-4 text-gray-800 animate-fadeIn">
            <Feather size={48} strokeWidth={1} />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 font-serif tracking-tight animate-fadeIn">
            The Anthology
          </h1>

          <p className="text-xl text-gray-600 italic font-serif mb-10 max-w-2xl mx-auto leading-relaxed animate-fadeIn delay-100">
            "Poetry is truth in its Sunday clothes."
          </p>

          {/* Search Bar Container */}
          <div className="animate-fadeIn delay-200">
            <SearchBar key={resetKey} onSearch={handleFilter} />
          </div>

          {/* Search Results Indicator */}
          {isSearching && (
            <div className="flex items-center justify-center gap-4 mt-6 animate-fadeIn">
              <span className="font-serif text-gray-900 bg-white px-4 py-1.5 rounded-full border border-gray-200 text-sm shadow-sm">
                Found {filteredPoems.length} result
                {filteredPoems.length !== 1 && "s"}
              </span>
              <button
                onClick={handleClear}
                className="flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-red-600 transition"
              >
                <XCircle size={16} /> Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {/*  CONTENT GRID  */}
      <div className="max-w-7xl mx-auto px-4 pb-24">
        {/* Floating Action Button (Mobile) */}
        {user && (
          <button
            onClick={() => navigate("/create")}
            className="fixed bottom-8 right-8 md:hidden bg-gray-900 text-white p-4 rounded-full shadow-2xl hover:bg-black transition z-50 hover:scale-105 active:scale-95"
          >
            <PenTool size={24} />
          </button>
        )}

        {/* MASONRY LAYOUT */}
        {filteredPoems.length > 0 ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredPoems.slice(0, displayCount).map((poem) => (
              <div key={poem._id} className="break-inside-avoid animate-fadeIn">
                <PoemCard poem={poem} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
            <EmptyState
              message="No poems found"
              subMessage="Try adjusting your search terms or tags."
            />
            <button
              onClick={handleClear}
              className="text-gray-900 border-b-2 border-gray-900 pb-0.5 hover:text-blue-700 hover:border-blue-700 mt-6 text-sm font-bold transition font-serif"
            >
              Show All Poems
            </button>
          </div>
        )}

        {/* Load More Button */}
        {displayCount < filteredPoems.length && (
          <div className="flex justify-center mt-16 pb-10">
            <button
              onClick={handleLoadMore}
              className="bg-transparent border-2 border-gray-900 text-gray-900 px-10 py-3 rounded-full hover:bg-gray-900 hover:text-white transition font-serif font-bold text-lg tracking-wide shadow-sm hover:shadow-lg"
            >
              Load More Verses
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
