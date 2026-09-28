import api from "./index.js";

export const fetchPosts = (params) => api.get("/posts", { params });
export const fetchPublishedPosts = () => api.get("/posts/published");
export const fetchPostById = (id) => api.get(`/posts/${id}`);
export const createPost = (data) => api.post("/posts", data);
export const updatePost = (id, data) => api.put(`/posts/${id}`, data);
export const deletePost = (id) => api.delete(`/posts/${id}`);

export default {
  fetchPosts,
  fetchPublishedPosts,
  fetchPostById,
  createPost,
  updatePost,
  deletePost,
};
