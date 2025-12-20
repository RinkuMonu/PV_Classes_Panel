

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import { FaEdit, FaTrash, FaPlus, FaTimes, FaEye, FaImage, FaTag, FaBook, FaUserTie, FaLanguage, FaMoneyBillWave, FaCalendarAlt, FaCheckCircle, FaList, FaStar, FaFileAlt, FaGlobe, FaQuestionCircle, FaVideo } from 'react-icons/fa';
import axiosInstance from '../../../config/AxiosInstance';

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
    comboId: '',
    faqs: [{ question: '', answer: '' }], // Added FAQs field
    videos: [] // Added videos field

  });
  // const [images, setImages] = useState([]);
  // const [editingId, setEditingId] = useState(null);
  // const [showModal, setShowModal] = useState(false);
  // const [activeTab, setActiveTab] = useState('basic');




  const [images, setImages] = useState([]);
  // const [videoFile, setVideoFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [currentCourseId, setCurrentCourseId] = useState(null);
  const [videoForm, setVideoForm] = useState({
    title: '',
    url: '',
    shortDescription: '',
    longDescription: '',
    duration: '',
    order: '',
    isFree: false,
    sourceType: 'youtube'
  });
  // const [editingVideoId, setEditingVideoId] = useState(null);




  // new feature add for cources videos me notes add krna 

  // Add these state variables
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [editingVideoIndex, setEditingVideoIndex] = useState(null);
  const [subjectForm, setSubjectForm] = useState({
    title: '',
    description: ''
  });
  const [notesFiles, setNotesFiles] = useState([]);

  // Add these functions
  const fetchSubjects = async (courseId) => {
    try {
      const response = await axiosInstance.get(`/sub/course/${courseId}`);
      setSubjects(response.data);
    } catch  {
      toast.error('Error fetching subjects');
    }
  };

  // const handleSubjectSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     if (editingSubject) {
  //       await axiosInstance.put(`/sub/${editingSubject._id}`, {
  //         ...subjectForm,
  //         course: currentCourseId
  //       });
  //       toast.success('Subject updated successfully');
  //     } else {
  //       await axiosInstance.post('/sub', {
  //         ...subjectForm,
  //         course: currentCourseId
  //       });
  //       toast.success('Subject created successfully');
  //     }

  //     setShowSubjectForm(false);
  //     setEditingSubject(null);
  //     setSubjectForm({ title: '', description: '' });
  //     fetchSubjects(currentCourseId);
  //   } catch (error) {
  //     toast.error('Error saving subject');
  //   }
  // };


  const handleSubjectSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSubject) {
        await axiosInstance.put(`/sub/${editingSubject._id}`, {
          ...subjectForm,
          course: currentCourseId
        });
        toast.success('Subject updated successfully');
      } else {
        await axiosInstance.post('/sub', {
          ...subjectForm,
          course: currentCourseId // Make sure this is included
        });
        toast.success('Subject created successfully');
      }

      setShowSubjectForm(false);
      setEditingSubject(null);
      setSubjectForm({ title: '', description: '' });
      fetchSubjects(currentCourseId);
    } catch {
      toast.error('Error saving subject');
    }
  };


  const handleEditSubject = (subject) => {
    setSubjectForm({
      title: subject.title,
      description: subject.description
    });
    setEditingSubject(subject);
    setShowSubjectForm(true);
  };

  const handleDeleteSubject = async (subjectId) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await axiosInstance.delete(`/sub/${subjectId}`);
        toast.success('Subject deleted successfully');
        fetchSubjects(currentCourseId);
      } catch{
        toast.error('Error deleting subject');
      }
    }
  };

  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();

      Object.keys(videoForm).forEach(key => {
        formDataToSend.append(key, videoForm[key]);
      });

      notesFiles.forEach(file => {
        formDataToSend.append('notes', file);
      });

      if (editingVideoIndex !== null) {
        await axiosInstance.put(
          `/sub/${selectedSubject._id}/videos/${editingVideoIndex}`,
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        toast.success('Video updated successfully');
      } else {
        await axiosInstance.post(
          `/sub/${selectedSubject._id}/videos`,
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        toast.success('Video added successfully');
      }

      setShowVideoForm(false);
      setEditingVideoIndex(null);
      setVideoForm({
        title: '',
        url: '',
        duration: '',
        order: '',
        isFree: false
      });
      setNotesFiles([]);

      // Refresh subjects to get updated video list
      fetchSubjects(currentCourseId);
    } catch  {
      toast.error('Error saving video');
    }
  };

  const handleEditVideo = (subjectId, video, index) => {
    setVideoForm({
      title: video.title,
      url: video.url,
      duration: video.duration || '',
      order: video.order || '',
      isFree: video.isFree || false
    });
    setEditingVideoIndex(index);
    setShowVideoForm(true);
  };

  const handleDeleteVideo = async (subjectId, index) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        // For simplicity, we'll update the subject by removing the video
        const subject = subjects.find(s => s._id === subjectId);
        subject.videos.splice(index, 1);

        await axiosInstance.put(`/sub/${subjectId}`, {
          videos: subject.videos
        });

        toast.success('Video deleted successfully');
        fetchSubjects(currentCourseId);
      } catch  {
        toast.error('Error deleting video');
      }
    }
  };

  // Update the openVideoModal function
  const openVideoModal = (courseId) => {
    setCurrentCourseId(courseId);
    setShowVideoModal(true);
    fetchSubjects(courseId);
  };



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
      const response = await axiosInstance.get('/courses');
      console.log("courses data : ", response.data);
      setCourses(response.data);
    } catch  {
      toast.error('Error fetching courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchExams = async () => {
    try {
      const response = await axiosInstance.get('/exams');
      setExams(response.data);
    } catch  {
      toast.error('Error fetching exams');
    }
  };

  const fetchFaculties = async () => {
    try {
      const response = await axiosInstance.get('/faculty');
      setFaculties(response.data);
    } catch  {
      toast.error('Error fetching faculties');
    }
  };

  const fetchCombos = async () => {
    try {
      const response = await axiosInstance.get('/combo');
      console.log("combos data : ", response.data);
      setCombos(response.data.combos || response.data);
    } catch  {
      toast.error('Error fetching combos');
    }
  };

  const fetchAuthors = async () => {
    try {
      const response = await axiosInstance.get('/users/getAllUser');
      setAuthors(response.data.data);
    } catch  {
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
        } else if (key === 'faqs') {
          // Handle FAQs array
          formDataToSend.append('faqs', JSON.stringify(formData.faqs));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append images
      images.forEach(image => {
        formDataToSend.append('images', image);
      });

      if (editingId) {
        await axiosInstance.put(`/courses/${editingId}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Course updated successfully');
      } else {
        await axiosInstance.post('/courses', formDataToSend, {
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
      comboId: course.comboId?._id || '',
      faqs: course.faqs?.length > 0 ? course.faqs : [{ question: '', answer: '' }] // Added FAQs field
    });
    setEditingId(course._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await axiosInstance.delete(`/courses/${id}`);
        toast.success('Course deleted successfully');
        fetchCourses();
      } catch {
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

  // Handle FAQs changes
  const handleFaqChange = (index, field, value) => {
    const updatedFaqs = [...formData.faqs];
    updatedFaqs[index][field] = value;
    setFormData({ ...formData, faqs: updatedFaqs });
  };

  const addFaq = () => {
    setFormData({
      ...formData,
      faqs: [...formData.faqs, { question: '', answer: '' }]
    });
  };

  const removeFaq = (index) => {
    if (formData.faqs.length > 1) {
      const updatedFaqs = [...formData.faqs];
      updatedFaqs.splice(index, 1);
      setFormData({ ...formData, faqs: updatedFaqs });
    }
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
      comboId: '',
      faqs: [{ question: '', answer: '' }] // Reset FAQs
    });
    setImages([]);
    setEditingId(null);
    setActiveTab('basic');
  };

  const StatusBadge = ({ status }) => (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );

  const PriceDisplay = ({ price, discountPrice, isFree }) => {
    if (isFree) return <span className="text-green-600 font-bold">Free</span>;

    return (
      <div className="flex items-center">
        {discountPrice > 0 && discountPrice < price ? (
          <>
            <span className="text-green-600 font-bold">₹{discountPrice}</span>
            <span className="text-gray-500 line-through text-sm ml-2">₹{price}</span>
          </>
        ) : (
          <span className="text-green-600 font-bold">₹{price}</span>
        )}
      </div>
    );
  };


  // const handleVideoSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const formDataToSend = new FormData();

  //     Object.keys(videoForm).forEach(key => {
  //       if (key !== 'url' || videoForm.sourceType === 'youtube') {
  //         formDataToSend.append(key, videoForm[key]);
  //       }
  //     });

  //     if (videoForm.sourceType === 'cloudinary' && videoFile) {
  //       formDataToSend.append('url', videoFile);
  //     }

  //     if (editingVideoId) {
  //       await axiosInstance.put(
  //         `/courses/${currentCourseId}/update-videos/${editingVideoId}`,
  //         formDataToSend,
  //         {
  //           headers: {
  //             'Content-Type': 'multipart/form-data'
  //           }
  //         }
  //       );
  //       toast.success('Video updated successfully');
  //     } else {
  //       await axiosInstance.post(
  //         `/courses/${currentCourseId}/upload-video`,
  //         formDataToSend,
  //         {
  //           headers: {
  //             'Content-Type': 'multipart/form-data'
  //           }
  //         }
  //       );
  //       toast.success('Video uploaded successfully');
  //     }

  //     setShowVideoModal(false);
  //     resetVideoForm();
  //     fetchCourses();
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || 'Error saving video');
  //     console.error('Error details:', error.response?.data);
  //   }
  // };

  // const handleEditVideo = (courseId, video) => {
  //   setVideoForm({
  //     title: video.title,
  //     url: video.url,
  //     shortDescription: video.shortDescription || '',
  //     longDescription: video.longDescription || '',
  //     duration: video.duration || '',
  //     order: video.order || '',
  //     isFree: video.isFree || false,
  //     sourceType: video.sourceType || 'youtube'
  //   });
  //   setEditingVideoId(video._id);
  //   setCurrentCourseId(courseId);
  //   setShowVideoModal(true);
  // };

  // const handleDeleteVideo = async (courseId, videoId) => {
  //   if (window.confirm('Are you sure you want to delete this video?')) {
  //     try {
  //       const course = await axiosInstance.get(`/courses/${courseId}`);
  //       const updatedVideos = course.data.videos.filter(v => v._id !== videoId);

  //       await axiosInstance.put(`/courses/${courseId}`, {
  //         videos: updatedVideos
  //       });

  //       toast.success('Video deleted successfully');
  //       fetchCourses();
  //     } catch (error) {
  //       toast.error('Error deleting video');
  //     }
  //   }
  // };

  // const resetVideoForm = () => {
  //   setVideoForm({
  //     title: '',
  //     url: '',
  //     shortDescription: '',
  //     longDescription: '',
  //     duration: '',
  //     order: '',
  //     isFree: false,
  //     sourceType: 'youtube'
  //   });
  //   setVideoFile(null);
  //   setEditingVideoId(null);
  //   setCurrentCourseId(null);
  // };

  // const openVideoModal = (courseId) => {
  //   setCurrentCourseId(courseId);
  //   setShowVideoModal(true);
  // };



  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-800">Course Managementt</h1>
            <p className="text-gray-600 mt-2">Create and manage courses for your platform</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg shadow-md transition-all hover:shadow-lg"
          >
            <FaPlus className="mr-2" /> Add New Course
          </button>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
              <div key={course._id} className="bg-white rounded-xl shadow-md overflow-hidden border border-green-100 hover:shadow-lg transition-shadow">
                <div className="h-40 bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
                  {course.full_image && course.full_image.length > 0 ? (
                    <img
                      src={course.full_image[0]}
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-white text-center p-4">
                      <FaBook className="text-4xl mx-auto mb-2" />
                      <h3 className="font-bold text-lg">{course.title}</h3>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg text-gray-800 truncate">{course.title}</h3>
                    <StatusBadge status={course.status} />
                  </div>

                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <FaBook className="mr-2 text-green-500" />
                    <span>{course.exam?.name}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <FaUserTie className="mr-2 text-green-500" />
                    <span>{course.type}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <FaMoneyBillWave className="mr-2 text-green-500" />
                    <PriceDisplay price={course.price} discountPrice={course.discountPrice} isFree={course.isFree} />
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleEdit(course)}
                      className="flex items-center text-green-600 hover:text-green-800 font-medium"
                    >
                      <FaEdit className="mr-1" /> Edit
                    </button>

                    <button
                      onClick={() => openVideoModal(course._id)}
                      className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <FaVideo className="mr-1" /> Videos
                    </button>
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="flex items-center text-red-500 hover:text-red-700 font-medium"
                    >
                      <FaTrash className="mr-1" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}



            {/* Video Management Modal */}
            {/* {showVideoModal && (
              <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center z-50">
                <div className="w-full max-w-2xl mx-4 bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
                  <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-xl p-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-green-800">
                      {editingVideoId ? 'Edit Video' : 'Add Video'}
                    </h2>
                    <button
                      onClick={() => {
                        setShowVideoModal(false);
                        resetVideoForm();
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FaTimes size={24} />
                    </button>
                  </div>

                  <div className="p-6">
                    <form onSubmit={handleVideoSubmit}>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">
                            Title *
                          </label>
                          <input
                            type="text"
                            value={videoForm.title}
                            onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                            required
                            placeholder="Video Title"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 font-medium mb-2">
                            Source Type
                          </label>
                          <select
                            value={videoForm.sourceType}
                            onChange={(e) => setVideoForm({ ...videoForm, sourceType: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                          >
                            <option value="youtube">YouTube URL</option>
                            <option value="cloudinary">Upload Video</option>
                          </select>
                        </div>

                        {videoForm.sourceType === 'youtube' ? (
                          <div>
                            <label className="block text-gray-700 font-medium mb-2">
                              YouTube URL *
                            </label>
                            <input
                              type="url"
                              value={videoForm.url}
                              onChange={(e) => setVideoForm({ ...videoForm, url: e.target.value })}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                              required
                              placeholder="https://www.youtube.com/watch?v=..."
                            />
                          </div>
                        ) : (
                          <div>
                            <label className="block text-gray-700 font-medium mb-2">
                              Video File *
                            </label>
                            <div className="flex items-center justify-center w-full">
                              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <FaVideo className="w-10 h-10 text-blue-500 mb-2" />
                                  <p className="text-sm text-blue-700">
                                    {videoFile ? videoFile.name : 'Click to upload video'}
                                  </p>
                                </div>
                                <input
                                  type="file"
                                  onChange={(e) => setVideoFile(e.target.files[0])}
                                  className="hidden"
                                  accept="video/*"
                                  required={!editingVideoId}
                                />
                              </label>
                            </div>
                          </div>
                        )}

                        <div>
                          <label className="block text-gray-700 font-medium mb-2">
                            Order *
                          </label>
                          <input
                            type="number"
                            value={videoForm.order}
                            onChange={(e) => setVideoForm({ ...videoForm, order: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                            required
                            min="1"
                            placeholder="1"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 font-medium mb-2">
                            Duration (seconds)
                          </label>
                          <input
                            type="number"
                            value={videoForm.duration}
                            onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                            min="0"
                            placeholder="Duration in seconds"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 font-medium mb-2">
                            Short Description
                          </label>
                          <textarea
                            value={videoForm.shortDescription}
                            onChange={(e) => setVideoForm({ ...videoForm, shortDescription: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                            rows="2"
                            placeholder="Brief description"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 font-medium mb-2">
                            Long Description
                          </label>
                          <textarea
                            value={videoForm.longDescription}
                            onChange={(e) => setVideoForm({ ...videoForm, longDescription: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                            rows="3"
                            placeholder="Detailed description"
                          />
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={videoForm.isFree}
                            onChange={(e) => setVideoForm({ ...videoForm, isFree: e.target.checked })}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <label className="ml-2 block text-gray-700 font-medium">
                            Free Video
                          </label>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-4 mt-6 pt-4 border-t border-gray-200">
                        <button
                          type="button"
                          onClick={() => {
                            setShowVideoModal(false);
                            resetVideoForm();
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors"
                        >
                          {editingVideoId ? 'Update Video' : 'Add Video'}
                        </button>
                      </div>
                    </form>

                    {currentCourseId && (
                      <div className="mt-8">
                        <h3 className="text-lg font-medium text-gray-700 mb-4">Course Videos</h3>
                        <div className="space-y-3">
                          {courses.find(c => c._id === currentCourseId)?.videos?.map((video) => (
                            <div key={video._id} className="border border-gray-200 rounded-lg p-3 flex justify-between items-center">
                              <div>
                                <h4 className="font-medium">{video.title}</h4>
                                <p className="text-sm text-gray-600">Order: {video.order} | Duration: {video.duration}s</p>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEditVideo(currentCourseId, video)}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  onClick={() => handleDeleteVideo(currentCourseId, video._id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )} */}


            {showVideoModal && (
              <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center z-50">
                <div className="w-full max-w-4xl mx-4 bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
                  <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-xl p-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-green-800">
                      Course Content Management
                    </h2>
                    <button
                      onClick={() => {
                        setShowVideoModal(false);
                        // resetVideoForm();
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FaTimes size={24} />
                    </button>
                  </div>

                  <div className="p-6">
                    {/* Subject Management Section */}
                    <div className="mb-8">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-700">Subjects</h3>
                        <button
                          onClick={() => setShowSubjectForm(true)}
                          className="flex items-center bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm"
                        >
                          <FaPlus className="mr-1" /> Add Subject
                        </button>
                      </div>

                      {/* Subject List */}
                      <div className="grid grid-cols-1 gap-3 mb-6">
                        {subjects.map((subject) => (
                          <div key={subject._id} className="border border-gray-200 rounded-lg p-3 flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">{subject.title}</h4>
                              <p className="text-sm text-gray-600">{subject.description}</p>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditSubject(subject)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDeleteSubject(subject._id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <FaTrash />
                              </button>
                              <button
                                onClick={() => setSelectedSubject(subject)}
                                className="text-green-600 hover:text-green-800"
                              >
                                <FaVideo /> Manage Videos
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Video Management Section (only show when a subject is selected) */}
                    {selectedSubject && (
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-medium text-gray-700">
                            Videos for: {selectedSubject.title}
                          </h3>
                          <button
                            onClick={() => setShowVideoForm(true)}
                            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm"
                          >
                            <FaPlus className="mr-1" /> Add Video
                          </button>
                        </div>

                        {/* Video List */}
                        <div className="space-y-3 mb-6">
                          {selectedSubject.videos?.map((video, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-3 flex justify-between items-center">
                              <div>
                                <h4 className="font-medium">{video.title}</h4>
                                <p className="text-sm text-gray-600">
                                  Order: {video.order} | Duration: {video.duration}s |
                                  Notes: {video.notes?.length || 0} file(s)
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEditVideo(selectedSubject._id, video, index)}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  onClick={() => handleDeleteVideo(selectedSubject._id, index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Subject Form Modal */}
                    {showSubjectForm && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg w-full max-w-md">
                          <h3 className="text-xl font-bold mb-4">
                            {editingSubject ? 'Edit Subject' : 'Add New Subject'}
                          </h3>
                          <form onSubmit={handleSubjectSubmit}>
                            <div className="mb-4">
                              <label className="block text-gray-700 font-medium mb-2">
                                Title *
                              </label>
                              <input
                                type="text"
                                value={subjectForm.title}
                                onChange={(e) => setSubjectForm({ ...subjectForm, title: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded"
                                required
                              />
                            </div>
                            <div className="mb-4">
                              <label className="block text-gray-700 font-medium mb-2">
                                Description
                              </label>
                              <textarea
                                value={subjectForm.description}
                                onChange={(e) => setSubjectForm({ ...subjectForm, description: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded"
                                rows="3"
                              />
                            </div>
                            <div className="flex justify-end space-x-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setShowSubjectForm(false);
                                  setEditingSubject(null);
                                  setSubjectForm({ title: '', description: '' });
                                }}
                                className="px-4 py-2 border border-gray-300 rounded"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="px-4 py-2 bg-green-600 text-white rounded"
                              >
                                {editingSubject ? 'Update' : 'Add'} Subject
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}

                    {/* Video Form Modal */}
                    {showVideoForm && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                          <h3 className="text-xl font-bold mb-4">
                            {editingVideoIndex !== null ? 'Edit Video' : 'Add New Video'}
                          </h3>
                          <form onSubmit={handleVideoSubmit}>
                            <div className="mb-4">
                              <label className="block text-gray-700 font-medium mb-2">
                                Title *
                              </label>
                              <input
                                type="text"
                                value={videoForm.title}
                                onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded"
                                required
                              />
                            </div>
                            <div className="mb-4">
                              <label className="block text-gray-700 font-medium mb-2">
                                YouTube URL *
                              </label>
                              <input
                                type="url"
                                value={videoForm.url}
                                onChange={(e) => setVideoForm({ ...videoForm, url: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded"
                                required
                                placeholder="https://www.youtube.com/watch?v=..."
                              />
                            </div>
                            <div className="mb-4">
                              <label className="block text-gray-700 font-medium mb-2">
                                Duration (seconds)
                              </label>
                              <input
                                type="number"
                                value={videoForm.duration}
                                onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded"
                                min="0"
                              />
                            </div>
                            <div className="mb-4">
                              <label className="block text-gray-700 font-medium mb-2">
                                Order *
                              </label>
                              <input
                                type="number"
                                value={videoForm.order}
                                onChange={(e) => setVideoForm({ ...videoForm, order: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded"
                                required
                                min="1"
                              />
                            </div>
                            <div className="mb-4">
                              <label className="block text-gray-700 font-medium mb-2">
                                Notes (PDF files)
                              </label>
                              <input
                                type="file"
                                onChange={(e) => setNotesFiles(Array.from(e.target.files))}
                                className="w-full p-2 border border-gray-300 rounded"
                                multiple
                                accept=".pdf"
                              />
                            </div>
                            <div className="mb-4 flex items-center">
                              <input
                                type="checkbox"
                                checked={videoForm.isFree}
                                onChange={(e) => setVideoForm({ ...videoForm, isFree: e.target.checked })}
                                className="mr-2"
                              />
                              <label className="text-gray-700">Free Video</label>
                            </div>
                            <div className="flex justify-end space-x-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setShowVideoForm(false);
                                  setEditingVideoIndex(null);
                                  setVideoForm({
                                    title: '',
                                    url: '',
                                    duration: '',
                                    order: '',
                                    isFree: false
                                  });
                                  setNotesFiles([]);
                                }}
                                className="px-4 py-2 border border-gray-300 rounded"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                              >
                                {editingVideoIndex !== null ? 'Update' : 'Add'} Video
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        )}



        {courses.length === 0 && !loading && (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <div className="mx-auto w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <FaBook className="text-green-500 text-3xl" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No courses yet</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first course</p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md transition-colors"
            >
              <FaPlus className="mr-2" /> Create Course
            </button>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 shadow-2xl">
            <div className="w-full max-w-4xl mx-4 my-8 bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-xl p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-green-800">
                  {editingId ? 'Edit Course' : 'Create New Course'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="p-6">
                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-6">
                  <button
                    className={`px-4 py-2 font-medium flex items-center ${activeTab === 'basic' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('basic')}
                  >
                    <FaList className="mr-2" /> Basic Info
                  </button>
                  <button
                    className={`px-4 py-2 font-medium flex items-center ${activeTab === 'details' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('details')}
                  >
                    <FaFileAlt className="mr-2" /> Details
                  </button>
                  <button
                    className={`px-4 py-2 font-medium flex items-center ${activeTab === 'pricing' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('pricing')}
                  >
                    <FaMoneyBillWave className="mr-2" /> Pricing
                  </button>
                  <button
                    className={`px-4 py-2 font-medium flex items-center ${activeTab === 'faqs' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('faqs')}
                  >
                    <FaQuestionCircle className="mr-2" /> FAQs
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Basic Info Tab */}
                  {activeTab === 'basic' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-gray-700 font-medium mb-2">
                          Title *
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                          required
                          placeholder="Course Title"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Slug *
                        </label>
                        <input
                          type="text"
                          value={formData.slug}
                          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                          required
                          placeholder="course-slug"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Exam *
                        </label>
                        <select
                          value={formData.exam}
                          onChange={(e) => setFormData({ ...formData, exam: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
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
                        <label className="block text-gray-700 font-medium mb-2">
                          Type *
                        </label>
                        <select
                          value={formData.type}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                          required
                        >
                          <option value="Course">Course</option>
                          <option value="Test Series">Test Series</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Author *
                        </label>
                        <select
                          value={formData.author}
                          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
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
                        <label className="block text-gray-700 font-medium mb-2">
                          Language
                        </label>
                        <select
                          value={formData.language}
                          onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                        >
                          <option value="english">English</option>
                          <option value="hindi">Hindi</option>
                          <option value="bilingual">Bilingual</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-gray-700 font-medium mb-2">
                          Faculty (Hold Ctrl to select multiple)
                        </label>
                        <select
                          multiple
                          value={formData.faculty}
                          onChange={handleFacultyChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition h-32"
                        >
                          {faculties.map((faculty) => (
                            <option key={faculty._id} value={faculty._id}>
                              {faculty.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-gray-700 font-medium mb-2">
                          Images
                        </label>
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-green-300 rounded-lg cursor-pointer bg-green-50 hover:bg-green-100 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <FaImage className="w-10 h-10 text-green-500 mb-2" />
                              <p className="text-sm text-green-700">Click to upload images</p>
                            </div>
                            <input
                              type="file"
                              onChange={(e) => setImages(Array.from(e.target.files))}
                              className="hidden"
                              accept="image/*"
                              multiple
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Details Tab */}
                  {activeTab === 'details' && (
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Main Motive
                        </label>
                        <textarea
                          value={formData.mainMotive}
                          onChange={(e) => setFormData({ ...formData, mainMotive: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                          rows="3"
                          placeholder="What is the main goal of this course?"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Topics (comma separated)
                        </label>
                        <textarea
                          value={formData.topics}
                          onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                          rows="3"
                          placeholder="Topic 1, Topic 2, Topic 3"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Features (comma separated)
                        </label>
                        <textarea
                          value={formData.features}
                          onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                          rows="3"
                          placeholder="Feature 1, Feature 2, Feature 3"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Short Description
                        </label>
                        <textarea
                          value={formData.shortDescription}
                          onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                          rows="3"
                          placeholder="Brief description of the course"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Long Description
                        </label>
                        <textarea
                          value={formData.longDescription}
                          onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                          rows="5"
                          placeholder="Detailed description of the course"
                        />
                      </div>
                    </div>
                  )}

                  {/* Pricing Tab */}
                  {activeTab === 'pricing' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Price (₹)
                        </label>
                        <input
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                          min="0"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Discount Price (₹)
                        </label>
                        <input
                          type="number"
                          value={formData.discountPrice}
                          onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                          min="0"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Validity
                        </label>
                        <input
                          type="text"
                          value={formData.validity}
                          onChange={(e) => setFormData({ ...formData, validity: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                          placeholder="e.g., 365 days"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Combo
                        </label>
                        <select
                          value={formData.comboId}
                          onChange={(e) => setFormData({ ...formData, comboId: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                        >
                          <option value="">Select Combo (Optional)</option>
                          {combos.map((combo) => (
                            <option key={combo._id} value={combo._id}>
                              {combo.title || combo.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.isFree}
                          onChange={(e) => setFormData({ ...formData, isFree: e.target.checked })}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-gray-700 font-medium">
                          Free Course
                        </label>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Status
                        </label>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* FAQs Tab */}
                  {activeTab === 'faqs' && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-700">Frequently Asked Questions</h3>
                        <button
                          type="button"
                          onClick={addFaq}
                          className="flex items-center bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm"
                        >
                          <FaPlus className="mr-1" /> Add FAQ
                        </button>
                      </div>

                      {formData.faqs.map((faq, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-medium text-gray-700">FAQ #{index + 1}</h4>
                            {formData.faqs.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeFaq(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <FaTimes />
                              </button>
                            )}
                          </div>

                          <div className="mb-3">
                            <label className="block text-gray-700 font-medium mb-2">
                              Question
                            </label>
                            <input
                              type="text"
                              value={faq.question}
                              onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                              placeholder="Enter question"
                            />
                          </div>

                          <div>
                            <label className="block text-gray-700 font-medium mb-2">
                              Answer
                            </label>
                            <textarea
                              value={faq.answer}
                              onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                              rows="3"
                              placeholder="Enter answer"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        resetForm();
                      }}
                      className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md transition-colors"
                    >
                      {editingId ? 'Update Course' : 'Create Course'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Course;