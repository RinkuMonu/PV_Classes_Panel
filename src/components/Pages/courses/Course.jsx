
// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';
// import axios from 'axios';
// import { Link } from 'react-router-dom';

// const Course = () => {
//   const [courses, setCourses] = useState([]);
//   const [exams, setExams] = useState([]);
//   const [faculties, setFaculties] = useState([]);
//   const [combos, setCombos] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     title: '',
//     slug: '',
//     exam: '',
//     type: 'Course',
//     author: '',
//     language: 'english',
//     mainMotive: '',
//     topics: '',
//     features: '',
//     price: 0,
//     discountPrice: 0,
//     isFree: false,
//     validity: '',
//     shortDescription: '',
//     longDescription: '',
//     status: 'active',
//     faculty: [],
//     comboId: '',
//     videos: []
//   });
//   const [images, setImages] = useState([]);
//   const [editingId, setEditingId] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     fetchCourses();
//     fetchExams();
//     fetchFaculties();
//     fetchCombos();
//   }, []);

//   const fetchCourses = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get('https://api.pvclasses.in/api/courses');
//       setCourses(response.data);
//     } catch (error) {
//       toast.error('Error fetching courses');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchExams = async () => {
//     try {
//       const response = await axios.get('https://api.pvclasses.in/api/exams');
//       setExams(response.data);
//     } catch (error) {
//       toast.error('Error fetching exams');
//     }
//   };

//   const fetchFaculties = async () => {
//     try {
//       const response = await axios.get('https://api.pvclasses.in/api/faculty');
//       setFaculties(response.data);
//     } catch (error) {
//       toast.error('Error fetching faculties');
//     }
//   };

//   const fetchCombos = async () => {
//     try {
//       const response = await axios.get('https://api.pvclasses.in/api/combo');
//       setCombos(response.data);
//     } catch (error) {
//       toast.error('Error fetching combos');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const formDataToSend = new FormData();
      
//       // Append all form fields
//       Object.keys(formData).forEach(key => {
//         if (key === 'topics' || key === 'features') {
//           // Convert comma-separated strings to arrays
//           formDataToSend.append(key, formData[key].split(',').map(item => item.trim()));
//         } else if (key === 'faculty') {
//           // Handle faculty array
//           formData.faculty.forEach(id => formDataToSend.append('faculty[]', id));
//         } else {
//           formDataToSend.append(key, formData[key]);
//         }
//       });
      
//       // Append images
//       images.forEach(image => {
//         formDataToSend.append('images', image);
//       });

//       if (editingId) {
//         await axios.put(`https://api.pvclasses.in/api/courses/${editingId}`, formDataToSend, {
//           headers: {
//             'Content-Type': 'multipart/form-data'
//           }
//         });
//         toast.success('Course updated successfully');
//       } else {
//         await axios.post('https://api.pvclasses.in/api/courses', formDataToSend, {
//           headers: {
//             'Content-Type': 'multipart/form-data'
//           }
//         });
//         toast.success('Course created successfully');
//       }
//       setShowModal(false);
//       resetForm();
//       fetchCourses();
//     } catch (error) {
//       toast.error('Error saving course');
//       console.error(error);
//     }
//   };

//   const handleEdit = (course) => {
//     setFormData({
//       title: course.title,
//       slug: course.slug,
//       exam: course.exam?._id,
//       type: course.type,
//       author: course.author?._id,
//       language: course.language,
//       mainMotive: course.mainMotive,
//       topics: course.topics?.join(', '),
//       features: course.features?.join(', '),
//       price: course.price,
//       discountPrice: course.discountPrice,
//       isFree: course.isFree,
//       validity: course.validity,
//       shortDescription: course.shortDescription,
//       longDescription: course.longDescription,
//       status: course.status,
//       faculty: course.faculty?.map(f => f._id) || [],
//       comboId: course.comboId?._id || '',
//       videos: course.videos || []
//     });
//     setEditingId(course._id);
//     setShowModal(true);
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this course?')) {
//       try {
//         await axios.delete(`https://api.pvclasses.in/api/courses/${id}`);
//         toast.success('Course deleted successfully');
//         fetchCourses();
//       } catch (error) {
//         toast.error('Error deleting course');
//       }
//     }
//   };

//   const handleFacultyChange = (e) => {
//     const options = e.target.options;
//     const selectedValues = [];
//     for (let i = 0; i < options.length; i++) {
//       if (options[i].selected) {
//         selectedValues.push(options[i].value);
//       }
//     }
//     setFormData({ ...formData, faculty: selectedValues });
//   };

