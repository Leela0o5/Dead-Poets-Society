import { Router } from "express";
import {
  register,
  login,
  getMe,
  updateProfile,
  logout,
} from "../controllers/authController.js";
import verifyToken from "../middlewares/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);

// It clears the session cookie
router.post("/logout", logout);

router.get("/me", verifyToken, getMe);
router.put("/profile", verifyToken, updateProfile);

export default router;
