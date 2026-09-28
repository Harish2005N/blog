import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PostForm from "../components/PostForm.jsx";
import Notification from "../components/Notification.jsx";
import postApi from "../api/posts.js";

const CreatePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError("");

    try {
      await postApi.createPost(formData);
      setNotification("Post created successfully!");
      setTimeout(() => {
        navigate("/admin");
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create post. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="auth-page">
        <Notification
          message={notification}
          type="success"
          onClose={() => setNotification("")}
        />
        <div className="post-form-container">
          <h1>Create New Post</h1>
          {error && <div className="auth-error">{error}</div>}
          <PostForm onSubmit={handleSubmit} submitLabel="Create Post" />
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
