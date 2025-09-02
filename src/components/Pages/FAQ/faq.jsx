import React, { useEffect, useState } from "react";
import axiosInstance from "../../../config/AxiosInstance";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
  });
  const [editingFaq, setEditingFaq] = useState(null);
  const [loading, setLoading] = useState(false);

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
        setEditingFaq(null);
      } else {
        await axiosInstance.post("/faq", formData);
      }

      setFormData({ question: "", answer: "" });
      fetchFaqs();
    } catch (error) {
      console.error("Error saving FAQ:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete FAQ
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      await axiosInstance.delete(`/faq/${id}`);
      fetchFaqs();
    } catch (error) {
      console.error("Error deleting FAQ:", error);
    }
  };

  // ✅ Edit FAQ
  const handleEdit = (faq) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
    });
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
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">
        {editingFaq ? "Update FAQ" : "Create FAQ"}
      </h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <input
          type="text"
          name="question"
          placeholder="Enter question"
          value={formData.question}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="answer"
          placeholder="Enter answer"
          value={formData.answer}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {loading
            ? "Saving..."
            : editingFaq
            ? "Update FAQ"
            : "Create FAQ"}
        </button>
        {editingFaq && (
          <button
            type="button"
            onClick={() => {
              setEditingFaq(null);
              setFormData({ question: "", answer: "" });
            }}
            className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </form>

      {/* FAQ List */}
      <h2 className="text-xl font-bold mb-4">FAQ List</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Question</th>
            <th className="p-2 border">Answer</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {faqs.length > 0 ? (
            faqs.map((faq) => (
              <tr key={faq._id}>
                <td className="p-2 border">{faq.question}</td>
                <td className="p-2 border">{faq.answer}</td>
                <td className="p-2 border flex justify-center gap-3">
                  <button
                    className="text-green-500 hover:text-green-700"
                    onClick={() => handleView(faq._id)}
                  >
                    <FaEye />
                  </button>
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => handleEdit(faq)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(faq._id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center p-2">
                No FAQs found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* View Modal */}
      {viewModalOpen && selectedFaq && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-bold mb-4">FAQ Details</h3>
            <p>
              <strong>Question:</strong> {selectedFaq.question}
            </p>
            <p className="mt-2">
              <strong>Answer:</strong> {selectedFaq.answer}
            </p>
            <button
              onClick={() => setViewModalOpen(false)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQ;
