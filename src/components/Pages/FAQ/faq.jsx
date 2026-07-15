import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../../../config/AxiosInstance";
import {
  FaPlus,
  FaTimes,
  FaQuestionCircle,
} from "react-icons/fa";
import { Eye, FileQuestionMark, Pencil, Trash2 } from "lucide-react";

// ✅ Import Toast
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TableActionButton from "../../common/TableActionButton";

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
  });
  const [editingFaq, setEditingFaq] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const formRef = useRef(null);

  // For viewing single FAQ
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  // ✅ Fetch FAQs
  const fetchFaqs = async () => {
    try {
      const res = await axiosInstance.get("/faq");
      if (res.data && res.data.success) {
        setFaqs(res.data.faqs);
      } else {
        setFaqs([]);
      }
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      toast.error("Failed to load FAQs!");
      setFaqs([]);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ Submit (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingFaq) {
        await axiosInstance.put(`/faq/${editingFaq._id}`, formData);
        toast.success("FAQ updated successfully!");
        setEditingFaq(null);
      } else {
        await axiosInstance.post("/faq", formData);
        toast.success("FAQ created successfully!");
      }

      setFormData({ question: "", answer: "" });
      setIsFormVisible(false);
      fetchFaqs();
    } catch (error) {
      console.error("Error saving FAQ:", error);
      toast.error("Failed to save FAQ!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete FAQ
  const handleDelete = async (id) => {
    // Instead of window.confirm, we’ll do toast confirm
    toast.info(
      <div>
        <p>Are you sure you want to delete this FAQ?</p>
        <div className="flex space-x-2 mt-2">
          <button
            onClick={async () => {
              try {
                await axiosInstance.delete(`/faq/${id}`);
                fetchFaqs();
                toast.dismiss(); // close confirmation toast
                toast.success("FAQ deleted successfully!");
              } catch (error) {
                console.error("Error deleting FAQ:", error);
                toast.dismiss();
                toast.error("Failed to delete FAQ!");
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

  // ✅ Edit FAQ
  const handleEdit = (faq) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
    });
    setIsFormVisible(true);

    // ✅ scroll to the form
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // ✅ View FAQ by ID
  const handleView = async (id) => {
    try {
      const res = await axiosInstance.get(`/faq/${id}`);
      if (res.data && res.data.success) {
        setSelectedFaq(res.data.faq);
        setViewModalOpen(true);
      }
    } catch (error) {
      console.error("Error fetching FAQ:", error);
      toast.error("Failed to fetch FAQ details!");
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({ question: "", answer: "" });
    setEditingFaq(null);
    setIsFormVisible(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ToastContainer position="top-right" />
      <div className="max-w-6xl mx-auto">
        {/* UI-only: standardized page header; handlers and rendering logic are unchanged. */}
        {/* UI-only: the direct FileQuestionMark icon replaces the old generated question mark. */}
        <div className="bg-gradient-to-r from-[#204972] to-[#87b105] rounded-xl shadow-lg mb-6 p-6 text-white flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <div>
            {/* UI-only: match the FAQ page header icon with its sidebar entry. */}
            <h1 className="flex items-center text-2xl font-bold">
              <FileQuestionMark className="mr-2 h-7 w-7" /> FAQ Management
            </h1>
            <p className="mt-1 opacity-90">Manage frequently asked questions</p>
          </div>
          {!isFormVisible && !editingFaq && (
            <button
              onClick={() => setIsFormVisible(true)}
              className="flex items-center bg-[#204972] hover:bg-[#183654] text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FaPlus className="mr-2" /> Add New FAQ
            </button>
          )}
        </div>

        {/* Form Section */}
        {(isFormVisible || editingFaq) && (
          <div ref={formRef} className="bg-white rounded-xl shadow-md p-6 mb-8 border border-green-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-green-800">
                {editingFaq ? "Update FAQ" : "Create New FAQ"}
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
                  Question
                </label>
                <input
                  type="text"
                  name="question"
                  placeholder="Enter your question"
                  value={formData.question}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Answer
                </label>
                <textarea
                  name="answer"
                  placeholder="Enter the answer"
                  value={formData.answer}
                  onChange={handleChange}
                  rows="4"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading
                    ? "Saving..."
                    : editingFaq
                      ? "Update FAQ"
                      : "Create FAQ"}
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

        {/* FAQ List */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-green-100">
          <h2 className="text-xl font-semibold text-[#204972]-800 mb-6">FAQ List</h2>

          {faqs.length > 0 ? (
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div
                  key={faq._id}
                  className="border border-green-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="bg-[#446382] p-4 flex justify-between items-start">
                    <div className="flex items-start">
                      <FaQuestionCircle className="text-white mt-1 mr-3 flex-shrink-0" />
                      <h3 className="font-semibold text-white">
                        {faq.question}
                      </h3>
                    </div>
                    <div className="flex gap-2">
                      <TableActionButton
                        tone="view"
                        onClick={() => handleView(faq._id)}
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </TableActionButton>
                      <TableActionButton
                        tone="edit"
                        onClick={() => handleEdit(faq)}
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </TableActionButton>
                      <TableActionButton
                        tone="delete"
                        onClick={() => handleDelete(faq._id)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </TableActionButton>
                    </div>
                  </div>
                  <div className="p-4 pl-12">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <FaQuestionCircle className="text-green-500 text-3xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No FAQs yet
              </h3>
              <p className="text-gray-500 mb-4">
                Get started by creating your first FAQ
              </p>
              <button
                onClick={() => setIsFormVisible(true)}
                className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <FaPlus className="mr-2" /> Create FAQ
              </button>
            </div>
          )}
        </div>

        {/* View Modal */}
        {viewModalOpen && selectedFaq && (
          <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            {/* UI-only: FAQ details overlay now matches the shared PV Classes modal theme. */}
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="bg-gradient-to-r from-[#204972] to-[#87b105] text-white p-5 flex justify-between items-center">
                <h3 className="flex items-center text-lg font-bold"><FaQuestionCircle className="mr-2" /> FAQ Details</h3>
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="rounded-full p-2 text-white/80 transition hover:bg-white/15 hover:text-white"
                  aria-label="Close FAQ details"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              <div className="p-6">
                <div className="mb-4 rounded-xl border border-[#204972]/10 bg-[#204972]/[0.04] p-4">
                  <h4 className="text-sm font-semibold text-[#204972] mb-1">
                    Question
                  </h4>
                  <p className="text-gray-800">{selectedFaq.question}</p>
                </div>
                <div className="rounded-xl border border-[#87b105]/20 bg-[#87b105]/[0.06] p-4">
                  <h4 className="text-sm font-semibold text-[#527000] mb-1">
                    Answer
                  </h4>
                  <p className="text-gray-800">{selectedFaq.answer}</p>
                </div>
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="mt-6 w-full text-white py-2.5 rounded-lg font-medium transition-colors form-cancel-button"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQ;
