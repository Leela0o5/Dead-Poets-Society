import Review from "../models/Review.js";
import Poem from "../models/Poem.js";

export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { poemId } = req.params;

    // Check if poem exists
    const poem = await Poem.findById(poemId);
    if (!poem) {
      return res.status(404).json({ message: "Poem not found" });
    }

    // Create review
    const review = await Review.create({
      author: req.user.id,
      poem: poemId,
      rating: Number(rating),
      comment,
    });

    // Populate author info
    const populatedReview = await Review.findById(review._id).populate(
      "author",
      "username profilePicture"
    );

    res.status(201).json(populatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ poem: req.params.poemId })
      .populate("author", "username profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    console.log("Attempting to delete review:", reviewId);

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    //  Remove reference from Poem
    await Poem.findByIdAndUpdate(review.poem, {
      $pull: { reviews: reviewId },
    });

    //  Delete the Review
    await Review.findByIdAndDelete(reviewId);

    res.status(200).json({ message: "Review deleted" });
  } catch (err) {
    console.error("DELETE REVIEW ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
