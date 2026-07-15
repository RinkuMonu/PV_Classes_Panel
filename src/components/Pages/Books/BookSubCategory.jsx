// components/Pages/Books/BookSubCategory.jsx
import React, { useState, useEffect } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  Loader,
  X
} from 'lucide-react';
import axiosInstance from '../../../config/AxiosInstance';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import GlobalTable from '../../common/GlobalTable';
import TableActionButton from '../../common/TableActionButton';

const BookSubCategory = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    book_category_id: '',
    status: 'active'
  });
  const limit = 10;

  // Fetch categories for dropdown
  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/book-categories?limit=100');
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Fetch subcategories
  const fetchSubcategories = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/book-sub-categories?page=${page}&limit=${limit}&search=${search}`);
      setSubcategories(response.data.data || []);
      setTotalPages(response.data.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      toast.error('Failed to fetch subcategories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      book_category_id: '',
      status: 'active'
    });
    setEditingSubcategory(null);
  };

  // Open create modal
  const handleCreate = () => {
    resetForm();
    setShowModal(true);
  };

  // Open edit modal
  const handleEdit = (subcategory) => {
    setEditingSubcategory(subcategory);
    setFormData({
      name: subcategory.name,
      book_category_id: subcategory.book_category_id,
      status: subcategory.status
    });
    setShowModal(true);
  };

  // View subcategory details
  const handleView = (subcategory) => {
    const category = categories.find(c => c._id === subcategory.book_category_id);
    Swal.fire({
      title: subcategory.name,
      html: `
        <div class="text-left">
          <p><strong>Category:</strong> ${category?.name || 'N/A'}</p>
          <p><strong>Status:</strong> <span class="badge ${subcategory.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">${subcategory.status}</span></p>
          <p><strong>Created:</strong> ${new Date(subcategory.createdAt).toLocaleDateString()}</p>
        </div>
      `,
      icon: 'info',
      confirmButtonColor: '#3085d6'
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error('Subcategory name is required');
      return;
    }
    if (!formData.book_category_id) {
      toast.error('Please select a category');
      return;
    }

    setLoading(true);
    try {
      if (editingSubcategory) {
        await axiosInstance.put(`/book-sub-categories/${editingSubcategory._id}`, formData);
        toast.success('Subcategory updated successfully');
      } else {
        await axiosInstance.post('/book-sub-categories', formData);
        toast.success('Subcategory created successfully');
      }

      setShowModal(false);
      resetForm();
      fetchSubcategories();
    } catch (error) {
      console.error('Error saving subcategory:', error);
      toast.error(error.response?.data?.message || 'Failed to save subcategory');
    } finally {
      setLoading(false);
    }
  };

  // Delete subcategory
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
        await axiosInstance.delete(`/book-sub-categories/${id}`);
        toast.success('Subcategory deleted successfully');
        fetchSubcategories();
      } catch (error) {
        console.error('Error deleting subcategory:', error);
        toast.error('Failed to delete subcategory');
      }
    }
  };

  // Get category name by id
  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c._id === categoryId);
    return category?.name || 'N/A';
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

  // UI-only edit: subcategory table actions now use the shared global table symbols.
  const subcategoryColumns = [
    {
      key: 'name',
      header: 'Name',
      render: (subcategory) => (
        <div className="text-sm font-medium text-gray-900">{subcategory.name}</div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (subcategory) => (
        <div className="text-sm text-gray-600">{getCategoryName(subcategory.book_category_id)}</div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (subcategory) => <StatusBadge status={subcategory.status} />,
    },
    {
      key: 'createdAt',
      header: 'Created At',
      render: (subcategory) => (
        <div className="text-sm text-gray-600">
          {new Date(subcategory.createdAt).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (subcategory) => (
        <div className="flex items-center gap-2">
          <TableActionButton
            tone="view"
            onClick={() => handleView(subcategory)}
            title="View"
          >
            <Eye className="h-4 w-4" />
          </TableActionButton>
          <TableActionButton
            tone="edit"
            onClick={() => handleEdit(subcategory)}
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </TableActionButton>
          <TableActionButton
            tone="delete"
            onClick={() => handleDelete(subcategory._id)}
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
      {/* UI-only: place the existing Add Subcategory action at the responsive header's right edge. */}
      <div data-page-icon data-icon-symbol="≡" className="flex flex-col gap-4 rounded-xl bg-gradient-to-r from-[#204972] to-[#87b105] p-6 text-white shadow-lg mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-2xl font-bold">Book Subcategories</h1><p className="mt-1 opacity-90">Organize and manage book subcategories</p></div>
        <button onClick={handleCreate} className="flex items-center gap-2 rounded-lg bg-[#204972] px-4 py-2 text-white transition-colors hover:bg-[#183654]">
          <Plus className="h-5 w-5" /> Add Subcategory
        </button>
      </div>

      {/* UI-only edit: Book subcategories stay on GlobalTable with shared action buttons. */}
      <GlobalTable
        title={`All Subcategories (${subcategories.length})`}
        filters={{
          searchValue: search,
          onSearchChange: (value) => {
            setSearch(value);
            setPage(1);
          },
          searchPlaceholder: "Search subcategories...",
        }}
        columns={subcategoryColumns}
        data={subcategories}
        loading={loading}
        emptyText="No subcategories found"
        loadingText="Loading subcategories..."
        getRowKey={(subcategory) => subcategory._id}
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
          {/* UI-only: Book Subcategory form overlay follows the shared PV Classes theme. */}
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 overflow-hidden">
            <div className="flex justify-between items-center -m-6 mb-6 p-5 bg-gradient-to-r from-[#204972] to-[#87b105] text-white">
              <h2 className="text-xl font-bold">
                {editingSubcategory ? 'Edit Subcategory' : 'Create Subcategory'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="rounded-full p-2 text-white/80 transition hover:bg-white/15 hover:text-white"
                aria-label="Close book subcategory form"
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
                    Category *
                  </label>
                  <select
                    name="book_category_id"
                    value={formData.book_category_id}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#87b105]"
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
                  {editingSubcategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookSubCategory;
