// components/TestSeries/TestSeriesForm.jsx
import React, { useState, useEffect } from 'react';
import { getExams } from '../../../services/examApi';

const TestSeriesForm = ({ series, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    exam_id: '',
    title: '',
    title_tag: '',
    description: '',
    price: 0,
    discount_price: 0,
    validity: '',
    total_tests: 0,
    subjects: [],
    is_active: true,
    images: []
  });
  const [exams, setExams] = useState([]);
  const [newSubject, setNewSubject] = useState({ name: '', test_count: 0 });
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExams();
    if (series) {
      setFormData({
        exam_id: series.exam_id?._id || series.exam_id || '',
        title: series.title || '',
        title_tag: series.title_tag || '',
        description: series.description || '',
        price: series.price || 0,
        discount_price: series.discount_price || 0,
        validity: series.validity || '',
        total_tests: series.total_tests || 0,
        subjects: series.subjects || [],
        is_active: series.is_active !== undefined ? series.is_active : true,
        images: series.images || []
      });
    }
  }, [series]);

  const fetchExams = async () => {
    try {
      const response = await getExams();
      setExams(response.data);
    } catch (err) {
      console.error('Failed to fetch exams', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddSubject = () => {
    if (newSubject.name.trim()) {
      setFormData(prev => ({
        ...prev,
        subjects: [...prev.subjects, { ...newSubject }]
      }));
      setNewSubject({ name: '', test_count: 0 });
    }
  };

  const handleRemoveSubject = (index) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = (e) => {
    setImageFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'subjects') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Append images
      imageFiles.forEach(file => {
        formDataToSend.append('images', file);
      });
      
      await onSubmit(formDataToSend);
    } catch (err) {
      console.error('Form submission error', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6">
        {series ? 'Edit Test Series' : 'Create New Test Series'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Exam</label>
            <select
              name="exam_id"
              value={formData.exam_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="">Select Exam</option>
              {exams.map(exam => (
                <option key={exam._id} value={exam._id}>{exam.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title Tag</label>
            <input
              type="text"
              name="title_tag"
              value={formData.title_tag}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price (₹)</label>
            <input
              type="number"
              name="discount_price"
              value={formData.discount_price}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Validity</label>
            <input
              type="text"
              name="validity"
              value={formData.validity}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="e.g., 6 months, 1 year"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Tests</label>
            <input
              type="number"
              name="total_tests"
              value={formData.total_tests}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_active"
              id="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
              Active
            </label>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 border rounded-md"
          ></textarea>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Subjects</label>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              placeholder="Subject name"
              value={newSubject.name}
              onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
              className="px-3 py-2 border rounded-md flex-1"
            />
            <input
              type="number"
              placeholder="Test count"
              value={newSubject.test_count}
              onChange={(e) => setNewSubject({...newSubject, test_count: parseInt(e.target.value) || 0})}
              className="px-3 py-2 border rounded-md w-24"
            />
            <button
              type="button"
              onClick={handleAddSubject}
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Add
            </button>
          </div>
          
          {formData.subjects.length > 0 && (
            <ul className="border rounded-md divide-y">
              {formData.subjects.map((subject, index) => (
                <li key={index} className="px-3 py-2 flex justify-between items-center">
                  <span>
                    {subject.name} ({subject.test_count} tests)
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubject(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="w-full px-3 py-2 border rounded-md"
            accept="image/*"
          />
          {formData.images.length > 0 && !imageFiles.length && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-1">Current images:</p>
              <div className="flex flex-wrap gap-2">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={`https://api.pvclasses.in/uploads/testSeries/${img}`} 
                      alt={`Preview ${index + 1}`} 
                      className="h-20 w-20 object-cover rounded"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : (series ? 'Update' : 'Create')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TestSeriesForm;