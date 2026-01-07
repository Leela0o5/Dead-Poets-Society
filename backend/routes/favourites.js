import { Router } from "express";
const router = Router();

import {
  toggleFavorite,
  getUserFavorites,
} from "../controllers/favouriteController.js";

import verifyToken from "../middlewares/auth.js";

router.post("/:poemId", verifyToken, toggleFavorite);
router.get("/", verifyToken, getUserFavorites);

export default router;
