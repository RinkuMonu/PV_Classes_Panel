import React, { useEffect, useState } from "react";
import axiosInstance from "../../../config/AxiosInstance";
import { FaCheckCircle, FaTimesCircle, FaEye, FaPaperPlane, FaSpinner } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DoubtsTable = () => {
    const [doubts, setDoubts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [solutions, setSolutions] = useState({});
    const [selectedDoubt, setSelectedDoubt] = useState(null);
    const [activeSolutionId, setActiveSolutionId] = useState(null);
    const [detailViewLoading, setDetailViewLoading] = useState(false);

    // Fetch all doubts
    const fetchDoubts = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/doubt/all");
            let fetchedDoubts = res?.data?.doubts || [];

            // Sort so that unsolved doubts come first
            fetchedDoubts.sort((a, b) => {
                if (a.status === "unsolved" && b.status !== "unsolved") return -1;
                if (a.status !== "unsolved" && b.status === "unsolved") return 1;
                return 0;
            });

            setDoubts(fetchedDoubts);
        } catch (error) {
            console.error("Error fetching doubts:", error);
            toast.error("Failed to fetch doubts");
        } finally {
            setLoading(false);
        }
    };

    // Fetch a doubt by ID
    const fetchDoubtById = async (id) => {
        try {
            setDetailViewLoading(true);
            const res = await axiosInstance.get(`/doubt/${id}`);
            setSelectedDoubt(res?.data || null);
        } catch (error) {
            console.error("Error fetching doubt by ID:", error);
            setSelectedDoubt(null);
            toast.error("Failed to fetch doubt details");
        } finally {
            setDetailViewLoading(false);
        }
    };

    // Solve a doubt
    const handleSolve = async (id) => {
        const solution = solutions[id];
        if (!solution?.trim()) {
            toast.warning("Please enter a solution before resolving!");
            return;
        }

        try {
            setActiveSolutionId(id);
            await axiosInstance.post(`/doubt/solve/${id}`, { solution });
            toast.success("Doubt resolved successfully!");
            setSolutions((prev) => ({ ...prev, [id]: "" }));
            fetchDoubts();
            if (selectedDoubt && selectedDoubt._id === id) {
                fetchDoubtById(id);
            }
        } catch (error) {
            console.error("Error solving doubt:", error);
            toast.error("Failed to resolve doubt");
        } finally {
            setActiveSolutionId(null);
        }
    };

    useEffect(() => {
        fetchDoubts();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
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
            
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-green-800 mb-2">Doubts Management</h1>
                    <p className="text-gray-600">View and resolve student doubts</p>
                </div>

                {/* Doubts Table */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-green-100">
                    <div className="bg-green-50 px-6 py-4 border-b border-green-200">
                        <h2 className="text-xl font-semibold text-green-800">Doubts List</h2>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-green-50">
                                        <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">#</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Question</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {doubts.map((doubt, idx) => (
                                        <tr key={doubt.id} className="hover:bg-green-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{idx + 1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{doubt.userName}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">{doubt.title}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {doubt.status === "resolved" ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        <FaCheckCircle className="mr-1" /> Resolved
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                        <FaTimesCircle className="mr-1" /> Pending
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center space-x-2">
                                                    {/* <button
                                                        onClick={() => fetchDoubtById(doubt.id)}
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                                    >
                                                        <FaEye className="mr-1" /> View
                                                    </button> */}

                                                    {doubt.status !== "resolved" && (
                                                        <div className="flex-1 flex items-center">
                                                            <input
                                                                type="text"
                                                                placeholder="Enter solution..."
                                                                value={solutions[doubt.id] || ""}
                                                                onChange={(e) =>
                                                                    setSolutions((prev) => ({
                                                                        ...prev,
                                                                        [doubt.id]: e.target.value,
                                                                    }))
                                                                }
                                                                className="flex-1 min-w-0 block w-full px-3 py-1.5 rounded-md border border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                                            />
                                                            <button
                                                                onClick={() => handleSolve(doubt.id)}
                                                                disabled={activeSolutionId === doubt.id}
                                                                className="ml-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-75 transition-colors"
                                                            >
                                                                {activeSolutionId === doubt.id ? (
                                                                    <FaSpinner className="animate-spin mr-1" />
                                                                ) : (
                                                                    <FaPaperPlane className="mr-1" />
                                                                )}
                                                                Resolve
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {doubts.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <div className="mx-auto w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-4">
                                <FaCheckCircle className="text-green-500 text-3xl" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-700 mb-2">No doubts found</h3>
                            <p className="text-gray-500">All student doubts have been resolved</p>
                        </div>
                    )}
                </div>

                {/* Doubt details section */}
                {selectedDoubt && (
                    <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden border border-green-100">
                        <div className="bg-green-50 px-6 py-4 border-b border-green-200">
                            <h2 className="text-xl font-semibold text-green-800">Doubt Details</h2>
                        </div>
                        
                        {detailViewLoading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
                            </div>
                        ) : (
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="md:col-span-2">
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Question</h3>
                                        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedDoubt.title}</p>
                                        
                                        <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">Description</h3>
                                        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">{selectedDoubt.description}</p>
                                    </div>
                                    
                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Doubt Information</h3>
                                        
                                        <div className="mb-4">
                                            <p className="text-sm font-medium text-gray-700">Status</p>
                                            {selectedDoubt.status === "resolved" ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                                                    <FaCheckCircle className="mr-1" /> Resolved
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-1">
                                                    <FaTimesCircle className="mr-1" /> Pending
                                                </span>
                                            )}
                                        </div>
                                        
                                        <div className="mb-4">
                                            <p className="text-sm font-medium text-gray-700">User</p>
                                            <p className="text-gray-700">{selectedDoubt.userName}</p>
                                        </div>
                                        
                                        {selectedDoubt.status !== "resolved" && (
                                            <div className="mt-6">
                                                <p className="text-sm font-medium text-gray-700 mb-2">Provide Solution</p>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Enter solution..."
                                                        value={solutions[selectedDoubt._id] || ""}
                                                        onChange={(e) =>
                                                            setSolutions((prev) => ({
                                                                ...prev,
                                                                [selectedDoubt._id]: e.target.value,
                                                            }))
                                                        }
                                                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                                    />
                                                    <button
                                                        onClick={() => handleSolve(selectedDoubt._id)}
                                                        disabled={activeSolutionId === selectedDoubt._id}
                                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-75 transition-colors"
                                                    >
                                                        {activeSolutionId === selectedDoubt._id ? (
                                                            <FaSpinner className="animate-spin mr-1" />
                                                        ) : (
                                                            <FaPaperPlane className="mr-1" />
                                                        )}
                                                        Resolve
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoubtsTable;