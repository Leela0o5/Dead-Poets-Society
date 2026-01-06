connect(
  "mongodb+srv://leela:leela@clusterpoetry.rzluawx.mongodb.net/?appName=ClusterPoetry"
);

import express, { json, urlencoded } from "express";
import { connect as _connect } from "mongoose";
import cors from "cors";
import { config } from "dotenv";
config();
import authRoutes from "./routes/auth";
import poemRoutes from "./routes/poems";
import reviewRoutes from "./routes/reviews";
import discussionRoutes from "./routes/discussions";
import favoriteRoutes from "./routes/favorites";
import aiRoutes from "./routes/ai";

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---

// CORS: Allows frontend to talk to this backend
app.use(
  cors({
    origin: "http://localhost:5173", // my Frontend URL
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET || "super_secret_session_key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 3, // 1 Day
      httpOnly: true, // Prevents XSS attacks
      secure: process.env.NODE_ENV === "production", 
      sameSite: "lax", // Protects against CSRF
    },
  })
);

//  Body Parser: Accept JSON data in requests
app.use(json());
app.use(urlencoded({ extended: true }));

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
