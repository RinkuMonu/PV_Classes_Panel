
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import { FaEdit, FaTrash, FaPlus, FaTimes, FaEye, FaGraduationCap } from 'react-icons/fa';
import axiosInstance from '../../../config/AxiosInstance';
import TableActionButton from '../../common/TableActionButton';


const Exam = () => {
  const [exams, setExams] = useState([]);
  const [examTypes, setExamTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    examType: '',
    serialNo: 0,
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
    } catch {
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
    } catch {
      toast.error('Error fetching exam types');
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
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('slug', slugify(formData.name));
      formDataToSend.append('description', formData.description);
      formDataToSend.append('examType', formData.examType);
      formDataToSend.append('serialNo', formData.serialNo);

      if (logo) {
        // formDataToSend.append('logo', logo);
        formDataToSend.append('image', logo);
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
    } catch {
      toast.error('Error saving exam');
    }
  };

  const handleEdit = (exam) => {
    setFormData({
      name: exam.name,
      description: exam.description,
      examType: exam.examType._id,
      serialNo: exam.serialNo || 0,
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
      } catch {
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
      serialNo: 0,
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
        {/* UI-only: standardized page header; exam logic is unchanged. */}
        <div data-page-icon data-icon-symbol="✓" className="bg-gradient-to-r from-[#204972] to-[#87b105] rounded-xl shadow-lg mb-6 p-6 text-white flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Exam Management</h1>
            <p className="mt-1 opacity-90">Create and manage exams for your platform</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center bg-[#204972] hover:bg-[#183654] text-white px-4 py-3 rounded-lg shadow-md transition-colors"
          >
            <FaPlus className="mr-2" /> Add New Exam
          </button>
        </div>

        {/* UI-only: restore the original Exams card layout with shared table-style action icons. */}
        {loading ? <div className="flex h-64 items-center justify-center"><div className="h-12 w-12 animate-spin rounded-full border-2 border-[#204972] border-t-transparent" /></div> : exams.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">{exams.map((exam) => { const status = exam.status || (exam.isActive === false ? 'inactive' : 'active'); return (
            <div key={exam._id} className="flex h-full flex-col rounded-xl border border-[#204972]/10 bg-white p-5 shadow-md transition-shadow hover:shadow-lg"><div className="mb-4 flex items-center">{exam.logo ? <img src={`https://api.pvclasses.in${exam.logo}`} alt={exam.name} className="h-14 w-14 rounded-full border-2 border-[#204972]/20 object-cover" /> : <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#204972]/10"><FaGraduationCap className="text-xl text-[#204972]" /></div>}<div className="ml-4"><h3 className="text-lg font-semibold text-[#204972]">{exam.name}</h3><p className="text-xs font-medium text-[#87b105]">Serial No: {exam.serialNo || 0}</p><p className="text-sm text-gray-500">{exam.examType?.name}</p></div></div><p className="mb-4 h-12 overflow-hidden text-sm text-gray-600">{exam.description?.length > 80 ? `${exam.description.substring(0, 80)}...` : exam.description || 'No description'}</p><div className="mt-auto flex items-center justify-between"><span className={`rounded-full px-3 py-1 text-xs ${status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{status}</span><div className="flex gap-3"><TableActionButton onClick={() => handleEdit(exam)} tone="edit" title="Edit exam"><FaEdit /></TableActionButton><TableActionButton onClick={() => handleDelete(exam._id)} tone="delete" title="Delete exam"><FaTrash /></TableActionButton></div></div></div>
          ); })}</div>
        ) : <div className="rounded-xl bg-white py-16 text-center shadow-md"><FaGraduationCap className="mx-auto mb-4 text-3xl text-[#204972]" /><h3 className="text-lg font-medium text-gray-700">No exams yet</h3></div>}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-50 ">
            {/* UI-only: clip the themed exam overlay to its rounded card border. */}
            <div className="bg-white rounded-2xl shadow-2xl w-full h-[90vh] max-w-md overflow-y-auto no-scrollbar"> 
              <div className="flex justify-between items-center p-6 border-b border-green-100 ">
                <h2 className="text-xl font-semibold text-black">
                  {editingId ? 'Edit Exam' : 'Add New Exam'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4 ">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exam Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#87b105] focus:border-[#87b105] outline-none transition"
                    placeholder="Enter exam name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#87b105] focus:border-[#87b105] outline-none transition"
                    rows="3"
                    placeholder="Enter exam description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Exam Type
                  </label>

                  <select
                    value={formData.examType}
                    onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#87b105] focus:border-[#87b105] outline-none transition"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Serial Number
                  </label>

                  <input
                    type="number"
                    value={formData.serialNo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        serialNo: Number(e.target.value)
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#87b105] focus:border-[#87b105] outline-none transition"
                    placeholder="Enter serial number"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                  <div className="flex items-center space-x-4">
                    <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-green-300 rounded-lg cursor-pointer bg-green-50  transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FaEye className="w-8 h-8 text-[#87b105] mb-2" />
                        <p className="text-xs text-green-700 font-bold">Upload Logo</p>
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#87b105] focus:border-[#87b105] outline-none transition"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-5 py-2 border  text-white bg-red-600 hover:scale-105 ease-in-out rounded-lg font-medium transition-colors form-cancel-button"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#204972] hover:bg-[#183654] hover:scale-105 ease-in-out text-white rounded-lg font-medium transition-colors"
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
