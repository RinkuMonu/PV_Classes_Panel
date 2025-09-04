import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../../../config/AxiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BannerManager = () => {
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
    const [imagePreview, setImagePreview] = useState(null);

    const formRef = useRef(null);

    const deviceTypes = ["mobile", "desktop", "both"];
    const positions = [
        "homepage-top",
        "homepage-bottom",
        "sidebar",
        "footer",
        "custom",
    ];

    // ✅ Fetch all banners
    const fetchBanners = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/banners");
            setBanners(res?.data?.banners || []);
        } catch (error) {
            console.error("Error fetching banners:", error);
            toast.error("Failed to fetch banners");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Fetch banner by ID
    const fetchBannerById = async (id) => {
        try {
            const res = await axiosInstance.get(`/banners/${id}`);
            const banner = res?.data?.banner;
            setSelectedBanner(banner || null);

            if (banner) {
                setFormData({
                    bannerName: banner.bannerName,
                    description: banner.description,
                    deviceType: banner.deviceType,
                    position: banner.position,
                    images: null,
                });

                // Set image preview for existing banner
                if (banner.full_image) {
                    // Use the full image URL from the server response
                    setImagePreview(banner.full_image);
                } else {
                    setImagePreview(null);
                }

                // ✅ Scroll to the form when editing
                setTimeout(() => {
                    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 100);
            }
        } catch (error) {
            console.error("Error fetching banner by ID:", error);
            toast.error("Failed to fetch banner details");
        }
    };

    // ✅ Handle input change
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "images") {
            const file = files[0];
            setFormData((prev) => ({ ...prev, images: file }));
            
            // Create image preview
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                // If no file selected, keep the existing preview
                if (selectedBanner && selectedBanner.full_image) {
                    setImagePreview(selectedBanner.full_image);
                } else {
                    setImagePreview(null);
                }
            }
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    // ✅ Create banner
    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append("bannerName", formData.bannerName);
            data.append("description", formData.description);
            data.append("deviceType", formData.deviceType);
            data.append("position", formData.position);
            if (formData.images) data.append("images", formData.images);

            await axiosInstance.post("/banners/create", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast.success("Banner created successfully!");
            fetchBanners();
            setFormData({
                bannerName: "",
                description: "",
                deviceType: "desktop",
                position: "homepage-top",
                images: null,
            });
            setImagePreview(null);
        } catch (error) {
            console.error("Error creating banner:", error);
            toast.error("Failed to create banner");
        }
    };

    // ✅ Update banner
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!selectedBanner) {
            toast.warning("No banner selected to update");
            return;
        }
        try {
            const data = new FormData();
            data.append("bannerName", formData.bannerName);
            data.append("description", formData.description);
            data.append("deviceType", formData.deviceType);
            data.append("position", formData.position);
            
            // Only append image if a new one was selected
            if (formData.images) {
                data.append("images", formData.images);
            } else {
                // Tell the server to preserve the existing image
                data.append("preserveImage", "true");
            }

            await axiosInstance.put(`/banners/${selectedBanner._id}`, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast.success("Banner updated successfully!");
            fetchBanners();
            setSelectedBanner(null);
            setFormData({
                bannerName: "",
                description: "",
                deviceType: "desktop",
                position: "homepage-top",
                images: null,
            });
            setImagePreview(null);
        } catch (error) {
            console.error("Error updating banner:", error);
            toast.error("Failed to update banner");
        }
    };

    // ✅ Delete banner
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this banner?")) return;
        try {
            await axiosInstance.delete(`/banners/${id}`);
            toast.success("Banner deleted successfully!");
            fetchBanners();
        } catch (error) {
            console.error("Error deleting banner:", error);
            toast.error("Failed to delete banner");
        }
    };

    // ✅ Cancel edit
    const handleCancelEdit = () => {
        setSelectedBanner(null);
        setFormData({
            bannerName: "",
            description: "",
            deviceType: "desktop",
            position: "homepage-top",
            images: null,
        });
        setImagePreview(null);
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Banner Manager</h1>
                {selectedBanner && (
                    <button
                        onClick={handleCancelEdit}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                        Cancel Edit
                    </button>
                )}
            </div>

            {/* Create/Update Form */}
            <div ref={formRef} className="bg-white shadow-lg rounded-xl p-6 mb-8 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                    {selectedBanner ? "Update Banner" : "Create New Banner"}
                </h2>

                <form onSubmit={selectedBanner ? handleUpdate : handleCreate}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Banner Name
                            </label>
                            <input
                                type="text"
                                name="bannerName"
                                placeholder="Enter banner name"
                                value={formData.bannerName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <input
                                type="text"
                                name="description"
                                placeholder="Enter description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Device Type
                            </label>
                            <select
                                name="deviceType"
                                value={formData.deviceType}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                            >
                                {deviceTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Position
                            </label>
                            <select
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                            >
                                {positions.map((pos) => (
                                    <option key={pos} value={pos}>
                                        {pos.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Banner Image
                            </label>
                            <div className="flex items-center space-x-4">
                                <label className="flex flex-col items-center px-4 py-6 bg-white text-green-600 rounded-lg border-2 border-dashed border-green-300 cursor-pointer hover:bg-green-50 transition-colors w-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <span className="mt-2 text-base leading-normal">
                                        {formData.images ? formData.images.name : 'Select an image'}
                                    </span>
                                    <input
                                        type="file"
                                        name="images"
                                        accept="image/*"
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                </label>
                                
                                {imagePreview && (
                                    <div className="flex flex-col items-center">
                                        <div className="w-32 h-24 bg-gray-100 border border-gray-300 rounded-lg overflow-hidden flex items-center justify-center">
                                            <img 
                                                src={imagePreview} 
                                                alt="Preview" 
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <span className="text-xs mt-1 text-gray-600">
                                            {formData.images ? "New Image Preview" : "Current Image"}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                {selectedBanner 
                                    ? "Select a new image to replace the current one. Leave empty to keep the existing image." 
                                    : "Upload an image for your banner"
                                }
                            </p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md hover:shadow-lg"
                    >
                        {selectedBanner ? "Update Banner" : "Create Banner"}
                    </button>
                </form>
            </div>

            {/* Banner List */}
            <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                    Banner List
                </h2>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
                    </div>
                ) : banners.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="mt-4 text-gray-600 text-lg">No banners available</p>
                        <p className="text-gray-500">Create your first banner using the form above</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-lg">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {banners.map((banner, idx) => (
                                    <tr key={banner._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{idx + 1}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{banner.bannerName}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${banner.deviceType === 'mobile'
                                                ? 'bg-blue-100 text-blue-800'
                                                : banner.deviceType === 'desktop'
                                                    ? 'bg-purple-100 text-purple-800'
                                                    : 'bg-indigo-100 text-indigo-800'
                                                }`}>
                                                {banner.deviceType}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                                                {banner.position}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {banner.full_image ? (
                                                <img
                                                    src={banner.full_image}
                                                    alt={banner.bannerName}
                                                    className="h-12 w-auto rounded-lg object-cover shadow-sm"
                                                />
                                            ) : (
                                                <span className="text-gray-400">No Image</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => fetchBannerById(banner._id)}
                                                    className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-md text-sm transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(banner._id)}
                                                    className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md text-sm transition-colors"
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
};

export default BannerManager;