// // components/Pages/Books/Books.jsx
// import React, { useState, useEffect } from 'react';
// import {
//   Plus,
//   Search,
//   Edit,
//   Trash2,
//   Eye,
//   ChevronLeft,
//   ChevronRight,
//   Image as ImageIcon,
//   X,
//   Upload,
//   Loader,
//   Tag
// } from 'lucide-react';
// import axiosInstance from '../../../config/AxiosInstance';
// import Swal from 'sweetalert2';
// import { toast } from 'react-toastify';

// const Books = () => {
//   const [books, setBooks] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [subcategories, setSubcategories] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [search, setSearch] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [editingBook, setEditingBook] = useState(null);
//   const [formData, setFormData] = useState({
//     book_category_id: '',
//     book_subcategory_id: '',
//     title: '',
//     book_description: '',
//     price: '',
//     discount_price: '',
//     stock: '',
//     language: 'english',
//     status: 'active',
//     tag: [],
//     book_key_features: [],
//     images: []
//   });
//   const [tagInput, setTagInput] = useState('');
//   const [featureInput, setFeatureInput] = useState({ title: '', value: '' });
//   const [imagePreviews, setImagePreviews] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const limit = 10;

//   // Fetch categories
//   const fetchCategories = async () => {
//     try {
//       const response = await axiosInstance.get('/book-categories?limit=100');
//       setCategories(response.data.data || []);
//     } catch (error) {
//       console.error('Error fetching categories:', error);
//     }
//   };

//   // Fetch subcategories based on selected category
//   const fetchSubcategories = async (categoryId) => {
//     if (!categoryId) {
//       setSubcategories([]);
//       return;
//     }
//     try {
//       const response = await axiosInstance.get(`/book-sub-categories?book_category_id=${categoryId}&limit=100`);
//       setSubcategories(response.data.data || []);
//     } catch (error) {
//       console.error('Error fetching subcategories:', error);
//     }
//   };

//   // Fetch books
// //   const fetchBooks = async () => {
// //     setLoading(true);
// //     try {
// //       const response = await axiosInstance.get(`/books?page=${page}&limit=${limit}&search=${search}`);
// //       console.log("books response ::",response.data.data);
// //       setBooks(response.data.data || []);
// //       setTotalPages(response.data.pagination?.totalPages || 1);
// //     } catch (error) {
// //       console.error('Error fetching books:', error);
// //       toast.error('Failed to fetch books');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// const fetchBooks = async () => {
//   setLoading(true);
//   try {
//     const response = await axiosInstance.get(`/books?page=${page}&limit=${limit}&search=${search}`);

//     const groupedData = response.data.data || {};

//     // convert grouped object → flat array
//     const booksArray = Object.values(groupedData).flatMap(group => group.books);

//     setBooks(booksArray);

//   } catch (error) {
//     console.error('Error fetching books:', error);
//     toast.error('Failed to fetch books');
//   } finally {
//     setLoading(false);
//   }
// };

//   useEffect(() => {
//     fetchCategories();
//     fetchBooks();
//   }, [page, search]);

//   // Handle category change
//   useEffect(() => {
//     if (formData.book_category_id) {
//       fetchSubcategories(formData.book_category_id);
//     } else {
//       setSubcategories([]);
//     }
//   }, [formData.book_category_id]);

//   // Handle form input change
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
    
//     if (name === 'book_category_id') {
//       setFormData(prev => ({ ...prev, book_subcategory_id: '' }));
//     }
//   };

//   // Handle images change
//   const handleImagesChange = (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length > 0) {
//       setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
      
//       // Create previews
//       files.forEach(file => {
//         const reader = new FileReader();
//         reader.onloadend = () => {
//           setImagePreviews(prev => [...prev, reader.result]);
//         };
//         reader.readAsDataURL(file);
//       });
//     }
//   };

//   // Remove image
//   const removeImage = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       images: prev.images.filter((_, i) => i !== index)
//     }));
//     setImagePreviews(prev => prev.filter((_, i) => i !== index));
//   };

//   // Add tag
//   const addTag = () => {
//     if (tagInput.trim()) {
//       setFormData(prev => ({
//         ...prev,
//         tag: [...prev.tag, tagInput.trim()]
//       }));
//       setTagInput('');
//     }
//   };

//   // Remove tag
//   const removeTag = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       tag: prev.tag.filter((_, i) => i !== index)
//     }));
//   };

