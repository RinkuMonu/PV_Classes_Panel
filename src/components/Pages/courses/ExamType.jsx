


import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaGraduationCap } from 'react-icons/fa';
import axiosInstance from '../../../config/AxiosInstance';
import TableActionButton from '../../common/TableActionButton';


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
        {/* UI-only: standardized page header; exam-type logic is unchanged. */}
        <div className="bg-gradient-to-r from-[#204972] to-[#87b105] rounded-xl shadow-lg mb-6 p-6 text-white flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center">
            <div>
              {/* UI-only: direct title icon uses the shared page-header tile styling. */}
              <h1 className="text-2xl font-bold"><FaGraduationCap /> Exam Types</h1>
              <p className="mt-1 opacity-90">Manage different types of exams</p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center bg-[#204972] hover:bg-[#183654] text-white px-4 py-3 rounded-lg transition-colors shadow-md"
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
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-[#204972]">
                <h3 className="text-lg font-semibold text-gray-700">Total Exam Types</h3>
              <p className="text-3xl font-bold text-[#87b105] mt-2">{examTypes.length}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-[#204972]">
                <h3 className="text-lg font-semibold text-gray-700">Active Exams</h3>
                <p className="text-3xl font-bold text-[#87b105] mt-2">
                  {examTypes.filter(e => e.status === 'active').length}
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-[#204972]">
                <h3 className="text-lg font-semibold text-gray-700">Categories</h3>
                <p className="text-3xl font-bold text-[#87b105] mt-2">{categories.length}</p>
              </div>
            </div>

            {/* UI-only: restore the original Exam Types list-card presentation. */}
            <div className="overflow-hidden rounded-xl bg-white shadow-md"><div className="border-b border-gray-200 bg-[#204972]/[0.05] px-6 py-4"><h2 className="text-xl font-semibold text-[#204972]">All Exam Types</h2></div>{examTypes.length > 0 ? <div className="divide-y divide-gray-100">{examTypes.map((examType) => { const status = examType.status || (examType.isActive === false ? 'inactive' : 'active'); return <div key={examType._id} className="p-6 transition-colors hover:bg-[#204972]/[0.03]"><div className="flex items-start justify-between gap-4"><div className="flex-1"><div className="flex items-center"><h3 className="text-lg font-semibold text-[#204972]">{examType.name}</h3><span className={`ml-3 rounded-full px-2 py-1 text-xs ${status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{status}</span></div><p className="mt-2 text-gray-600">{examType.description}</p><span className="mt-3 inline-block rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">{examType.category?.name}</span></div><div className="flex gap-3"><TableActionButton onClick={() => handleEdit(examType)} tone="edit" title="Edit exam type"><FaEdit /></TableActionButton><TableActionButton onClick={() => handleDelete(examType._id)} tone="delete" title="Delete exam type"><FaTrash /></TableActionButton></div></div></div>; })}</div> : <div className="py-12 text-center"><FaGraduationCap className="mx-auto mb-4 text-3xl text-[#204972]" /><h3 className="text-lg font-medium text-gray-700">No exam types yet</h3></div>}</div>
          </>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center shadow-2xl justify-center p-4 z-50">
            {/* UI-only: keep the Exam Type overlay border consistently rounded and clipped. */}
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
                <h2 className="text-xl font-semibold text-black">
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#87b105] focus:border-[#87b105] outline-none transition"
                    required
                    placeholder="Enter exam type name"
                  />
                </div>
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#87b105] focus:border-[#87b105] outline-none transition"
                    required                    rows="3"
                    placeholder="Enter description (optional)"
                  />
                </div>
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#87b105] focus:border-[#87b105] outline-none transition"
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#87b105] focus:border-[#87b105] outline-none transition"
                    required                  >
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
                    className="px-5 py-2 rounded-lg text-white bg-red-600 hover:scale-105 ease-in-out transition-colors form-cancel-button"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#204972] hover:bg-[#183654] hover:scale-105 ease-in-out text-white px-5 py-2 rounded-lg transition-colors"
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
