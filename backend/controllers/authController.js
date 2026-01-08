import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    if (user) {
      // Set Session Data
      req.session.user = {
        id: user._id,
        name: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        role: user.role,
      };

      // FORCE SAVE before response (Fixes Vercel 401 Issue)
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).json({ message: "Session save failed" });
        }

        res.status(201).json({
          _id: user.id,
          name: user.username,
          email: user.email,
          profilePicture: user.profilePicture,
          token: generateToken(user._id), // Kept for backward compatibility
        });
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      //  Set Session Data
      req.session.user = {
        id: user._id,
        name: user.username, // Normalized field name (was user.name in your snippet, changed to match model likely)
        email: user.email,
        profilePicture: user.profilePicture,
        role: user.role,
      };

      // FORCE SAVE before response (Fixes Vercel 401 Issue)
      req.session.save((err) => {
        if (err) {
          console.error("Login Session save error:", err);
          return res.status(500).json({ message: "Session save failed" });
        }

        res.json({
          message: "Logged in successfully",
          user: req.session.user,

          _id: user._id,
          username: user.username,
          email: user.email,
          profilePicture: user.profilePicture,
        });
      });
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Could not log out" });

    // Explicitly clear the cookie with the same settings
    res.clearCookie("connect.sid", { path: "/" });
    res.json({ message: "Logged out successfully" });
  });
};

export const getMe = async (req, res) => {
  try {
    // Check if session exists first
    if (!req.session || !req.session.user) {
      return res.status(401).json({ message: "Not authorized, no session" });
    }

    // Use session ID
    const user = await User.findById(req.session.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    // Ensure we have a user ID from the session
    const userId = req.user
      ? req.user.id
      : req.session.user
      ? req.session.user.id
      : null;

    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const user = await User.findById(userId);

    if (user) {
      user.bio = req.body.bio || user.bio;
      user.profilePicture = req.body.profilePicture || user.profilePicture;
      user.username = req.body.username || user.username;

      const updatedUser = await user.save();

      if (req.session.user) {
        req.session.user.name = updatedUser.username;
        req.session.user.profilePicture = updatedUser.profilePicture;
        req.session.save(); // Save background update
      }

      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.username,
        email: updatedUser.email,
        bio: updatedUser.bio,
        profilePicture: updatedUser.profilePicture,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