//   // Add key feature
//   const addKeyFeature = () => {
//     if (featureInput.title.trim() && featureInput.value.trim()) {
//       setFormData(prev => ({
//         ...prev,
//         book_key_features: [...prev.book_key_features, { ...featureInput }]
//       }));
//       setFeatureInput({ title: '', value: '' });
//     }
//   };

//   // Remove key feature
//   const removeKeyFeature = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       book_key_features: prev.book_key_features.filter((_, i) => i !== index)
//     }));
//   };

//   // Reset form
//   const resetForm = () => {
//     setFormData({
//       book_category_id: '',
//       book_subcategory_id: '',
//       title: '',
//       book_description: '',
//       price: '',
//       discount_price: '',
//       stock: '',
//       language: 'english',
//       status: 'active',
//       tag: [],
//       book_key_features: [],
//       images: []
//     });
//     setImagePreviews([]);
//     setTagInput('');
//     setFeatureInput({ title: '', value: '' });
//     setEditingBook(null);
//   };

//   // Open create modal
//   const handleCreate = () => {
//     resetForm();
//     setShowModal(true);
//   };

//   // Open edit modal
//   const handleEdit = (book) => {
//     setEditingBook(book);
//     setFormData({
//       book_category_id: book.book_category_id?._id || book.book_category_id,
//       book_subcategory_id: book.book_subcategory_id,
//       title: book.title,
//       book_description: book.book_description || '',
//       price: book.price,
//       discount_price: book.discount_price,
//       stock: book.stock,
//       language: book.language,
//       status: book.status,
//       tag: book.tag || [],
//       book_key_features: book.book_key_features || [],
//       images: []
//     });
//     setImagePreviews(book.full_image || []);
//     setShowModal(true);
//   };

//   // View book details
// const handleView = (book) => {

//   Swal.fire({
//     title: book.title,
//     html: `
//       <div class="text-left">
//         <p><strong>Category:</strong> ${book.category?.name || 'N/A'}</p>
//         <p><strong>Subcategory:</strong> ${book?.book_subcategory_name || 'N/A'}</p>

//         <p><strong>Price:</strong> ₹${book.price}</p>
//         <p><strong>Discount Price:</strong> ₹${book.discount_price}</p>
//         <p><strong>Stock:</strong> ${book.stock}</p>
//         <p><strong>Language:</strong> ${book.language}</p>

//         <p><strong>Status:</strong> 
//           <span class="${book.status === 'active' ? 'text-green-600' : 'text-red-600'}">
//             ${book.status}
//           </span>
//         </p>

//         <p><strong>Description:</strong> ${book.book_description || 'N/A'}</p>

//         ${book.tag?.length > 0 
//           ? `<p><strong>Tags:</strong> ${book.tag.join(', ')}</p>` 
//           : ''}

//         ${book.full_image?.length > 0 ? `
//           <div class="mt-4">
//             <strong>Images:</strong>
//             <div class="flex gap-2 mt-2">
//               ${book.full_image.map(img => `
//                 <img src="${img}" class="h-20 w-20 object-cover rounded"/>
//               `).join('')}
//             </div>
//           </div>
//         ` : ''}
//       </div>
//     `,
//     width: '600px',
//     confirmButtonColor: '#3085d6'
//   });

// };

