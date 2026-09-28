import React from "react";
import { Link } from "react-router-dom";

const BlogCard = ({ post }) => {
  const defaultImage =
    "https://images.unsplash.com/photo-1503443229168-b2e3c1c1be8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

  return (
    <article className="blog-card">
      <div className="blog-card-img">
        <img
          src={post.image || defaultImage}
          alt={post.title}
          onError={(e) => {
            e.target.src = defaultImage;
          }}
        />
      </div>
      <div className="blog-card-body">
        <span className="blog-card-category">{post.category}</span>
        <h3 className="blog-card-title">{post.title}</h3>
        <p className="blog-card-meta">
          By {post.author} •{" "}
          {new Date(post.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
        <Link to={`/posts/${post._id}`} className="blog-card-link">
          Read More
        </Link>
      </div>
    </article>
  );
};

export default BlogCard;
