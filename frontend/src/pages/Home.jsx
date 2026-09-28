import React, { useEffect, useState } from "react";
import BlogCard from "../components/BlogCard.jsx";
import Loading from "../components/Loading.jsx";
import EmptyState from "../components/EmptyState.jsx";
import postApi from "../api/posts.js";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await postApi.fetchPublishedPosts();
        setPosts(res.data.posts);
        setError("");
      } catch (err) {
        setError("Failed to load posts. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <Loading text="Loading blog posts..." />;

  if (error) {
    return (
      <div className="container text-center mt-4">
        <EmptyState title="Something went wrong" description={error} />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="container mt-4">
        <EmptyState
          title="No posts yet"
          description="Check back soon for new content!"
        />
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="page-title">Latest Blog Posts</h1>
      <div className="blog-grid">
        {posts.map((post) => (
          <BlogCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Home;
