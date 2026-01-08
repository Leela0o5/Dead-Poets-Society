import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { PenTool, X, Lock, Globe, Feather, Hash, Loader2 } from "lucide-react";
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

  const PRESET_TAGS = [
    "Love",
    "Nature",
    "Sadness",
    "Haiku",
    "Life",
    "Abstract",
    "Tech",
  ];

  const handleAddTag = (e) => {
    e.preventDefault();
    const cleanTag = tagInput.trim().toLowerCase();
    if (cleanTag && !tags.includes(cleanTag) && tags.length < 5) {
      setTags([...tags, cleanTag]);
      setTagInput("");
    }
  };

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
      toast.error("A poem needs both a title and a soul (content).");
      setLoading(false);
      return;
    }

    toast.dismiss();

    try {
      await api.post("/poems", {
        title,
        content,
        tags,
        visibility,
      });
      toast.success("Your verse has been published.");
      navigate("/feed");
    } catch (err) {
      toast.error("Failed to publish poem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 flex justify-center">
      <div className="w-full max-w-4xl">
        {/* Header Title */}
        <div className="text-center mb-8 animate-fadeIn">
          <h1 className="text-4xl font-bold font-serif text-gray-900 flex items-center justify-center gap-3">
            <Feather className="text-gray-700" size={32} />
            Compose a Verse
          </h1>
          <p className="text-gray-500 italic font-serif mt-2">
            "No matter what anybody tells you, words and ideas can change the
            world."
          </p>
        </div>

        {/* The Writing Sheet  */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden animate-fadeIn relative"
        >
          {/* Decorative Ink Strip */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-900"></div>

          <div className="p-8 md:p-12">
            {/*  TITLE INPUT */}
            <div className="mb-8">
              <input
                type="text"
                required
                placeholder="Untitled Masterpiece"
                className="w-full text-4xl md:text-5xl font-serif font-bold text-gray-900 caret-gray-900 placeholder-gray-300 border-b-2 border-transparent focus:border-gray-900 focus:outline-none transition-colors py-2 bg-transparent"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/*  CONTENT TEXTAREA */}
            <div className="mb-8">
              <textarea
                required
                placeholder="Let your thoughts flow onto the page..."
                className="w-full min-h-[300px] text-xl font-serif leading-normal text-gray-900 caret-gray-900 placeholder-gray-300 border-none focus:ring-0 resize-none bg-transparent p-1 whitespace-pre-wrap"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></textarea>
            </div>

            {/* Separator Line */}
            <hr className="border-gray-100 my-8" />

            {/* METADATA SECTION */}
            <div className="grid md:grid-cols-2 gap-10">
              {/* Left Column: Tags */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
                  <Hash size={16} /> Tags (Max 5)
                </label>

                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Add a custom tag..."
                    className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddTag(e)}
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition font-medium"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {PRESET_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => togglePresetTag(tag)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition border ${
                        tags.includes(tag.toLowerCase())
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-dashed border-gray-200">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => togglePresetTag(tag)}
                          className="hover:text-red-500 transition ml-1"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Visibility & Publish */}
              <div className="flex flex-col justify-between">
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-900 flex items-center gap-2">
                      {visibility ? (
                        <Globe size={18} className="text-blue-600" />
                      ) : (
                        <Lock size={18} className="text-gray-500" />
                      )}
                      {visibility ? "Public Poem" : "Private Journal"}
                    </span>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={visibility}
                        onChange={() => setVisibility(!visibility)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                    </label>
                  </div>
                  <p className="text-sm text-gray-500">
                    {visibility
                      ? "Visible to the entire Dead Poets Society."
                      : "Only you can view and edit this poem."}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-900 text-white font-bold text-lg py-4 rounded-xl hover:bg-black hover:shadow-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 size={24} className="animate-spin" />{" "}
                      Publishing...
                    </>
                  ) : (
                    <>
                      <PenTool size={20} /> Publish to Society
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePoem;
