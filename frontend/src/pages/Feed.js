import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import PoemCard from "../components/poemCard";
import SearchBar from "../components/SearchBar";
import { PenTool, Loader2, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";

const Feed = () => {
  const [poems, setPoems] = useState([]);
  const [filteredPoems, setFilteredPoems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(5);

  // Track if a search is active to show the button
  const [isSearching, setIsSearching] = useState(false);
  // Key to force SearchBar to reset
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
        toast.error("Failed to load poems. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchPoems();
  }, []);
  if (loading) return <LoadingSpinner />;

  //  SERVER-SIDE SEARCH
  const handleFilter = async (query, activeTags) => {
    setLoading(true);

    // Check if we need to reset to "All Poems"
    const isSearchEmpty =
      (!query || query.trim() === "") &&
      (!activeTags || activeTags.length === 0);

    try {
      if (isSearchEmpty) {
        // Load default feed
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
      toast.error("Search failed. Try Again");
    } finally {
      setLoading(false);
      setDisplayCount(5); // Reset pagination
    }
  };
  // Clear Filter Logic
  const handleClear = () => {
    setFilteredPoems(poems); // Restore all poems
    setIsSearching(false); // Hide button
    setResetKey((prev) => prev + 1); // (clearing its inputs)
    setDisplayCount(5);
  };

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 5);
  };

  if (loading)
    return (
      <div className="flex justify-center mt-20">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 font-serif">
          Discover Poems
        </h1>

        <SearchBar key={resetKey} onSearch={handleFilter} />

        {isSearching && (
          <div className="flex items-center justify-between bg-blue-50 text-blue-800 px-4 py-3 rounded-lg mb-6 animate-fadeIn">
            <span className="font-medium">
              Showing filtered results ({filteredPoems.length})
            </span>
            <button
              onClick={handleClear}
              className="flex items-center gap-1 text-sm font-bold hover:text-blue-600 transition"
            >
              <XCircle size={18} /> Clear Filters
            </button>
          </div>
        )}
      </div>

      {user && (
        <button
          onClick={() => navigate("/create")}
          className="fixed bottom-8 right-8 md:hidden bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition z-50"
        >
          <PenTool size={24} />
        </button>
      )}

      {/* Results List */}
      <div className="space-y-6">
        {filteredPoems.length > 0 ? (
          filteredPoems
            .slice(0, displayCount)
            .map((poem) => (
              <PoemCard key={poem._id} className="animate-fadeIn" poem={poem} />
            ))
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <EmptyState
              message="No poems found"
              subMessage="Try adjusting your search terms or tags."
            />
            <button
              onClick={handleClear}
              className="text-blue-600 hover:underline mt-2 text-sm font-bold"
            >
              Clear Search & Show All
            </button>
          </div>
        )}
      </div>

      {displayCount < filteredPoems.length && (
        <button
          onClick={handleLoadMore}
          className="w-full mt-8 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default Feed;
