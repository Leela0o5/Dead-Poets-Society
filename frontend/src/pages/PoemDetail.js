import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import EditPoemModal from "../components/EditPoemModal";
import ConfirmationModal from "../components/ConfirmationModal";
import Avatar from "../components/Avatar";
import {
  Heart,
  Sparkles,
  Trash2,
  MessageSquare,
  Send,
  Calendar,
  Feather,
  Quote,
  Star,
  Edit3,
  X,
} from "lucide-react";

const PoemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [poem, setPoem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal States
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // <--- NEW STATE
  const [isDeleting, setIsDeleting] = useState(false); // <--- LOAD STATE FOR DELETE

  // AI & Review States
  const [insight, setInsight] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  //  Fetch Poem
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

  // Handle Like
  const handleLike = async () => {
    if (!user) return toast.error("Please login to appreciate poems.");
    try {
      const { data } = await api.put(`/poems/${id}/like`);
      setPoem((prev) => ({ ...prev, likes: data }));
    } catch (err) {
      toast.error("Failed to update like.");
    }
  };

  // Handle AI Insight
  const handleGenerateInsight = async () => {
    setAiLoading(true);
    const toastId = toast.loading("Summoning the muse...");
    try {
      const { data } = await api.post(`/ai/insight/${id}`);
      setInsight(data.insight);
      toast.success("Insight revealed.", { id: toastId });
    } catch (err) {
      toast.error("The muse is silent right now.", { id: toastId });
    } finally {
      setAiLoading(false);
    }
  };

  //  Handle Delete (Opens Modal)
  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  //  Confirm Delete (API Call)
  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/poems/${id}`);
      toast.success("Poem burned successfully.");
      navigate("/feed");
    } catch (err) {
      toast.error("Failed to delete poem.");
      setIsDeleting(false); // Only stop loading if error, otherwise we navigate away
      setShowDeleteModal(false);
    }
  };

  //  Handle Poem Update
  const handlePoemUpdate = (updatedPoem) => {
    setPoem((prev) => ({ ...prev, ...updatedPoem }));
  };

  //  Handle Review Submit
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to leave feedback.");
    if (reviewRating === 0) return toast.error("Please select a star rating.");
    if (!reviewComment.trim()) return toast.error("Feedback cannot be empty.");

    try {
      const { data } = await api.post(`/reviews/${id}`, {
        rating: reviewRating,
        comment: reviewComment,
      });

      const newReview = {
        ...data,
        user: { _id: user._id, username: user.username },
        createdAt: new Date().toISOString(),
      };

      setPoem((prev) => ({
        ...prev,
        reviews: [newReview, ...(prev.reviews || [])],
      }));

      setReviewComment("");
      setReviewRating(0);
      toast.success("Feedback submitted anonymously.");
    } catch (err) {
      toast.error("Failed to post feedback.");
    }
  };

  //  Handle Delete Review
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Remove this feedback?")) return;
    try {
      await api.delete(`/reviews/${reviewId}`);
      setPoem((prev) => ({
        ...prev,
        reviews: prev.reviews.filter((r) => r._id !== reviewId),
      }));
      toast.success("Feedback removed.");
    } catch (err) {
      toast.error("Failed to delete feedback.");
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error || !poem)
    return (
      <div className="flex justify-center mt-20">
        <EmptyState
          message="Page Not Found"
          subMessage="This poem may have been lost to time."
        />
      </div>
    );

  const isOwner = user && poem.author?._id === user._id;

  return (
    <div className="min-h-screen py-12 px-4 md:px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* --- POEM SHEET --- */}
        <div className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-sm border border-gray-100 p-8 md:p-16 relative overflow-hidden animate-fadeIn">
          <div className="absolute top-0 left-0 w-full h-2 bg-gray-900"></div>

          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold font-serif text-gray-900 mb-6 tracking-tight leading-tight">
              {poem.title}
            </h1>

            <div className="flex flex-col items-center gap-3 text-gray-500 font-serif">
              <div className="flex items-center gap-2 text-lg">
                <span className="italic">written by</span>
                <Link
                  to={`/profile/${poem.author?._id}`}
                  className="font-bold text-gray-900 border-b border-gray-300 hover:border-blue-600 hover:text-blue-600 transition pb-0.5"
                >
                  {poem.author?.username || "Anonymous"}
                </Link>
              </div>
              <div className="text-sm flex items-center gap-2 opacity-70">
                <Calendar size={12} />
                {new Date(poem.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </header>

          <div className="flex justify-center mb-12">
            <Feather className="text-gray-300" size={24} />
          </div>

          <article className="mb-16">
            <div className="whitespace-pre-wrap text-xl md:text-2xl leading-loose font-serif text-gray-800 max-w-2xl mx-auto">
              {poem.content}
            </div>
          </article>

          {/* Tags */}
          <div className="flex justify-center flex-wrap gap-2 mb-12">
            {poem.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-50 text-gray-500 text-xs uppercase tracking-widest border border-gray-100 rounded-sm"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Actions Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-gray-100 pt-8">
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                className={`group flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 border ${
                  poem.likes.includes(user?._id)
                    ? "bg-red-50 border-red-100 text-red-600"
                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-900 hover:text-gray-900"
                }`}
              >
                <Heart
                  size={18}
                  className={`transition-transform ${
                    poem.likes.includes(user?._id)
                      ? "fill-current"
                      : "group-hover:scale-110"
                  }`}
                />
                <span className="font-bold text-sm">{poem.likes.length}</span>
              </button>

              {/* OWNER ACTIONS */}
              {isOwner && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition"
                    title="Edit Poem"
                  >
                    <Edit3 size={20} />
                  </button>
                  <button
                    onClick={handleDeleteClick} // <--- UPDATED THIS
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                    title="Burn this page"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleGenerateInsight}
              disabled={aiLoading}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition font-serif italic text-sm"
            >
              <Sparkles size={16} />
              {aiLoading ? "Consulting the muse..." : "Ask the Critic"}
            </button>
          </div>
        </div>

        {/* --- AI INSIGHT --- */}
        {insight && (
          <div className="bg-[#fcfbf9] p-8 md:p-10 rounded-sm border border-indigo-100 shadow-sm relative overflow-hidden animate-fadeIn">
            <Quote
              className="absolute top-6 right-6 text-indigo-50"
              size={80}
            />
            <div className="relative z-10">
              <h3 className="font-bold text-indigo-900 mb-4 flex items-center gap-2 font-serif text-lg">
                <Sparkles size={18} /> The Critic's View
              </h3>
              <p className="text-indigo-900/80 text-lg leading-relaxed font-serif italic border-l-2 border-indigo-200 pl-6">
                "{insight}"
              </p>
            </div>
          </div>
        )}

        {/* --- FEEDBACK --- */}
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3 font-serif border-b border-gray-200 pb-4">
            <MessageSquare className="text-gray-400" size={24} />
            Feedback ({poem.reviews?.length || 0})
          </h3>

          {/* Input Form */}
          {user ? (
            <form
              onSubmit={handleSubmitReview}
              className="mb-16 bg-white p-6 rounded-lg shadow-sm border border-gray-200 relative animate-fadeIn"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Rate:
                </span>
                <div
                  className="flex gap-1"
                  onMouseLeave={() => setHoverRating(0)}
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        size={20}
                        className={`transition-colors duration-200 ${
                          star <= (hoverRating || reviewRating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-transparent text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                required
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:bg-white transition-all font-serif resize-none text-gray-800 placeholder-gray-400"
                placeholder="Leave anonymous feedback..."
                rows="3"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
              ></textarea>

              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="bg-gray-900 text-white px-6 py-2.5 rounded-md hover:bg-black transition font-bold text-sm tracking-wide shadow-md flex items-center gap-2"
                >
                  <Send size={14} /> Submit Feedback
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-8 bg-gray-50 border border-gray-200 mb-10 rounded-lg">
              <p className="text-gray-600 font-serif">
                <Link
                  to="/login"
                  className="text-gray-900 font-bold underline hover:text-blue-700"
                >
                  Log in
                </Link>{" "}
                to leave feedback.
              </p>
            </div>
          )}

          {/* Feedback List */}
          <div className="space-y-8">
            {poem.reviews && poem.reviews.length > 0 ? (
              poem.reviews.map((review, index) => {
                const reviewUserId = review.user?._id || review.user;
                const isReviewOwner = user && reviewUserId === user._id;
                const reviewUser =
                  typeof review.user === "object"
                    ? review.user
                    : { _id: review.user };
                return (
                  <div
                    key={review._id || index}
                    className="animate-fadeIn group relative pl-6 border-l-2 border-gray-100 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center">
                          <Avatar user={reviewUser} size="sm" />
                        </div>
                        <span className="font-bold text-gray-700 font-serif text-lg">
                          Anonymous
                        </span>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={
                                i < review.rating
                                  ? "fill-gray-900 text-gray-900"
                                  : "text-gray-200"
                              }
                            />
                          ))}
                        </div>
                        {isReviewOwner && (
                          <button
                            onClick={() => handleDeleteReview(review._id)}
                            className="text-gray-300 hover:text-red-500 transition p-1"
                            title="Delete your feedback"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-700 leading-relaxed font-serif text-lg mb-2">
                      {review.comment}
                    </p>

                    <div className="text-xs text-gray-400 font-sans uppercase tracking-wider">
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString(
                            undefined,
                            { month: "short", day: "numeric", year: "numeric" }
                          )
                        : "Just now"}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 opacity-50">
                <Feather className="mx-auto mb-3 text-gray-400" size={24} />
                <p className="font-serif italic text-gray-500">
                  No feedback yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* Edit Modal */}
      {isEditing && (
        <EditPoemModal
          poem={poem}
          onClose={() => setIsEditing(false)}
          onUpdate={handlePoemUpdate}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Burn this Poem?"
        message="Are you sure you want to delete this poem permanently? This action cannot be undone."
        confirmText="Burn It"
        loading={isDeleting}
      />
    </div>
  );
};

export default PoemDetail;
