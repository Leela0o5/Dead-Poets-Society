import dotenv from "dotenv";
dotenv.config();
import express, { json, urlencoded } from "express";
import { connect as _connect } from "mongoose";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";

import authRoutes from "./routes/auth.js";
import poemRoutes from "./routes/poem.js";
import reviewRoutes from "./routes/reviews.js";
import discussionRoutes from "./routes/discussion.js";
import favoriteRoutes from "./routes/favourites.js";
import aiRoutes from "./routes/ai.js";

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
console.log(
  "CHECKING MONGO URI:",
  process.env.MONGO_URI ? "It exists!" : "IT IS UNDEFINED ❌"
);

app.use(
  cors({
    origin: [
      "https://dead-poets-society-one.vercel.app", // <--- CHANGED: No trailing slash
      "http://localhost:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(json());
app.use(urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    secure: true,
    sameSite: "none",
    httpOnly: true,
  })
);

let isConnected = false;

const connectDB = async () => {
  // Check if we have an active connection state
  if (isConnected || mongoose.connection.readyState === 1) {
    return;
  }

  try {
    const conn = await _connect(process.env.MONGO_URI);
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(" MongoDB Connection Error:", err);
  }
};

// Connect immediately when the serverless function loads
connectDB();

// --- Route Mounting ---
app.use("/api/auth", authRoutes);
app.use("/api/poems", poemRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/discussions", discussionRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/ai", aiRoutes);

// --- Global Error Handling ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong on the server",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// ---Local Development Only ---
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
