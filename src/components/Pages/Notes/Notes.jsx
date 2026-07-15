
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
//   const [courses, setCourses] = useState([]);
//   const [search, setSearch] = useState("");

//   const [formData, setFormData] = useState({
//     course: "",
//     noteTitle: "",
//     title: "",
//     description: "",
//     isFree: false,
//     pdf: null,
//   });

//   const [editingId, setEditingId] = useState(null);
//   const [isFormVisible, setIsFormVisible] = useState(false);

//   // ================= FETCH COURSES =================
//   const fetchCourses = async () => {
//     try {
//       const res = await axiosInstance.get("/courses");
//       setCourses(res.data);
//     } catch {
//       toast.error("Failed to fetch courses");
//     }
//   };

//   // ================= FETCH NOTES =================
//   const fetchNotes = async () => {
//     try {
//       const res = await axiosInstance.get("/notes");

//       // 🔥 Transform array → grouped
//       const grouped = {};
//       res.data.forEach((note) => {
//         const courseTitle = note.course?.title || "Unknown";
//         const groupName = note.noteTitle || "General";

//         if (!grouped[courseTitle]) grouped[courseTitle] = {};
//         if (!grouped[courseTitle][groupName])
//           grouped[courseTitle][groupName] = [];

//         grouped[courseTitle][groupName].push(note);
//       });

//       setNotesData(grouped);
//     } catch {
//       toast.error("Failed to fetch notes");
//     }
//   };

//   useEffect(() => {
//     fetchCourses();
//     fetchNotes();
//   }, []);

//   // ================= HANDLE CHANGE =================
//   // const handleChange = (e) => {
//   //   const { name, value, files, type, checked } = e.target;

//   //   if (type === "file") {
//   //     setFormData({ ...formData, pdf: files[0] });
//   //   } else if (type === "checkbox") {
//   //     setFormData({ ...formData, [name]: checked });
//   //   } else {
//   //     setFormData({ ...formData, [name]: value });
//   //   }
//   // };

//   const handleChange = (e) => {
//   const { name, value, files, type, checked } = e.target;

//   if (type === "file") {
//     setFormData({ ...formData, pdf: files[0] }); // 🔥 only files[0]
//   } else if (type === "checkbox") {
//     setFormData({ ...formData, [name]: checked });
//   } else {
//     setFormData({ ...formData, [name]: value });
//   }
// };

//   // ================= CREATE / UPDATE =================
//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();

//   //   try {
//   //     const data = new FormData();
//   //     data.append("course", formData.course);
//   //     data.append("noteTitle", formData.noteTitle);
//   //     data.append("title", formData.title);
//   //     data.append("description", formData.description);
//   //     data.append("isFree", formData.isFree);

//   //     if (formData.pdf) data.append("pdf", formData.pdf);

//   //     if (editingId) {
//   //       await axiosInstance.put(`/notes/${editingId}`, data);
//   //       toast.success("Updated successfully");
//   //     } else {
//   //       await axiosInstance.post("/notes", data);
//   //       toast.success("Created successfully");
//   //     }

//   //     setFormData({
//   //       course: "",
//   //       noteTitle: "",
//   //       title: "",
//   //       description: "",
//   //       isFree: false,
//   //       pdf: null,
//   //     });

//   //     setEditingId(null);
//   //     setIsFormVisible(false);
//   //     fetchNotes();

//   //   } catch (err) {
//   //     toast.error("Save failed");
//   //   }
//   // };

//   const handleSubmit = async (e) => {
//   e.preventDefault();

//   try {
//     const data = new FormData();

//     data.append("course", formData.course);
//     data.append("noteTitle", formData.noteTitle);
//     data.append("title", formData.title);
//     data.append("description", formData.description);

//     // 🔥 Boolean fix
//     data.append("isFree", formData.isFree === true);

//     // 🔥 VERY IMPORTANT (file check)
//     if (formData.pdf instanceof File) {
//       data.append("pdf", formData.pdf);
//     }

//     if (editingId) {
//       await axiosInstance.put(`/notes/${editingId}`, data, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       toast.success("Updated successfully");
//     } else {
//       await axiosInstance.post("/notes", data, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
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

//   } catch (error) {
//     console.error(error);
//     toast.error("Save failed");
//   }
// };

//   // ================= DELETE =================
//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this note?")) return;

//     try {
//       await axiosInstance.delete(`/notes/${id}`);
//       toast.success("Deleted");
//       fetchNotes();
//     } catch {
//       toast.error("Delete failed");
//     }
//   };

