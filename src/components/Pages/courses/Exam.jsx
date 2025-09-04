


import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaEye, FaGraduationCap } from 'react-icons/fa';
import axiosInstance from '../../../config/AxiosInstance';


const Exam = () => {
  const [exams, setExams] = useState([]);
  const [examTypes, setExamTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    examType: '',
    status: 'active'
  });
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchExams();
    fetchExamTypes();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      // const response = await axios.get('https://api.pvclasses.in/api/exams');
            const response = await axiosInstance.get('/exams'); // ✅ using axiosInstance

      setExams(response.data);
    } catch (error) {
      toast.error('Error fetching exams');
    } finally {
      setLoading(false);
    }
  };

  const fetchExamTypes = async () => {
    try {
      // const response = await axios.get('https://api.pvclasses.in/api/exam-types');
            const response = await axiosInstance.get('/exam-types'); // ✅ using axiosInstance

      setExamTypes(response.data);
    } catch (error) {
      toast.error('Error fetching exam types');
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
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('slug', slugify(formData.name));
      formDataToSend.append('description', formData.description);
      formDataToSend.append('examType', formData.examType);

      if (logo) {
        formDataToSend.append('logo', logo);
      }

      if (editingId) {
        // await axios.put(`https://api.pvclasses.in/api/exams/${editingId}`, formDataToSend, {
        //   headers: {
        //     'Content-Type': 'multipart/form-data'
        //   }
        // });

            await axiosInstance.put(`/exams/${editingId}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Exam updated successfully');
      } else {
        // await axios.post('https://api.pvclasses.in/api/exams', formDataToSend, {
                await axiosInstance.post('/exams', formDataToSend, {

          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Exam created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchExams();
    } catch (error) {
      toast.error('Error saving exam');
    }
  };

  const handleEdit = (exam) => {
    setFormData({
      name: exam.name,
      description: exam.description,
      examType: exam.examType._id,
      status: exam.status
    });
    setEditingId(exam._id);
    if (exam.logo) {
      setLogoPreview(`https://api.pvclasses.in${exam.logo}`);
    }
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      try {
        // await axios.delete(`https://api.pvclasses.in/api/exams/${id}`);
                await axiosInstance.delete(`/exams/${id}`); // ✅ using axiosInstance

        toast.success('Exam deleted successfully');
        fetchExams();
      } catch (error) {
        toast.error('Error deleting exam');
      }
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      examType: '',
      status: 'active'
    });
    setLogo(null);
    setLogoPreview(null);
    setEditingId(null);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-800">Exam Management</h1>
            <p className="text-gray-600 mt-2">Create and manage exams for your platform</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg shadow-md transition-colors"
          >
            <FaPlus className="mr-2" /> Add New Exam
          </button>
        </div>

        {/* Exams Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => (
              <div key={exam._id} className="bg-white rounded-xl shadow-md overflow-hidden border border-green-100 hover:shadow-lg transition-shadow">
                <div className="p-5">
                  <div className="flex items-center mb-4">
                    {exam.logo ? (
                      <img 
                        src={`https://api.pvclasses.in${exam.logo}`} 
                        alt={exam.name} 
                        className="h-14 w-14 rounded-full object-cover border-2 border-green-200" 
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center">
                        <FaGraduationCap className="text-green-600 text-xl" />
                      </div>
                    )}
                    <div className="ml-4">
                      <h3 className="font-semibold text-lg text-green-800">{exam.name}</h3>
                      <p className="text-sm text-gray-500">{exam.examType?.name}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 h-12 overflow-hidden">
                    {exam.description.length > 80 
                      ? `${exam.description.substring(0, 80)}...` 
                      : exam.description}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <span className={`px-3 py-1 rounded-full text-xs ${exam.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {exam.status}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(exam)}
                        className="text-green-600 hover:text-green-800 p-2 rounded-full hover:bg-green-100 transition-colors"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(exam._id)}
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

        {exams.length === 0 && !loading && (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <div className="mx-auto w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <FaGraduationCap className="text-green-600 text-3xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No exams yet</h3>
            <p className="text-gray-500 mb-4">Get started by creating your first exam</p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FaPlus className="mr-2" /> Create Exam
            </button>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full h-[90vh] max-w-md overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b border-green-100">
                <h2 className="text-xl font-semibold text-green-800">
                  {editingId ? 'Edit Exam' : 'Add New Exam'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exam Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                    placeholder="Enter exam name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                    rows="3"
                    placeholder="Enter exam description"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
                  <select
                    value={formData.examType}
                    onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                    required
                  >
                    <option value="">Select Exam Type</option>
                    {examTypes.map((examType) => (
                      <option key={examType._id} value={examType._id}>
                        {examType.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                  <div className="flex items-center space-x-4">
                    <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-green-300 rounded-lg cursor-pointer bg-green-50 hover:bg-green-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FaEye className="w-8 h-8 text-green-500 mb-2" />
                        <p className="text-xs text-green-700">Upload Logo</p>
                      </div>
                      <input
                        type="file"
                        onChange={handleLogoChange}
                        className="hidden"
                        accept="image/*"
                      />
                    </label>
                    
                    {logoPreview && (
                      <div className="flex flex-col items-center">
                        <img src={logoPreview} alt="Preview" className="w-16 h-16 rounded-full object-cover border border-green-200" />
                        <span className="text-xs mt-1 text-gray-600">Preview</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-5 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                  >
                    {editingId ? 'Update Exam' : 'Create Exam'}
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

export default Exam;