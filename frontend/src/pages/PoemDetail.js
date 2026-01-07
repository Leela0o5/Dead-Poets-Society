import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import {
  Heart,
  Sparkles,
  Trash2,
  User,
  MessageCircle,
  Send,
} from "lucide-react";

const PoemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [poem, setPoem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // AI State
  const [insight, setInsight] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Review State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  //  Fetch Poem Data
  useEffect(() => {
    const fetchPoem = async () => {
      try {
        const { data } = await api.get(`/poems/${id}`);
        setPoem(data);
      } catch (err) {
        setError("Poem not found or private.");
      } finally {
        setLoading(false);
      }
    };
    fetchPoem();
  }, [id]);

  //  Handle Like
  const handleLike = async () => {
    try {
      const { data } = await api.put(`/poems/${id}/like`);
      // Update local state immediately
      setPoem((prev) => ({ ...prev, likes: data }));
    } catch (err) {
      console.error("Failed to like poem");
    }
  };

  //  Handle AI Insight
  const handleGenerateInsight = async () => {
    setAiLoading(true);
    try {
      const { data } = await api.post(`/ai/insight/${id}`);
      setInsight(data.insight);
    } catch (err) {
      alert("AI is tired right now. Try again later!");
    } finally {
      setAiLoading(false);
    }
  };

  //  Handle Delete (Owner Only)
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this poem?")) {
      try {
        await api.delete(`/poems/${id}`);
        navigate("/");
      } catch (err) {
        alert("Failed to delete poem");
      }
    }
  };

  //  Handle Submit Review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(`/reviews/${id}`, {
        rating: reviewRating,
        comment: reviewComment,
      });

      // Add new review to the list dynamically
      const newReview = {
        ...data,
        user: { _id: user._id, username: user.username }, // Mock user for instant display
      };

      setPoem((prev) => ({
        ...prev,
        reviews: [newReview, ...(prev.reviews || [])],
      }));
      setReviewComment("");
    } catch (err) {
      alert("Failed to post review");
    }
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (error)
    return <div className="text-center mt-20 text-red-500">{error}</div>;

  const isOwner = user && poem.author._id === user._id;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* --- Main Poem Section --- */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 mb-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">
              {poem.title}
            </h1>
            <div className="flex items-center gap-2 text-gray-600">
              <User size={18} />
              <span>
                By{" "}
                <span className="font-semibold text-blue-600">
                  @{poem.author.username}
                </span>
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-sm">
                {new Date(poem.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {isOwner && (
            <button
              onClick={handleDelete}
              className="text-gray-400 hover:text-red-600 transition"
              title="Delete Poem"
            >
              <Trash2 size={20} />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="whitespace-pre-line text-lg leading-loose font-serif text-gray-800 mb-8 pl-4 border-l-4 border-blue-200">
          {poem.content}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {poem.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Actions Bar */}
        <div className="flex items-center gap-4 border-t pt-6">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
              poem.likes.includes(user?._id)
                ? "bg-red-50 text-red-600"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Heart
              size={20}
              className={poem.likes.includes(user?._id) ? "fill-current" : ""}
            />
            <span className="font-semibold">{poem.likes.length}</span>
          </button>

          <button
            onClick={handleGenerateInsight}
            disabled={aiLoading}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100 transition"
          >
            <Sparkles size={20} />
            {aiLoading ? "Asking AI..." : "AI Insight"}
          </button>
        </div>

        {/* AI Insight Result Box */}
        {insight && (
          <div className="mt-6 bg-indigo-50 p-6 rounded-lg border border-indigo-100 animate-fadeIn">
            <h3 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
              <Sparkles size={16} /> AI Analysis
            </h3>
            <p className="text-indigo-800 leading-relaxed italic">
              "{insight}"
            </p>
          </div>
        )}
      </div>

      {/* --- Reviews Section --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <MessageCircle /> Discussion
        </h3>

        {/* Add Review Form */}
        <form
          onSubmit={handleSubmitReview}
          className="mb-8 bg-gray-50 p-4 rounded-lg"
        >
          <textarea
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
            placeholder="Share your thoughts on this poem..."
            rows="3"
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
          ></textarea>
          <div className="flex justify-between items-center">
            <select
              value={reviewRating}
              onChange={(e) => setReviewRating(e.target.value)}
              className="bg-white border border-gray-300 rounded px-2 py-1"
            >
              <option value="5">★★★★★ Excellent</option>
              <option value="4">★★★★☆ Good</option>
              <option value="3">★★★☆☆ Average</option>
              <option value="2">★★☆☆☆ Poor</option>
              <option value="1">★☆☆☆☆ Bad</option>
            </select>
            <button
              type="submit"
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Send size={16} /> Post
            </button>
          </div>
        </form>

        {/* Reviews List */}
        <div className="space-y-6">
          {poem.reviews && poem.reviews.length > 0 ? (
            poem.reviews.map((review) => (
              <div key={review._id} className="border-b pb-4 last:border-0">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-800">
                    @{review.user?.username || "User"}
                  </span>
                  <span className="text-yellow-500 text-sm">
                    {"★".repeat(review.rating)}
                  </span>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">
              No reviews yet. Be the first to share your thoughts!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PoemDetail;
