import { useState } from "react";
import { Search, Filter, X } from "lucide-react";

const SearchBar = ({ onSearch }) => {
  // Local state for the input
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState([]);

  // Common tags for quick filtering
  const PRESET_TAGS = [
    "Love",
    "Nature",
    "Sadness",
    "Haiku",
    "Life",
    "Abstract",
    "Joy",
    "Tech",
  ];

  // 1. Toggle Tag Selection
  const toggleTag = (tag) => {
    const newTags = activeTags.includes(tag)
      ? activeTags.filter((t) => t !== tag) // Remove
      : [...activeTags, tag]; // Add

    setActiveTags(newTags);
  };

  // Trigger Search (Pass data up to parent)
  const handleSearch = () => {
    onSearch(query, activeTags);
  };

  // Handle Enter Key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
      {/* Search Input Row */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by title, content, or author..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
        >
          Search
        </button>
      </div>

      {/* Multi-Tag Selector */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1 text-gray-500 text-sm font-medium mr-2">
          <Filter size={16} /> Filter by:
        </div>

        {PRESET_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            onKeyDown={handleKeyDown}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition border ${
              activeTags.includes(tag)
                ? "bg-blue-100 text-blue-700 border-blue-200"
                : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
            }`}
          >
            {tag}
          </button>
        ))}

        {activeTags.length > 0 && (
          <button
            onClick={() => setActiveTags([])}
            className="text-xs text-red-500 hover:underline ml-auto"
          >
            Clear Tags
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
