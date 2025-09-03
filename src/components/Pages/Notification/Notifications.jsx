// import React, { useEffect, useState } from "react";
// import axiosInstance from "../../../config/AxiosInstance";

// const Notifications = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     categoryId: "",
//   });

//   // ✅ Fetch categories for dropdown
// const fetchCategories = async () => {
//   try {
//     const res = await axiosInstance.get("/categories");
//     setCategories(res.data || []);  // <-- Fix here
//   } catch (error) {
//     console.error("Error fetching categories:", error);
//   }
// };

//   // ✅ Fetch all notifications
//   const fetchNotifications = async () => {
//     try {
//       const res = await axiosInstance.get("/notification/all");
//       setNotifications(res.data.notifications || []);
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//     }
//   };

//   // ✅ Create new notification
//   const handleCreate = async (e) => {
//     e.preventDefault();
//     try {
//       await axiosInstance.post("/notification", formData);
//       setFormData({ title: "", description: "", categoryId: "" });
//       fetchNotifications(); // refresh list
//     } catch (error) {
//       console.error("Error creating notification:", error);
//     }
//   };

//   // ✅ Delete notification
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this notification?")) return;
//     try {
//       await axiosInstance.delete(`/notification/${id}`);
//       fetchNotifications(); // refresh list
//     } catch (error) {
//       console.error("Error deleting notification:", error);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//     fetchNotifications();
//   }, []);

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h2 className="text-2xl font-bold mb-4">Manage Notifications</h2>

//       {/* Create Notification Form */}
//       <form onSubmit={handleCreate} className="space-y-4 bg-gray-100 p-4 rounded">
//         <input
//           type="text"
//           placeholder="Title"
//           value={formData.title}
//           onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//           className="w-full p-2 border rounded"
//           required
//         />
//         <textarea
//           placeholder="Description"
//           value={formData.description}
//           onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//           className="w-full p-2 border rounded"
//           required
//         />
//         <select
//           value={formData.categoryId}
//           onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
//           className="w-full p-2 border rounded"
//           required
//         >
//           <option value="">Select Category</option>
//           {categories.map((cat) => (
//             <option key={cat._id} value={cat._id}>
//               {cat.name}
//             </option>
//           ))}
//         </select>
//         <button
//           type="submit"
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           Create Notification
//         </button>
//       </form>

//       {/* Notifications List */}
//       <div className="mt-8">
//         <h3 className="text-xl font-semibold mb-4">All Notifications</h3>
//         {notifications.length === 0 ? (
//           <p>No notifications found.</p>
//         ) : (
//           <ul className="space-y-3">
//             {notifications.map((n) => (
//               <li
//                 key={n._id}
//                 className="flex justify-between items-center bg-white shadow p-3 rounded"
//               >
//                 <div>
//                   <h4 className="font-bold">{n.title}</h4>
//                   <p className="text-sm">{n.description}</p>
//                   <span className="text-xs text-gray-500">Category: {n.category?.name}</span>
//                 </div>
//                 <button
//                   onClick={() => handleDelete(n._id)}
//                   className="bg-red-500 text-white px-3 py-1 rounded"
//                 >
//                   Delete
//                 </button>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Notifications;



import React, { useEffect, useState } from "react";
import axiosInstance from "../../../config/AxiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
  });

  // ✅ Fetch categories for dropdown
  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/categories");
      setCategories(res.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    }
  };

  // ✅ Fetch all notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/notification/all");
      setNotifications(res.data.notifications || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Create new notification
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/notification", formData);
      setFormData({ title: "", description: "", categoryId: "" });
      toast.success("Notification created successfully!");
      fetchNotifications(); // refresh list
    } catch (error) {
      console.error("Error creating notification:", error);
      toast.error("Failed to create notification");
    }
  };

  // ✅ Delete notification
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) return;
    try {
      await axiosInstance.delete(`/notification/${id}`);
      toast.success("Notification deleted successfully!");
      fetchNotifications(); // refresh list
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchNotifications();
  }, []);

  return (
    <div className="p-6 mx-auto bg-gray-50 min-h-screen">
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
      
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage Notifications</h2>

      {/* Create Notification Form */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-8 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
          Create New Notification
        </h3>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              placeholder="Enter notification title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              placeholder="Enter notification description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
              rows="3"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
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
          
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md hover:shadow-lg"
          >
            Create Notification
          </button>
        </form>
      </div>

      {/* Notifications List */}
      <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
          All Notifications
        </h3>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p className="mt-4 text-gray-600 text-lg">No notifications found</p>
            <p className="text-gray-500">Create your first notification using the form above</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((n) => (
              <div key={n._id} className="flex justify-between items-start bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-gray-800">{n.title}</h4>
                  <p className="text-gray-600 mt-1">{n.description}</p>
                  <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Category: {n.category?.name || "Uncategorized"}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(n._id)}
                  className="ml-4 bg-red-100 text-red-600 hover:bg-red-200 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;