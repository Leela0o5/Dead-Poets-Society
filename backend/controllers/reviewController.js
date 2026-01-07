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
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.author.toString() !== req.user.id) {
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
