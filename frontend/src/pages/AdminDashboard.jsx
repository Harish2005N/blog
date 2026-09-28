import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import postApi from "../api/posts.js";
import Loading from "../components/Loading.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import Notification from "../components/Notification.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const AdminDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [notification, setNotification] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { logout } = useAuth();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (filterStatus !== "all") params.status = filterStatus;
      const res = await postApi.fetchPosts(params);
      setPosts(res.data.posts);
    } catch (err) {
      setError("Failed to load posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [searchTerm, filterStatus]);

  const handleDelete = async () => {
    if (!postToDelete) return;
    try {
      await postApi.deletePost(postToDelete._id);
      setPosts((prev) => prev.filter((p) => p._id !== postToDelete._id));
      setNotification("Post deleted successfully");
    } catch (err) {
      setError("Failed to delete post.");
    } finally {
      setConfirmOpen(false);
      setPostToDelete(null);
    }
  };

  const publishedCount = posts.filter((p) => p.status === "published").length;
  const draftCount = posts.filter((p) => p.status === "draft").length;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) return <Loading text="Loading dashboard..." />;

  return (
    <div className="admin-dashboard container">
      <Notification
        message={notification}
        type="success"
        onClose={() => setNotification("")}
      />

      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <button className="btn btn-secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {error && <div className="auth-error">{error}</div>}

      <div className="admin-stats">
        <div className="stat-card">
          <span className="stat-value">{posts.length}</span>
          <span className="stat-label">Total Posts</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{publishedCount}</span>
          <span className="stat-label">Published</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{draftCount}</span>
          <span className="stat-label">Drafts</span>
        </div>
      </div>

      <div className="admin-actions">
        <Link to="/admin/create" className="btn btn-primary">
          Create New Post
        </Link>
        <div className="admin-filters">
          <input
            type="text"
            className="form-control"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="form-control"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Posts</option>
            <option value="published">Published Only</option>
            <option value="draft">Drafts Only</option>
          </select>
        </div>
      </div>

      {posts.length === 0 ? (
        <EmptyState
          title="No posts found"
          description="Create your first post to get started."
        />
      ) : (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Author</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post._id}>
                  <td>{post.title}</td>
                  <td>{post.category}</td>
                  <td>
                    <span
                      className={
                        post.status === "published"
                          ? "status-published"
                          : "status-draft"
                      }
                    >
                      {post.status}
                    </span>
                  </td>
                  <td>{post.author}</td>
                  <td>
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td>
                    <Link
                      to={`/admin/edit/${post._id}`}
                      className="btn btn-outline btn-sm"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        setPostToDelete(post);
                        setConfirmOpen(true);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Post?"
        message={
          postToDelete
            ? `Are you sure you want to delete "${postToDelete.title}"? This action cannot be undone.`
            : ""
        }
      />
    </div>
  );
};

export default AdminDashboard;
