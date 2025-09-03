import React, { useEffect, useState } from "react";
import axiosInstance from "../../../config/AxiosInstance";

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
            }
        } catch (error) {
            console.error("Error fetching banner by ID:", error);
        }
    };

    // ✅ Handle input change
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "images") {
            setFormData((prev) => ({ ...prev, images: files[0] }));
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

            alert("Banner created successfully!");
            fetchBanners();
            setFormData({
                bannerName: "",
                description: "",
                deviceType: "desktop",
                position: "homepage-top",
                images: null,
            });
        } catch (error) {
            console.error("Error creating banner:", error);
            alert("Failed to create banner.");
        }
    };

    // ✅ Update banner
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!selectedBanner) {
            alert("No banner selected to update.");
            return;
        }
        try {
            const data = new FormData();
            data.append("bannerName", formData.bannerName);
            data.append("description", formData.description);
            data.append("deviceType", formData.deviceType);
            data.append("position", formData.position);
            if (formData.images) data.append("images", formData.images);

            await axiosInstance.put(`/banners/${selectedBanner._id}`, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            alert("Banner updated successfully!");
            fetchBanners();
            setSelectedBanner(null);
        } catch (error) {
            console.error("Error updating banner:", error);
            alert("Failed to update banner.");
        }
    };

    // ✅ Delete banner
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this banner?")) return;
        try {
            await axiosInstance.delete(`/banners/${id}`);
            alert("Banner deleted successfully!");
            fetchBanners();
        } catch (error) {
            console.error("Error deleting banner:", error);
            alert("Failed to delete banner.");
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Banner Manager</h1>

            {/* Create/Update Form */}
            <form
                onSubmit={selectedBanner ? handleUpdate : handleCreate}
                className="bg-white shadow-md rounded-lg p-4 mb-6"
            >
                <h2 className="text-xl font-semibold mb-4">
                    {selectedBanner ? "Update Banner" : "Create Banner"}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="bannerName"
                        placeholder="Banner Name"
                        value={formData.bannerName}
                        onChange={handleChange}
                        className="border p-2 rounded w-full"
                        required
                    />
                    <input
                        type="text"
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                        className="border p-2 rounded w-full"
                        required
                    />

                    <select
                        name="deviceType"
                        value={formData.deviceType}
                        onChange={handleChange}
                        className="border p-2 rounded w-full"
                    >
                        {deviceTypes.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>

                    <select
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        className="border p-2 rounded w-full"
                    >
                        {positions.map((pos) => (
                            <option key={pos} value={pos}>
                                {pos}
                            </option>
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
                    className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    {selectedBanner ? "Update" : "Create"}
                </button>
            </form>

            {/* Banner List */}
            <div className="bg-white shadow-md rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-4">Banners List</h2>
                {loading ? (
                    <p>Loading banners...</p>
                ) : banners.length === 0 ? (
                    <p>No banners available.</p>
                ) : (
                    <table className="w-full border">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-3 py-2">#</th>
                                <th className="border px-3 py-2">Name</th>
                                <th className="border px-3 py-2">Device</th>
                                <th className="border px-3 py-2">Position</th>
                                <th className="border px-3 py-2">Image</th>
                                <th className="border px-3 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {banners.map((banner, idx) => (
                                <tr key={banner._id} className="text-center">
                                    <td className="border px-3 py-2">{idx + 1}</td>
                                    <td className="border px-3 py-2">{banner.bannerName}</td>
                                    <td className="border px-3 py-2">{banner.deviceType}</td>
                                    <td className="border px-3 py-2">{banner.position}</td>
                                    <td className="border px-3 py-2">
                                        {banner.full_image ? (
                                            <img
                                                src={`https://api.pvclasses.in/uploads/banner/${banner.full_image.split("/").pop()}`}
                                                alt={banner.bannerName}
                                                className="h-12 mx-auto rounded"
                                            />
                                        ) : (
                                            "No Image"
                                        )}
                                    </td>
                                    <td className="border px-3 py-2 space-x-2">
                                        <button
                                            onClick={() => fetchBannerById(banner._id)}
                                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(banner._id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default BannerManager;
