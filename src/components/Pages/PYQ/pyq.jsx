import React, { useEffect, useState } from "react";
import axiosInstance from "../../../config/AxiosInstance";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
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
      pdf: null, // user can upload new one
    });
  };

  // View PDF
  const handleView = (pyq) => {
    if (pyq.pdfUrl) {
      window.open(pyq.pdfUrl, "_blank");
    } else {
      toast.info("No PDF available for this PYQ");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">
        {editingPyq ? "Update PYQ" : "Create PYQ"}
      </h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <input
          type="text"
          name="exam"
          placeholder="Exam Name"
          value={formData.exam}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="file"
          name="pdf"
          accept="application/pdf"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {editingPyq ? "Update" : "Create"}
        </button>
        {editingPyq && (
          <button
            type="button"
            onClick={() => {
              setEditingPyq(null);
              setFormData({ exam: "", description: "", category: "", pdf: null });
            }}
            className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </form>

      {/* PYQ List */}
      <h2 className="text-xl font-bold mb-4">PYQ List</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Exam</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pyqs.length > 0 ? (
            pyqs.map((pyq) => (
              <tr key={pyq._id}>
                <td className="p-2 border">{pyq.exam}</td>
                <td className="p-2 border">{pyq.description}</td>
                <td className="p-2 border">{pyq.category}</td>
                <td className="p-2 border flex justify-center gap-3">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => handleUpdate(pyq)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-green-500 hover:text-green-700"
                    onClick={() => handleView(pyq)}
                  >
                    <FaEye />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(pyq._id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center p-2">
                No PYQs found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Pyq;
