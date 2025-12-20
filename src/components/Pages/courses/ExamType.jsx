


import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaGraduationCap } from 'react-icons/fa';
import axiosInstance from '../../../config/AxiosInstance';


const ExamType = () => {
  const [examTypes, setExamTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    status: 'active'
  });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchExamTypes();
    fetchCategories();
  }, []);

  const fetchExamTypes = async () => {
    try {
      setLoading(true);
      // const response = await axios.get('https://api.pvclasses.in/api/exam-types');
      const response = await axiosInstance.get('/exam-types'); // ✅

      setExamTypes(response.data);
    } catch  {
      toast.error('Error fetching exam types');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      // const response = await axios.get('https://api.pvclasses.in/api/categories');
      const response = await axiosInstance.get('/categories'); // ✅

      setCategories(response.data);
    } catch {
      toast.error('Error fetching categories');
    }
  };

  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')       // Replace spaces with -
      .replace(/[^\w-]+/g, '')    // Remove all non-word chars
      .replace(/--+/g, '-');      // Replace multiple - with single -
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add slug based on name
    const payload = {
      ...formData,
      slug: slugify(formData.name),
    };

    try {
      if (editingId) {
        // await axios.put(`https://api.pvclasses.in/api/exam-types/${editingId}`, payload);
        await axiosInstance.put(`/exam-types/${editingId}`, payload); // ✅

        toast.success('Exam type updated successfully');
      } else {
        // await axios.post('https://api.pvclasses.in/api/exam-types', payload);
        await axiosInstance.post('/exam-types', payload); // ✅

        toast.success('Exam type created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchExamTypes();
    } catch (error) {
      toast.error(error?.response?.data?.error || 'Error saving exam type');
    }
  };

  const handleEdit = (examType) => {
    setFormData({
      name: examType.name,
      description: examType.description,
      category: examType.category._id,
      status: examType.status
    });
    setEditingId(examType._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this exam type?')) {
      try {
        // await axios.delete(`https://api.pvclasses.in/api/exam-types/${id}`);
        await axiosInstance.delete(`/exam-types/${id}`); // ✅
        toast.success('Exam type deleted successfully');
        fetchExamTypes();
      } catch{
        toast.error('Error deleting exam type');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      status: 'active'
    });
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <FaGraduationCap className="text-green-600 text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-green-800">Exam Types</h1>
              <p className="text-gray-600">Manage different types of exams</p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors shadow-md"
          >
            <FaPlus className="mr-2" /> Add Exam Type
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-center">
              <div className="w-16 h-16 bg-green-200 rounded-full mx-auto mb-4"></div>
              <p className="text-green-800">Loading exam types...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                <h3 className="text-lg font-semibold text-gray-700">Total Exam Types</h3>
                <p className="text-3xl font-bold text-green-700 mt-2">{examTypes.length}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                <h3 className="text-lg font-semibold text-gray-700">Active Exams</h3>
                <p className="text-3xl font-bold text-blue-700 mt-2">
                  {examTypes.filter(e => e.status === 'active').length}
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
                <h3 className="text-lg font-semibold text-gray-700">Categories</h3>
                <p className="text-3xl font-bold text-purple-700 mt-2">{categories.length}</p>
              </div>
            </div>

            {/* Exam Types List */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4 bg-green-50">
                <h2 className="text-xl font-semibold text-green-800">All Exam Types</h2>
              </div>

              {examTypes.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {examTypes.map((examType) => (
                    <div key={examType._id} className="p-6 hover:bg-green-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h3 className="text-lg font-semibold text-green-800">{examType.name}</h3>
                            <span className={`ml-3 px-2 py-1 text-xs rounded-full ${examType.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                              {examType.status}
                            </span>
                          </div>
                          <p className="text-gray-600 mt-2">{examType.description}</p>
                          <div className="mt-3 flex items-center">
                            <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                              {examType.category?.name}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleEdit(examType)}
                            className="text-green-600 hover:text-green-800 p-2 rounded-full hover:bg-green-100 transition-colors"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(examType._id)}
                            className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <FaGraduationCap className="text-green-500 text-3xl" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No exam types yet</h3>
                  <p className="text-gray-500 mb-4">Get started by creating your first exam type</p>
                  <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <FaPlus className="mr-2" /> Create Exam Type
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-opacity-50 flex items-center shadow-2xl justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
              <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
                <h2 className="text-xl font-semibold text-green-800">
                  {editingId ? 'Edit Exam Type' : 'Add Exam Type'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6">
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                    required
                    placeholder="Enter exam type name"
                  />
                </div>
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                    rows="3"
                    placeholder="Enter description (optional)"
                  />
                </div>
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition-colors"
                  >
                    {editingId ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamType;