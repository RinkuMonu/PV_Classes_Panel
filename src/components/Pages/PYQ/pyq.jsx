import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../../../config/AxiosInstance";
import {
  FaPlus,
  FaTimes,
  FaFilePdf,
} from "react-icons/fa";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TableActionButton from "../../common/TableActionButton";

const Pyq = () => {
  const [pyqs, setPyqs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    exam: "",
    description: "",
    category: "",
    pdf: null,
  });
  const [editingPyq, setEditingPyq] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const formRef = useRef(null);

  // Fetch PYQs
  const fetchPyqs = async () => {
    try {
      const res = await axiosInstance.get("/pyq");
      setPyqs(res.data);
    } catch (error) {
      console.error("Error fetching PYQs:", error);
      toast.error("Failed to load PYQs!");
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
        await axiosInstance.put(`/pyq/${editingPyq._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setEditingPyq(null);
        toast.success("PYQ updated successfully!");
      } else {
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
      toast.error("Something went wrong while saving!");
    }
  };

  // Delete PYQ (with toast confirmation)
  const handleDelete = (id) => {
    toast.info(
      <div>
        <p>Are you sure you want to delete this PYQ?</p>
        <div className="flex space-x-2 mt-2">
          <button
            onClick={async () => {
              try {
                await axiosInstance.delete(`/pyq/${id}`);
                fetchPyqs();
                toast.dismiss();
                toast.success("PYQ deleted successfully!");
              } catch (error) {
                console.error("Error deleting PYQ:", error);
                toast.dismiss();
                toast.error("Failed to delete PYQ!");
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

    // ✅ scroll to form
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // View PDF
  const handleView = async (pyq) => {
    if (!pyq.pdfUrl) {
      toast.info("No PDF available for this PYQ");
      return;
    }

    // Frontend safety: verify the stored PDF exists before navigating away.
    const previewTab = window.open("about:blank", "_blank");
    if (previewTab) previewTab.opener = null;

    try {
      const apiOrigin = new URL(axiosInstance.defaults.baseURL).origin;
      const pdfUrl = new URL(pyq.pdfUrl, `${apiOrigin}/`);

      if (!['http:', 'https:'].includes(pdfUrl.protocol)) {
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
      console.error("Error opening PYQ PDF:", error);
      toast.error("PDF file is unavailable or has been removed.");
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({ exam: "", description: "", category: "", pdf: null });
    setEditingPyq(null);
    setPdfPreview(null);
    setIsFormVisible(false);
  };

  const filteredPyqs = pyqs.filter((pyq) => {
    const search = searchTerm.toLowerCase();
    return (
      pyq.exam?.toLowerCase().includes(search) ||
      pyq.category?.toLowerCase().includes(search) ||
      pyq.description?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* UI-only: keep file errors consistent with the website's shared light toast style. */}
      <ToastContainer position="top-right" autoClose={3000} closeOnClick pauseOnHover theme="light" />
      <div className="max-w-7xl mx-auto">
        {/* UI-only: standardized page header; handlers and rendering logic are unchanged. */}
        <div data-page-icon data-icon-symbol="▧" className="bg-gradient-to-r from-[#204972] to-[#87b105] rounded-xl shadow-lg mb-6 p-6 text-white flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h1 className="text-2xl font-bold">PYQ Management</h1>
            <p className="mt-1 opacity-90">Manage previous year questions</p>
          </div>
          {!isFormVisible && !editingPyq && (
            <button
              onClick={() => setIsFormVisible(true)}
              className="flex items-center bg-[#204972] hover:bg-[#183654] text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FaPlus className="mr-2" /> Add New PYQ
            </button>
          )}
        </div>

        {/* Form Section */}
        {(isFormVisible || editingPyq) && (
          <div ref={formRef} className="bg-white rounded-xl shadow-md p-6 mb-8 border border-green-100">
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
                  {editingPyq ? "Update PYQ" : "Create PYQ"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="border border-gray-300 text-gray-700 hover:bg-gray-100 px-6 py-2 rounded-lg font-medium transition-colors form-cancel-button"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* UI-only: PYQ cards use the shared theme and global action symbols. */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-green-100">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-semibold text-black">PYQ List</h2>
            <div className="relative w-full md:max-w-sm">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search PYQs..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none transition focus:border-[#87b105] focus:ring-1 focus:ring-[#87b105]"
              />
            </div>
          </div>

          {filteredPyqs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPyqs.map((pyq) => (
                <div
                  key={pyq._id}
                  className="flex h-full flex-col overflow-hidden rounded-lg border border-green-200 bg-white transition-shadow hover:shadow-md"
                >
                  <div className="flex flex-1 flex-col p-4">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                        <FaFilePdf className="mr-1" /> PYQ
                      </span>
                      <span className="rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-600">
                        {pyq.category}
                      </span>
                    </div>

                    <h3 className="mb-2 line-clamp-1 font-semibold text-black">
                      {pyq.exam}
                    </h3>
                    <p className="mb-4 line-clamp-3 text-sm text-gray-600">
                      {pyq.description.length > 100
                        ? `${pyq.description.substring(0, 100)}...`
                        : pyq.description}
                    </p>

                    <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                      <div className="flex items-center">
                        {pyq.pdfUrl && (
                          <span className="flex items-center text-xs font-medium text-[#5f7f03]">
                            <FaFilePdf className="mr-1" /> PDF Attached
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <TableActionButton
                          tone="edit"
                          onClick={() => handleUpdate(pyq)}
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </TableActionButton>
                        <TableActionButton
                          tone="view"
                          onClick={() => handleView(pyq)}
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </TableActionButton>
                        <TableActionButton
                          tone="delete"
                          onClick={() => handleDelete(pyq._id)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </TableActionButton>
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
                No PYQs yet
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? "No PYQs match your search" : "Get started by creating your first PYQ"}
              </p>
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
