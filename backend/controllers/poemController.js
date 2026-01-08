import Poem from "../models/Poem.js";
import User from "../models/User.js";
import Review from "../models/Review.js";

//  Create Poem
export const createPoem = async (req, res) => {
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
      visibility: visibility !== undefined ? visibility : true,
      author: req.user.id,
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

//  Get All Poems (Feed)
export const getAllPoems = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { visibility: true };

    const poems = await Poem.find(query)
      .populate("author", "username profilePicture")
      .sort({ createdAt: -1 })
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

// Get User Profile Poems
export const getUserPoems = async (req, res) => {
  try {
    const { userId } = req.params;
    const isOwner = req.user && req.user.id === userId;

    let query = { author: userId };

    if (!isOwner) {
      query.visibility = true;
    }

    const poems = await Poem.find(query)
      .populate("author", "username profilePicture bio")
      .sort({ createdAt: -1 });

    res.status(200).json(poems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Poem
export const getPoemById = async (req, res) => {
  try {
    const poem = await Poem.findById(req.params.id)
      .populate("author", "username profilePicture bio")
      .populate({
        path: "reviews",
        populate: { path: "author", select: "username profilePicture" }, 
      });

    if (!poem) {
      return res.status(404).json({ message: "Poem not found" });
    }

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

// Update Poe
export const updatePoem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, tags, visibility } = req.body;

    console.log(`Attempting to update poem: ${id}`);

    const poem = await Poem.findById(id);
    if (!poem) {
      return res.status(404).json({ message: "Poem not found" });
    }
    if (poem.author.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not the author of this poem." });
    }

    if (title) poem.title = title;
    if (content) poem.content = content;
    if (tags) poem.tags = tags;
    if (visibility !== undefined) poem.visibility = visibility;

    const updatedPoem = await poem.save();

    console.log("Poem updated successfully");
    res.status(200).json(updatedPoem);
  } catch (err) {
    console.error("UPDATE POEM ERROR:", err);
    res.status(500).json({ message: "Server error while updating poem." });
  }
};

//  Delete Poem
export const deletePoem = async (req, res) => {
  try {
    const poem = await Poem.findById(req.params.id);

    if (!poem) {
      return res.status(404).json({ message: "Poem not found" });
    }

    if (poem.author.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Cleanup
    await Review.deleteMany({ poem: poem._id });

    await poem.deleteOne();

    res.status(200).json({ message: "Poem deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle Like
export const toggleLike = async (req, res) => {
  try {
    const poem = await Poem.findById(req.params.id);
    const user = await User.findById(req.user.id);

    if (!poem) {
      return res.status(404).json({ message: "Poem not found" });
    }

    // Optimization: Only fetch author if we need to update stats
    const poemAuthor = await User.findById(poem.author);

    if (poem.likes.includes(req.user.id)) {
      // Unlike
      poem.likes = poem.likes.filter((id) => id.toString() !== req.user.id);
      if (poemAuthor) {
        poemAuthor.totalLikes = Math.max(0, (poemAuthor.totalLikes || 0) - 1);
        await poemAuthor.save();
      }
    } else {
      // Like
      poem.likes.push(req.user.id);
      if (poemAuthor) {
        poemAuthor.totalLikes = (poemAuthor.totalLikes || 0) + 1;
        await poemAuthor.save();
      }
    }

    await poem.save();
    res.status(200).json(poem.likes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Advanced Filter/Search
export const getFilteredPoems = async (req, res) => {
  try {
    const { query, tags } = req.query;
    let filter = { visibility: true };

    if (tags) {
      const tagArray = tags.split(",");
      filter.tags = { $in: tagArray.map((t) => new RegExp(t, "i")) };
    }

    if (query) {
      const matchingUsers = await User.find({
        username: { $regex: query, $options: "i" },
      }).select("_id");

      const userIds = matchingUsers.map((u) => u._id);

      filter.$or = [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
        { author: { $in: userIds } },
      ];
    }

    const poems = await Poem.find(filter)
      .populate("author", "username profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json(poems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
