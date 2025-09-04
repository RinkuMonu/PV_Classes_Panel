// // components/TestSeries/TestSeriesForm.jsx
// import React, { useState, useEffect } from 'react';
// import { getExams } from '../../../services/examApi';

// const TestSeriesForm = ({ series, onSubmit, onCancel }) => {
//   const [formData, setFormData] = useState({
//     exam_id: '',
//     title: '',
//     title_tag: '',
//     description: '',
//     price: 0,
//     discount_price: 0,
//     validity: '',
//     total_tests: 0,
//     subjects: [],
//     is_active: true,
//     images: []
//   });
//   const [exams, setExams] = useState([]);
//   const [newSubject, setNewSubject] = useState({ name: '', test_count: 0 });
//   const [imageFiles, setImageFiles] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchExams();
//     if (series) {
//       setFormData({
//         exam_id: series.exam_id?._id || series.exam_id || '',
//         title: series.title || '',
//         title_tag: series.title_tag || '',
//         description: series.description || '',
//         price: series.price || 0,
//         discount_price: series.discount_price || 0,
//         validity: series.validity || '',
//         total_tests: series.total_tests || 0,
//         subjects: series.subjects || [],
//         is_active: series.is_active !== undefined ? series.is_active : true,
//         images: series.images || []
//       });
//     }
//   }, [series]);

//   const fetchExams = async () => {
//     try {
//       const response = await getExams();
//       setExams(response.data);
//     } catch (err) {
//       console.error('Failed to fetch exams', err);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleAddSubject = () => {
//     if (newSubject.name.trim()) {
//       setFormData(prev => ({
//         ...prev,
//         subjects: [...prev.subjects, { ...newSubject }]
//       }));
//       setNewSubject({ name: '', test_count: 0 });
//     }
//   };

//   const handleRemoveSubject = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       subjects: prev.subjects.filter((_, i) => i !== index)
//     }));
//   };

//   const handleImageChange = (e) => {
//     setImageFiles(Array.from(e.target.files));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
    
//     try {
//       const formDataToSend = new FormData();
      
//       // Append all form fields
//       Object.keys(formData).forEach(key => {
//         if (key === 'subjects') {
//           formDataToSend.append(key, JSON.stringify(formData[key]));
//         } else {
//           formDataToSend.append(key, formData[key]);
//         }
//       });
      
//       // Append images
//       imageFiles.forEach(file => {
//         formDataToSend.append('images', file);
//       });
      
//       await onSubmit(formDataToSend);
//     } catch (err) {
//       console.error('Form submission error', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded shadow-md">
//       <h2 className="text-2xl font-bold mb-6">
//         {series ? 'Edit Test Series' : 'Create New Test Series'}
//       </h2>
      
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Exam</label>
//             <select
//               name="exam_id"
//               value={formData.exam_id}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded-md"
//               required
//             >
//               <option value="">Select Exam</option>
//               {exams.map(exam => (
//                 <option key={exam._id} value={exam._id}>{exam.name}</option>
//               ))}
//             </select>
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
//             <input
//               type="text"
//               name="title"
//               value={formData.title}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded-md"
//               required
//             />
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Title Tag</label>
//             <input
//               type="text"
//               name="title_tag"
//               value={formData.title_tag}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded-md"
//             />
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
//             <input
//               type="number"
//               name="price"
//               value={formData.price}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded-md"
//               required
//             />
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price (₹)</label>
//             <input
//               type="number"
//               name="discount_price"
//               value={formData.discount_price}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded-md"
//             />
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Validity</label>
//             <input
//               type="text"
//               name="validity"
//               value={formData.validity}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded-md"
//               placeholder="e.g., 6 months, 1 year"
//               required
//             />
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Total Tests</label>
//             <input
//               type="number"
//               name="total_tests"
//               value={formData.total_tests}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded-md"
//               required
//             />
//           </div>
          
//           <div className="flex items-center">
//             <input
//               type="checkbox"
//               name="is_active"
//               id="is_active"
//               checked={formData.is_active}
//               onChange={handleChange}
//               className="h-4 w-4 text-blue-600 rounded"
//             />
//             <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
//               Active
//             </label>
//           </div>
//         </div>
        
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//           <textarea
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             rows="4"
//             className="w-full px-3 py-2 border rounded-md"
//           ></textarea>
//         </div>
        
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">Subjects</label>
//           <div className="flex space-x-2 mb-2">
//             <input
//               type="text"
//               placeholder="Subject name"
//               value={newSubject.name}
//               onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
//               className="px-3 py-2 border rounded-md flex-1"
//             />
//             <input
//               type="number"
//               placeholder="Test count"
//               value={newSubject.test_count}
//               onChange={(e) => setNewSubject({...newSubject, test_count: parseInt(e.target.value) || 0})}
//               className="px-3 py-2 border rounded-md w-24"
//             />
//             <button
//               type="button"
//               onClick={handleAddSubject}
//               className="px-4 py-2 bg-blue-600 text-white rounded-md"
//             >
//               Add
//             </button>
//           </div>
          
