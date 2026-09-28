import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostForm from "../components/PostForm.jsx";
import Loading from "../components/Loading.jsx";
import Notification from "../components/Notification.jsx";
import EmptyState from "../components/EmptyState.jsx";
import postApi from "../api/posts.js";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await postApi.fetchPostById(id);
        setPost(res.data.post);
        setError("");
      } catch (err) {
        setError("Failed to load post.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setError("");

    try {
      await postApi.updatePost(id, formData);
      setNotification("Post updated successfully!");
      setTimeout(() => {
        navigate("/admin");
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update post. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading text="Loading post..." />;

  if (!post) {
    return (
      <div className="container mt-4 text-center">
        <EmptyState title="Post not found" />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <Notification
        message={notification}
        type="success"
        onClose={() => setNotification("")}
      />
      <div className="post-form-container">
        <h1>Edit Post</h1>
        {error && <div className="auth-error">{error}</div>}
        <PostForm
          initialData={post}
          onSubmit={handleSubmit}
          submitLabel={submitting ? "Saving..." : "Save Changes"}
        />
      </div>
    </div>
  );
};

export default EditPost;
