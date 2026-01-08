import { useState, useEffect } from "react";
import { Heart, MessageSquare, Star, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

const PoemCard = ({ poem }) => {
  const { user } = useAuth();

  // State for interactions
  const [likes, setLikes] = useState(poem.likes || []);
  const [isFavorite, setIsFavorite] = useState(false);

  // Determine Author and Ownership
  const author = poem.author || poem.user;
  const isOwner = user && author && user._id === author._id;
  const profileLink = isOwner ? "/profile" : `/profile/${author?._id}`;
  const isLiked = user && likes.includes(user._id);

  // Cut text at 150 characters to keep cards uniform
  const maxLength = 150;
  const previewText =
    poem.content.length > maxLength
      ? poem.content.substring(0, maxLength) + "..."
      : poem.content;

  useEffect(() => {
    if (user && user.favorites) {
      setIsFavorite(user.favorites.includes(poem._id));
    }
  }, [user, poem._id]);

  // Handlers
  const handleLike = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to like poems.");

    if (isLiked) {
      setLikes(likes.filter((id) => id !== user._id));
    } else {
      setLikes([...likes, user._id]);
    }

    try {
      const { data } = await api.put(`/poems/${poem._id}/like`);
      setLikes(data);
    } catch (err) {
      setLikes(poem.likes);
    }
  };

  const handleFavorite = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to save poems.");

    const previousState = isFavorite;
    setIsFavorite(!isFavorite);

    try {
      const { data } = await api.post(`/favorites/${poem._id}`);
      if (data.isFavorited !== undefined) {
        setIsFavorite(data.isFavorited);
        toast.success(
          data.isFavorited ? "Saved to collection." : "Removed from collection."
        );
      }
    } catch (err) {
      setIsFavorite(previousState);
    }
  };

  return (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
      {/* Decorative Ink Strip */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-900 opacity-0 group-hover:opacity-100 transition-opacity"></div>

      {/* Header: Title & Author */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 font-serif mb-1 tracking-tight">
            {/* CLICKING TITLE OPENS POEM */}
            <Link
              to={`/poem/${poem._id}`}
              className="hover:text-blue-700 transition"
            >
              {poem.title}
            </Link>
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              by
              <Link
                to={profileLink}
                className="font-semibold text-gray-700 hover:text-blue-600 hover:underline flex items-center gap-1"
              >
                @{author?.username || "Unknown"}
              </Link>
            </span>
            <span>•</span>
            <span>{new Date(poem.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Visibility Icon */}
        {isOwner && (
          <div className="bg-gray-50 p-2 rounded-full border border-gray-100">
            {poem.visibility ? (
              <Eye size={16} className="text-gray-400" />
            ) : (
              <EyeOff size={16} className="text-gray-400" />
            )}
          </div>
        )}
      </div>

      {/* Content Preview (Truncated) */}
      <div className="mb-6">
        <Link to={`/poem/${poem._id}`} className="block group/text">
          <p className="text-lg text-gray-600 leading-relaxed font-serif whitespace-pre-wrap pl-4 border-l-2 border-gray-200 group-hover/text:border-gray-900 transition-colors">
            {previewText}
          </p>

          {poem.content.length > maxLength && (
            <span className="text-sm font-bold text-blue-600 mt-2 inline-block hover:underline">
              Read full poem →
            </span>
          )}
        </Link>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {poem.tags &&
          poem.tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-gray-50 text-gray-600 border border-gray-200 px-2 py-1 rounded-md font-medium uppercase tracking-wider"
            >
              #{tag}
            </span>
          ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-sm text-gray-500">
        <div className="flex gap-6">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 transition group ${
              isLiked ? "text-red-600" : "hover:text-red-600"
            }`}
          >
            <Heart
              size={18}
              className={`transition-all ${
                isLiked ? "fill-current scale-110" : "group-hover:scale-110"
              }`}
            />
            <span className="font-medium">{likes.length}</span>
          </button>

          <Link
            to={`/poem/${poem._id}`}
            className="flex items-center gap-1.5 hover:text-blue-600 transition"
          >
            <MessageSquare size={18} />
            <span>Discuss</span>
          </Link>
        </div>

        <button
          onClick={handleFavorite}
          className={`transition transform active:scale-95 ${
            isFavorite
              ? "text-yellow-500 scale-110"
              : "text-gray-300 hover:text-yellow-500"
          }`}
        >
          <Star size={20} className={isFavorite ? "fill-current" : ""} />
        </button>
      </div>
    </div>
  );
};

export default PoemCard;
