import { Router } from "express";
const router = Router();

import { generateInsight } from "../controllers/aiController.js";

router.post("/insight/:poemId", generateInsight);

export default router;
