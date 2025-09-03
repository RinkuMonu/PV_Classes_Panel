


// import React, { useEffect, useState } from "react";
// import axiosInstance from "../../../config/AxiosInstance";
// import { FaEdit, FaEye, FaTrash, FaPlus, FaTimes, FaFilePdf } from "react-icons/fa";

// const Notes = () => {
//   const [notes, setNotes] = useState([]);
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     pdf: null,
//   });
//   const [editingNote, setEditingNote] = useState(null);
//   const [pdfPreview, setPdfPreview] = useState(null);
//   const [isFormVisible, setIsFormVisible] = useState(false);

//   // Fetch notes
//   const fetchNotes = async () => {
//     try {
//       const res = await axiosInstance.get("/notes");
//       setNotes(res.data);
//     } catch (error) {
//       console.error("Error fetching notes:", error);
//     }
//   };

//   useEffect(() => {
//     fetchNotes();
//   }, []);

//   // Handle input change
//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === "pdf") {
//       setFormData({ ...formData, pdf: files[0] });
//       if (files[0]) {
//         const reader = new FileReader();
//         reader.onload = (e) => setPdfPreview(e.target.result);
//         reader.readAsDataURL(files[0]);
//       } else {
//         setPdfPreview(null);
//       }
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   // Submit (create or update)
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const data = new FormData();
//       data.append("title", formData.title);
//       data.append("description", formData.description);
//       if (formData.pdf) {
//         data.append("pdf", formData.pdf);
//       }

//       if (editingNote) {
//         // Update API
//         await axiosInstance.put(`/notes/${editingNote._id}`, data, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//         setEditingNote(null);
//       } else {
//         // Create API
//         await axiosInstance.post("/notes", data, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//       }

//       setFormData({ title: "", description: "", pdf: null });
//       setPdfPreview(null);
//       setIsFormVisible(false);
//       fetchNotes();
//     } catch (error) {
//       console.error("Error saving note:", error);
//     }
//   };

//   // Delete Note
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this note?")) return;
//     try {
//       await axiosInstance.delete(`/notes/${id}`);
//       fetchNotes();
//     } catch (error) {
//       console.error("Error deleting note:", error);
//     }
//   };

//   // Edit Note
//   const handleUpdate = (note) => {
//     setEditingNote(note);
//     setFormData({
//       title: note.title,
//       description: note.description,
//       pdf: null,
//     });
//     setPdfPreview(note.pdfUrl ? `https://api.pvclasses.in/${note.pdfUrl}` : null);
//     setIsFormVisible(true);
//   };

//   // View Note (open pdf if available)
//   const handleView = (note) => {
//     if (note.pdfUrl) {
//       window.open(`https://api.pvclasses.in/${note.pdfUrl}`, "_blank");
//     } else {
//       alert("No PDF available for this note");
//     }
//   };

//   // Reset form
//   const resetForm = () => {
//     setFormData({ title: "", description: "", pdf: null });
//     setEditingNote(null);
//     setPdfPreview(null);
//     setIsFormVisible(false);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold text-green-800">Notes Management</h1>
//           {!isFormVisible && !editingNote && (
//             <button
//               onClick={() => setIsFormVisible(true)}
//               className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
//             >
//               <FaPlus className="mr-2" /> Add New Note
//             </button>
//           )}
//         </div>

//         {/* Form Section */}
//         {(isFormVisible || editingNote) && (
//           <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-green-100">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-xl font-semibold text-green-800">
//                 {editingNote ? "Update Note" : "Create New Note"}
//               </h2>
//               <button
//                 onClick={resetForm}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <FaTimes size={20} />
//               </button>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Title
//                 </label>
//                 <input
//                   type="text"
//                   name="title"
//                   placeholder="Enter note title"
//                   value={formData.title}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Description
//                 </label>
//                 <textarea
//                   name="description"
//                   placeholder="Enter note description"
//                   value={formData.description}
//                   onChange={handleChange}
//                   rows="4"
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   PDF File
//                 </label>
//                 <div className="flex items-center space-x-4">
//                   <label className="flex flex-col items-center justify-center w-40 h-32 border-2 border-dashed border-green-300 rounded-lg cursor-pointer bg-green-50 hover:bg-green-100 transition-colors">
//                     <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                       <FaFilePdf className="w-8 h-8 text-green-500 mb-2" />
//                       <p className="text-xs text-green-700">Upload PDF</p>
//                     </div>
//                     <input
//                       type="file"
//                       name="pdf"
//                       accept="application/pdf"
//                       onChange={handleChange}
//                       className="hidden"
//                     />
//                   </label>
                  
