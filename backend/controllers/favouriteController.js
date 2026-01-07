import User from "../models/User.js";
import Poem from "../models/Poem.js";

export const toggleFavorite = async (req, res) => {
  try {
    const { poemId } = req.params;
    const user = await User.findById(req.user.id);

    //  Verify Poem exists 
    const poemExists = await Poem.findById(poemId);
    if (!poemExists) {
      return res.status(404).json({ message: 'Poem not found' });
    }

    //  Check if already favorited
    // We convert ObjectIds to strings for comparison
    const isFavorited = user.favorites.some(
      (id) => id.toString() === poemId
    );

    if (isFavorited) {
      // Remove from favorites
      user.favorites = user.favorites.filter(
        (id) => id.toString() !== poemId
      );
      await user.save();
      return res.status(200).json({ message: 'Removed from favorites', isFavorited: false });
    } else {
      // Add to favorites
      user.favorites.push(poemId);
      await user.save();
      return res.status(200).json({ message: 'Added to favorites', isFavorited: true });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserFavorites = async (req, res) => {
  try {
    // Find the user and "Populate" the favorites array
    // This turns the list of IDs into actual Poem objects
    const user = await User.findById(req.user.id).populate({
      path: 'favorites',
      select: 'title content author tags createdAt', 
      populate: {
        path: 'author',
        select: 'username profilePicture' 
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};