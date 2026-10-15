import React, { useState, useEffect } from "react";

const PostForm = ({
  initialData,
  onSubmit,
  submitLabel = "Create Post",
  authorReadOnly = false,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
    category: "General",
    image: "",
    status: "draft",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        content: initialData.content || "",
        author: initialData.author || "",
        category: initialData.category || "General",
        image: initialData.image || "",
        status: initialData.status || "draft",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Title *</label>
        <input
          className="form-control"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Enter post title"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Author *</label>
          <input
            className="form-control"
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            readOnly={authorReadOnly}
            placeholder="Enter author name"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Category</label>
          <input
            className="form-control"
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Enter category"
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Image URL</label>
        <input
          className="form-control"
          type="url"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="Enter image URL (optional)"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Status</label>
          <select
            className="form-control"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Content *</label>
        <textarea
          className="form-control textarea-large"
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
          placeholder="Write your post content here..."
          rows={10}
        />
      </div>

      <button type="submit" className="btn btn-primary">
        {submitLabel}
      </button>
    </form>
  );
};

export default PostForm;