//                   {pdfPreview && (
//                     <div className="flex flex-col items-center">
//                       <div className="w-12 h-16 bg-red-100 flex items-center justify-center rounded-md">
//                         <FaFilePdf className="text-red-600 text-xl" />
//                       </div>
//                       <span className="text-xs mt-1 text-gray-600">PDF Ready</span>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="flex space-x-3 pt-4">
//                 <button
//                   type="submit"
//                   className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
//                 >
//                   {editingNote ? "Update Note" : "Create Note"}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={resetForm}
//                   className="border border-gray-300 text-gray-700 hover:bg-gray-100 px-6 py-2 rounded-lg font-medium transition-colors"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         )}

//         {/* Notes List */}
//         <div className="bg-white rounded-xl shadow-md p-6 border border-green-100">
//           <h2 className="text-xl font-semibold text-green-800 mb-6">Notes List</h2>
          
//           {notes.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {notes.map((note) => (
//                 <div key={note._id} className="border border-green-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
//                   <div className="bg-green-50 p-4 border-b border-green-200">
//                     <h3 className="font-semibold text-green-800 truncate">{note.title}</h3>
//                   </div>
//                   <div className="p-4">
//                     <p className="text-gray-600 text-sm h-12 overflow-hidden mb-4">
//                       {note.description.length > 100 
//                         ? `${note.description.substring(0, 100)}...` 
//                         : note.description}
//                     </p>
                    
//                     <div className="flex justify-between items-center">
//                       <div className="flex items-center">
//                         {note.pdfUrl && (
//                           <span className="flex items-center text-xs text-green-600">
//                             <FaFilePdf className="mr-1" /> PDF Attached
//                           </span>
//                         )}
//                       </div>
                      
//                       <div className="flex space-x-2">
//                         <button
//                           className="text-green-600 hover:text-green-800 p-2 rounded-full hover:bg-green-100 transition-colors"
//                           onClick={() => handleUpdate(note)}
//                           title="Edit"
//                         >
//                           <FaEdit />
//                         </button>
//                         <button
//                           className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100 transition-colors"
//                           onClick={() => handleView(note)}
//                           title="View"
//                         >
//                           <FaEye />
//                         </button>
//                         <button
//                           className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors"
//                           onClick={() => handleDelete(note._id)}
//                           title="Delete"
//                         >
//                           <FaTrash />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-12">
//               <div className="mx-auto w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-4">
//                 <FaFilePdf className="text-green-500 text-3xl" />
//               </div>
//               <h3 className="text-lg font-medium text-gray-700 mb-2">No notes yet</h3>
//               <p className="text-gray-500 mb-4">Get started by creating your first note</p>
//               <button
//                 onClick={() => setIsFormVisible(true)}
//                 className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
//               >
//                 <FaPlus className="mr-2" /> Create Note
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Notes;




import React, { useEffect, useState } from "react";
import axiosInstance from "../../../config/AxiosInstance";
import { FaEdit, FaEye, FaTrash, FaPlus, FaTimes, FaFilePdf } from "react-icons/fa";