//           {formData.subjects.length > 0 && (
//             <ul className="border rounded-md divide-y">
//               {formData.subjects.map((subject, index) => (
//                 <li key={index} className="px-3 py-2 flex justify-between items-center">
//                   <span>
//                     {subject.name} ({subject.test_count} tests)
//                   </span>
//                   <button
//                     type="button"
//                     onClick={() => handleRemoveSubject(index)}
//                     className="text-red-600 hover:text-red-800"
//                   >
//                     Remove
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
        
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
//           <input
//             type="file"
//             multiple
//             onChange={handleImageChange}
//             className="w-full px-3 py-2 border rounded-md"
//             accept="image/*"
//           />
//           {formData.images.length > 0 && !imageFiles.length && (
//             <div className="mt-2">
//               <p className="text-sm text-gray-600 mb-1">Current images:</p>
//               <div className="flex flex-wrap gap-2">
//                 {formData.images.map((img, index) => (
//                   <div key={index} className="relative">
//                     <img 
//                       src={`https://api.pvclasses.in/uploads/testSeries/${img}`} 
//                       alt={`Preview ${index + 1}`} 
//                       className="h-20 w-20 object-cover rounded"
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
        
//         <div className="flex justify-end space-x-4">
//           <button
//             type="button"
//             onClick={onCancel}
//             className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={loading}
//             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
//           >
//             {loading ? 'Saving...' : (series ? 'Update' : 'Create')}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default TestSeriesForm;



// components/TestSeries/TestSeriesForm.jsx
import React, { useState, useEffect } from 'react';
import { getExams } from '../../../services/examApi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      toast.error('Failed to fetch exams. Please try again.');
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
      toast.success('Subject added successfully!');
    } else {
      toast.error('Please enter a subject name');
    }
  };

  const handleRemoveSubject = (index) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index)
    }));
    toast.info('Subject removed');
  };

  const handleImageChange = (e) => {
    setImageFiles(Array.from(e.target.files));
    if (e.target.files.length > 0) {
      toast.success(`${e.target.files.length} image(s) selected`);
    }
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
      toast.success(`Test Series ${series ? 'updated' : 'created'} successfully!`);
    } catch (err) {
      console.error('Form submission error', err);
      toast.error(`Failed to ${series ? 'update' : 'create'} test series. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-green-100">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <h2 className="text-2xl font-bold mb-6 text-green-800 border-b border-green-200 pb-3">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Validity</label>
            <input
              type="text"
              name="validity"
              value={formData.validity}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              required
            />
          </div>
          
          <div className="flex items-center p-2 bg-green-50 rounded-lg">
            <input
              type="checkbox"
              name="is_active"
              id="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="h-5 w-5 text-green-600 rounded focus:ring-green-500"
            />
            <label htmlFor="is_active" className="ml-2 text-sm font-medium text-gray-700">
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
          ></textarea>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">Subjects</label>
          <div className="flex flex-col sm:flex-row gap-2 mb-3">
            <input
              type="text"
              placeholder="Subject name"
              value={newSubject.name}
              onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition flex-1"
            />
            <input
              type="number"
              placeholder="Test count"
              value={newSubject.test_count}
              onChange={(e) => setNewSubject({...newSubject, test_count: parseInt(e.target.value) || 0})}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition w-28"
            />
            <button
              type="button"
              onClick={handleAddSubject}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Add Subject
            </button>
          </div>
          
          {formData.subjects.length > 0 && (
            <div className="border border-green-200 rounded-lg divide-y divide-green-100 bg-white overflow-hidden">
              {formData.subjects.map((subject, index) => (
                <div key={index} className="px-4 py-3 flex justify-between items-center hover:bg-green-50 transition">
                  <span className="font-medium">
                    {subject.name} <span className="text-green-600">({subject.test_count} tests)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubject(index)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
          <div className="flex items-center gap-3 mb-2">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-green-300 rounded-lg cursor-pointer bg-white hover:bg-green-50 transition">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-gray-500 mt-2">Click to upload images</p>
              </div>
              <input 
                type="file" 
                multiple 
                onChange={handleImageChange} 
                className="hidden" 
                accept="image/*" 
              />
            </label>
          </div>
          
          {formData.images.length > 0 && !imageFiles.length && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Current images:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={`https://api.pvclasses.in/uploads/testSeries/${img}`} 
                      alt={`Preview ${index + 1}`} 
                      className="h-24 w-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">Current Image</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-4 pt-4 border-t border-green-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-75 flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {series ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                {series ? 'Update Test Series' : 'Create Test Series'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TestSeriesForm;