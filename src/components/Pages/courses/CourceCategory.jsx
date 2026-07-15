
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import { FaEdit, FaTrash, FaPlus, FaTimes, FaEye, FaRegFolderOpen } from 'react-icons/fa';
import axiosInstance from '../../../config/AxiosInstance';
import TableActionButton from '../../common/TableActionButton';


const CourceCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active'
  });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      // const response = await axios.get('https://api.pvclasses.in/api/categories');
         const response = await axiosInstance.get('/categories'); // ✅ using axiosInstance
      setCategories(response.data);
    } catch {
      toast.error('Error fetching categories');
    } finally {
      setLoading(false);
    }
  };

  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
   .replace(/\s+/g, '-')       // spaces → -
.replace(/[^\w-]+/g, '')    // remove non-word chars
.replace(/-+/g, '-');       // collapse multiple dashes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create slug from name
    const payload = {
      ...formData,
      slug: slugify(formData.name),
    };

    try {
      if (editingId) {
        // await axios.put(`https://api.pvclasses.in/api/categories/${editingId}`, payload);
                await axiosInstance.put(`/categories/${editingId}`, payload); // ✅ using axiosInstance

        toast.success('Category updated successfully');
      } else {
        // await axios.post('https://api.pvclasses.in/api/categories', payload);
                await axiosInstance.post('/categories', payload); // ✅ using axiosInstance

        toast.success('Category created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchCategories();
    } catch (error) {
      toast.error(error?.response?.data?.error || 'Error saving category');
    }
  };

  const handleEdit = (category) => {
    setFormData({
      name: category.name,
      description: category.description,
      status: category.status
    });
    setEditingId(category._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        // await axios.delete(`https://api.pvclasses.in/api/categories/${id}`);
                await axiosInstance.delete(`/categories/${id}`); // ✅ using axiosInstance

        toast.success('Category deleted successfully');
        fetchCategories();
      } catch {
        toast.error('Error deleting category');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      status: 'active'
    });
    setEditingId(null);
  };

  // UI-only: normalize missing/boolean API status values for display and table filtering.
  const getCategoryStatus = (category) => category.status || (category.isActive === false ? 'inactive' : 'active');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* UI-only: standardized page header; course-category logic is unchanged. */}
        <div data-page-icon data-icon-symbol="▤" className="bg-gradient-to-r from-[#204972] to-[#87b105] rounded-xl shadow-lg mb-6 p-6 text-white flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Course Categories</h1>
            <p className="mt-1 opacity-90">Manage and organize your course categories</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center bg-[#204972] hover:bg-[#183654] text-white px-4 py-3 rounded-lg  shadow-md"
          >
            <FaPlus className="mr-2" /> Add Category
          </button>
        </div>

        {/* UI-only: restore the original Course Categories card layout with shared action icons. */}
        {loading ? <div className="flex h-64 items-center justify-center"><p className="text-[#204972]">Loading categories...</p></div> : categories.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => { const status = getCategoryStatus(category); return (
              <div key={category._id} className="flex h-full flex-col overflow-hidden rounded-xl border border-[#204972]/10 bg-white shadow-md transition-shadow hover:shadow-lg">
                <div className="border-b border-[#204972]/10 bg-[#204972]/[0.05] p-5"><div className="flex items-center"><div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#204972]/10"><FaRegFolderOpen className="text-xl text-[#204972]" /></div><h3 className="truncate text-lg font-semibold text-[#204972]">{category.name}</h3></div></div>
                <div className="flex flex-1 flex-col p-5"><p className="mb-6 h-16 overflow-hidden text-sm text-gray-600">{category.description || 'No description provided'}</p><div className="mt-auto flex items-center justify-between"><span className={`rounded-full px-3 py-1 text-xs ${status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{status}</span><div className="flex gap-3"><TableActionButton onClick={() => handleEdit(category)} tone="edit" title="Edit category"><FaEdit /></TableActionButton><TableActionButton onClick={() => handleDelete(category._id)} tone="delete" title="Delete category"><FaTrash /></TableActionButton></div></div></div>
              </div>
            ); })}
          </div>
        ) : <div className="rounded-xl bg-white py-16 text-center shadow-md"><FaRegFolderOpen className="mx-auto mb-4 text-3xl text-[#204972]" /><h3 className="text-lg font-medium text-gray-700">No categories yet</h3></div>}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center shadow-2xl justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
              <div className="flex justify-between items-center p-6 border-b border-green-100">
                <h2 className="text-xl font-bold text-green-800">
                  {editingId ? 'Edit Category' : 'Add Category'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100"
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
                    placeholder="Enter category name"
                    required
                  />
                </div>
                
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                    rows="3"
                    placeholder="Enter category description"
                  />
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
                    className="px-5 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors form-cancel-button"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium transition-colors"
                  >
                    {editingId ? 'Update Category' : 'Create Category'}
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

export default CourceCategory;
