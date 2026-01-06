import { Router } from "express";
const router = Router();

import {
  toggleFavorite,
  getUserFavorites,
} from "../controllers/favoriteController";

import verifyToken from "../middleware/auth";

router.post("/:poemId", verifyToken, toggleFavorite);
router.get("/", verifyToken, getUserFavorites);

export default router;
