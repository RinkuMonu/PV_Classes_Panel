// src/components/Pages/Results/ResultManagement.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../../../config/AxiosInstance";
import { toast } from "react-toastify";
import {
    FiEye,
    FiX,
    FiTrash2,
    FiEdit2,
    FiPlus,
    FiFilter,
    FiDownload,
    FiBarChart2,
    // FiUser,
    // FiBookOpen,
    FiAward,
    FiMessageSquare,
    FiCalendar
} from "react-icons/fi";

import GlobalTable from "../../common/GlobalTable";
import TableFilters from "../../common/TableFilters";
import TableActionButton from "../../common/TableActionButton";

function ResultManagement() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedResult, setSelectedResult] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportData, setReportData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [filterExamType, setFilterExamType] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        examType: "",
        marks: "",
        message: ""
    });

    const limit = 10;

    // Categories and Exam Types for filters
    const categories = ["GENERAL", "OBC", "SC", "ST", "EWS"];
    const examTypes = ["PRT", "TGT"];

    // Fetch all results with pagination and filters
    const fetchResults = async () => {
        setLoading(true);
        try {
            let url = `/results?page=${currentPage}&limit=${limit}`;
            if (searchTerm) url += `&search=${searchTerm}`;
            if (filterCategory) url += `&category=${filterCategory}`;
            if (filterExamType) url += `&examType=${filterExamType}`;

            const response = await axiosInstance.get(url);
            setResults(response.data.data);
            // setTotalPages(response.data.pagination?.totalPages || 1);
            setTotalPages(response.data.totalPages || 1);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch results");
        } finally {
            setLoading(false);
        }
    };

    // Fetch single result by ID
    const fetchResultById = async (id) => {
        try {
            const response = await axiosInstance.get(`/results/${id}`);
            setSelectedResult(response.data.data);
            setShowModal(true);
        } catch {
            toast.error("Failed to fetch result details");
        }
    };

    // Delete result
    const deleteResult = async (id) => {
        if (window.confirm("Are you sure you want to delete this result?")) {
            try {
                await axiosInstance.delete(`/results/${id}`);
                toast.success("Result deleted successfully");
                fetchResults(); // Refresh the list
            } catch {
                toast.error("Failed to delete result");
            }
        }
    };

    // Update result
    const updateResult = async (id, data) => {
        setIsSubmitting(true);
        try {
            await axiosInstance.put(`/results/${id}`, data);
            toast.success("Result updated successfully");
            setShowModal(false);
            fetchResults();
        } catch {
            toast.error("Failed to update result");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Create new result
    const createResult = async (data) => {
        setIsSubmitting(true);
        try {
            await axiosInstance.post("/results", data);
            toast.success("Result created successfully");
            setShowModal(false);
            fetchResults();
            resetForm();
        } catch {
            toast.error("Failed to create result");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Fetch report summary
    const fetchReportSummary = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get("/results/report/summary");
            setReportData(response.data.data);
            setShowReportModal(true);
        } catch {
            toast.error("Failed to fetch report summary");
        } finally {
            setLoading(false);
        }
    };

    // Handle form submit
    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedResult) {
            updateResult(selectedResult._id, formData);
        } else {
            createResult(formData);
        }
    };

    // Handle edit button click
    const handleEdit = (result) => {
        setSelectedResult(result);
        setFormData({
            name: result.name,
            category: result.category,
            examType: result.examType,
            marks: result.marks,
            message: result.message || ""
        });
        setShowModal(true);
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            name: "",
            category: "",
            examType: "",
            marks: "",
            message: ""
        });
        setSelectedResult(null);
    };

    // Handle add new button
    const handleAddNew = () => {
        resetForm();
        setShowModal(true);
    };

    useEffect(() => {
        fetchResults();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, searchTerm, filterCategory, filterExamType]);

    // Get category badge color
    const getCategoryBadgeColor = (category) => {
        const colors = {
            GENERAL: "bg-blue-100 text-blue-800",
            OBC: "bg-green-100 text-green-800",
            SC: "bg-purple-100 text-purple-800",
            ST: "bg-orange-100 text-orange-800",
            EWS: "bg-yellow-100 text-yellow-800"
        };
        return colors[category] || "bg-gray-100 text-gray-800";
    };

    // Get marks badge color
    const getMarksBadgeColor = (marks) => {
        if (marks >= 50) return "bg-green-100 text-green-800";
        if (marks >= 40) return "bg-yellow-100 text-yellow-800";
        return "bg-red-100 text-red-800";
    };

    // Changed: filter options are now passed into shared TableFilters.
    // API filter logic in fetchResults stays unchanged.
    const resultFilterOptions = [
    {
        key: "category",
        value: filterCategory,
        onChange: (value) => {
        setFilterCategory(value);
        setCurrentPage(1);
        },
        options: [
        { value: "", label: "All Categories" },
        ...categories.map((category) => ({
            value: category,
            label: category,
        })),
        ],
    },
    {
        key: "examType",
        value: filterExamType,
        onChange: (value) => {
        setFilterExamType(value);
        setCurrentPage(1);
        },
        options: [
        { value: "", label: "All Exam Types" },
        ...examTypes.map((type) => ({
            value: type,
            label: type,
        })),
        ],
    },
    ];
    
    // Changed: result table columns are now passed into GlobalTable.
    // Backend API, pagination, modals, edit/delete/view handlers remain unchanged.
        const resultColumns = [
        {
            key: "serial",
            header: "S.No",
            render: (_result, index) => (currentPage - 1) * limit + index + 1,
        },
        {
            key: "name",
            header: "Student Name",
            cellClassName: "font-medium text-gray-900 whitespace-nowrap",
        },
        {
            key: "category",
            header: "Category",
            render: (result) => (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryBadgeColor(result.category)}`}>
                {result.category}
            </span>
            ),
        },
        {
            key: "examType",
            header: "Exam Type",
            render: (result) => (
            <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-700">
                {result.examType}
            </span>
            ),
        },
        {
            key: "marks",
            header: "Marks",
            render: (result) => (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getMarksBadgeColor(result.marks)}`}>
                {result.marks} / 60
            </span>
            ),
        },
        {
            key: "message",
            header: "Feedback",
            cellClassName: "max-w-xs",
            render: (result) => (
            <p className="text-sm text-gray-600 truncate">
                {result.message || "No feedback"}
            </p>
            ),
        },
        {
            key: "createdAt",
            header: "Date",
            render: (result) => new Date(result.createdAt).toLocaleDateString(),
        },
        {
            key: "actions",
            header: "Actions",
            render: (result) => (
            <div className="flex gap-2">
                <TableActionButton
                tone="view"
                onClick={() => fetchResultById(result._id)}
                title="View Details"
                >
                <FiEye size={18} />
                </TableActionButton>

                <TableActionButton
                tone="edit"
                onClick={() => handleEdit(result)}
                title="Edit"
                >
                <FiEdit2 size={18} />
                </TableActionButton>

                <TableActionButton
                tone="delete"
                onClick={() => deleteResult(result._id)}
                title="Delete"
                >
                <FiTrash2 size={18} />
                </TableActionButton>
            </div>
            ),
        },
        ];

    // Changed: CSV export fields are passed into TableFilters, so export stays consistent across tables.
    const resultExportColumns = [
        {
            key: "serial",
            header: "S.No",
            value: (_result, index) => (currentPage - 1) * limit + index + 1,
        },
        { key: "name", header: "Student Name", value: (result) => result.name || "N/A" },
        { key: "category", header: "Category", value: (result) => result.category || "N/A" },
        { key: "examType", header: "Exam Type", value: (result) => result.examType || "N/A" },
        { key: "marks", header: "Marks", value: (result) => `${result.marks || 0} / 60` },
        { key: "message", header: "Feedback", value: (result) => result.message || "No feedback" },
        {
            key: "createdAt",
            header: "Date",
            value: (result) => result.createdAt ? new Date(result.createdAt).toLocaleDateString() : "N/A",
        },
    ];

    return (
        <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* UI-only: shared visual header style; result logic is unchanged. */}
                <div className="bg-gradient-to-r from-[#204972] to-[#87b105] rounded-xl shadow-lg mb-6 p-4 sm:p-6 text-white">
                    {/* UI-only: stack and stretch result-header actions on narrow screens. */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                            <h2 className="flex items-center text-xl font-bold sm:text-2xl">
                                <FiAward className="mr-2" /> Exam Results Management
                            </h2>
                            <p className="mt-1 opacity-90">Manage and analyze student exam results</p>
                        </div>
                        <div className="grid w-full grid-cols-1 gap-3 sm:w-auto sm:grid-cols-2">
                            <button
                                onClick={fetchReportSummary}
                                className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#204972] px-4 py-2 text-white transition hover:bg-[#183654] sm:w-auto"
                            >
                                <FiBarChart2 /> View Report
                            </button>
                            <button
                                onClick={handleAddNew}
                                className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#204972] px-4 py-2 text-white transition hover:bg-[#183654] sm:w-auto"
                            >
                                <FiPlus /> Add Result
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                {/* <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by name..."
                                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                            <FiUser className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        </div>

                        <div className="relative">
                            <select
                                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                value={filterCategory}
                                onChange={(e) => {
                                    setFilterCategory(e.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <FiFilter className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        </div>

                        <div className="relative">
                            <select
                                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                value={filterExamType}
                                onChange={(e) => {
                                    setFilterExamType(e.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="">All Exam Types</option>
                                {examTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                            <FiBookOpen className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        </div>

                        <button
                            onClick={() => {
                                setSearchTerm("");
                                setFilterCategory("");
                                setFilterExamType("");
                                setCurrentPage(1);
                            }}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div> */}
                {/* Changed: filters now use TableFilters. Existing API filter state is unchanged. */}
                <div className="mb-6">
                <TableFilters
                    searchValue={searchTerm}
                    onSearchChange={(value) => {
                    setSearchTerm(value);
                    setCurrentPage(1);
                    }}
                    searchPlaceholder="Search by name..."
                    filters={resultFilterOptions}
                    exportData={results}
                    exportColumns={resultExportColumns}
                    exportFileName={`exam-results-${new Date().toISOString().split("T")[0]}.csv`}
                    rightContent={
                    <button
                        onClick={() => {
                        setSearchTerm("");
                        setFilterCategory("");
                        setFilterExamType("");
                        setCurrentPage(1);
                        }}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                    >
                        Clear Filters
                    </button>
                    }
                />
                </div>

                {/* Results Table */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="text-center py-20">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                                <p className="mt-2 text-gray-500">Loading...</p>
                            </div>
                        ) : (
                            // <table className="w-full text-left">
                            //     <thead className="bg-gray-100 border-b">
                            //         <tr>
                            //             <th className="px-6 py-4 text-sm font-semibold text-gray-600">S.No</th>
                            //             <th className="px-6 py-4 text-sm font-semibold text-gray-600">Student Name</th>
                            //             <th className="px-6 py-4 text-sm font-semibold text-gray-600">Category</th>
                            //             <th className="px-6 py-4 text-sm font-semibold text-gray-600">Exam Type</th>
                            //             <th className="px-6 py-4 text-sm font-semibold text-gray-600">Marks</th>
                            //             <th className="px-6 py-4 text-sm font-semibold text-gray-600">Feedback</th>
                            //             <th className="px-6 py-4 text-sm font-semibold text-gray-600">Date</th>
                            //             <th className="px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
                            //         </tr>
                            //     </thead>
                            //     <tbody>
                            //         {results.map((result, index) => (
                            //             <tr key={result._id} className="border-b hover:bg-gray-50 transition">
                            //                 <td className="px-6 py-4 text-sm text-gray-600">
                            //                     {(currentPage - 1) * limit + index + 1}
                            //                 </td>
                            //                 <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">{result.name}</td>
                            //                 <td className="px-6 py-4">
                            //                     <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryBadgeColor(result.category)}`}>
                            //                         {result.category}
                            //                     </span>
                            //                 </td>
                            //                 <td className="px-6 py-4">
                            //                     <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-700">
                            //                         {result.examType}
                            //                     </span>
                            //                 </td>
                            //                 <td className="px-6 py-4">
                            //                     <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap  ${getMarksBadgeColor(result.marks)}`}>
                            //                         {result.marks} / 60
                            //                     </span>
                            //                 </td>
                            //                 <td className="px-6 py-4 max-w-xs">
                            //                     <p className="text-sm text-gray-600 truncate">
                            //                         {result.message || "No feedback"}
                            //                     </p>
                            //                 </td>
                            //                 <td className="px-6 py-4 text-sm text-gray-500">
                            //                     {new Date(result.createdAt).toLocaleDateString()}
                            //                 </td>
                            //                 <td className="px-6 py-4">
                            //                     <div className="flex gap-2">
                            //                         <button
                            //                             onClick={() => fetchResultById(result._id)}
                            //                             className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            //                             title="View Details"
                            //                         >
                            //                             <FiEye size={18} />
                            //                         </button>
                            //                         <button
                            //                             onClick={() => handleEdit(result)}
                            //                             className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                            //                             title="Edit"
                            //                         >
                            //                             <FiEdit2 size={18} />
                            //                         </button>
                            //                         <button
                            //                             onClick={() => deleteResult(result._id)}
                            //                             className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            //                             title="Delete"
                            //                         >
                            //                             <FiTrash2 size={18} />
                            //                         </button>
                            //                     </div>
                            //                 </td>
                            //             </tr>
                            //         ))}
                            //     </tbody>
                            // </table>
                        <GlobalTable
                            columns={resultColumns}
                            data={results}
                            loading={loading}
                            loadingText="Loading results..."
                            emptyText="No results found"
                            wrapperClassName="border-0 rounded-none shadow-none"
                            pagination={{
                                currentPage,
                                totalPages,
                                onPageChange: setCurrentPage,
                            }}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Modal for Add/Edit/View */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        {/* UI-only: Add/Edit/View Result overlay uses the shared themed header. */}
                        <div className="flex justify-between items-center p-6 border-b border-white/20 bg-gradient-to-r from-[#204972] to-[#87b105] text-white">
                            <h3 className="text-xl font-bold">
                                {selectedResult && !formData.name ? "Result Details" : selectedResult ? "Edit Result" : "Add New Result"}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    resetForm();
                                }}
                                className="rounded-full p-2 text-white/80 hover:bg-white/15 hover:text-white transition"
                            >
                                <FiX size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            {selectedResult && !formData.name ? (
                                // View Mode
                                <div className="space-y-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-500 mb-1">Student Name</p>
                                        <p className="text-lg font-semibold">{selectedResult.name}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-500 mb-1">Category</p>
                                            <p className="text-lg font-semibold">{selectedResult.category}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-500 mb-1">Exam Type</p>
                                            <p className="text-lg font-semibold">{selectedResult.examType}</p>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-500 mb-1">Marks</p>
                                        <p className="text-3xl font-bold text-emerald-600">{selectedResult.marks}/60</p>
                                    </div>
                                    {selectedResult.message && (
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-500 mb-1">Feedback</p>
                                            <p className="text-gray-700">{selectedResult.message}</p>
                                        </div>
                                    )}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-500 mb-1">Created At</p>
                                        <p className="text-gray-600">{new Date(selectedResult.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                            ) : (
                                // Add/Edit Mode
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Student Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Category *
                                            </label>
                                            <select
                                                required
                                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            >
                                                <option value="">Select Category</option>
                                                {categories.map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Exam Type *
                                            </label>
                                            <select
                                                required
                                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                value={formData.examType}
                                                onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
                                            >
                                                <option value="">Select Exam Type</option>
                                                {examTypes.map(type => (
                                                    <option key={type} value={type}>{type}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Marks (out of 60) *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            max="100"
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                            value={formData.marks}
                                            onChange={(e) => setFormData({ ...formData, marks: parseInt(e.target.value) })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Feedback / Message
                                        </label>
                                        <textarea
                                            rows="3"
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            placeholder="Optional feedback from student..."
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        resetForm();
                                    }}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition form-cancel-button"
                                >
                                    Cancel
                                </button>
                                {(!selectedResult || formData.name) && (
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition disabled:opacity-50"
                                    >
                                        {isSubmitting ? "Saving..." : (selectedResult ? "Update" : "Create")}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Report Summary Modal */}
            {showReportModal && (
                <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    {/* UI-only: report modal now follows the shared PV Classes blue/green theme. */}
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 bg-gradient-to-r from-[#204972] to-[#87b105] text-white">
                            <h3 className="text-xl font-bold flex items-center">
                                <FiBarChart2 className="mr-2" /> Exam Results Report Summary
                            </h3>
                            <button
                                onClick={() => setShowReportModal(false)}
                                className="rounded-full p-2 text-white/80 hover:bg-white/15 hover:text-white transition"
                            >
                                <FiX size={24} />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {reportData.map((item, index) => (
                                    <div key={index} className="rounded-xl border border-[#204972]/10 bg-gradient-to-br from-[#204972]/[0.04] to-[#87b105]/[0.08] p-5 shadow-sm">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <span className="inline-block px-2.5 py-1 bg-[#87b105]/15 text-[#527000] rounded-full text-xs font-semibold mb-2">
                                                    {item._id.examType}
                                                </span>
                                                <h4 className="text-lg font-bold text-gray-800">{item._id.category}</h4>
                                            </div>
                                            <span className="flex h-11 min-w-11 items-center justify-center rounded-xl bg-[#204972] px-3 text-xl font-bold text-white">
                                                {item.totalStudents}
                                            </span>
                                        </div>

                                        <div className="space-y-2 mt-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Average Marks:</span>
                                                <span className="font-semibold">{item.averageMarks}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Highest Marks:</span>
                                                <span className="font-semibold text-green-600">{item.maxMarks}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Lowest Marks:</span>
                                                <span className="font-semibold text-red-600">{item.minMarks}</span>
                                            </div>
                                        </div>

                                        {/* Progress bar visualization */}
                                        <div className="mt-3">
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-gradient-to-r from-[#204972] to-[#87b105] h-2 rounded-full"
                                                    style={{ width: `${(item.averageMarks)}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">Average Score: {item.averageMarks}%</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Overall Statistics */}
                            {reportData.length > 0 && (
                                <div className="mt-6 p-5 bg-[#204972]/[0.05] rounded-xl border border-[#204972]/15">
                                    <h4 className="font-bold text-[#204972] mb-3">Overall Statistics</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                            <p className="text-sm text-slate-500">Total Groups</p>
                                            <p className="text-2xl font-bold text-[#204972]">{reportData.length}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">Total Students</p>
                                            <p className="text-2xl font-bold text-[#204972]">
                                                {reportData.reduce((sum, item) => sum + item.totalStudents, 0)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">Overall Avg</p>
                                            <p className="text-2xl font-bold text-[#87b105]">
                                                {(reportData.reduce((sum, item) => sum + item.averageMarks, 0) / reportData.length).toFixed(1)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">Highest Score</p>
                                            <p className="text-2xl font-bold text-[#87b105]">
                                                {Math.max(...reportData.map(item => item.maxMarks))}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ResultManagement;
