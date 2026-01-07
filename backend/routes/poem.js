import { Router } from "express";
const router = Router();

// Import Controller Functions
import {
  createPoem,
  getAllPoems,
  getUserPoems,
  getPoemById,
  updatePoem,
  deletePoem,
  toggleLike,
  getFilteredPoems,
} from "../controllers/poemController.js";

// Import Middleware
import verifyToken from "../middlewares/auth.js";

// New Search route
router.get("/search", getFilteredPoems);

// Get all public poems (with pagination)
router.get("/", getAllPoems);
router.get("/search", getFilteredPoems);
router.get("/user/:userId", verifyToken, getUserPoems);
router.get("/:id", verifyToken, getPoemById);

// --- Protected Routes ---
// Create a new poem
router.post("/", verifyToken, createPoem);

// Update a poem
router.put("/:id", verifyToken, updatePoem);

// Delete a poem
router.delete("/:id", verifyToken, deletePoem);

// Toggle Like
router.put("/:id/like", verifyToken, toggleLike);

export default router;
