import React, { useEffect, useState } from "react";
import axiosInstance from "../../../config/AxiosInstance";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
  });

  // ✅ Fetch categories for dropdown
const fetchCategories = async () => {
  try {
    const res = await axiosInstance.get("/categories");
    setCategories(res.data || []);  // <-- Fix here
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

  // ✅ Fetch all notifications
  const fetchNotifications = async () => {
    try {
      const res = await axiosInstance.get("/notification/all");
      setNotifications(res.data.notifications || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // ✅ Create new notification
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/notification", formData);
      setFormData({ title: "", description: "", categoryId: "" });
      fetchNotifications(); // refresh list
    } catch (error) {
      console.error("Error creating notification:", error);
    }
  };

  // ✅ Delete notification
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) return;
    try {
      await axiosInstance.delete(`/notification/${id}`);
      fetchNotifications(); // refresh list
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchNotifications();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Manage Notifications</h2>

      {/* Create Notification Form */}
      <form onSubmit={handleCreate} className="space-y-4 bg-gray-100 p-4 rounded">
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <select
          value={formData.categoryId}
          onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Notification
        </button>
      </form>

      {/* Notifications List */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">All Notifications</h3>
        {notifications.length === 0 ? (
          <p>No notifications found.</p>
        ) : (
          <ul className="space-y-3">
            {notifications.map((n) => (
              <li
                key={n._id}
                className="flex justify-between items-center bg-white shadow p-3 rounded"
              >
                <div>
                  <h4 className="font-bold">{n.title}</h4>
                  <p className="text-sm">{n.description}</p>
                  <span className="text-xs text-gray-500">Category: {n.category?.name}</span>
                </div>
                <button
                  onClick={() => handleDelete(n._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notifications;