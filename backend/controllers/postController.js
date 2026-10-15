import Post from "../models/Post.js";
import { AppError } from "../utils/errorHandler.js";

const createPost = async (req, res, next) => {
  try {
    const postData = { ...req.body, user: req.user._id };

    if (req.user.role !== "admin" || !postData.author) {
      postData.author = req.user.name;
    }

    const post = await Post.create(postData);
    res.status(201).json({ message: "Post created", post });
  } catch (error) {
    next(error);
  }
};

const getPosts = async (req, res, next) => {
  try {
    let query = {};

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.search) {
      const regex = new RegExp(req.query.search, "i");
      query.$or = [
        { title: regex },
        { content: regex },
        { author: regex },
        { category: regex },
      ];
    }

    const posts = await Post.find(query).sort({ createdAt: -1 });
    res.status(200).json({ count: posts.length, posts });
  } catch (error) {
    next(error);
  }
};

const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(new AppError("Post not found", 404));
    }

    res.status(200).json({ post });
  } catch (error) {
    if (error.name === "CastError") {
      return next(new AppError("Invalid post ID", 400));
    }
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return next(new AppError("Post not found", 404));
    }

    Object.assign(post, req.body);
    post.updatedAt = Date.now();
    await post.save();

    res.status(200).json({ message: "Post updated", post });
  } catch (error) {
    if (error.name === "CastError") {
      return next(new AppError("Invalid post ID", 400));
    }
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(new AppError("Post not found", 404));
    }

    await post.deleteOne();

    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    if (error.name === "CastError") {
      return next(new AppError("Invalid post ID", 400));
    }
    next(error);
  }
};

const getPublishedPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ status: "published" }).sort({
      createdAt: -1,
    });
    res.status(200).json({ count: posts.length, posts });
  } catch (error) {
    next(error);
  }
};

export {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  getPublishedPosts,
};
