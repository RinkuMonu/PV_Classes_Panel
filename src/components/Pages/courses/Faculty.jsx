// src/components/Admin/Faculty/FacultyManagement.jsx

import React, { useEffect, useState } from "react";
import axiosInstance from "../../../config/AxiosInstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function FacultyManagement() {
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    experience: "",
    specialization: "",
    photo: null,
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
      });
      fetchFaculty();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create faculty");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Faculty Management</h2>

      {/* Faculty Create Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-6 p-4 border border-gray-300 rounded"
      >
        <h3 className="text-lg font-semibold mb-3">Add New Faculty</h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="experience"
            placeholder="Experience"
            value={formData.experience}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="specialization"
            placeholder="Specialization"
            value={formData.specialization}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
        >
          Add Faculty
        </button>
      </form>

      {/* Faculty Table */}
      {loading ? (
        <p>Loading faculty...</p>
      ) : (
        <table className="w-full border border-gray-300 text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">#</th>
              <th className="border p-2">Photo</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Experience</th>
              <th className="border p-2">Specialization</th>
            </tr>
          </thead>
          <tbody>
            {facultyList.length > 0 ? (
              facultyList.map((faculty, index) => (
                <tr key={faculty._id}>
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">
                    {faculty.photo ? (
                      <img
                        // src={faculty.photo}
                              src={`https://api.pvclasses.in/${faculty.photo}`}

                        alt={faculty.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      "No photo"
                    )}
                  </td>
                  <td className="border p-2">{faculty.name}</td>
                  <td className="border p-2">{faculty.experience}</td>
                  <td className="border p-2">{faculty.specialization}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="border p-2 text-center">
                  No faculty found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default FacultyManagement;
