import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../../../config/AxiosInstance";
import { FaEdit, FaEye, FaTrash, FaPlus, FaTimes, FaImage, FaTag, FaFolder } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CurrentAffairsAdmin = () => {
  const [categories, setCategories] = useState([]);
  const [currentAffairs, setCurrentAffairs] = useState([]);

  const formRef = useRef(null);

  // --- Category Form State ---
  const [categoryName, setCategoryName] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [showCategoryForm, setShowCategoryForm] = useState(false);

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
  const [imagePreview, setImagePreview] = useState(null);

  // Track edit mode
  const [editingId, setEditingId] = useState(null);
  const [showCurrentAffairForm, setShowCurrentAffairForm] = useState(false);

  // ✅ Fetch Categories
  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/current-affairs/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      toast.error("Failed to fetch categories");
    }
  };

  // ✅ Fetch Current Affairs
  const fetchCurrentAffairs = async () => {
    try {
      const res = await axiosInstance.get("/current-affairs");
      setCurrentAffairs(res.data);
    } catch (err) {
      console.error("Error fetching current affairs:", err);
      toast.error("Failed to fetch current affairs");
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
      setShowCategoryForm(false);
      fetchCategories();
      toast.success("Category created successfully!");
    } catch (err) {
      console.error("Error creating category:", err);
      toast.error("Failed to create category");
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
        toast.success("Current affair updated successfully!");
      } else {
        // Create
        await axiosInstance.post("/current-affairs", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Current affair created successfully!");
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
      setImagePreview(null);
      setEditingId(null);
      setShowCurrentAffairForm(false);

      fetchCurrentAffairs();
    } catch (err) {
      console.error("Error saving current affair:", err);
      toast.error("Failed to save current affair");
    }
  };

  // ✅ Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this current affair?"))
      return;

    try {
      await axiosInstance.delete(`/current-affairs/${id}`);
      fetchCurrentAffairs();
      toast.success("Current affair deleted successfully!");
    } catch (err) {
      console.error("Error deleting current affair:", err);
      toast.error("Failed to delete current affair");
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
    setImagePreview(affair.imageUrl || null);
    setEditingId(affair._id);
    setShowCurrentAffairForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
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

  // Handle image upload for preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset current affair form
  const resetCurrentAffairForm = () => {
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
    setImagePreview(null);
    setEditingId(null);
    setShowCurrentAffairForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-800">Current Affairs Management</h1>
          <div className="flex space-x-4">
            {!showCategoryForm && (
              <button
                onClick={() => setShowCategoryForm(true)}
                className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <FaPlus className="mr-2" /> Add Category
              </button>
            )}
            {!showCurrentAffairForm && (
              <button
                onClick={() => setShowCurrentAffairForm(true)}
                className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <FaPlus className="mr-2" /> Add Current Affair
              </button>
            )}
          </div>
        </div>

        {/* Category Form */}
        {showCategoryForm && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-green-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-green-800">Create Category</h2>
              <button
                onClick={() => setShowCategoryForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  placeholder="Enter category name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Slug
                </label>
                <input
                  type="text"
                  placeholder="Enter category slug"
                  value={categorySlug}
                  onChange={(e) => setCategorySlug(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                  required
                />
              </div>
              <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                Create Category
              </button>
            </form>
          </div>
        )}

        {/* Current Affair Form */}
        {showCurrentAffairForm && (
          <div ref={formRef} className="bg-white rounded-xl shadow-md p-6 mb-8 border border-green-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-green-800">
                {editingId ? "Edit Current Affair" : "Create Current Affair"}
              </h2>
              <button
                onClick={resetCurrentAffairForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmitCurrentAffair} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    placeholder="Enter slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  placeholder="Enter content"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                  rows="4"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Excerpt
                </label>
                <textarea
                  placeholder="Enter excerpt"
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                  rows="2"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma separated)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaTag className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter tags (comma separated)"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg pl-10 px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex flex-col items-center justify-center w-40 h-32 border-2 border-dashed border-green-300 rounded-lg cursor-pointer bg-green-50 hover:bg-green-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FaImage className="w-8 h-8 text-green-500 mb-2" />
                      <p className="text-xs text-green-700">Upload Image</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>

                  {imagePreview && (
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded-md overflow-hidden">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs mt-1 text-gray-600">Image Preview</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  {editingId ? "Update Current Affair" : "Create Current Affair"}
                </button>
                <button
                  type="button"
                  onClick={resetCurrentAffairForm}
                  className="border border-gray-300 text-gray-700 hover:bg-gray-100 px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Current Affairs List */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-green-100">
          <h2 className="text-xl font-semibold text-green-800 mb-6">Current Affairs List</h2>

          {currentAffairs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentAffairs.map((affair) => (
                <div key={affair._id} className="border border-green-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  {affair.imageUrl && (
                    <div className="h-48 bg-gray-200 overflow-hidden">
                      <img
                        src={affair.imageUrl}
                        alt={affair.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${affair.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {affair.status}
                      </span>
                      {affair.category && (
                        <span className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          <FaFolder className="mr-1" /> {affair.category.name}
                        </span>
                      )}
                    </div>

                    <h3 className="font-semibold text-green-800 mb-2 line-clamp-1">{affair.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{affair.excerpt || affair.content}</p>

                    {affair.tags && affair.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {affair.tags.map((tag, index) => (
                          <span key={index} className="inline-flex items-center text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                            <FaTag className="mr-1 text-xs" /> {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-end space-x-2">
                      <button
                        className="text-green-600 hover:text-green-800 p-2 rounded-full hover:bg-green-100 transition-colors"
                        onClick={() => handleEdit(affair)}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100 transition-colors"
                        onClick={() => handleView(affair)}
                        title="View"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors"
                        onClick={() => handleDelete(affair._id)}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <FaImage className="text-green-500 text-3xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">No current affairs yet</h3>
              <p className="text-gray-500 mb-4">Get started by creating your first current affair</p>
              <button
                onClick={() => setShowCurrentAffairForm(true)}
                className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <FaPlus className="mr-2" /> Create Current Affair
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrentAffairsAdmin;