

// import React, { useEffect, useState } from "react";
// import axiosInstance from "../../../config/AxiosInstance";
// import {
//   FaEdit,
//   FaEye,
//   FaTrash,
//   FaPlus,
//   FaFilePdf,
//   FaSearch,
//   FaFolder,
//   FaBook,
//   FaTimes,
//   FaCloudUploadAlt,
// } from "react-icons/fa";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const Notes = () => {
//   const [notesData, setNotesData] = useState({});
//   const [search, setSearch] = useState("");
//   const [formData, setFormData] = useState({
//     courseName: "",
//     noteTitle: "",
//     title: "",
//     description: "",
//     pdf: null,
//   });
//   const [editingId, setEditingId] = useState(null);
//   const [isFormVisible, setIsFormVisible] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);

//   // ================= FETCH ALL =================
//   const fetchNotes = async () => {
//     try {
//       const res = await axiosInstance.get("/notes");
//       setNotesData(res.data);
//     } catch (err) {
//       toast.error("Failed to fetch notes");
//     }
//   };

//   useEffect(() => {
//     fetchNotes();
//   }, []);

//   // ================= SEARCH =================
//   const handleSearch = async () => {
//     if (!search) return fetchNotes();

//     try {
//       const res = await axiosInstance.get(`/notes/search?q=${search}`);
//       const grouped = {};
//       res.data.forEach((note) => {
//         if (!grouped[note.courseName]) grouped[note.courseName] = {};
//         if (!grouped[note.courseName][note.noteTitle])
//           grouped[note.courseName][note.noteTitle] = [];
//         grouped[note.courseName][note.noteTitle].push(note);
//       });
//       setNotesData(grouped);
//     } catch {
//       toast.error("Search failed");
//     }
//   };

//   // ================= HANDLE CHANGE =================
//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === "pdf") {
//       setFormData({ ...formData, pdf: files[0] });
//       setSelectedFile(files[0]);
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   // ================= CREATE / UPDATE =================
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const data = new FormData();
//       data.append("courseName", formData.courseName);
//       data.append("noteTitle", formData.noteTitle);
//       data.append("title", formData.title);
//       data.append("description", formData.description);

//       if (formData.pdf) {
//         data.append("pdf", formData.pdf);
//       }

//       if (editingId) {
//         await axiosInstance.put(`/notes/${editingId}`, data, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//         toast.success("Note updated successfully!");
//       } else {
//         await axiosInstance.post("/notes", data, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//         toast.success("Note created successfully!");
//       }

//       setFormData({
//         courseName: "",
//         noteTitle: "",
//         title: "",
//         description: "",
//         pdf: null,
//       });
//       setSelectedFile(null);
//       setEditingId(null);
//       setIsFormVisible(false);
//       fetchNotes();
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to save note!");
//     }
//   };

//   // ================= DELETE =================
//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this note?")) {
//       try {
//         await axiosInstance.delete(`/notes/${id}`);
//         toast.success("Deleted successfully");
//         fetchNotes();
//       } catch {
//         toast.error("Delete failed");
//       }
//     }
//   };

//   // ================= VIEW PDF =================
//   // const handleView = (pdfUrl) => {
//   //   window.open(`http://localhost:5006/${pdfUrl}`, "_blank");
//   // };

//   const handleView = (pdfUrl) => {
//     const baseURL = import.meta.env.VITE_API_SERVER_URL;
//     window.open(`${baseURL}/${pdfUrl}`, "_blank");
//   };

//   // ================= EDIT =================
//   const handleEdit = (note) => {
//     setFormData({
//       courseName: note.courseName,
//       noteTitle: note.noteTitle,
//       title: note.title,
//       description: note.description,
//       pdf: null,
//     });
//     setSelectedFile(null);
//     setEditingId(note._id);
//     setIsFormVisible(true);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   // ================= CANCEL FORM =================
//   const handleCancel = () => {
//     setFormData({
//       courseName: "",
//       noteTitle: "",
//       title: "",
//       description: "",
//       pdf: null,
//     });
//     setSelectedFile(null);
//     setEditingId(null);
//     setIsFormVisible(false);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-6 md:p-8">
//       <ToastContainer position="top-right" autoClose={3000} />

//       {/* Header Section */}
//       <div className="mb-8">
//         <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-emerald-600 mb-2">
//           📚 Notes Management
//         </h1>
//         <p className="text-gray-600">Organize and manage your course notes efficiently</p>
//       </div>

