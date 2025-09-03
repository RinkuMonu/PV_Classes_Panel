import React, { useEffect, useState } from "react";
import axiosInstance from "../../../config/AxiosInstance";
import { FaEye, FaEdit, FaPlus, FaSpinner } from "react-icons/fa";

const deviceTypes = ["mobile", "desktop", "both"];
const positions = ["homepage-top", "homepage-bottom", "sidebar", "footer", "custom"];

const BannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [formData, setFormData] = useState({
    bannerName: "",
    description: "",
    deviceType: "desktop",
    position: "homepage-top",
    images: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all banners
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/banners");
      setBanners(res?.data || []);
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch banner by ID
  const fetchBannerById = async (id) => {
    try {
      const res = await axiosInstance.get(`/banners/${id}`);
      setSelectedBanner(res?.data || null);
    } catch (error) {
      console.error("Error fetching banner:", error);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      setFormData({ ...formData, images: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Create Banner
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) data.append(key, formData[key]);
      });

      await axiosInstance.post("/banners/create", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Banner created successfully!");
      setFormData({
        bannerName: "",
        description: "",
        deviceType: "desktop",
        position: "homepage-top",
        images: null,
      });
      fetchBanners();
    } catch (error) {
      console.error("Error creating banner:", error);
      alert("Failed to create banner.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update Banner
  const handleUpdate = async (id) => {
    try {
      setIsSubmitting(true);
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) data.append(key, formData[key]);
      });

      await axiosInstance.put(`/banners/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Banner updated successfully!");
      setSelectedBanner(null);
      fetchBanners();
    } catch (error) {
      console.error("Error updating banner:", error);
      alert("Failed to update banner.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-800">Banner Management</h1>
        </div>

        {/* Create/Update Form */}
        <form
          onSubmit={selectedBanner ? (e) => { e.preventDefault(); handleUpdate(selectedBanner._id); } : handleCreate}
          className="bg-white p-6 rounded-lg shadow-md mb-8"
        >
          <h2 className="text-lg font-semibold mb-4">
            {selectedBanner ? "Update Banner" : "Create Banner"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="bannerName"
              value={formData.bannerName}
              onChange={handleChange}
              placeholder="Banner Name"
              className="border p-2 rounded w-full"
              required
            />

            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              className="border p-2 rounded w-full"
              required
            />

            <select
              name="deviceType"
              value={formData.deviceType}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            >
              {deviceTypes.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <select
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            >
              {positions.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            <input
              type="file"
              name="images"
              accept="image/*"
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
          >
            {isSubmitting ? <FaSpinner className="animate-spin mr-2" /> : <FaPlus className="mr-2" />}
            {selectedBanner ? "Update" : "Create"}
          </button>
        </form>

        {/* Banners Table */}
        <div className="bg-white rounded-lg shadow-md">
          <table className="w-full text-sm">
            <thead className="bg-green-50">
              <tr>
                <th className="p-2 border">#</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Device</th>
                <th className="p-2 border">Position</th>
                <th className="p-2 border">Image</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-4">Loading...</td></tr>
              ) : banners.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-4">No banners found</td></tr>
              ) : (
                banners.map((banner, idx) => (
                  <tr key={banner._id}>
                    <td className="border p-2">{idx + 1}</td>
                    <td className="border p-2">{banner.bannerName}</td>
                    <td className="border p-2">{banner.deviceType}</td>
                    <td className="border p-2">{banner.position}</td>
                    <td className="border p-2">
                      {banner.images?.length > 0 && (
                        <img
                          src={`https://api.pvclasses.in/uploads/banner/${banner.images[0]}`}
                          alt="banner"
                          className="w-24 h-12 object-cover"
                        />
                      )}
                    </td>
                    <td className="border p-2 space-x-2">
                      <button
                        onClick={() => fetchBannerById(banner._id)}
                        className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                      >
                        <FaEye /> View
                      </button>
                      <button
                        onClick={() => {
                          setSelectedBanner(banner);
                          setFormData({
                            bannerName: banner.bannerName,
                            description: banner.description,
                            deviceType: banner.deviceType,
                            position: banner.position,
                            images: null,
                          });
                        }}
                        className="px-2 py-1 bg-yellow-500 text-white rounded text-xs"
                      >
                        <FaEdit /> Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Banner Details */}
        {selectedBanner && (
          <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Banner Details</h2>
            <p><strong>Name:</strong> {selectedBanner.bannerName}</p>
            <p><strong>Description:</strong> {selectedBanner.description}</p>
            <p><strong>Device:</strong> {selectedBanner.deviceType}</p>
            <p><strong>Position:</strong> {selectedBanner.position}</p>
            {selectedBanner.images?.length > 0 && (
              <img
                src={`https://api.pvclasses.in/uploads/banner/${selectedBanner.images[0]}`}
                alt="banner"
                className="w-48 h-24 mt-2 object-cover"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerManagement;
