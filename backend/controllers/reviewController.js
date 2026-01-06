import { create, findById, find } from "../models/Review";
import { findById as _findById } from "../models/Poem";

const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { poemId } = req.params;

    //  Check if the poem actually exists
    const poem = await _findById(poemId);
    if (!poem) {
      return res.status(404).json({ message: "Poem not found" });
    }

    //  Create the review
    const review = await create({
      author: req.user.id,
      poem: poemId,
      rating: Number(rating),
      comment,
    });

    // Populate user details immediately so the frontend can display it
    const populatedReview = await findById(review._id).populate(
      "author",
      "username profilePicture"
    );

    res.status(201).json(populatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getReviews = async (req, res) => {
  try {
    const reviews = await find({ poem: req.params.poemId })
      .populate("author", "username profilePicture") // Show who wrote it
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    //  Verify Ownership
    // Check if the logged-in user matches the review author
    if (review.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "Not authorized to delete this review" });
    }

    await review.deleteOne();

    res.status(200).json({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  addReview,
  getReviews,
  deleteReview,
};
