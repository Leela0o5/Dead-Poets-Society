import { Router } from "express";
const router = Router();

import {
  addDiscussion,
  getDiscussions,
  deleteDiscussion,
} from "../controllers/discussionController.js";

import verifyToken from "../middlewares/auth.js";

// Add a comment/discussion
router.post("/:poemId", verifyToken, addDiscussion);

// Get all discussions for a poem
router.get("/:poemId", getDiscussions);

// Delete a specific discussion
router.delete("/:discussionId", verifyToken, deleteDiscussion);

export default router;