//   // ================= EDIT =================
//   const handleEdit = (note) => {
//     setFormData({
//       course: note.course?._id,
//       noteTitle: note.noteTitle,
//       title: note.title,
//       description: note.description,
//       isFree: note.isFree,
//       pdf: null,
//     });
//     setEditingId(note._id);
//     setIsFormVisible(true);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   return (
//     <div className="p-6">
//       <ToastContainer />

//       <h1 className="text-2xl font-bold mb-4">Notes Management</h1>

//       <div className="mb-6">
//   <button
//     onClick={() => setIsFormVisible(!isFormVisible)}
//     className="bg-green-600 text-white px-5 py-2 rounded-lg"
//   >
//     {isFormVisible ? "Close Form" : "Add New Note"}
//   </button>
// </div>

//       {/* ================= FORM ================= */}
//       {isFormVisible && (
//         <form onSubmit={handleSubmit} className="space-y-4 mb-8">

//           {/* 🔥 Course Dropdown */}
//           <select
//             name="course"
//             value={formData.course}
//             onChange={handleChange}
//             required
//             className="border p-2 w-full"
//           >
//             <option value="">Select Course</option>
//             {courses.map((course) => (
//               <option key={course._id} value={course._id}>
//                 {course.title}
//               </option>
//             ))}
//           </select>

//           <input
//             name="noteTitle"
//             placeholder="Group (Unit 1)"
//             value={formData.noteTitle}
//             onChange={handleChange}
//             required
//             className="border p-2 w-full"
//           />

//           <input
//             name="title"
//             placeholder="Note Title"
//             value={formData.title}
//             onChange={handleChange}
//             required
//             className="border p-2 w-full"
//           />

//           <textarea
//             name="description"
//             placeholder="Description"
//             value={formData.description}
//             onChange={handleChange}
//             required
//             className="border p-2 w-full"
//           />

//           <label className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               name="isFree"
//               checked={formData.isFree}
//               onChange={handleChange}
//             />
//             Free Note
//           </label>

//           <input
//             type="file"
//             name="pdf"
//             accept="application/pdf"
//             onChange={handleChange}
//           />

//           <button
//             type="submit"
//             className="bg-green-600 text-white px-4 py-2 rounded"
//           >
//             {editingId ? "Update" : "Create"}
//           </button>
//         </form>
//       )}

//       {/* ================= DISPLAY ================= */}
//       {Object.keys(notesData).map((course) => (
//         <div key={course} className="mb-6">
//           <h2 className="font-bold text-lg mb-2">{course}</h2>

//           {Object.keys(notesData[course]).map((group) => (
//             <div key={group} className="mb-4">
//               <h3 className="font-semibold">{group}</h3>

//               {notesData[course][group].map((note) => (
//                 <div key={note._id} className="border p-3 mb-2 rounded flex justify-between">
//                   <div>
//                     <p className="font-semibold">{note.title}</p>
//                     <p className="text-sm text-gray-500">{note.description}</p>
//                   </div>

//                   <div className="flex gap-3">
//                     <button onClick={() => window.open(note.full_pdf)}>
//                       <FaEye />
//                     </button>
//                     <button onClick={() => handleEdit(note)}>
//                       <FaEdit />
//                     </button>
//                     <button onClick={() => handleDelete(note._id)}>
//                       <FaTrash />
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ))}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Notes;

import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../../../config/AxiosInstance";
import {
  FaEdit,
  FaPlus,
  FaFilePdf,
  FaSearch,
  FaFolder,
  FaBook,
  FaTimes,
  FaCloudUploadAlt,
  FaChevronDown,
  FaChevronUp,
  FaLock,
  FaLockOpen,
} from "react-icons/fa";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import TableActionButton from "../../common/TableActionButton";