//   const resetForm = () => {
//     setFormData({
//       title: '',
//       slug: '',
//       exam: '',
//       type: 'Course',
//       author: '',
//       language: 'english',
//       mainMotive: '',
//       topics: '',
//       features: '',
//       price: 0,
//       discountPrice: 0,
//       isFree: false,
//       validity: '',
//       shortDescription: '',
//       longDescription: '',
//       status: 'active',
//       faculty: [],
//       comboId: '',
//       videos: []
//     });
//     setImages([]);
//     setEditingId(null);
//   };

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Courses</h1>
//         <button
//           onClick={() => setShowModal(true)}
//           className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
//         >
//           Add Course
//         </button>
//       </div>

//       {loading ? (
//         <div>Loading...</div>
//       ) : (
//         <div className="bg-white shadow-md rounded-md overflow-hidden">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Title
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Exam
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Type
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Price
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {courses.map((course) => (
//                 <tr key={course._id}>
//                   <td className="px-6 py-4 whitespace-nowrap">{course.title}</td>
//                   <td className="px-6 py-4">{course.exam?.name}</td>
//                   <td className="px-6 py-4">{course.type}</td>
//                   <td className="px-6 py-4">₹{course.price}</td>
//                   <td className="px-6 py-4">
//                     <span className={`px-2 py-1 text-xs rounded-full ${course.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
//                       {course.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <button
//                       onClick={() => handleEdit(course)}
//                       className="text-blue-600 hover:text-blue-900 mr-3"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(course._id)}
//                       className="text-red-600 hover:text-red-900"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {showModal && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center overflow-y-auto">
//           <div className="bg-white p-6 rounded-md w-full max-w-4xl my-8 max-h-screen overflow-y-auto">
//             <h2 className="text-xl font-bold mb-4">
//               {editingId ? 'Edit Course' : 'Add Course'}
//             </h2>
//             <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="col-span-2">
//                 <label className="block text-gray-700 mb-2">Title</label>
//                 <input
//                   type="text"
//                   value={formData.title}
//                   onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-gray-700 mb-2">Slug</label>
//                 <input
//                   type="text"
//                   value={formData.slug}
//                   onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-gray-700 mb-2">Exam</label>
//                 <select
//                   value={formData.exam}
//                   onChange={(e) => setFormData({ ...formData, exam: e.target.value })}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                   required
//                 >
//                   <option value="">Select Exam</option>
//                   {exams.map((exam) => (
//                     <option key={exam._id} value={exam._id}>
//                       {exam.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-gray-700 mb-2">Type</label>
//                 <select
//                   value={formData.type}
//                   onChange={(e) => setFormData({ ...formData, type: e.target.value })}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 >
//                   <option value="Course">Course</option>
//                   <option value="Test Series">Test Series</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-gray-700 mb-2">Language</label>
//                 <select
//                   value={formData.language}
//                   onChange={(e) => setFormData({ ...formData, language: e.target.value })}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 >
//                   <option value="english">English</option>
//                   <option value="hindi">Hindi</option>
//                   <option value="bilingual">Bilingual</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-gray-700 mb-2">Price (₹)</label>
//                 <input
//                   type="number"
//                   value={formData.price}
//                   onChange={(e) => setFormData({ ...formData, price: e.target.value })}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//               <div>
//                 <label className="block text-gray-700 mb-2">Discount Price (₹)</label>
//                 <input
//                   type="number"
//                   value={formData.discountPrice}
//                   onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//               <div>
//                 <label className="block text-gray-700 mb-2">Validity (days)</label>
//                 <input
//                   type="text"
//                   value={formData.validity}
//                   onChange={(e) => setFormData({ ...formData, validity: e.target.value })}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//               <div className="flex items-center">
//                 <input
//                   type="checkbox"
//                   checked={formData.isFree}
//                   onChange={(e) => setFormData({ ...formData, isFree: e.target.checked })}
//                   className="mr-2"
//                 />
//                 <label className="text-gray-700">Free Course</label>
//               </div>
//               <div>
//                 <label className="block text-gray-700 mb-2">Combo</label>
//                 <select
//                   value={formData.comboId}
//                   onChange={(e) => setFormData({ ...formData, comboId: e.target.value })}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 >
//                   <option value="">Select Combo</option>
//                   {combos.map((combo) => (
//                     <option key={combo._id} value={combo._id}>
//                       {combo.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="col-span-2">
//                 <label className="block text-gray-700 mb-2">Faculty (Hold Ctrl to select multiple)</label>
//                 <select
//                   multiple
//                   value={formData.faculty}
//                   onChange={handleFacultyChange}
//                   className="w-full p-2 border border-gray-300 rounded-md h-32"
//                 >
//                   {faculties.map((faculty) => (
//                     <option key={faculty._id} value={faculty._id}>
//                       {faculty.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="col-span-2">
//                 <label className="block text-gray-700 mb-2">Topics (comma separated)</label>
//                 <input
//                   type="text"
//                   value={formData.topics}
//                   onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//               <div className="col-span-2">
//                 <label className="block text-gray-700 mb-2">Features (comma separated)</label>
//                 <input
//                   type="text"
//                   value={formData.features}
//                   onChange={(e) => setFormData({ ...formData, features: e.target.value })}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//               <div className="col-span-2">
//                 <label className="block text-gray-700 mb-2">Main Motive</label>
//                 <textarea
//                   value={formData.mainMotive}
//                   onChange={(e) => setFormData({ ...formData, mainMotive: e.target.value })}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                   rows="2"
//                 />
//               </div>
//               <div className="col-span-2">
//                 <label className="block text-gray-700 mb-2">Short Description</label>
//                 <textarea
//                   value={formData.shortDescription}
//                   onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                   rows="2"
//                 />
//               </div>
//               <div className="col-span-2">
//                 <label className="block text-gray-700 mb-2">Long Description</label>
//                 <textarea
//                   value={formData.longDescription}
//                   onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                   rows="4"
//                 />
//               </div>
//               <div>
//                 <label className="block text-gray-700 mb-2">Status</label>
//                 <select
//                   value={formData.status}
//                   onChange={(e) => setFormData({ ...formData, status: e.target.value })}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 >
//                   <option value="active">Active</option>
//                   <option value="inactive">Inactive</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-gray-700 mb-2">Images</label>
//                 <input
//                   type="file"
//                   onChange={(e) => setImages(Array.from(e.target.files))}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                   accept="image/*"
//                   multiple
//                 />
//               </div>
//               <div className="col-span-2 flex justify-end">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowModal(false);
//                     resetForm();
//                   }}
//                   className="mr-2 px-4 py-2 border border-gray-300 rounded-md"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
//                 >
//                   {editingId ? 'Update' : 'Create'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Course;




import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const Course = () => {
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [combos, setCombos] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    exam: '',
    type: 'Course',
    author: '',
    language: 'english',
    mainMotive: '',
    topics: '',
    features: '',
    price: 0,
    discountPrice: 0,
    isFree: false,
    validity: '',
    shortDescription: '',
    longDescription: '',
    status: 'active',
    faculty: [],
    comboId: ''
  });
  const [images, setImages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCourses();
    fetchExams();
    fetchFaculties();
    fetchCombos();
    fetchAuthors();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://api.pvclasses.in/api/courses');
      setCourses(response.data);
    } catch (error) {
      toast.error('Error fetching courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchExams = async () => {
    try {
      const response = await axios.get('https://api.pvclasses.in/api/exams');
      setExams(response.data);
    } catch (error) {
      toast.error('Error fetching exams');
    }
  };

  const fetchFaculties = async () => {
    try {
      const response = await axios.get('https://api.pvclasses.in/api/faculty');
      setFaculties(response.data);
    } catch (error) {
      toast.error('Error fetching faculties');
    }
  };

  const fetchCombos = async () => {
    try {
      const response = await axios.get('https://api.pvclasses.in/api/combo');
      setCombos(response.data.combos || response.data);
    } catch (error) {
      toast.error('Error fetching combos');
    }
  };

  const fetchAuthors = async () => {
    try {
      const response = await axios.get('https://api.pvclasses.in/api/users?role=author');
      setAuthors(response.data);
    } catch (error) {
      toast.error('Error fetching authors');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'topics' || key === 'features') {
          // Convert comma-separated strings to arrays
          if (formData[key]) {
            formDataToSend.append(key, formData[key].split(',').map(item => item.trim()));
          }
        } else if (key === 'faculty') {
          // Handle faculty array
          formData.faculty.forEach(id => formDataToSend.append('faculty[]', id));
        } else if (key === 'comboId' && formData[key] === '') {
          // Skip empty comboId
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Append images
      images.forEach(image => {
        formDataToSend.append('images', image);
      });

      if (editingId) {
        await axios.put(`https://api.pvclasses.in/api/courses/${editingId}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Course updated successfully');
      } else {
        await axios.post('https://api.pvclasses.in/api/courses', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Course created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchCourses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving course');
      console.error('Error details:', error.response?.data);
    }
  };

  const handleEdit = (course) => {
    setFormData({
      title: course.title,
      slug: course.slug,
      exam: course.exam?._id,
      type: course.type,
      author: course.author?._id,
      language: course.language,
      mainMotive: course.mainMotive,
      topics: course.topics?.join(', '),
      features: course.features?.join(', '),
      price: course.price,
      discountPrice: course.discountPrice,
      isFree: course.isFree,
      validity: course.validity,
      shortDescription: course.shortDescription,
      longDescription: course.longDescription,
      status: course.status,
      faculty: course.faculty?.map(f => f._id) || [],
      comboId: course.comboId?._id || ''
    });
    setEditingId(course._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await axios.delete(`https://api.pvclasses.in/api/courses/${id}`);
        toast.success('Course deleted successfully');
        fetchCourses();
      } catch (error) {
        toast.error('Error deleting course');
      }
    }
  };

  const handleFacultyChange = (e) => {
    const options = e.target.options;
    const selectedValues = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    setFormData({ ...formData, faculty: selectedValues });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      exam: '',
      type: 'Course',
      author: '',
      language: 'english',
      mainMotive: '',
      topics: '',
      features: '',
      price: 0,
      discountPrice: 0,
      isFree: false,
      validity: '',
      shortDescription: '',
      longDescription: '',
      status: 'active',
      faculty: [],
      comboId: ''
    });
    setImages([]);
    setEditingId(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Courses</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Add Course
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="bg-white shadow-md rounded-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exam
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
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
              {courses.map((course) => (
                <tr key={course._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{course.title}</td>
                  <td className="px-6 py-4">{course.exam?.name}</td>
                  <td className="px-6 py-4">{course.type}</td>
                  <td className="px-6 py-4">₹{course.price}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${course.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {course.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(course)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center overflow-y-auto">
          <div className="bg-white p-6 rounded-md w-full max-w-4xl my-8 max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? 'Edit Course' : 'Add Course'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Slug *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Exam *</label>
                <select
                  value={formData.exam}
                  onChange={(e) => setFormData({ ...formData, exam: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Exam</option>
                  {exams.map((exam) => (
                    <option key={exam._id} value={exam._id}>
                      {exam.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="Course">Course</option>
                  <option value="Test Series">Test Series</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Author *</label>
                <select
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Author</option>
                  {authors.map((author) => (
                    <option key={author._id} value={author._id}>
                      {author.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Language</label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="english">English</option>
                  <option value="hindi">Hindi</option>
                  <option value="bilingual">Bilingual</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Price (₹)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Discount Price (₹)</label>
                <input
                  type="number"
                  value={formData.discountPrice}
                  onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Validity</label>
                <input
                  type="text"
                  value={formData.validity}
                  onChange={(e) => setFormData({ ...formData, validity: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="e.g., 365 days"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isFree}
                  onChange={(e) => setFormData({ ...formData, isFree: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-gray-700">Free Course</label>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Combo</label>
                <select
                  value={formData.comboId}
                  onChange={(e) => setFormData({ ...formData, comboId: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Combo (Optional)</option>
                  {combos.map((combo) => (
                    <option key={combo._id} value={combo._id}>
                      {combo.title || combo.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-gray-700 mb-2">Faculty (Hold Ctrl to select multiple)</label>
                <select
                  multiple
                  value={formData.faculty}
                  onChange={handleFacultyChange}
                  className="w-full p-2 border border-gray-300 rounded-md h-32"
                >
                  {faculties.map((faculty) => (
                    <option key={faculty._id} value={faculty._id}>
                      {faculty.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-gray-700 mb-2">Topics (comma separated)</label>
                <input
                  type="text"
                  value={formData.topics}
                  onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Topic 1, Topic 2, Topic 3"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-gray-700 mb-2">Features (comma separated)</label>
                <input
                  type="text"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Feature 1, Feature 2, Feature 3"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-gray-700 mb-2">Main Motive</label>
                <textarea
                  value={formData.mainMotive}
                  onChange={(e) => setFormData({ ...formData, mainMotive: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows="2"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-gray-700 mb-2">Short Description</label>
                <textarea
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows="2"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-gray-700 mb-2">Long Description</label>
                <textarea
                  value={formData.longDescription}
                  onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows="4"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Images</label>
                <input
                  type="file"
                  onChange={(e) => setImages(Array.from(e.target.files))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  accept="image/*"
                  multiple
                />
              </div>
              <div className="col-span-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="mr-2 px-4 py-2 border border-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  {editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Course;