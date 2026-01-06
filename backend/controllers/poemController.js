import Poem from "../models/Poem";
import User from "../models/User";
import Review from "../models/Review";
import Discussion from "../models/Discussion";

const createPoem = async (req, res) => {
  try {
    const { title, content, tags, visibility } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    const poem = await Poem.create({
      title,
      content,
      tags: tags || [],
      visibility: visibility || true,
      author: req.user.id, // From authMiddleware
    });

    const populatedPoem = await Poem.findById(poem._id).populate(
      "author",
      "username profilePicture"
    );

    res.status(201).json(populatedPoem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllPoems = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filter only public poems
    const query = { visibility: true };

    const poems = await Poem.find(query)
      .populate("author", "username profilePicture")
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(limit);

    const total = await Poem.countDocuments(query);

    res.status(200).json({
      poems,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserPoems = async (req, res) => {
  try {
    const { userId } = req.params;
    const isOwner = req.user && req.user.id === userId;

    let query = { author: userId };

    // If not the owner, only show public poems
    if (!isOwner) {
      query.visibility = true;
    }

    const poems = await Poem.find(query)
      .populate("author", "username profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json(poems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPoemById = async (req, res) => {
  try {
    const poem = await Poem.findById(req.params.id)
      .populate("author", "username profilePicture bio")
      .populate({
        path: "reviews", // Assumes a virtual or field for reviews
        populate: { path: "author", select: "username profilePicture" },
      });

    if (!poem) {
      return res.status(404).json({ message: "Poem not found" });
    }

    // Check visibility permissions
    const isPrivate = poem.visibility === false;
    const isOwner = req.user && poem.author._id.toString() === req.user.id;

    if (isPrivate && !isOwner) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this poem" });
    }

    res.status(200).json(poem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePoem = async (req, res) => {
  try {
    const poem = await Poem.findById(req.params.id);

    if (!poem) {
      return res.status(404).json({ message: "Poem not found" });
    }

    // Verify ownership
    if (poem.author.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Update fields
    poem.title = req.body.title || poem.title;
    poem.content = req.body.content || poem.content;
    poem.tags = req.body.tags || poem.tags;
    poem.visibility = req.body.visibility || poem.visibility;

    const updatedPoem = await poem.save();
    res.status(200).json(updatedPoem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePoem = async (req, res) => {
  try {
    const poem = await Poem.findById(req.params.id);

    if (!poem) {
      return res.status(404).json({ message: "Poem not found" });
    }

    // Verify ownership
    if (poem.author.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Cleanup associated data (Cascading delete)
    await Review.deleteMany({ poem: poem._id });
    await Discussion.deleteMany({ poem: poem._id });

    await poem.deleteOne();

    res.status(200).json({ message: "Poem deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleLike = async (req, res) => {
  try {
    const poem = await Poem.findById(req.params.id);
    const user = await User.findById(req.user.id);
    const poemAuthor = await User.findById(poem.author); // To update totalLikes

    if (!poem) {
      return res.status(404).json({ message: "Poem not found" });
    }

    // Check if already liked
    if (poem.likes.includes(req.user.id)) {
      // Unlike
      poem.likes = poem.likes.filter((id) => id.toString() !== req.user.id);

      // Decrease author's total likes count if logic requires it
      if (poemAuthor) {
        poemAuthor.totalLikes = Math.max(0, (poemAuthor.totalLikes || 0) - 1);
        await poemAuthor.save();
      }
    } else {
      // Like
      poem.likes.push(req.user.id);

      // Increase author's total likes
      if (poemAuthor) {
        poemAuthor.totalLikes = (poemAuthor.totalLikes || 0) + 1;
        await poemAuthor.save();
      }
    }

    await poem.save();
    res.status(200).json(poem.likes); // Return updated likes array
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchPoems = async (req, res) => {
  try {
    const keyword = req.query.q
      ? {
          $or: [
            { title: { $regex: req.query.q, $options: "i" } },
            { content: { $regex: req.query.q, $options: "i" } },
            { tags: { $regex: req.query.q, $options: "i" } },
          ],
        }
      : {};

    // Combine search with public visibility
    const poems = await Poem.find({ ...keyword, visibility: true })
      .populate("author", "username profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json(poems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFilteredPoems = async (req, res) => {
  try {
    const { tag, q } = req.query; // Accept tag and optional search query

    let query = { visibility: true };

    if (tag) {
      query.tags = { $in: [tag] };
    }

    if (q) {
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } },
      ];
    }

    const poems = await Poem.find(query)
      .populate("author", "username profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json(poems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPoem,
  getAllPoems,
  getUserPoems,
  getPoemById,
  updatePoem,
  deletePoem,
  toggleLike,
  searchPoems,
  getFilteredPoems,
};