const Notes = () => {
  const [notesData, setNotesData] = useState({});
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [expandedCourses, setExpandedCourses] = useState({});
  const [expandedGroups, setExpandedGroups] = useState({});
  
  // Ref for form scroll
  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    course: "",
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
      
      // Initialize expanded states
      const initialExpandedCourses = {};
      const initialExpandedGroups = {};
      Object.keys(grouped).forEach(course => {
        initialExpandedCourses[course] = true;
        Object.keys(grouped[course]).forEach(group => {
          if (!initialExpandedGroups[course]) initialExpandedGroups[course] = {};
          initialExpandedGroups[course][group] = true;
        });
      });
      setExpandedCourses(initialExpandedCourses);
      setExpandedGroups(initialExpandedGroups);
    } catch {
      toast.error("Failed to fetch notes");
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchNotes();
  }, []);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;

    if (type === "file") {
      setFormData({ ...formData, pdf: files[0] });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ================= CREATE / UPDATE =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("course", formData.course);
      data.append("noteTitle", formData.noteTitle);
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("isFree", formData.isFree === true);

      if (formData.pdf instanceof File) {
        data.append("pdf", formData.pdf);
      }

      if (editingId) {
        await axiosInstance.put(`/notes/${editingId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        
        // Success message with animation
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Note has been updated successfully.',
          timer: 2000,
          showConfirmButton: false,
          background: '#ffffff',
          iconColor: '#10b981',
        });
        
      } else {
        await axiosInstance.post("/notes", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        
        Swal.fire({
          icon: 'success',
          title: 'Created!',
          text: 'Note has been created successfully.',
          timer: 2000,
          showConfirmButton: false,
          background: '#ffffff',
          iconColor: '#10b981',
        });
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
      
      Swal.fire({
        icon: 'error',
        title: 'Failed!',
        text: 'Save failed. Please try again.',
        background: '#ffffff',
        iconColor: '#ef4444',
        confirmButtonColor: '#10b981',
      });
    }
  };

  // ================= DELETE WITH SWEETALERT =================
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      background: '#ffffff',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/notes/${id}`);
        
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Note has been deleted successfully.',
          timer: 2000,
          showConfirmButton: false,
          background: '#ffffff',
          iconColor: '#10b981',
        });
        
        fetchNotes();
      } catch {
        Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: 'Delete failed. Please try again.',
          background: '#ffffff',
          iconColor: '#ef4444',
          confirmButtonColor: '#10b981',
        });
      }
    }
  };

  // ================= VIEW PDF SAFELY =================
  const handleViewPdf = async (note) => {
    if (!note.full_pdf) {
      toast.info("No PDF available for this note");
      return;
    }

    // Frontend safety: check the existing Notes file before opening a preview tab.
    const previewTab = window.open("about:blank", "_blank");
    if (previewTab) previewTab.opener = null;

    try {
      const apiOrigin = new URL(axiosInstance.defaults.baseURL).origin;
      const pdfUrl = new URL(note.full_pdf, `${apiOrigin}/`);

      if (!["http:", "https:"].includes(pdfUrl.protocol)) {
        throw new Error("Unsupported PDF URL");
      }

      const response = await fetch(pdfUrl.href, { method: "HEAD" });
      if (!response.ok) {
        throw new Error(`PDF unavailable (${response.status})`);
      }

      if (previewTab) {
        previewTab.location.replace(pdfUrl.href);
      } else {
        window.open(pdfUrl.href, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      previewTab?.close();
      console.error("Error opening Notes PDF:", error);
      toast.error("PDF file is unavailable or has been removed.");
    }
  };

  // ================= EDIT WITH AUTO SCROLL =================
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
    
    // Auto scroll to form with smooth behavior
    setTimeout(() => {
      formRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  };

  // ================= TOGGLE FUNCTIONS =================
  const toggleCourse = (course) => {
    setExpandedCourses(prev => ({
      ...prev,
      [course]: !prev[course]
    }));
  };

  const toggleGroup = (course, group) => {
    setExpandedGroups(prev => ({
      ...prev,
      [course]: {
        ...prev[course],
        [group]: !prev[course]?.[group]
      }
    }));
  };

  // Filter notes based on search
  const filterNotes = () => {
    if (!search) return notesData;
    
    const filtered = {};
    Object.keys(notesData).forEach(course => {
      Object.keys(notesData[course]).forEach(group => {
        const filteredNotes = notesData[course][group].filter(note =>
          note.title.toLowerCase().includes(search.toLowerCase()) ||
          note.description.toLowerCase().includes(search.toLowerCase())
        );
        if (filteredNotes.length > 0) {
          if (!filtered[course]) filtered[course] = {};
          filtered[course][group] = filteredNotes;
        }
      });
    });
    return filtered;
  };

  const displayedNotes = filterNotes();
  const displayedNoteCount = Object.values(displayedNotes).reduce(
    (acc, course) =>
      acc + Object.values(course).reduce((sum, notes) => sum + notes.length, 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* UI-only: use the shared light toast presentation instead of a full-color error card. */}
      <ToastContainer position="top-right" autoClose={3000} closeOnClick pauseOnHover theme="light" />
      
      {/* UI-only redesign: modern Notes page shell, no data/API logic changed. */}
      <div className="max-w-7xl mx-auto">
        {/* UI-only: standardized page header; notes logic is unchanged. */}
        <div className="bg-gradient-to-r from-[#204972] to-[#87b105] rounded-xl shadow-lg mb-6 p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              {/* UI-only: direct title icon uses the shared page-header tile styling. */}
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <FaBook /> Notes Management
              </h1>
              <p className="mt-1 opacity-90">Organize and manage your course notes efficiently</p>
            </div>
            
            <div className="flex gap-3">
              {/* <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full md:w-64"
                />
              </div> */}
              
              <button
                onClick={() => {
                  setIsFormVisible(!isFormVisible);
                  if (!isFormVisible) {
                    setEditingId(null);
                    setFormData({
                      course: "",
                      noteTitle: "",
                      title: "",
                      description: "",
                      isFree: false,
                      pdf: null,
                    });
                    // Scroll to form when opening
                    setTimeout(() => {
                      formRef.current?.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                      });
                    }, 100);
                  }
                }}
                className={`flex items-center gap-2 rounded-md px-6 py-2 transition-all duration-300  ${
                  isFormVisible 
                    ? 'bg-red-600 text-white' 
                    : 'bg-[#204972] hover:bg-[#183654] text-white shadow-sm'
                }`}
              >
                {isFormVisible ? (
                  <>
                    <FaTimes /> Close Form
                  </>
                ) : (
                  <>
                    <FaPlus /> Add New Note
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ================= FORM WITH REF ================= */}
        {isFormVisible && (
          <div ref={formRef} className="mb-8 scroll-mt-4 rounded-lg border border-[#87b105]/30 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaCloudUploadAlt className="text-green-600" />
              {editingId ? (
                <>
                  <FaEdit className="text-green-600" /> Edit Note
                </>
              ) : (
                <>
                  <FaPlus className="text-green-600" /> Create New Note
                </>
              )}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Course Dropdown */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Course</label>
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select Course</option>
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Group Name */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Group (Unit/Chapter)</label>
                  <input
                    name="noteTitle"
                    placeholder="e.g., Unit 1, Chapter 1"
                    value={formData.noteTitle}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Note Title */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Note Title</label>
                  <input
                    name="title"
                    placeholder="Enter note title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Free Note Checkbox */}
                <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isFree"
                      checked={formData.isFree}
                      onChange={handleChange}
                      className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                    />
                    <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      {formData.isFree ? <FaLockOpen className="text-green-600" /> : <FaLock className="text-gray-400" />}
                      Free Note (Available to all users)
                    </span>
                  </label>
                </div>

                {/* Description - Full Width */}
                <div className="md:col-span-2 space-y-1">
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    placeholder="Enter note description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* File Upload */}
                <div className="md:col-span-2 space-y-1">
                  <label className="text-sm font-medium text-gray-700">PDF File</label>
                  <div className="border-2 border-dashed  rounded-lg p-4 text-center border-[#87b105] hover:bg-[#EEF7E0] transition-colors">
                    <input
                      type="file"
                      name="pdf"
                      accept="application/pdf"
                      onChange={handleChange}
                      className="hidden"
                      id="pdf-upload"
                    />
                    <label htmlFor="pdf-upload" className="cursor-pointer">
                      <FaCloudUploadAlt className="mx-auto text-3xl text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        {formData.pdf ? formData.pdf.name : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">PDF files only (Max 10MB)</p>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-md bg-[#204972] px-6 py-2 text-white shadow-sm transition-all duration-300"
                >
                  {editingId ? (
                    <>
                      <FaEdit /> Update Note
                    </>
                  ) : (
                    <>
                      <FaPlus /> Create Note
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => setIsFormVisible(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg transition-all duration-300 form-cancel-button"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= STATS CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="rounded-lg border border-green-100 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Total Courses</p>
            <p className="text-2xl font-bold text-gray-800">{Object.keys(notesData).length}</p>
          </div>
          <div className="rounded-lg border border-green-100 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Total Groups</p>
            <p className="text-2xl font-bold text-gray-800">
              {Object.values(notesData).reduce((acc, course) => acc + Object.keys(course).length, 0)}
            </p>
          </div>
          <div className="rounded-lg border border-green-100 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Total Notes</p>
            <p className="text-2xl font-bold text-gray-800">
              {Object.values(notesData).reduce((acc, course) => 
                acc + Object.values(course).reduce((sum, notes) => sum + notes.length, 0), 0
              )}
            </p>
          </div>
          <div className="rounded-lg border border-green-100 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Free Notes</p>
            <p className="text-2xl font-bold text-gray-800">
              {Object.values(notesData).reduce((acc, course) => 
                acc + Object.values(course).reduce((sum, notes) => 
                  sum + notes.filter(note => note.isFree).length, 0), 0
              )}
            </p>
          </div>
        </div>

        {/* ================= SEARCH BAR ================= */}
        <div className="mb-6 rounded-lg border border-green-100 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Browse Notes</h2>
              <p className="text-sm text-gray-500">
                {search
                  ? `${displayedNoteCount} note${displayedNoteCount === 1 ? "" : "s"} found`
                  : "Search by note title or description"}
              </p>
            </div>

            <div className="relative w-full md:max-w-sm">
              <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-10 text-sm text-gray-800 outline-none transition focus:border-[#87b105] focus:bg-white focus:ring-2 focus:ring-[#87b105]/20"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                  title="Clear search"
                >
                  <FaTimes className="text-xs" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ================= DISPLAY ================= */}
        {Object.keys(displayedNotes).length === 0 ? (
          <div className="rounded-lg border border-green-100 bg-white p-12 text-center shadow-sm">
            <FaBook className="mx-auto text-6xl text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Notes Found</h3>
            <p className="text-gray-500 mb-4">
              {search ? 'No notes match your search criteria' : 'Start by adding your first note'}
            </p>
            {!search && (
              <button
                onClick={() => {
                  setIsFormVisible(true);
                  setTimeout(() => {
                    formRef.current?.scrollIntoView({ 
                      behavior: 'smooth', 
                      block: 'start' 
                    });
                  }, 100);
                }}
                className="inline-flex items-center gap-2 rounded-md bg-[#87b105] px-6 py-2 text-white transition-all duration-300 hover:scale-105"
              >
                <FaPlus /> Add Your First Note
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {Object.keys(displayedNotes).map((course) => (
              <div key={course} className="overflow-hidden rounded-lg border border-green-100 bg-white shadow-sm">
                {/* UI-only redesign: soft course accordion header matching project theme. */}
                <div 
                  className="cursor-pointer border-b border-[#204972]/20 bg-[#EEF4FA] px-6 py-4"
                  onClick={() => toggleCourse(course)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FaFolder className="text-[#204972] text-xl" />
                      <h2 className="font-bold text-lg text-gray-900">{course}</h2>
                      <span className="rounded-full bg-white px-2 py-1 text-sm text-[#5f7f03]">
                        {Object.keys(displayedNotes[course]).length} groups
                      </span>
                    </div>
                    {expandedCourses[course] ? (
                      <FaChevronUp className="text-[#204972]" />
                    ) : (
                      <FaChevronDown className="text-[#204972]" />
                    )}
                  </div>
                </div>

                {/* Course Content */}
                {expandedCourses[course] && (
                  <div className="p-4 space-y-3">
                    {Object.keys(displayedNotes[course]).map((group) => (
                      <div key={group} className="overflow-hidden rounded-lg border border-gray-100">
                        {/* Group Header */}
                        <div 
                          className="cursor-pointer bg-gray-50 px-4 py-3 transition-colors hover:bg-[#EEF4FA]/60"
                          onClick={() => toggleGroup(course, group)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FaBook className="text-[#87b105] text-sm" />
                              <h3 className="font-semibold text-gray-700">{group}</h3>
                              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                                {displayedNotes[course][group].length} notes
                              </span>
                            </div>
                            {expandedGroups[course]?.[group] ? (
                              <FaChevronUp className="text-gray-500 text-sm" />
                            ) : (
                              <FaChevronDown className="text-gray-500 text-sm" />
                            )}
                          </div>
                        </div>

                        {/* Notes List */}
                        {expandedGroups[course]?.[group] && (
                          <div className="divide-y divide-gray-100">
                            {displayedNotes[course][group].map((note) => (
                              <div key={note._id} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <FaFilePdf className="text-red-500" />
                                      <p className="font-semibold text-gray-800">{note.title}</p>
                                      {note.isFree ? (
                                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                          <FaLockOpen className="text-xs" /> Free
                                        </span>
                                      ) : (
                                        <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                          <FaLock className="text-xs" /> Premium
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-500 mb-2">{note.description}</p>
                                  </div>

                                  <div className="flex gap-2">
                                    <TableActionButton
                                      tone="view"
                                      onClick={() => handleViewPdf(note)}
                                      title="View PDF"
                                    >
                                      <Eye className="h-4 w-4" />
                                    </TableActionButton>
                                    <TableActionButton
                                      tone="edit"
                                      onClick={() => handleEdit(note)}
                                      title="Edit"
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </TableActionButton>
                                    <TableActionButton
                                      tone="delete"
                                      onClick={() => handleDelete(note._id)}
                                      title="Delete"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </TableActionButton>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
