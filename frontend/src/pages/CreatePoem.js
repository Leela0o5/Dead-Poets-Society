import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { PenTool, X, Lock, Globe } from "lucide-react";
import toast from "react-hot-toast";

const CreatePoem = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState(true); // true = Public

  // Tag State
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  // Preset Tags
  const PRESET_TAGS = [
    "Love",
    "Nature",
    "Sadness",
    "Haiku",
    "Life",
    "Abstract",
    "Tech",
  ];

  // Handle adding a tag (Enter key or Button)
  const handleAddTag = (e) => {
    e.preventDefault();
    const cleanTag = tagInput.trim().toLowerCase();
    if (cleanTag && !tags.includes(cleanTag) && tags.length < 5) {
      setTags([...tags, cleanTag]);
      setTagInput("");
    }
  };

  // Toggle Preset Tag
  const togglePresetTag = (tag) => {
    const lowerTag = tag.toLowerCase();
    if (tags.includes(lowerTag)) {
      setTags(tags.filter((t) => t !== lowerTag));
    } else if (tags.length < 5) {
      setTags([...tags, lowerTag]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!title.trim() || !content.trim()) {
      toast.error("Title and Content cannot be empty!");
      return;
    }
    const toastId = toast.loading("Publishing your masterpiece...");
    try {
      await api.post("/poems", {
        title,
        content,
        tags,
        visibility,
      });
      toast.success("Poem published successfully!", { id: toastId });
      // Redirect to Feed on success
      navigate("/");
    } catch (err) {
      toast.error("Failed to publish poem.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
        <PenTool className="text-blue-600" />
        Write a New Poem
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8"
      >
        {/* Title */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Title</label>
          <input
            type="text"
            required
            placeholder="Give your poem a name..."
            className="w-full text-lg px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Content */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Content
          </label>
          <textarea
            required
            rows="10"
            placeholder="Let your thoughts flow..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-serif text-lg leading-relaxed transition"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>

        {/* Tags Section */}
        <div className="mb-8">
          <label className="block text-gray-700 font-medium mb-3">
            Tags (Max 5)
          </label>

          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            {PRESET_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => togglePresetTag(tag)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                  tags.includes(tag.toLowerCase())
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Custom Input */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add custom tag..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTag(e)}
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-black transition"
            >
              Add
            </button>
          </div>

          {/* Selected Tags Display */}
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => togglePresetTag(tag)}
                  className="hover:text-red-500"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Visibility Toggle */}
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg mb-8">
          <div className="flex items-center gap-3">
            {visibility ? (
              <Globe className="text-green-600" />
            ) : (
              <Lock className="text-gray-500" />
            )}
            <div>
              <p className="font-medium text-gray-800">
                {visibility ? "Public" : "Private"}
              </p>
              <p className="text-xs text-gray-500">
                {visibility
                  ? "Anyone can read this poem."
                  : "Only you can see this."}
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={visibility}
              onChange={() => setVisibility(!visibility)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-bold text-lg py-3 rounded-xl hover:bg-blue-700 transition shadow-md disabled:opacity-50"
        >
          {loading ? "Publishing..." : "Publish Poem"}
        </button>
      </form>
    </div>
  );
};

export default CreatePoem;
