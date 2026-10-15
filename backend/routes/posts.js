import express from "express";
const router = express.Router();

import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  getPublishedPosts,
} from "../controllers/postController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.get("/", getPosts);
router.get("/published", getPublishedPosts);
router.get("/:id", getPostById);
router.post("/", protect, createPost);
router.put("/:id", protect, admin, updatePost);
router.delete("/:id", protect, admin, deletePost);

export default router;
