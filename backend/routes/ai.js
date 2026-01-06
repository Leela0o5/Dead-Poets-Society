import { Router } from "express";
const router = Router();

import { generateInsight } from "../controllers/aiController";
import verifyToken from "../middleware/auth";
router.post("/insight/:poemId", verifyToken, generateInsight);

export default router;
