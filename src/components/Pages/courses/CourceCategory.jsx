
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaEye, FaRegFolderOpen } from 'react-icons/fa';
import axiosInstance from '../../../config/AxiosInstance';


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
    } catch (error) {
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
      .replace(/\s+/g, '-')      // Replace spaces with -
      .replace(/[^\w\-]+/g, '')  // Remove all non-word chars
      .replace(/\-\-+/g, '-');   // Replace multiple - with single -
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
      } catch (error) {
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-800">Course Categories</h1>
            <p className="text-gray-600 mt-2">Manage and organize your course categories</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors shadow-md"
          >
            <FaPlus className="mr-2" /> Add Category
          </button>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-center">
              <div className="w-16 h-16 bg-green-200 rounded-full mx-auto mb-4"></div>
              <p className="text-green-800">Loading categories...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div key={category._id} className="bg-white rounded-xl shadow-md overflow-hidden border border-green-100 hover:shadow-lg transition-shadow">
                <div className="bg-green-50 p-5 border-b border-green-200">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                      <FaRegFolderOpen className="text-green-600 text-xl" />
                    </div>
                    <h3 className="font-semibold text-green-800 text-lg truncate">{category.name}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-gray-600 text-sm mb-6 h-16 overflow-hidden">
                    {category.description || 'No description provided'}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <span className={`px-3 py-1 text-xs rounded-full ${category.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {category.status}
                    </span>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-green-600 hover:text-green-800 p-2 rounded-full hover:bg-green-100 transition-colors"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(category._id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {categories.length === 0 && !loading && (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <div className="mx-auto w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6">
              <FaRegFolderOpen className="text-green-500 text-3xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No categories yet</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first category</p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FaPlus className="mr-2" /> Create Category
            </button>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-opacity-50 flex items-center shadow-2xl justify-center z-50 p-4">
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
                    className="px-5 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
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