// ✅ Import Toast
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    pdf: null,
  });
  const [editingNote, setEditingNote] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Fetch notes
  const fetchNotes = async () => {
    try {
      const res = await axiosInstance.get("/notes");
      setNotes(res.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast.error("Failed to fetch notes!");
    }
  };

  useEffect(() => {
    fetchNotes();
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
      data.append("title", formData.title);
      data.append("description", formData.description);
      if (formData.pdf) {
        data.append("pdf", formData.pdf);
      }

      if (editingNote) {
        // Update API
        await axiosInstance.put(`/notes/${editingNote._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Note updated successfully!");
        setEditingNote(null);
      } else {
        // Create API
        await axiosInstance.post("/notes", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Note created successfully!");
      }

      setFormData({ title: "", description: "", pdf: null });
      setPdfPreview(null);
      setIsFormVisible(false);
      fetchNotes();
    } catch (error) {
      console.error("Error saving note:", error);
      toast.error("Failed to save note!");
    }
  };

  // Delete Note
  const handleDelete = async (id) => {
    // Instead of window.confirm, use toast confirm
    toast.info(
      <div>
        <p>Are you sure you want to delete this note?</p>
        <div className="flex space-x-2 mt-2">
          <button
            onClick={async () => {
              try {
                await axiosInstance.delete(`/notes/${id}`);
                fetchNotes();
                toast.dismiss();
                toast.success("Note deleted successfully!");
              } catch (error) {
                console.error("Error deleting note:", error);
                toast.dismiss();
                toast.error("Failed to delete note!");
              }
            }}
            className="bg-red-600 text-white px-3 py-1 rounded"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="bg-gray-300 px-3 py-1 rounded"
          >
            No
          </button>
        </div>
      </div>,
      { autoClose: false }
    );
  };

  // Edit Note
  const handleUpdate = (note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      description: note.description,
      pdf: null,
    });
    setPdfPreview(note.pdfUrl ? `https://api.pvclasses.in/${note.pdfUrl}` : null);
    setIsFormVisible(true);
  };

  // View Note (open pdf if available)
  const handleView = (note) => {
    if (note.pdfUrl) {
      window.open(`https://api.pvclasses.in/${note.pdfUrl}`, "_blank");
    } else {
      toast.warn("No PDF available for this note!");
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({ title: "", description: "", pdf: null });
    setEditingNote(null);
    setPdfPreview(null);
    setIsFormVisible(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ToastContainer position="top-right" />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-800">Notes Management</h1>
          {!isFormVisible && !editingNote && (
            <button
              onClick={() => setIsFormVisible(true)}
              className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FaPlus className="mr-2" /> Add New Note
            </button>
          )}
        </div>

        {/* Form Section */}
        {(isFormVisible || editingNote) && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-green-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-green-800">
                {editingNote ? "Update Note" : "Create New Note"}
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
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter note title"
                  value={formData.title}
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
                  placeholder="Enter note description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
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
                      <span className="text-xs mt-1 text-gray-600">
                        PDF Ready
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  {editingNote ? "Update Note" : "Create Note"}
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

        {/* Notes List */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-green-100">
          <h2 className="text-xl font-semibold text-green-800 mb-6">Notes List</h2>

          {notes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note) => (
                <div
                  key={note._id}
                  className="border border-green-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="bg-green-50 p-4 border-b border-green-200">
                    <h3 className="font-semibold text-green-800 truncate">
                      {note.title}
                    </h3>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-600 text-sm h-12 overflow-hidden mb-4">
                      {note.description.length > 100
                        ? `${note.description.substring(0, 100)}...`
                        : note.description}
                    </p>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        {note.pdfUrl && (
                          <span className="flex items-center text-xs text-green-600">
                            <FaFilePdf className="mr-1" /> PDF Attached
                          </span>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <button
                          className="text-green-600 hover:text-green-800 p-2 rounded-full hover:bg-green-100 transition-colors"
                          onClick={() => handleUpdate(note)}
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100 transition-colors"
                          onClick={() => handleView(note)}
                          title="View"
                        >
                          <FaEye />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors"
                          onClick={() => handleDelete(note._id)}
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
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No notes yet
              </h3>
              <p className="text-gray-500 mb-4">
                Get started by creating your first note
              </p>
              <button
                onClick={() => setIsFormVisible(true)}
                className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <FaPlus className="mr-2" /> Create Note
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes;
