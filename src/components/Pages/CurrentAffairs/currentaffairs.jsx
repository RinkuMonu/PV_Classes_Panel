import React, { useEffect, useState } from "react";
import axiosInstance from "../../../config/AxiosInstance"; // adjust path if needed

const CurrentAffairsAdmin = () => {
  const [categories, setCategories] = useState([]);
  const [currentAffairs, setCurrentAffairs] = useState([]);

  // --- Category Form State ---
  const [categoryName, setCategoryName] = useState("");
  const [categorySlug, setCategorySlug] = useState("");

  // --- Current Affair Form State ---
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    category: "",
    tags: "",
    status: "draft",
  });
  const [image, setImage] = useState(null);

  // Track edit mode
  const [editingId, setEditingId] = useState(null);

  // ✅ Fetch Categories
  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/current-affairs/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // ✅ Fetch Current Affairs
  const fetchCurrentAffairs = async () => {
    try {
      const res = await axiosInstance.get("/current-affairs");
      setCurrentAffairs(res.data);
    } catch (err) {
      console.error("Error fetching current affairs:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchCurrentAffairs();
  }, []);

  // ✅ Handle Create Category
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/current-affairs/categories", {
        name: categoryName,
        slug: categorySlug,
      });
      setCategoryName("");
      setCategorySlug("");
      fetchCategories();
    } catch (err) {
      console.error("Error creating category:", err);
    }
  };

  // ✅ Handle Create/Update Current Affair
  const handleSubmitCurrentAffair = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("slug", formData.slug);
      data.append("content", formData.content);
      data.append("excerpt", formData.excerpt);
      data.append("category", formData.category);
      data.append("tags", formData.tags);
      data.append("status", formData.status);
      if (image) data.append("image", image);

      if (editingId) {
        // Update
        await axiosInstance.put(`/current-affairs/${editingId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // Create
        await axiosInstance.post("/current-affairs", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      // Reset form
      setFormData({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        category: "",
        tags: "",
        status: "draft",
      });
      setImage(null);
      setEditingId(null);

      fetchCurrentAffairs();
    } catch (err) {
      console.error("Error saving current affair:", err);
    }
  };

  // ✅ Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this current affair?"))
      return;

    try {
      await axiosInstance.delete(`/current-affairs/${id}`);
      fetchCurrentAffairs();
    } catch (err) {
      console.error("Error deleting current affair:", err);
    }
  };

  // ✅ Handle Edit
  const handleEdit = (affair) => {
    setFormData({
      title: affair.title,
      slug: affair.slug,
      content: affair.content,
      excerpt: affair.excerpt,
      category: affair.category?._id || "",
      tags: affair.tags?.join(",") || "",
      status: affair.status,
    });
    setImage(null);
    setEditingId(affair._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ Handle View
  const handleView = (affair) => {
    alert(`
      Title: ${affair.title}
      Slug: ${affair.slug}
      Category: ${affair.category?.name || "N/A"}
      Status: ${affair.status}
      Tags: ${affair.tags?.join(", ")}
      Content: ${affair.content}
    `);
  };

  return (
    <div className="p-6 space-y-8">
      {/* Category Form */}
      <div>
        <h2 className="text-xl font-bold mb-4">Create Category</h2>
        <form onSubmit={handleCreateCategory} className="space-y-4">
          <input
            type="text"
            placeholder="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="border p-2 w-full"
            required
          />
          <input
            type="text"
            placeholder="Category Slug"
            value={categorySlug}
            onChange={(e) => setCategorySlug(e.target.value)}
            className="border p-2 w-full"
            required
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2">
            Create Category
          </button>
        </form>
      </div>

      {/* Current Affair Form */}
      <div>
        <h2 className="text-xl font-bold mb-4">
          {editingId ? "Edit Current Affair" : "Create Current Affair"}
        </h2>
        <form onSubmit={handleSubmitCurrentAffair} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="border p-2 w-full"
            required
          />
          <input
            type="text"
            placeholder="Slug"
            value={formData.slug}
            onChange={(e) =>
              setFormData({ ...formData, slug: e.target.value })
            }
            className="border p-2 w-full"
            required
          />
          <textarea
            placeholder="Content"
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            className="border p-2 w-full"
            rows="4"
            required
          />
          <textarea
            placeholder="Excerpt"
            value={formData.excerpt}
            onChange={(e) =>
              setFormData({ ...formData, excerpt: e.target.value })
            }
            className="border p-2 w-full"
            rows="2"
          />
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="border p-2 w-full"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={formData.tags}
            onChange={(e) =>
              setFormData({ ...formData, tags: e.target.value })
            }
            className="border p-2 w-full"
          />
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            className="border p-2 w-full"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="border p-2 w-full"
          />
          <button
            type="submit"
            className={`${
              editingId ? "bg-yellow-500" : "bg-green-500"
            } text-white px-4 py-2`}
          >
            {editingId ? "Update Current Affair" : "Create Current Affair"}
          </button>
        </form>
      </div>

      {/* Current Affairs Table */}
      <div>
        <h2 className="text-xl font-bold mb-4">Current Affairs List</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Title</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentAffairs.map((affair) => (
              <tr key={affair._id}>
                <td className="border p-2">{affair.title}</td>
                <td className="border p-2">
                  {affair.category?.name || "N/A"}
                </td>
                <td className="border p-2">{affair.status}</td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => handleEdit(affair)}
                    className="bg-yellow-500 text-white px-2 py-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(affair._id)}
                    className="bg-red-500 text-white px-2 py-1"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleView(affair)}
                    className="bg-blue-500 text-white px-2 py-1"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CurrentAffairsAdmin;
