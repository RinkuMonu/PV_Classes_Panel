// import React, { useEffect, useState } from "react";
// import axiosInstance from "../../../config/AxiosInstance";
// import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const Pyq = () => {
//   const [pyqs, setPyqs] = useState([]);
//   const [formData, setFormData] = useState({
//     exam: "",
//     description: "",
//     category: "",
//     pdf: null,
//   });
//   const [editingPyq, setEditingPyq] = useState(null);

//   // Fetch PYQs
//   const fetchPyqs = async () => {
//     try {
//       const res = await axiosInstance.get("/pyq");
//       setPyqs(res.data);
//     } catch (error) {
//       console.error("Error fetching PYQs:", error);
//     }
//   };

//   useEffect(() => {
//     fetchPyqs();
//   }, []);

//   // Handle input change
//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === "pdf") {
//       setFormData({ ...formData, pdf: files[0] });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   // Submit (create or update)
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const data = new FormData();
//       data.append("exam", formData.exam);
//       data.append("description", formData.description);
//       data.append("category", formData.category);
//       if (formData.pdf) {
//         data.append("pdf", formData.pdf);
//       }

//       if (editingPyq) {
//         // Update API
//         await axiosInstance.put(`/pyq/${editingPyq._id}`, data, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//         setEditingPyq(null);
//         toast.success("PYQ updated successfully!");
//       } else {
//         // Create API
//         await axiosInstance.post("/pyq", data, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//         toast.success("PYQ created successfully!");
//       }

//       setFormData({ exam: "", description: "", category: "", pdf: null });
//       fetchPyqs();
//     } catch (error) {
//       console.error("Error saving PYQ:", error);
//       toast.error("Something went wrong!");
//     }
//   };

//   // Delete PYQ
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this PYQ?")) return;
//     try {
//       await axiosInstance.delete(`/pyq/${id}`);
//       fetchPyqs();
//       toast.success("PYQ deleted successfully!");
//     } catch (error) {
//       console.error("Error deleting PYQ:", error);
//       toast.error("Failed to delete PYQ!");
//     }
//   };

//   // Edit PYQ
//   const handleUpdate = (pyq) => {
//     setEditingPyq(pyq);
//     setFormData({
//       exam: pyq.exam,
//       description: pyq.description,
//       category: pyq.category,
//       pdf: null, // user can upload new one
//     });
//   };

//   // View PDF
//   const handleView = (pyq) => {
//     if (pyq.pdfUrl) {
//       window.open(pyq.pdfUrl, "_blank");
//     } else {
//       toast.info("No PDF available for this PYQ");
//     }
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-bold mb-4">
//         {editingPyq ? "Update PYQ" : "Create PYQ"}
//       </h2>

//       {/* Form */}
//       <form onSubmit={handleSubmit} className="space-y-4 mb-6">
//         <input
//           type="text"
//           name="exam"
//           placeholder="Exam Name"
//           value={formData.exam}
//           onChange={handleChange}
//           className="w-full border p-2 rounded"
//           required
//         />
//         <textarea
//           name="description"
//           placeholder="Description"
//           value={formData.description}
//           onChange={handleChange}
//           className="w-full border p-2 rounded"
//           required
//         />
//         <input
//           type="text"
//           name="category"
//           placeholder="Category"
//           value={formData.category}
//           onChange={handleChange}
//           className="w-full border p-2 rounded"
//           required
//         />
//         <input
//           type="file"
//           name="pdf"
//           accept="application/pdf"
//           onChange={handleChange}
//           className="w-full border p-2 rounded"
//         />
//         <button
//           type="submit"
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           {editingPyq ? "Update" : "Create"}
//         </button>
//         {editingPyq && (
//           <button
//             type="button"
//             onClick={() => {
//               setEditingPyq(null);
//               setFormData({ exam: "", description: "", category: "", pdf: null });
//             }}
//             className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
//           >
//             Cancel
//           </button>
//         )}
//       </form>

//       {/* PYQ List */}
//       <h2 className="text-xl font-bold mb-4">PYQ List</h2>
//       <table className="w-full border">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="p-2 border">Exam</th>
//             <th className="p-2 border">Description</th>
//             <th className="p-2 border">Category</th>
//             <th className="p-2 border">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {pyqs.length > 0 ? (
//             pyqs.map((pyq) => (
//               <tr key={pyq._id}>
//                 <td className="p-2 border">{pyq.exam}</td>
//                 <td className="p-2 border">{pyq.description}</td>
//                 <td className="p-2 border">{pyq.category}</td>
//                 <td className="p-2 border flex justify-center gap-3">
//                   <button
//                     className="text-blue-500 hover:text-blue-700"
//                     onClick={() => handleUpdate(pyq)}
//                   >
//                     <FaEdit />
//                   </button>
//                   <button
//                     className="text-green-500 hover:text-green-700"
//                     onClick={() => handleView(pyq)}
//                   >
//                     <FaEye />
//                   </button>
//                   <button
//                     className="text-red-500 hover:text-red-700"
//                     onClick={() => handleDelete(pyq._id)}
//                   >
//                     <FaTrash />
//                   </button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="4" className="text-center p-2">
//                 No PYQs found
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Pyq;






