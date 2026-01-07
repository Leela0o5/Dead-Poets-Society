import dotenv from "dotenv";
dotenv.config();
import express, { json, urlencoded } from "express";
import { connect as _connect } from "mongoose";
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

// CORS: Allows frontend to talk to this backend
app.use(
  cors({
    origin: "http://localhost:3000", // my Frontend URL
    credentials: true,
  })
);
//  Body Parser: Accept JSON data in requests
app.use(json());
app.use(urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

// --- Database Connection ---
_connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB Connected"))
  .catch((err) => {
    console.error(" MongoDB Connection Error:", err);
    process.exit(1); // Exit process with failure
  });

// --- Route Mounting ---
app.use("/api/auth", authRoutes);
app.use("/api/poems", poemRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/discussions", discussionRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/ai", aiRoutes);

// --- Global Error Handling ---
// Catches any errors thrown in routes that weren't caught locally
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong on the server",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
