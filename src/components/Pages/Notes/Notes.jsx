import React, { useEffect, useState } from "react";
import axiosInstance from "../../../config/AxiosInstance";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    pdf: null,
  });
  const [editingNote, setEditingNote] = useState(null); // track if updating

  // Fetch notes
  const fetchNotes = async () => {
    try {
      const res = await axiosInstance.get("/notes");
      setNotes(res.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
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
        setEditingNote(null);
      } else {
        // Create API
        await axiosInstance.post("/notes", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setFormData({ title: "", description: "", pdf: null });
      fetchNotes();
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  // Delete Note
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await axiosInstance.delete(`/notes/${id}`);
      fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  // Edit Note
  const handleUpdate = (note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      description: note.description,
      pdf: null, // user can upload new one
    });
  };

  // View Note (open pdf if available)
  const handleView = (note) => {
    if (note.pdfUrl) {
      window.open(note.pdfUrl, "_blank");
    } else {
      alert("No PDF available for this note");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">
        {editingNote ? "Update Note" : "Create Note"}
      </h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
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
          {editingNote ? "Update" : "Create"}
        </button>
        {editingNote && (
          <button
            type="button"
            onClick={() => {
              setEditingNote(null);
              setFormData({ title: "", description: "", pdf: null });
            }}
            className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Notes List */}
      <h2 className="text-xl font-bold mb-4">Notes List</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {notes.length > 0 ? (
            notes.map((note) => (
              <tr key={note._id}>
                <td className="p-2 border">{note.title}</td>
                <td className="p-2 border">{note.description}</td>
                <td className="p-2 border flex justify-center gap-3">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => handleUpdate(note)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-green-500 hover:text-green-700"
                    onClick={() => handleView(note)}
                  >
                    <FaEye />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(note._id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center p-2">
                No notes found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Notes;