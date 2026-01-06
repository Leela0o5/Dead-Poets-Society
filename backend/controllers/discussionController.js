import { create, findById, find } from "../models/Discussion";
import { findById as _findById } from "../models/Poem";

const addDiscussion = async (req, res) => {
  try {
    const { content } = req.body;
    const { poemId } = req.params;

    if (!content) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    //  Verify Poem exists
    const poem = await _findById(poemId);
    if (!poem) {
      return res.status(404).json({ message: "Poem not found" });
    }

    //  Create Discussion
    const discussion = await create({
      author: req.user.id,
      poem: poemId,
      content: content,
      createdAt: Date.now(),
    });

    // Populate author details immediately for the UI
    const populatedDiscussion = await findById(discussion._id).populate(
      "author",
      "username profilePicture"
    );

    res.status(201).json(populatedDiscussion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDiscussions = async (req, res) => {
  try {
    const discussions = await find({ poem: req.params.poemId })
      .populate("author", "username profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json(discussions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteDiscussion = async (req, res) => {
  try {
    const discussion = await findById(req.params.discussionId);

    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" });
    }

    // Check Ownership
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

export default {
  addDiscussion,
  getDiscussions,
  deleteDiscussion,
};
