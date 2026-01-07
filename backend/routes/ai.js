import { Router } from "express";
const router = Router();

import { generateInsight } from "../controllers/aiController.js";
import verifyToken from "../middlewares/auth.js";

router.post("/insight/:poemId", verifyToken, generateInsight);

export default router;