//       {/* Search and Add Section */}
//       <div className="flex flex-col md:flex-row gap-4 mb-8">
//         <div className="flex-1 flex">
//           <div className="relative flex-1">
//             <input
//               type="text"
//               placeholder="Search notes by title, course, or description..."
//               className="w-full pl-12 pr-4 py-3 rounded-l-lg border-2 border-green-200 focus:border-green-500 focus:outline-none transition shadow-sm"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
//             />
//             <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-400" />
//           </div>
//           <button
//             onClick={handleSearch}
//             className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-r-lg hover:from-green-700 hover:to-emerald-700 transition shadow-md flex items-center gap-2"
//           >
//             Search
//           </button>
//         </div>

//         <button
//           onClick={() => setIsFormVisible(!isFormVisible)}
//           className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition shadow-md flex items-center gap-2 justify-center md:w-auto"
//         >
//           {isFormVisible ? (
//             <>
//               <FaTimes /> Close Form
//             </>
//           ) : (
//             <>
//               <FaPlus /> Add New Note
//             </>
//           )}
//         </button>
//       </div>

//       {/* Form Section */}
//       {isFormVisible && (
//         <div className="mb-10 bg-white rounded-xl shadow-xl p-6 border-l-4 border-green-500 animate-fadeIn">
//           <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
//             {editingId ? (
//               <>
//                 <FaEdit className="text-green-600" /> Edit Note
//               </>
//             ) : (
//               <>
//                 <FaPlus className="text-green-600" /> Create New Note
//               </>
//             )}
//           </h2>

//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Course Name
//                 </label>
//                 <input
//                   name="courseName"
//                   placeholder="e.g., Computer Science"
//                   value={formData.courseName}
//                   onChange={handleChange}
//                   className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-green-500 focus:outline-none transition"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Note Title Group
//                 </label>
//                 <input
//                   name="noteTitle"
//                   placeholder="e.g., Chapter 1"
//                   value={formData.noteTitle}
//                   onChange={handleChange}
//                   className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-green-500 focus:outline-none transition"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Actual Note Title
//                 </label>
//                 <input
//                   name="title"
//                   placeholder="e.g., Introduction to Programming"
//                   value={formData.title}
//                   onChange={handleChange}
//                   className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-green-500 focus:outline-none transition"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   PDF File
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="file"
//                     name="pdf"
//                     accept="application/pdf"
//                     onChange={handleChange}
//                     className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-green-500 focus:outline-none transition file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
//                   />
//                   {selectedFile && (
//                     <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-green-600">
//                       {selectedFile.name}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Description
//               </label>
//               <textarea
//                 name="description"
//                 placeholder="Write a detailed description of the note..."
//                 value={formData.description}
//                 onChange={handleChange}
//                 rows="4"
//                 className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-green-500 focus:outline-none transition resize-none"
//                 required
//               />
//             </div>

//             <div className="flex gap-3 pt-4">
//               <button
//                 type="submit"
//                 className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition shadow-md flex items-center gap-2"
//               >
//                 {editingId ? (
//                   <>
//                     <FaEdit /> Update Note
//                   </>
//                 ) : (
//                   <>
//                     <FaCloudUploadAlt /> Create Note
//                   </>
//                 )}
//               </button>

//               <button
//                 type="button"
//                 onClick={handleCancel}
//                 className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition shadow-md flex items-center gap-2"
//               >
//                 <FaTimes /> Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* Display Grouped Data */}
//       {Object.keys(notesData).length > 0 ? (
//         Object.keys(notesData).map((course) => (
//           <div key={course} className="mb-10 animate-slideIn">
//             <div className="flex items-center gap-3 mb-4">
//               <FaBook className="text-3xl text-green-600" />
//               <h2 className="text-2xl font-bold text-gray-800">{course}</h2>
//               <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
//                 {Object.keys(notesData[course]).reduce((acc, group) => acc + notesData[course][group].length, 0)} notes
//               </span>
//             </div>

//             {Object.keys(notesData[course]).map((group) => (
//               <div key={group} className="mb-6 bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
//                 <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-3 border-b border-green-100">
//                   <h3 className="font-semibold text-lg text-gray-700 flex items-center gap-2">
//                     <FaFolder className="text-green-600" />
//                     {group}
//                   </h3>
//                 </div>

