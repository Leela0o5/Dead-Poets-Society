import User from "../models/User.js";
import Poem from "../models/Poem.js";

// Get User Profile by ID
export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    // Find user
    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get stats
    const poemsCount = await Poem.countDocuments({ author: id });

    // Return combined data
    res.status(200).json({
      ...user.toObject(),
      poemsCount,
    });
  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    res.status(500).json({ message: "Server error fetching profile" });
  }
};
