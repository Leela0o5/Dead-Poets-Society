import { Router } from "express";
import {
  register,
  login,
  getMe,
  updateProfile,
  logout,
} from "../controllers/authController";
const router = Router();

const verifyToken = require("../middlewares/auth");

router.post("/register", register);
router.post("/login", login);

// It clears the session cookie
router.post("/logout", logout);

router.get("/me", verifyToken, getMe);
router.put("/profile", verifyToken, updateProfile);

module.exports = router;
