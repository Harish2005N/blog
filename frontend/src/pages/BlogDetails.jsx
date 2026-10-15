import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../components/Loading.jsx";
import EmptyState from "../components/EmptyState.jsx";
import postApi from "../api/posts.js";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await postApi.fetchPostById(id);
        setPost(res.data.post);
        setError("");
      } catch (err) {
        setError("Failed to load post. The post may not exist.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <Loading text="Loading post..." />;

  if (error) {
    return (
      <div className="container text-center mt-4">
        <EmptyState title="Post not found" description={error} />
        <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container text-center mt-4">
        <EmptyState title="Post not found" />
      </div>
    );
  }

  const defaultImage =
    "https://images.unsplash.com/photo-1503443229168-b2e3c1c1be8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

  return (
    <div className="container mt-4">
      <button className="btn btn-outline mb-4" onClick={() => navigate("/")}>
        ← Back
      </button>

      <article className="blog-details">
        <img
          src={post.image || defaultImage}
          alt={post.title}
          onError={(e) => {
            e.target.src = defaultImage;
          }}
        />
        <div className="blog-details-meta">
          <span className="blog-details-category">{post.category}</span>
        </div>
        <h1 className="blog-details-title">{post.title}</h1>
        <p className="blog-details-author">
          By {post.author} •{" "}
          {new Date(post.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <div className="blog-details-content">
          {post.content
            .split(/\n\s*\n/)
            .map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
        </div>
      </article>
    </div>
  );
};

export default BlogDetails;
