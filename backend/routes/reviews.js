import { Router } from "express";
const router = Router();

import { addReview, getReviews, deleteReview } from "../controllers/reviewController";
import verifyToken from "../middleware/auth";

router.post("/:poemId", verifyToken, addReview);
router.get("/:poemId", getReviews);
router.delete("/:reviewId", verifyToken, deleteReview);

export default router;
