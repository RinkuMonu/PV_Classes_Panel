


// src/components/Admin/Faculty/FacultyManagement.jsx

import React, { useEffect, useState } from "react";
import axiosInstance from "../../../config/AxiosInstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GlobalTable from "../../common/GlobalTable";
import TableActionButton from "../../common/TableActionButton";
import { Video, Trash2 } from "lucide-react";

function FacultyManagement() {
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    experience: "",
    specialization: "",
    photo: null,
    demoVideo: "",
  });

  // Fetch all faculty
  const fetchFaculty = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/faculty");
      setFacultyList(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch faculty");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      setFormData({ ...formData, photo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle form submit to create faculty
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name) {
      toast.error("Name is required");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("experience", formData.experience);
    data.append("specialization", formData.specialization);
    if (formData.photo) {
      data.append("photo", formData.photo);
    }
    if (formData.demoVideo) {
      data.append("demoVideo", formData.demoVideo);
    }

    try {
      await axiosInstance.post("/faculty", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Faculty created successfully");
      setFormData({
        name: "",
        experience: "",
        specialization: "",
        photo: null,
        demoVideo: "",
      });
      fetchFaculty();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create faculty");
    }
  };

  // Delete faculty
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this faculty?")) return;

    try {
      await axiosInstance.delete(`/faculty/${id}`);
      toast.success("Faculty deleted successfully");
      fetchFaculty();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete faculty");
    }
  };

  const facultyColumns = [
    {
      key: "index",
      // UI-only: use the website's standard serial-number column label.
      header: "S.No.",
      render: (_faculty, index) => index + 1,
    },
    {
      key: "photo",
      header: "Photo",
      render: (faculty) => (
        faculty.photo ? (
          <img
            src={`${import.meta.env.VITE_API_SERVER_URL}${faculty.photo}`}
            alt={faculty.name}
            className="w-12 h-12 object-cover rounded-full shadow-sm"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
        )
      ),
    },
    {
      key: "name",
      header: "Name",
      cellClassName: "font-medium text-gray-900",
    },
    {
      key: "experience",
      header: "Experience",
    },
    {
      key: "specialization",
      header: "Specialization",
    },
    {
      key: "demoVideo",
      header: "Demo Video",
      render: (faculty) => (
        faculty.demoVideo ? (
          // UI-only: the demo link uses the shared icon button instead of text.
          <TableActionButton
            tone="view"
            title="Watch demo video"
            onClick={() => window.open(faculty.demoVideo, "_blank", "noopener,noreferrer")}
          >
            {/* UI-only: use a video symbol for the faculty demo-video action. */}
            <Video className="h-4 w-4" />
          </TableActionButton>
        ) : (
          "-"
        )
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (faculty) => (
        // UI-only: faculty actions now use the shared website table button.
        <TableActionButton
          onClick={() => handleDelete(faculty._id)}
          tone="delete"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </TableActionButton>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* UI-only: standardized page header; faculty logic is unchanged. */}
      <div data-page-icon data-icon-symbol="♙" className="bg-gradient-to-r from-[#204972] to-[#87b105] rounded-xl shadow-lg mb-6 p-6 text-white">
        <h2 className="text-2xl font-bold">Faculty Management</h2>
        <p className="mt-1 opacity-90">Create and manage faculty profiles</p>
      </div>

      {/* Faculty Create Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b">Add New Faculty</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                name="name"
                placeholder="Enter faculty name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#87b105] focus:border-[#87b105] transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
              <input
                type="text"
                name="experience"
                placeholder="e.g., 5 years"
                value={formData.experience}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#87b105] focus:border-[#87b105] transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
              <input
                type="text"
                name="specialization"
                placeholder="Area of expertise"
                value={formData.specialization}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#87b105] focus:border-[#87b105] transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Demo Video URL</label>
              <input
                type="text"
                name="demoVideo"
                placeholder="https://youtube.com/..."
                value={formData.demoVideo}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#87b105] focus:border-[#87b105] transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
              <div className="flex items-center">
                <label className="flex flex-col items-center px-4 py-3 bg-white text-[#87b105] rounded-lg border border-gray-300 cursor-pointer hover:bg-green-50 transition">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="mt-1 text-sm">
                    {formData.photo ? formData.photo.name : "Choose image"}
                  </span>
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 px-6 py-2 bg-[#87b105] hover:scale-105 ease-in-out text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition"
          >
            Add Faculty
          </button>
        </form>
      </div>

      {/* Faculty Table */}
      <GlobalTable
        title={`Faculty List (${facultyList.length})`}
        columns={facultyColumns}
        data={facultyList}
        loading={loading}
        emptyText="No faculty members found"
        loadingText="Loading faculty..."
        getRowKey={(faculty) => faculty._id}
      />
    </div>
  );
}

export default FacultyManagement;
