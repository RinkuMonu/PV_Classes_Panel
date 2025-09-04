import React, { useState, useEffect } from "react";
import axiosInstance from "../../../config/AxiosInstance";
import toast, { Toaster } from "react-hot-toast";

function Compo() {
  const [combos, setCombos] = useState([]);
  const [courses, setCourses] = useState([]);
  const [testSeries, setTestSeries] = useState([]);
  const [notes, setNotes] = useState([]);
  const [pyqs, setPyqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingCombo, setEditingCombo] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    price: "",
    discountPercent: "",
    validity: "",
    course: "",
    notes: [],
    testSeries: [],
    pyqs: [],
  });

  // Fetch all data
  useEffect(() => {
    fetchCombos();
    fetchCourses();
    fetchTestSeries();
    fetchNotes();
    fetchPyqs();
  }, []);

  const fetchCombos = async () => {
    try {
      const response = await axiosInstance.get("/combo");
      setCombos(response.data.combos || []);
      toast.success("Combos loaded successfully!");
    } catch (error) {
      console.error("Error fetching combos:", error);
      toast.error("Failed to load combos");
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axiosInstance.get("/courses");
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to load courses");
    }
  };

  const fetchTestSeries = async () => {
    try {
      const response = await axiosInstance.get("/test-series");
      console.log("Test Series API Response:", response.data);
      
      // Handle the nested response structure
      let testSeriesData = [];
      
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        // Extract all series from each exam category
        testSeriesData = response.data.data.flatMap(examCategory => 
          examCategory.series ? examCategory.series : []
        );
      }
      
      setTestSeries(testSeriesData);
      toast.success("Test Series loaded successfully!");
    } catch (error) {
      console.error("Error fetching test series:", error);
      toast.error("Failed to load test series");
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await axiosInstance.get("/notes");
      setNotes(response.data);
      toast.success("Notes loaded successfully!");
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast.error("Failed to load notes");
    }
  };

  const fetchPyqs = async () => {
    try {
      const response = await axiosInstance.get("/pyq");
      console.log("PYQs API Response:", response.data);
      
      // PYQs response is an array of objects with an "exam" property
      let pyqsData = Array.isArray(response.data) ? response.data : [];
      
      setPyqs(pyqsData);
      toast.success("PYQs loaded successfully!");
    } catch (error) {
      console.error("Error fetching PYQs:", error);
      toast.error("Failed to load PYQs");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArrayChange = (e, field) => {
    const options = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData((prev) => ({
      ...prev,
      [field]: options,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingCombo) {
        await axiosInstance.put(`/combo/${editingCombo._id}`, formData);
        toast.success("Combo updated successfully!");
      } else {
        await axiosInstance.post("/combo/create", formData);
        toast.success("Combo created successfully!");
      }

      resetForm();
      fetchCombos();
    } catch (error) {
      console.error("Error saving combo:", error);
      toast.error("Error saving combo. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (combo) => {
    setEditingCombo(combo);
    setFormData({
      title: combo.title,
      slug: combo.slug,
      description: combo.description,
      price: combo.price,
      discountPercent: combo.discountPercent,
      validity: combo.validity,
      course: combo.course?._id || "",
      notes: combo.notes?.map((note) => note._id) || [],
      testSeries: combo.testSeries?.map((ts) => ts._id) || [],
      pyqs: combo.pyqs?.map((pyq) => pyq._id) || [],
    });
    toast.success("Combo loaded for editing!");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this combo?")) return;

    try {
      await axiosInstance.delete(`/combo/${id}`);
      fetchCombos();
      toast.success("Combo deleted successfully!");
    } catch (error) {
      console.error("Error deleting combo:", error);
      toast.error("Error deleting combo. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      description: "",
      price: "",
      discountPercent: "",
      validity: "",
      course: "",
      notes: [],
      testSeries: [],
      pyqs: [],
    });
    setEditingCombo(null);
    toast.success("Form reset successfully!");
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  return (
    <div className="container mx-auto p-6">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <h1 className="text-3xl font-bold mb-8 text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Combo Management
      </h1>

      {/* Create/Edit Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
          <span className="mr-2">{editingCombo ? '✏️' : '➕'}</span>
          {editingCombo ? 'Edit Combo' : 'Create New Combo'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleTitleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                placeholder="Enter combo title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                placeholder="auto-generated-slug"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
              <input
                type="number"
                name="discountPercent"
                value={formData.discountPercent}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                placeholder="0"
                min="0"
                max="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Validity (Days)</label>
              <input
                type="number"
                name="validity"
                value={formData.validity}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                placeholder="365"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
              <select
                name="course"
                value={formData.course}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Course</option>
                {courses.map(course => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              placeholder="Describe the combo package..."
            />
          </div>

          {/* Multi-select dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <select
                multiple
                value={formData.notes}
                onChange={(e) => handleArrayChange(e, 'notes')}
                className="w-full p-3 border border-gray-300 rounded-md h-40 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {notes.map(note => (
                  <option key={note._id} value={note._id}>
                    {note.title}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-2">Hold Ctrl/Cmd to select multiple</p>
              <p className="text-xs text-blue-600 mt-1">{formData.notes.length} selected</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Test Series</label>
              <select
                multiple
                value={formData.testSeries}
                onChange={(e) => handleArrayChange(e, 'testSeries')}
                className="w-full p-3 border border-gray-300 rounded-md h-40 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {testSeries.length > 0 ? (
                  testSeries.map(series => (
                    <option key={series._id} value={series._id}>
                      {series.title}
                    </option>
                  ))
                ) : (
                  <option disabled>No test series available</option>
                )}
              </select>
              <p className="text-xs text-gray-500 mt-2">Hold Ctrl/Cmd to select multiple</p>
              <p className="text-xs text-blue-600 mt-1">{formData.testSeries.length} selected</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">PYQs</label>
              <select
                multiple
                value={formData.pyqs}
                onChange={(e) => handleArrayChange(e, 'pyqs')}
                className="w-full p-3 border border-gray-300 rounded-md h-40 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {pyqs.length > 0 ? (
                  pyqs.map(pyq => (
                    <option key={pyq._id} value={pyq._id}>
                      {pyq.exam} {/* Use the exam property for display */}
                    </option>
                  ))
                ) : (
                  <option disabled>No PYQs available</option>
                )}
              </select>
              <p className="text-xs text-gray-500 mt-2">Hold Ctrl/Cmd to select multiple</p>
              <p className="text-xs text-blue-600 mt-1">{formData.pyqs.length} selected</p>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-3 rounded-md hover:from-blue-700 hover:to-blue-900 disabled:opacity-50 transition-all duration-200 flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                editingCombo ? 'Update Combo' : 'Create Combo'
              )}
            </button>

            {editingCombo && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 transition-colors duration-200"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Combos List */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
          <span className="mr-2">📦</span>
          All Combos ({combos.length})
        </h2>

        {combos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-16" />
            </svg>
            <p className="mt-4">No combos found. Create your first combo!</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {combos.map(combo => (
                  <tr key={combo._id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{combo.title}</div>
                      <div className="text-sm text-gray-500">{combo.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">₹{combo.price}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        {combo.discountPercent}% off
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {combo.validity} days
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(combo)}
                          className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-md transition-colors duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(combo._id)}
                          className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md transition-colors duration-200"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Compo;