import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import { AppError } from "./utils/errorHandler.js";

dotenv.config();

connectDB();

const app = express();

const corsOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((s) => s.trim())
  : ["http://localhost:5173"];

const normalizeOrigin = (origin) => origin?.replace(/\/$/, "");

const allowedOrigins = new Set(corsOrigins.map(normalizeOrigin));

app.use(
  cors({
    origin: (origin, callback) => {
      const normalized = normalizeOrigin(origin);
      if (!origin || allowedOrigins.has(normalized)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/", (req, res) => {
  res.json({ message: "Blog Platform API is running..." });
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: err.status || "error",
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});

export default app;
