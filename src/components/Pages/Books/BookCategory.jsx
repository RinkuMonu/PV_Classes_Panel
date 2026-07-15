// components/Pages/Books/BookCategory.jsx
import React, { useState, useEffect } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  Image as ImageIcon,
  X,
  Upload,
  Loader
} from 'lucide-react';
import axiosInstance from '../../../config/AxiosInstance';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import GlobalTable from '../../common/GlobalTable';
import TableActionButton from '../../common/TableActionButton';

const BookCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
    image: null
  });
  const [imagePreview, setImagePreview] = useState('');
  const limit = 10;

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/book-categories?page=${page}&limit=${limit}&search=${search}`);
      setCategories(response.data.data || []);
      setTotalPages(response.data.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      status: 'active',
      image: null
    });
    setImagePreview('');
    setEditingCategory(null);
  };

  // Open create modal
  const handleCreate = () => {
    resetForm();
    setShowModal(true);
  };

  // Open edit modal
  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      status: category.status,
      image: null
    });
    setImagePreview(category.full_image || '');
    setShowModal(true);
  };

  // View category details
  const handleView = (category) => {
    Swal.fire({
      title: category.name,
      // UI-only: compact the category details popup so it fits without page scrolling.
      customClass: {
        popup: 'book-category-details-popup',
        htmlContainer: 'book-category-details-content'
      },
      html: `
        <div class="text-left space-y-2">
          <p><strong>Description:</strong> ${category.description || 'N/A'}</p>
          <p><strong>Status:</strong> <span class="badge ${category.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">${category.status}</span></p>
          <p><strong>Created:</strong> ${new Date(category.createdAt).toLocaleDateString()}</p>
          ${category.full_image ? `<img src="${category.full_image}" alt="${category.name}" class="w-full h-28 object-cover mt-3 rounded-lg"/>` : ''}
        </div>
      `,
      width: '26rem',
      padding: '1rem',
      confirmButtonText: 'Close',
      confirmButtonColor: '#dc2626'
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error('Category name is required');
      return;
    }

    setLoading(true);
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('status', formData.status);
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      if (editingCategory) {
        await axiosInstance.put(`/book-categories/${editingCategory._id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Category updated successfully');
      } else {
        await axiosInstance.post('/book-categories', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Category created successfully');
      }

      setShowModal(false);
      resetForm();
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error(error.response?.data?.message || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  // Delete category
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/book-categories/${id}`);
        toast.success('Category deleted successfully');
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('Failed to delete category');
      }
    }
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const classes = status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${classes}`}>
        {status}
      </span>
    );
  };

  // UI-only edit: category table actions now use the shared global table symbols.
  const categoryColumns = [
    {
      key: 'image',
      header: 'Image',
      render: (category) => (
        category.full_image ? (
          <img
            src={category.full_image}
            alt={category.name}
            className="h-12 w-12 object-cover rounded-lg"
          />
        ) : (
          <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
            <ImageIcon className="h-6 w-6 text-gray-400" />
          </div>
        )
      ),
    },
    {
      key: 'name',
      header: 'Name',
      render: (category) => (
        <div className="text-sm font-medium text-gray-900">{category.name}</div>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (category) => (
        <div className="text-sm text-gray-600 truncate max-w-xs">
          {category.description || '-'}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (category) => <StatusBadge status={category.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (category) => (
        <div className="flex items-center gap-2">
          <TableActionButton
            tone="view"
            onClick={() => handleView(category)}
            title="View"
          >
            <Eye className="h-4 w-4" />
          </TableActionButton>
          <TableActionButton
            tone="edit"
            onClick={() => handleEdit(category)}
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </TableActionButton>
          <TableActionButton
            tone="delete"
            onClick={() => handleDelete(category._id)}
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </TableActionButton>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      {/* UI-only: place the existing Add Category action at the responsive header's right edge. */}
      <div data-page-icon data-icon-symbol="▤" className="flex flex-col gap-4 rounded-xl bg-gradient-to-r from-[#204972] to-[#87b105] p-6 text-white shadow-lg mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-2xl font-bold">Book Categories</h1><p className="mt-1 opacity-90">Organize and manage book categories</p></div>
        <button onClick={handleCreate} className="flex items-center gap-2 rounded-lg bg-[#204972] px-4 py-2 text-white transition-colors hover:bg-[#183654]">
          <Plus className="h-5 w-5" /> Add Category
        </button>
      </div>

      {/* UI-only edit: Book categories stay on GlobalTable with shared action buttons. */}
      <GlobalTable
        title={`All Categories (${categories.length})`}
        filters={{
          searchValue: search,
          onSearchChange: (value) => {
            setSearch(value);
            setPage(1);
          },
          searchPlaceholder: "Search categories...",
        }}
        columns={categoryColumns}
        data={categories}
        loading={loading}
        emptyText="No categories found"
        loadingText="Loading categories..."
        getRowKey={(category) => category._id}
        pagination={
          totalPages > 1
            ? {
                currentPage: page,
                totalPages,
                onPageChange: setPage,
              }
            : undefined
        }
      />

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          {/* UI-only: Book Category form overlay follows the shared PV Classes theme. */}
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 overflow-hidden">
            <div className="flex justify-between items-center -m-6 mb-6 p-5 bg-gradient-to-r from-[#204972] to-[#87b105] text-white">
              <h2 className="text-xl font-bold">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="rounded-full p-2 text-white/80 transition hover:bg-white/15 hover:text-white"
                aria-label="Close book category form"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#87b105]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#87b105]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#87b105]"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg flex items-center gap-2">
                      <Upload className="h-5 w-5" />
                      Choose Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-12 w-12 object-cover rounded-lg"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 form-cancel-button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-[#87b105] text-white rounded-lg hover:bg-[#6f9204] disabled:opacity-50 flex items-center gap-2"
                >
                  {loading && <Loader className="h-4 w-4 animate-spin" />}
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookCategory;