//                 <div className="p-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {notesData[course][group].map((note) => (
//                       <div
//                         key={note._id}
//                         className="group border border-gray-200 rounded-xl p-5 hover:shadow-xl transition-all duration-300 hover:border-green-300 hover:scale-105 bg-white"
//                       >
//                         <div className="flex items-start justify-between mb-3">
//                           <h4 className="font-bold text-lg text-gray-800 group-hover:text-green-700 transition">
//                             {note.title}
//                           </h4>
//                           <FaFilePdf className="text-red-500 text-xl" />
//                         </div>

//                         <p className="text-sm text-gray-600 mb-4 line-clamp-2">
//                           {note.description}
//                         </p>

//                         <div className="flex items-center justify-between pt-3 border-t border-gray-100">
//                           <button
//                             onClick={() => handleView(note.pdfUrl)}
//                             className="text-blue-600 hover:text-blue-800 transition p-2 hover:bg-blue-50 rounded-full"
//                             title="View PDF"
//                           >
//                             <FaEye size={18} />
//                           </button>
//                           <button
//                             onClick={() => handleEdit(note)}
//                             className="text-green-600 hover:text-green-800 transition p-2 hover:bg-green-50 rounded-full"
//                             title="Edit"
//                           >
//                             <FaEdit size={18} />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(note._id)}
//                             className="text-red-600 hover:text-red-800 transition p-2 hover:bg-red-50 rounded-full"
//                             title="Delete"
//                           >
//                             <FaTrash size={18} />
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ))
//       ) : (
//         <div className="text-center py-16 bg-white rounded-xl shadow-md">
//           <FaBook className="text-6xl text-green-300 mx-auto mb-4" />
//           <p className="text-gray-500 text-lg">No notes found. Create your first note!</p>
//         </div>
//       )}

