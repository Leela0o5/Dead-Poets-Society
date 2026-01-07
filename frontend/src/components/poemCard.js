import { useState, useEffect } from 'react';
import { Heart, MessageSquare, Star, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const PoemCard = ({ poem }) => {
  const { user } = useAuth();
  
  // State for interactions
  const [likes, setLikes] = useState(poem.likes || []);
  const [isFavorite, setIsFavorite] = useState(false);

  // Determine Author and Ownership
  const author = poem.author || poem.user; 
  const isOwner = user && author && user._id === author._id;
  
  const profileLink = isOwner ? '/profile' : `/profile/${author?._id}`;

  // Check if User Liked/Favorited
  const isLiked = user && likes.includes(user._id);

  useEffect(() => {
    if (user && user.favorites) {
      setIsFavorite(user.favorites.includes(poem._id));
    }
  }, [user, poem._id]);

  // Handlers
  const handleLike = async (e) => {
    e.preventDefault();
    if (!user) return;

    if (isLiked) {
      setLikes(likes.filter(id => id !== user._id));
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
    if (!user) return;
    
    const previousState = isFavorite;
    setIsFavorite(!isFavorite);

    try {
      const { data } = await api.post(`/favorites/${poem._id}`);
      if (data.isFavorited !== undefined) setIsFavorite(data.isFavorited);
    } catch (err) {
      setIsFavorite(previousState);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
      
      {/* Header: Title & Author */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-xl font-bold text-gray-800 font-serif mb-1">
            <Link to={`/poem/${poem._id}`} className="hover:text-blue-600 transition">
              {poem.title}
            </Link>
          </h3>
          <p className="text-sm text-gray-500">
            by{' '}
            {/* UPDATED LINK */}
            <Link to={profileLink} className="font-semibold text-blue-500 hover:underline">
              @{author?.username || 'Unknown'}
            </Link>
          </p>
        </div>

        {/* Visibility Toggle (Owner Only) */}
        {isOwner && (
          <div className="bg-gray-50 p-2 rounded-full" title={poem.visibility ? "Public" : "Private"}>
            {poem.visibility ? <Eye size={18} className="text-green-500" /> : <EyeOff size={18} className="text-gray-400" />}
          </div>
        )}
      </div>

      {/* Content Preview */}
      <div className="mb-4 text-gray-700 leading-relaxed font-serif italic bg-gray-50 p-4 rounded-lg border-l-4 border-blue-200">
        {poem.content.length > 150 
          ? `${poem.content.substring(0, 150)}...` 
          : poem.content}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {poem.tags && poem.tags.map((tag, index) => (
          <span key={index} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-md font-medium">
            #{tag}
          </span>
        ))}
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between border-t pt-4 text-sm text-gray-500">
        <div className="flex gap-6">
          <button 
            onClick={handleLike}
            className={`flex items-center gap-1.5 transition group ${isLiked ? "text-red-500" : "hover:text-red-500"}`}
          >
            <Heart size={18} className={`transition-all ${isLiked ? "fill-current scale-110" : "group-hover:scale-110"}`} />
            <span className="font-medium">{likes.length}</span>
          </button>

          <Link to={`/poem/${poem._id}`} className="flex items-center gap-1.5 hover:text-blue-600 transition">
            <MessageSquare size={18} />
            <span>Discuss</span>
          </Link>
        </div>

        <button 
          onClick={handleFavorite}
          className={`transition transform active:scale-95 ${isFavorite ? "text-yellow-500 scale-110" : "text-gray-400 hover:text-yellow-500"}`}
        >
          <Star size={20} className={isFavorite ? "fill-current" : ""} />
        </button>
      </div>
    </div>
  );
};

export default PoemCard;