import React, { useEffect, useState } from "react";
import axiosInstance from "../../../config/AxiosInstance";
import { FaEdit, FaEye, FaTrash, FaPlus, FaTimes, FaFilePdf } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Pyq = () => {
  const [pyqs, setPyqs] = useState([]);
  const [formData, setFormData] = useState({
    exam: "",
    description: "",
    category: "",
    pdf: null,
  });
  const [editingPyq, setEditingPyq] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Fetch PYQs
  const fetchPyqs = async () => {
    try {
      const res = await axiosInstance.get("/pyq");
      setPyqs(res.data);
    } catch (error) {
      console.error("Error fetching PYQs:", error);
    }
  };

  useEffect(() => {
    fetchPyqs();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "pdf") {
      setFormData({ ...formData, pdf: files[0] });
      if (files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => setPdfPreview(e.target.result);
        reader.readAsDataURL(files[0]);
      } else {
        setPdfPreview(null);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Submit (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("exam", formData.exam);
      data.append("description", formData.description);
      data.append("category", formData.category);
      if (formData.pdf) {
        data.append("pdf", formData.pdf);
      }

      if (editingPyq) {
        // Update API
        await axiosInstance.put(`/pyq/${editingPyq._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setEditingPyq(null);
        toast.success("PYQ updated successfully!");
      } else {
        // Create API
        await axiosInstance.post("/pyq", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("PYQ created successfully!");
      }

      setFormData({ exam: "", description: "", category: "", pdf: null });
      setPdfPreview(null);
      setIsFormVisible(false);
      fetchPyqs();
    } catch (error) {
      console.error("Error saving PYQ:", error);
      toast.error("Something went wrong!");
    }
  };

  // Delete PYQ
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this PYQ?")) return;
    try {
      await axiosInstance.delete(`/pyq/${id}`);
      fetchPyqs();
      toast.success("PYQ deleted successfully!");
    } catch (error) {
      console.error("Error deleting PYQ:", error);
      toast.error("Failed to delete PYQ!");
    }
  };

  // Edit PYQ
  const handleUpdate = (pyq) => {
    setEditingPyq(pyq);
    setFormData({
      exam: pyq.exam,
      description: pyq.description,
      category: pyq.category,
      pdf: null,
    });
    setPdfPreview(pyq.pdfUrl ? pyq.pdfUrl : null);
    setIsFormVisible(true);
  };

  // View PDF
const handleView = (pyq) => {
  if (pyq.pdfUrl) {
    const baseUrl = "https://api.pvclasses.in";
    const pdfUrl = pyq.pdfUrl.startsWith("http")
      ? pyq.pdfUrl
      : `${baseUrl}/${pyq.pdfUrl}`;
    window.open(pdfUrl, "_blank");
  } else {
    toast.info("No PDF available for this PYQ");
  }
};


  // Reset form
  const resetForm = () => {
    setFormData({ exam: "", description: "", category: "", pdf: null });
    setEditingPyq(null);
    setPdfPreview(null);
    setIsFormVisible(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-800">PYQ Management</h1>
          {!isFormVisible && !editingPyq && (
            <button
              onClick={() => setIsFormVisible(true)}
              className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FaPlus className="mr-2" /> Add New PYQ
            </button>
          )}
        </div>

        {/* Form Section */}
        {(isFormVisible || editingPyq) && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-green-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-green-800">
                {editingPyq ? "Update PYQ" : "Create New PYQ"}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exam Name
                </label>
                <input
                  type="text"
                  name="exam"
                  placeholder="Enter exam name"
                  value={formData.exam}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Enter description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  placeholder="Enter category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PDF File
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex flex-col items-center justify-center w-40 h-32 border-2 border-dashed border-green-300 rounded-lg cursor-pointer bg-green-50 hover:bg-green-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FaFilePdf className="w-8 h-8 text-green-500 mb-2" />
                      <p className="text-xs text-green-700">Upload PDF</p>
                    </div>
                    <input
                      type="file"
                      name="pdf"
                      accept="application/pdf"
                      onChange={handleChange}
                      className="hidden"
                    />
                  </label>
                  
                  {pdfPreview && (
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-16 bg-red-100 flex items-center justify-center rounded-md">
                        <FaFilePdf className="text-red-600 text-xl" />
                      </div>
                      <span className="text-xs mt-1 text-gray-600">PDF Ready</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  {editingPyq ? "Update PYQ" : "Create PYQ"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="border border-gray-300 text-gray-700 hover:bg-gray-100 px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* PYQ List */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-green-100">
          <h2 className="text-xl font-semibold text-green-800 mb-6">PYQ List</h2>
          
          {pyqs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pyqs.map((pyq) => (
                <div key={pyq._id} className="border border-green-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="bg-green-50 p-4 border-b border-green-200">
                    <h3 className="font-semibold text-green-800 truncate">{pyq.exam}</h3>
                    <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {pyq.category}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-600 text-sm h-12 overflow-hidden mb-4">
                      {pyq.description.length > 100 
                        ? `${pyq.description.substring(0, 100)}...` 
                        : pyq.description}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        {pyq.pdfUrl && (
                          <span className="flex items-center text-xs text-green-600">
                            <FaFilePdf className="mr-1" /> PDF Attached
                          </span>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          className="text-green-600 hover:text-green-800 p-2 rounded-full hover:bg-green-100 transition-colors"
                          onClick={() => handleUpdate(pyq)}
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100 transition-colors"
                          onClick={() => handleView(pyq)}
                          title="View"
                        >
                          <FaEye />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors"
                          onClick={() => handleDelete(pyq._id)}
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <FaFilePdf className="text-green-500 text-3xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">No PYQs yet</h3>
              <p className="text-gray-500 mb-4">Get started by creating your first PYQ</p>
              <button
                onClick={() => setIsFormVisible(true)}
                className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <FaPlus className="mr-2" /> Create PYQ
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pyq;