//   // Submit form
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!formData.title) {
//       toast.error('Book title is required');
//       return;
//     }
//     if (!formData.book_category_id) {
//       toast.error('Please select a category');
//       return;
//     }
//     if (!formData.book_subcategory_id) {
//       toast.error('Please select a subcategory');
//       return;
//     }

//     setLoading(true);
//     try {
//       const submitData = new FormData();
      
//       // Append all form fields
//       Object.keys(formData).forEach(key => {
//         if (key === 'images') {
//           formData.images.forEach(image => {
//             submitData.append('images', image);
//           });
//         } else if (key === 'tag') {
//           submitData.append('tag', formData.tag.join(','));
//         } else if (key === 'book_key_features') {
//           submitData.append('book_key_features', JSON.stringify(formData.book_key_features));
//         } else {
//           submitData.append(key, formData[key]);
//         }
//       });

//       let response;
//       if (editingBook) {
//         response = await axiosInstance.put(`/books/${editingBook._id}`, submitData, {
//           headers: { 'Content-Type': 'multipart/form-data' }
//         });
//         toast.success('Book updated successfully');
//       } else {
//         response = await axiosInstance.post('/books', submitData, {
//           headers: { 'Content-Type': 'multipart/form-data' }
//         });
//         toast.success('Book created successfully');
//       }

//       setShowModal(false);
//       resetForm();
//       fetchBooks();
//     } catch (error) {
//       console.error('Error saving book:', error);
//       toast.error(error.response?.data?.message || 'Failed to save book');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete book
//   const handleDelete = async (id) => {
//     const result = await Swal.fire({
//       title: 'Are you sure?',
//       text: "You won't be able to revert this!",
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#d33',
//       cancelButtonColor: '#3085d6',
//       confirmButtonText: 'Yes, delete it!'
//     });

//     if (result.isConfirmed) {
//       try {
//         await axiosInstance.delete(`/books/${id}`);
//         toast.success('Book deleted successfully');
//         fetchBooks();
//       } catch (error) {
//         console.error('Error deleting book:', error);
//         toast.error('Failed to delete book');
//       }
//     }
//   };

//   // Status badge component
//   const StatusBadge = ({ status }) => {
//     const classes = status === 'active' 
//       ? 'bg-green-100 text-green-800' 
//       : 'bg-red-100 text-red-800';
//     return (
//       <span className={`px-2 py-1 text-xs font-semibold rounded-full ${classes}`}>
//         {status}
//       </span>
//     );
//   };

//   return (
//     <div className="p-6">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <div className="flex items-center">
//           <h1 className="text-2xl font-bold text-gray-800">Books Management</h1>
//         </div>
//         <button
//           onClick={handleCreate}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
//         >
//           <Plus className="h-5 w-5" />
//           Add Book
//         </button>
//       </div>

//       {/* Search Bar */}
//       <div className="mb-6">
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//           <input
//             type="text"
//             placeholder="Search books..."
//             value={search}
//             onChange={(e) => {
//               setSearch(e.target.value);
//               setPage(1);
//             }}
//             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//       </div>

//       {/* Books Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Image
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Title
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Category
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Price
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Discount
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Stock
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Status
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {loading ? (
//               <tr>
//                 <td colSpan="8" className="px-6 py-4 text-center">
//                   <div className="flex justify-center">
//                     <Loader className="h-8 w-8 animate-spin text-blue-600" />
//                   </div>
//                 </td>
//               </tr>
//             ) : books.length > 0 ? (
//               books.map((book) => (
//                 <tr key={book._id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {book.full_image && book.full_image.length > 0 ? (
//                       <img
//                         src={book.full_image[0]}
//                         alt={book.title}
//                         className="h-12 w-12 object-cover rounded-lg"
//                       />
//                     ) : (
//                       <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
//                         <ImageIcon className="h-6 w-6 text-gray-400" />
//                       </div>
//                     )}
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="text-sm font-medium text-gray-900">{book.title}</div>
//                     {book.tag && book.tag.length > 0 && (
//                       <div className="flex items-center gap-1 mt-1">
//                         <Tag className="h-3 w-3 text-gray-400" />
//                         <span className="text-xs text-gray-500">{book.tag.join(', ')}</span>
//                       </div>
//                     )}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-gray-600">
//                       {book.category?.name || 'N/A'}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-gray-900">₹{book.price}</div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-green-600 font-semibold">₹{book.discount_price}</div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-gray-600">{book.stock}</div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <StatusBadge status={book.status} />
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <div className="flex items-center space-x-3">
//                       <button
//                         onClick={() => handleView(book)}
//                         className="text-blue-600 hover:text-blue-900"
//                         title="View"
//                       >
//                         <Eye className="h-5 w-5" />
//                       </button>
//                       <button
//                         onClick={() => handleEdit(book)}
//                         className="text-green-600 hover:text-green-900"
//                         title="Edit"
//                       >
//                         <Edit className="h-5 w-5" />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(book._id)}
//                         className="text-red-600 hover:text-red-900"
//                         title="Delete"
//                       >
//                         <Trash2 className="h-5 w-5" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
//                   No books found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex justify-between items-center px-6 py-4 border-t">
//             <button
//               onClick={() => setPage(prev => Math.max(prev - 1, 1))}
//               disabled={page === 1}
//               className="flex items-center gap-1 px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
//             >
//               <ChevronLeft className="h-4 w-4" />
//               Previous
//             </button>
//             <span className="text-sm text-gray-700">
//               Page {page} of {totalPages}
//             </span>
//             <button
//               onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
//               disabled={page === totalPages}
//               className="flex items-center gap-1 px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
//             >
//               Next
//               <ChevronRight className="h-4 w-4" />
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Create/Edit Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
//           <div className="bg-white rounded-lg w-full max-w-2xl my-8 p-6">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold">
//                 {editingBook ? 'Edit Book' : 'Create Book'}
//               </h2>
//               <button
//                 onClick={() => {
//                   setShowModal(false);
//                   resetForm();
//                 }}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <X className="h-6 w-6" />
//               </button>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
//               {/* Category Selection */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Category *
//                   </label>
//                   <select
//                     name="book_category_id"
//                     value={formData.book_category_id}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   >
//                     <option value="">Select Category</option>
//                     {categories.map((category) => (
//                       <option key={category._id} value={category._id}>
//                         {category.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Subcategory *
//                   </label>
//                   <select
//                     name="book_subcategory_id"
//                     value={formData.book_subcategory_id}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                     disabled={!formData.book_category_id}
//                   >
//                     <option value="">Select Subcategory</option>
//                     {subcategories.map((subcategory) => (
//                       <option key={subcategory._id} value={subcategory._id}>
//                         {subcategory.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               {/* Title */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Title *
//                 </label>
//                 <input
//                   type="text"
//                   name="title"
//                   value={formData.title}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//               </div>

//               {/* Description */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Description
//                 </label>
//                 <textarea
//                   name="book_description"
//                   value={formData.book_description}
//                   onChange={handleInputChange}
//                   rows="3"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               {/* Price and Stock */}
//               <div className="grid grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Price *
//                   </label>
//                   <input
//                     type="number"
//                     name="price"
//                     value={formData.price}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Discount Price *
//                   </label>
//                   <input
//                     type="number"
//                     name="discount_price"
//                     value={formData.discount_price}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Stock *
//                   </label>
//                   <input
//                     type="number"
//                     name="stock"
//                     value={formData.stock}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Language and Status */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Language
//                   </label>
//                   <select
//                     name="language"
//                     value={formData.language}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="english">English</option>
//                     <option value="hindi">Hindi</option>
//                     <option value="both">Both</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Status
//                   </label>
//                   <select
//                     name="status"
//                     value={formData.status}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="active">Active</option>
//                     <option value="inactive">Inactive</option>
//                   </select>
//                 </div>
//               </div>

//               {/* Tags */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Tags
//                 </label>
//                 <div className="flex gap-2 mb-2">
//                   <input
//                     type="text"
//                     value={tagInput}
//                     onChange={(e) => setTagInput(e.target.value)}
//                     onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
//                     placeholder="Enter tag"
//                     className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                   <button
//                     type="button"
//                     onClick={addTag}
//                     className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
//                   >
//                     Add
//                   </button>
//                 </div>
//                 <div className="flex flex-wrap gap-2">
//                   {formData.tag.map((tag, index) => (
//                     <span
//                       key={index}
//                       className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
//                     >
//                       {tag}
//                       <button
//                         type="button"
//                         onClick={() => removeTag(index)}
//                         className="hover:text-blue-600"
//                       >
//                         <X className="h-3 w-3" />
//                       </button>
//                     </span>
//                   ))}
//                 </div>
//               </div>

//               {/* Key Features */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Key Features
//                 </label>
//                 <div className="grid grid-cols-2 gap-2 mb-2">
//                   <input
//                     type="text"
//                     placeholder="Title"
//                     value={featureInput.title}
//                     onChange={(e) => setFeatureInput(prev => ({ ...prev, title: e.target.value }))}
//                     className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                   <input
//                     type="text"
//                     placeholder="Value"
//                     value={featureInput.value}
//                     onChange={(e) => setFeatureInput(prev => ({ ...prev, value: e.target.value }))}
//                     className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                   <button
//                     type="button"
//                     onClick={addKeyFeature}
//                     className="col-span-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
//                   >
//                     Add Feature
//                   </button>
//                 </div>
//                 <div className="space-y-2">
//                   {formData.book_key_features.map((feature, index) => (
//                     <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
//                       <span className="text-sm">
//                         <strong>{feature.title}:</strong> {feature.value}
//                       </span>
//                       <button
//                         type="button"
//                         onClick={() => removeKeyFeature(index)}
//                         className="text-red-600 hover:text-red-900"
//                       >
//                         <X className="h-4 w-4" />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Images */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Images
//                 </label>
//                 <div className="flex items-center space-x-4">
//                   <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg flex items-center gap-2">
//                     <Upload className="h-5 w-5" />
//                     Upload Images
//                     <input
//                       type="file"
//                       accept="image/*"
//                       multiple
//                       onChange={handleImagesChange}
//                       className="hidden"
//                     />
//                   </label>
//                 </div>
//                 {imagePreviews.length > 0 && (
//                   <div className="grid grid-cols-4 gap-2 mt-4">
//                     {imagePreviews.map((preview, index) => (
//                       <div key={index} className="relative">
//                         <img
//                           src={preview}
//                           alt={`Preview ${index + 1}`}
//                           className="h-20 w-20 object-cover rounded-lg"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => removeImage(index)}
//                           className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
//                         >
//                           <X className="h-3 w-3" />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Form Actions */}
//               <div className="flex justify-end gap-3 pt-4 border-t">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowModal(false);
//                     resetForm();
//                   }}
//                   className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
//                 >
//                   {loading && <Loader className="h-4 w-4 animate-spin" />}
//                   {editingBook ? 'Update' : 'Create'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Books;



// components/Pages/Books/Books.jsx
import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  X,
  Upload,
  Loader,
  Tag,
  FileText,
  Download
} from 'lucide-react';
import axiosInstance from '../../../config/AxiosInstance';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    book_category_id: '',
    book_subcategory_id: '',
    title: '',
    book_description: '',
    price: '',
    discount_price: '',
    stock: '',
    language: 'english',
    status: 'active',
    tag: [],
    book_key_features: [],
    images: [],
    free_pdf: null,
    paid_pdf: null
  });
  const [tagInput, setTagInput] = useState('');
  const [featureInput, setFeatureInput] = useState({ title: '', value: '' });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [freePdfName, setFreePdfName] = useState('');
  const [paidPdfName, setPaidPdfName] = useState('');
  const limit = 10;

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/book-categories?limit=100');
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Fetch subcategories based on selected category
  const fetchSubcategories = async (categoryId) => {
    if (!categoryId) {
      setSubcategories([]);
      return;
    }
    try {
      const response = await axiosInstance.get(`/book-sub-categories?book_category_id=${categoryId}&limit=100`);
      setSubcategories(response.data.data || []);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  // Fetch books
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/books?page=${page}&limit=${limit}&search=${search}`);
      console.log("books response ::", response.data);

      const groupedData = response.data.data || {};

      // convert grouped object → flat array
      const booksArray = Object.values(groupedData).flatMap(group => group.books);

      setBooks(booksArray);
      setTotalPages(response.data.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchBooks();
  }, [page, search]);

  // Handle category change
  useEffect(() => {
    if (formData.book_category_id) {
      fetchSubcategories(formData.book_category_id);
    } else {
      setSubcategories([]);
    }
  }, [formData.book_category_id]);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'book_category_id') {
      setFormData(prev => ({ ...prev, book_subcategory_id: '' }));
    }
  };

  // Handle images change
  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
      
      // Create previews
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Handle free PDF change
  const handleFreePdfChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, free_pdf: file }));
      setFreePdfName(file.name);
    }
  };

  // Handle paid PDF change
  const handlePaidPdfChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, paid_pdf: file }));
      setPaidPdfName(file.name);
    }
  };

  // Remove image
  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Add tag
  const addTag = () => {
    if (tagInput.trim()) {
      setFormData(prev => ({
        ...prev,
        tag: [...prev.tag, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  // Remove tag
  const removeTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tag: prev.tag.filter((_, i) => i !== index)
    }));
  };

  // Add key feature
  const addKeyFeature = () => {
    if (featureInput.title.trim() && featureInput.value.trim()) {
      setFormData(prev => ({
        ...prev,
        book_key_features: [...prev.book_key_features, { ...featureInput }]
      }));
      setFeatureInput({ title: '', value: '' });
    }
  };

  // Remove key feature
  const removeKeyFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      book_key_features: prev.book_key_features.filter((_, i) => i !== index)
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      book_category_id: '',
      book_subcategory_id: '',
      title: '',
      book_description: '',
      price: '',
      discount_price: '',
      stock: '',
      language: 'english',
      status: 'active',
      tag: [],
      book_key_features: [],
      images: [],
      free_pdf: null,
      paid_pdf: null
    });
    setImagePreviews([]);
    setFreePdfName('');
    setPaidPdfName('');
    setTagInput('');
    setFeatureInput({ title: '', value: '' });
    setEditingBook(null);
  };

  // Open create modal
  const handleCreate = () => {
    resetForm();
    setShowModal(true);
  };

  // Open edit modal
  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData({
      book_category_id: book.book_category_id?._id || book.book_category_id,
      book_subcategory_id: book.book_subcategory_id,
      title: book.title,
      book_description: book.book_description || '',
      price: book.price,
      discount_price: book.discount_price,
      stock: book.stock,
      language: book.language,
      status: book.status,
      tag: book.tag || [],
      book_key_features: book.book_key_features || [],
      images: [],
      free_pdf: null,
      paid_pdf: null
    });
    setImagePreviews(book.full_image || []);
    if (book.free_pdf_url) setFreePdfName('Current PDF: ' + book.free_pdf);
    if (book.paid_pdf_url) setPaidPdfName('Current PDF: ' + book.paid_pdf);
    setShowModal(true);
  };

  // View book details
  const handleView = (book) => {
    setSelectedBook(book);
    setShowViewModal(true);
  };

  // Close view modal
  const closeViewModal = () => {
    setShowViewModal(false);
    setSelectedBook(null);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title) {
      toast.error('Book title is required');
      return;
    }
    if (!formData.book_category_id) {
      toast.error('Please select a category');
      return;
    }
    if (!formData.book_subcategory_id) {
      toast.error('Please select a subcategory');
      return;
    }

    setLoading(true);
    try {
      const submitData = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'images' && formData.images.length > 0) {
          formData.images.forEach(image => {
            submitData.append('images', image);
          });
        } else if (key === 'tag') {
          submitData.append('tag', formData.tag.join(','));
        } else if (key === 'book_key_features') {
          submitData.append('book_key_features', JSON.stringify(formData.book_key_features));
        } else if (key === 'free_pdf' && formData.free_pdf) {
          submitData.append('free_pdf', formData.free_pdf);
        } else if (key === 'paid_pdf' && formData.paid_pdf) {
          submitData.append('paid_pdf', formData.paid_pdf);
        } else if (key !== 'images' && key !== 'free_pdf' && key !== 'paid_pdf') {
          submitData.append(key, formData[key]);
        }
      });

      let response;
      if (editingBook) {
        response = await axiosInstance.put(`/books/${editingBook._id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Book updated successfully');
      } else {
        response = await axiosInstance.post('/books', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Book created successfully');
      }

      setShowModal(false);
      resetForm();
      fetchBooks();
    } catch (error) {
      console.error('Error saving book:', error);
      toast.error(error.response?.data?.message || 'Failed to save book');
    } finally {
      setLoading(false);
    }
  };

  // Delete book
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
        await axiosInstance.delete(`/books/${id}`);
        toast.success('Book deleted successfully');
        fetchBooks();
      } catch (error) {
        console.error('Error deleting book:', error);
        toast.error('Failed to delete book');
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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-800">Books Management</h1>
        </div>
        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Book
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search books..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Books Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Discount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <Loader className="h-8 w-8 animate-spin text-blue-600" />
                  </div>
                </td>
              </tr>
            ) : books.length > 0 ? (
              books.map((book) => (
                <tr key={book._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {book.full_image && book.full_image.length > 0 ? (
                      <img
                        src={book.full_image[0]}
                        alt={book.title}
                        className="h-12 w-12 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{book.title}</div>
                    {book.tag && book.tag.length > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <Tag className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{book.tag.join(', ')}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {book.category?.name || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">₹{book.price}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-green-600 font-semibold">₹{book.discount_price}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{book.stock}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={book.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleView(book)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(book)}
                        className="text-green-600 hover:text-green-900"
                        title="Edit"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(book._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                  No books found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center px-6 py-4 border-t">
            <button
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* View Book Modal */}
      {showViewModal && selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-3xl my-8 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Book Details</h2>
              <button
                onClick={closeViewModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
              {/* Images */}
              {selectedBook.full_image && selectedBook.full_image.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Images</h3>
                  <div className="flex gap-2 flex-wrap">
                    {selectedBook.full_image.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Book ${index + 1}`}
                        className="h-24 w-24 object-cover rounded-lg border"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Title</h3>
                  <p className="text-base text-gray-900">{selectedBook.title}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Category</h3>
                  <p className="text-base text-gray-900">{selectedBook.category?.name || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Subcategory</h3>
                  <p className="text-base text-gray-900">{selectedBook.book_subcategory_name || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Language</h3>
                  <p className="text-base text-gray-900 capitalize">{selectedBook.language}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Price</h3>
                  <p className="text-base text-gray-900">₹{selectedBook.price}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Discount Price</h3>
                  <p className="text-base text-green-600 font-semibold">₹{selectedBook.discount_price}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Stock</h3>
                  <p className="text-base text-gray-900">{selectedBook.stock}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <StatusBadge status={selectedBook.status} />
                </div>
              </div>

              {/* Description */}
              {selectedBook.book_description && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{selectedBook.book_description}</p>
                </div>
              )}

              {/* Tags */}
              {selectedBook.tag && selectedBook.tag.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedBook.tag.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Features */}
              {selectedBook.book_key_features && selectedBook.book_key_features.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Key Features</h3>
                  <div className="bg-gray-50 rounded-lg p-3">
                    {selectedBook.book_key_features.map((feature, index) => (
                      <div key={index} className="flex py-1 border-b last:border-0">
                        <span className="w-1/3 font-medium">{feature.title}:</span>
                        <span className="w-2/3 text-gray-700">{feature.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PDFs */}
              <div className="grid grid-cols-2 gap-4">
                {selectedBook.free_pdf_url && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Free PDF</h3>
                    <a
                      href={selectedBook.free_pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                    >
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">View PDF</span>
                      <Download className="h-4 w-4" />
                    </a>
                  </div>
                )}

                {selectedBook.paid_pdf_url && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Paid PDF</h3>
                    <a
                      href={selectedBook.paid_pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
                    >
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">View PDF</span>
                      <Download className="h-4 w-4" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={closeViewModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-2xl my-8 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingBook ? 'Edit Book' : 'Create Book'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
              {/* Category Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    name="book_category_id"
                    value={formData.book_category_id}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    Subcategory *
                  </label>
                  <select
                    name="book_subcategory_id"
                    value={formData.book_subcategory_id}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={!formData.book_category_id}
                  >
                    <option value="">Select Subcategory</option>
                    {subcategories.map((subcategory) => (
                      <option key={subcategory._id} value={subcategory._id}>
                        {subcategory.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="book_description"
                  value={formData.book_description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Price and Stock */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Price *
                  </label>
                  <input
                    type="number"
                    name="discount_price"
                    value={formData.discount_price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Language and Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Language
                  </label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="english">English</option>
                    <option value="hindi">Hindi</option>
                    <option value="both">Both</option>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Enter tag"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tag.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="hover:text-blue-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Key Features
                </label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Title"
                    value={featureInput.title}
                    onChange={(e) => setFeatureInput(prev => ({ ...prev, title: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={featureInput.value}
                    onChange={(e) => setFeatureInput(prev => ({ ...prev, value: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addKeyFeature}
                    className="col-span-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    Add Feature
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.book_key_features.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm">
                        <strong>{feature.title}:</strong> {feature.value}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeKeyFeature(index)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Images
                </label>
                <div className="flex items-center space-x-4">
                  <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Upload Images
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImagesChange}
                      className="hidden"
                    />
                  </label>
                </div>
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="h-20 w-20 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Free PDF */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Free PDF
                </label>
                <div className="flex items-center space-x-4">
                  <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {freePdfName || 'Upload Free PDF'}
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFreePdfChange}
                      className="hidden"
                    />
                  </label>
                  {freePdfName && (
                    <span className="text-sm text-gray-600">{freePdfName}</span>
                  )}
                </div>
              </div>

              {/* Paid PDF */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Paid PDF
                </label>
                <div className="flex items-center space-x-4">
                  <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {paidPdfName || 'Upload Paid PDF'}
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handlePaidPdfChange}
                      className="hidden"
                    />
                  </label>
                  {paidPdfName && (
                    <span className="text-sm text-gray-600">{paidPdfName}</span>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading && <Loader className="h-4 w-4 animate-spin" />}
                  {editingBook ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Books;