//       {/* Add custom animations */}
//       <style jsx>{`
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(-10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
        
//         @keyframes slideIn {
//           from { opacity: 0; transform: translateX(-20px); }
//           to { opacity: 1; transform: translateX(0); }
//         }
        
//         .animate-fadeIn {
//           animation: fadeIn 0.3s ease-out;
//         }
        
//         .animate-slideIn {
//           animation: slideIn 0.3s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Notes;


import React, { useEffect, useState } from "react";
import axiosInstance from "../../../config/AxiosInstance";
import {
  FaEdit,
  FaEye,
  FaTrash,
  FaPlus,
  FaFilePdf,
  FaSearch,
  FaFolder,
  FaBook,
  FaTimes,
  FaCloudUploadAlt,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Notes = () => {
  const [notesData, setNotesData] = useState({});
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    course: "",   // 🔥 changed
    noteTitle: "",
    title: "",
    description: "",
    isFree: false,
    pdf: null,
  });

  const [editingId, setEditingId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  // ================= FETCH COURSES =================
  const fetchCourses = async () => {
    try {
      const res = await axiosInstance.get("/courses");
      setCourses(res.data);
    } catch {
      toast.error("Failed to fetch courses");
    }
  };

  // ================= FETCH NOTES =================
  const fetchNotes = async () => {
    try {
      const res = await axiosInstance.get("/notes");

      // 🔥 Transform array → grouped
      const grouped = {};
      res.data.forEach((note) => {
        const courseTitle = note.course?.title || "Unknown";
        const groupName = note.noteTitle || "General";

        if (!grouped[courseTitle]) grouped[courseTitle] = {};
        if (!grouped[courseTitle][groupName])
          grouped[courseTitle][groupName] = [];

        grouped[courseTitle][groupName].push(note);
      });

      setNotesData(grouped);
    } catch {
      toast.error("Failed to fetch notes");
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchNotes();
  }, []);

  // ================= HANDLE CHANGE =================
  // const handleChange = (e) => {
  //   const { name, value, files, type, checked } = e.target;

  //   if (type === "file") {
  //     setFormData({ ...formData, pdf: files[0] });
  //   } else if (type === "checkbox") {
  //     setFormData({ ...formData, [name]: checked });
  //   } else {
  //     setFormData({ ...formData, [name]: value });
  //   }
  // };

  const handleChange = (e) => {
  const { name, value, files, type, checked } = e.target;

  if (type === "file") {
    setFormData({ ...formData, pdf: files[0] }); // 🔥 only files[0]
  } else if (type === "checkbox") {
    setFormData({ ...formData, [name]: checked });
  } else {
    setFormData({ ...formData, [name]: value });
  }
};

  // ================= CREATE / UPDATE =================
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const data = new FormData();
  //     data.append("course", formData.course);
  //     data.append("noteTitle", formData.noteTitle);
  //     data.append("title", formData.title);
  //     data.append("description", formData.description);
  //     data.append("isFree", formData.isFree);

  //     if (formData.pdf) data.append("pdf", formData.pdf);

  //     if (editingId) {
  //       await axiosInstance.put(`/notes/${editingId}`, data);
  //       toast.success("Updated successfully");
  //     } else {
  //       await axiosInstance.post("/notes", data);
  //       toast.success("Created successfully");
  //     }

  //     setFormData({
  //       course: "",
  //       noteTitle: "",
  //       title: "",
  //       description: "",
  //       isFree: false,
  //       pdf: null,
  //     });

  //     setEditingId(null);
  //     setIsFormVisible(false);
  //     fetchNotes();

  //   } catch (err) {
  //     toast.error("Save failed");
  //   }
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const data = new FormData();

    data.append("course", formData.course);
    data.append("noteTitle", formData.noteTitle);
    data.append("title", formData.title);
    data.append("description", formData.description);

    // 🔥 Boolean fix
    data.append("isFree", formData.isFree === true);

    // 🔥 VERY IMPORTANT (file check)
    if (formData.pdf instanceof File) {
      data.append("pdf", formData.pdf);
    }

    if (editingId) {
      await axiosInstance.put(`/notes/${editingId}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Updated successfully");
    } else {
      await axiosInstance.post("/notes", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Created successfully");
    }

    setFormData({
      course: "",
      noteTitle: "",
      title: "",
      description: "",
      isFree: false,
      pdf: null,
    });

    setEditingId(null);
    setIsFormVisible(false);
    fetchNotes();

  } catch (error) {
    console.error(error);
    toast.error("Save failed");
  }
};

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this note?")) return;

    try {
      await axiosInstance.delete(`/notes/${id}`);
      toast.success("Deleted");
      fetchNotes();
    } catch {
      toast.error("Delete failed");
    }
  };

  // ================= EDIT =================
  const handleEdit = (note) => {
    setFormData({
      course: note.course?._id,
      noteTitle: note.noteTitle,
      title: note.title,
      description: note.description,
      isFree: note.isFree,
      pdf: null,
    });
    setEditingId(note._id);
    setIsFormVisible(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="p-6">
      <ToastContainer />

      <h1 className="text-2xl font-bold mb-4">Notes Management</h1>

      <div className="mb-6">
  <button
    onClick={() => setIsFormVisible(!isFormVisible)}
    className="bg-green-600 text-white px-5 py-2 rounded-lg"
  >
    {isFormVisible ? "Close Form" : "Add New Note"}
  </button>
</div>

      {/* ================= FORM ================= */}
      {isFormVisible && (
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">

          {/* 🔥 Course Dropdown */}
          <select
            name="course"
            value={formData.course}
            onChange={handleChange}
            required
            className="border p-2 w-full"
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>

          <input
            name="noteTitle"
            placeholder="Group (Unit 1)"
            value={formData.noteTitle}
            onChange={handleChange}
            required
            className="border p-2 w-full"
          />

          <input
            name="title"
            placeholder="Note Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="border p-2 w-full"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
            className="border p-2 w-full"
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isFree"
              checked={formData.isFree}
              onChange={handleChange}
            />
            Free Note
          </label>

          <input
            type="file"
            name="pdf"
            accept="application/pdf"
            onChange={handleChange}
          />

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {editingId ? "Update" : "Create"}
          </button>
        </form>
      )}

      {/* ================= DISPLAY ================= */}
      {Object.keys(notesData).map((course) => (
        <div key={course} className="mb-6">
          <h2 className="font-bold text-lg mb-2">{course}</h2>

          {Object.keys(notesData[course]).map((group) => (
            <div key={group} className="mb-4">
              <h3 className="font-semibold">{group}</h3>

              {notesData[course][group].map((note) => (
                <div key={note._id} className="border p-3 mb-2 rounded flex justify-between">
                  <div>
                    <p className="font-semibold">{note.title}</p>
                    <p className="text-sm text-gray-500">{note.description}</p>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => window.open(note.full_pdf)}>
                      <FaEye />
                    </button>
                    <button onClick={() => handleEdit(note)}>
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(note._id)}>
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Notes;