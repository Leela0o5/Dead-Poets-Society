import Discussion from "../models/Discussion.js";
import Poem from "../models/Poem.js";

export const addDiscussion = async (req, res) => {
  try {
    const { content } = req.body;
    const { poemId } = req.params;

    if (!content) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    // Verify poem exists
    const poem = await Poem.findById(poemId);
    if (!poem) {
      return res.status(404).json({ message: "Poem not found" });
    }

    // Create discussion
    const discussion = await Discussion.create({
      author: req.user.id,
      poem: poemId,
      content,
    });

    // Populate author for UI
    const populatedDiscussion = await Discussion.findById(
      discussion._id
    ).populate("author", "username profilePicture");

    res.status(201).json(populatedDiscussion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDiscussions = async (req, res) => {
  try {
    const discussions = await Discussion.find({
      poem: req.params.poemId,
    })
      .populate("author", "username profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json(discussions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.discussionId);

    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" });
    }

    // Ownership check
    if (discussion.author.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "Not authorized to delete this comment" });
    }

    await discussion.deleteOne();
    res.status(200).json({ message: "Discussion deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
