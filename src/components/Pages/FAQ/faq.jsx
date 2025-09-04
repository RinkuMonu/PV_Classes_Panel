import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../../../config/AxiosInstance";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaPlus,
  FaTimes,
  FaQuestionCircle,
} from "react-icons/fa";

// ✅ Import Toast
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-800">FAQ Management</h1>
          {!isFormVisible && !editingFaq && (
            <button
              onClick={() => setIsFormVisible(true)}
              className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
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
                  className="border border-gray-300 text-gray-700 hover:bg-gray-100 px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* FAQ List */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-green-100">
          <h2 className="text-xl font-semibold text-green-800 mb-6">FAQ List</h2>

          {faqs.length > 0 ? (
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div
                  key={faq._id}
                  className="border border-green-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="bg-green-50 p-4 flex justify-between items-start">
                    <div className="flex items-start">
                      <FaQuestionCircle className="text-green-600 mt-1 mr-3 flex-shrink-0" />
                      <h3 className="font-semibold text-green-800">
                        {faq.question}
                      </h3>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        className="text-green-600 hover:text-green-800 p-2 rounded-full hover:bg-green-100 transition-colors"
                        onClick={() => handleView(faq._id)}
                        title="View"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100 transition-colors"
                        onClick={() => handleEdit(faq)}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors"
                        onClick={() => handleDelete(faq._id)}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
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
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
              <div className="bg-green-600 text-white p-4 flex justify-between items-center">
                <h3 className="text-lg font-bold">FAQ Details</h3>
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="text-white hover:text-green-200"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    Question
                  </h4>
                  <p className="text-gray-800">{selectedFaq.question}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    Answer
                  </h4>
                  <p className="text-gray-800">{selectedFaq.answer}</p>
                </div>
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors"
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
