
import {
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Eye,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  Send,
  Users,
  X,
  User,
  Mail,
  Phone,
  BookOpen,
  GraduationCap,
  MapPin as LocationIcon,
  Tag,
  CalendarClock,
  Bell,
  FileText
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../../config/AxiosInstance";

const OfflineTestStudents = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("all");


  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Group creation modal
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupSize, setGroupSize] = useState(5);
  const [groupType, setGroupType] = useState("interview");

  // Schedule modal
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    groupNumber: "",
    scheduleDate: "",
    location: ""
  });

  // Send notification modal
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationData, setNotificationData] = useState({
    groupNumber: "",
    type: "interview"
  });

  // Student details modal
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loadingStudent, setLoadingStudent] = useState(false);


  // Stats
  const [stats, setStats] = useState({
    totalStudents: 0,
    groupedStudents: 0,
    ungroupedStudents: 0,
    scheduledStudents: 0,
    notifiedStudents: 0
  });

  // Fetch students
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/offline-interview/students");
      const data = response.data;
      setStudents(data);
      filterStudents(data, searchTerm, selectedGroup);
      calculateStats(data);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();

  }, []);


  // Handle view student
  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setShowStudentModal(true);
    // Uncomment below if you want to fetch fresh data each time
    // fetchStudentDetails(student._id);
  };

  // Filter students based on search and group
  const filterStudents = (data, search, group) => {
    let filtered = [...data];

    if (search) {
      filtered = filtered.filter(student =>
        student.name?.toLowerCase().includes(search.toLowerCase()) ||
        student.email?.toLowerCase().includes(search.toLowerCase()) ||
        student.mobile?.includes(search) ||
        student.rollNumber?.includes(search) ||
        student.fatherName?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (group !== "all") {
      if (group === "ungrouped") {
        filtered = filtered.filter(student => !student.groupNumber);
      } else if (group === "scheduled") {
        filtered = filtered.filter(student => student.scheduleDate);
      } else if (group === "notified") {
        filtered = filtered.filter(student => student.notificationSent);
      } else {
        filtered = filtered.filter(student => student.groupNumber === parseInt(group));
      }
    }

    setFilteredStudents(filtered);
    setTotalPages(Math.ceil(filtered.length / limit));
    setPage(1);
  };

  useEffect(() => {
    filterStudents(students, searchTerm, selectedGroup);
  }, [searchTerm, selectedGroup, students]);

  // Calculate stats
  const calculateStats = (data) => {
    const total = data.length;
    const grouped = data.filter(s => s.groupNumber).length;
    const scheduled = data.filter(s => s.scheduleDate).length;
    const notified = data.filter(s => s.notificationSent).length;

    setStats({
      totalStudents: total,
      groupedStudents: grouped,
      ungroupedStudents: total - grouped,
      scheduledStudents: scheduled,
      notifiedStudents: notified
    });
  };


  // Create groups
  const handleCreateGroups = async () => {
    if (!groupSize || groupSize < 1) {
      toast.error("Group size must be at least 1");
      return;
    }

    try {
      const response = await axiosInstance.post("/offline-interview/create-groups", {
        groupSize,
        type: groupType
      });

      toast.success(`Groups Created Successfully! Total students: ${response.data.totalStudents}`);
      setShowGroupModal(false);
      fetchStudents();
    } catch (error) {
      console.error("Error creating groups:", error);
      toast.error(error.response?.data?.message || "Failed to create groups");
    }
  };

  // Schedule event
  const handleSchedule = async () => {
    if (!scheduleData.groupNumber || !scheduleData.scheduleDate || !scheduleData.location) {
      toast.error("All fields are required");
      return;
    }

    try {
      await axiosInstance.post("/offline-interview/schedule", scheduleData);
      toast.success("Event scheduled successfully!");
      setShowScheduleModal(false);
      setScheduleData({ groupNumber: "", scheduleDate: "", location: "" });
      fetchStudents();
    } catch (error) {
      console.error("Error scheduling:", error);
      toast.error(error.response?.data?.message || "Failed to schedule");
    }
  };

  // Send notification
  const handleSendNotification = async () => {
    if (!notificationData.groupNumber) {
      toast.error("Group number is required");
      return;
    }

    try {
      const response = await axiosInstance.post("/offline-interview/send-notification", notificationData);
      toast.success(`Notification sent to ${response.data.totalStudents} students!`);
      setShowNotificationModal(false);
      setNotificationData({ groupNumber: "", type: "interview" });
      fetchStudents();
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error(error.response?.data?.message || "Failed to send notification");
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ["Name", "Father's Name", "Mother's Name", "Email", "Mobile", "Roll Number", "Group", "Schedule Date", "Location", "Notification Sent", "Qualification", "City", "State"];

    const csvData = filteredStudents.map(s => [
      s.name,
      s.fatherName || "",
      s.motherName || "",
      s.email || "",
      s.mobile,
      s.rollNumber || "",
      s.groupNumber || "Not Assigned",
      s.scheduleDate ? new Date(s.scheduleDate).toLocaleDateString() : "",
      s.location || "",
      s.notificationSent ? "Yes" : "No",
      s.qualification || "",
      s.city || "",
      s.state || "",
      s.teachingSubjects?.join(", ") || "",
      s.disabilitySpecialization || ""
    ]);

    const csvContent = [headers, ...csvData].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `offline-test-students-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Get unique groups
  const groups = [...new Set(students.map(s => s.groupNumber).filter(g => g))].sort((a, b) => a - b);

  // Pagination
  const paginatedStudents = filteredStudents.slice((page - 1) * limit, page * limit);

  // Get page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, page + 2);

    if (page <= 3) {
      end = Math.min(totalPages, maxVisible);
    }

    if (page >= totalPages - 2) {
      start = Math.max(1, totalPages - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not scheduled";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Status badge
  const getStatusBadge = (student) => {


    // 🔽 existing logic
    if (student.notificationSent) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <Bell className="h-3 w-3 mr-1" />
          Notified
        </span>
      );
    } else if (student.scheduleDate) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <Calendar className="h-3 w-3 mr-1" />
          Scheduled
        </span>
      );
    } else if (student.groupNumber) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          <Users className="h-3 w-3 mr-1" />
          Grouped
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </span>
      );
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center">
          <Users className="h-8 w-8 text-green-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">Offline Interview</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={exportToCSV}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>

          <button
            onClick={() => setShowGroupModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Groups
          </button>

          <button
            onClick={() => setShowScheduleModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Calendar className="h-4 w-4" />
            Schedule
          </button>

          <button
            onClick={() => setShowNotificationModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Send className="h-4 w-4" />
            Send Notification
          </button>

        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-600">
          <p className="text-sm text-gray-600">Total Students</p>
          <p className="text-2xl font-bold text-gray-800">{stats.totalStudents}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-600">
          <p className="text-sm text-gray-600">Grouped</p>
          <p className="text-2xl font-bold text-gray-800">{stats.groupedStudents}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-600">
          <p className="text-sm text-gray-600">Ungrouped</p>
          <p className="text-2xl font-bold text-gray-800">{stats.ungroupedStudents}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-600">
          <p className="text-sm text-gray-600">Scheduled</p>
          <p className="text-2xl font-bold text-gray-800">{stats.scheduledStudents}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-600">
          <p className="text-sm text-gray-600">Notified</p>
          <p className="text-2xl font-bold text-gray-800">{stats.notifiedStudents}</p>
        </div>
      </div>


      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, mobile, roll number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[180px]"
          >
            <option value="all">All Groups</option>
            <option value="ungrouped">Ungrouped Students</option>
            <option value="scheduled">Scheduled</option>
            <option value="notified">Notified</option>
            {groups.map(group => (
              <option key={group} value={group}>Group {group}</option>
            ))}
          </select>

          <div className="text-sm text-gray-600">
            Showing {paginatedStudents.length} of {filteredStudents.length} students
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Group
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Schedule
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
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-gray-600">Loading students...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedStudents.length > 0 ? (
                paginatedStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start">

                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">
                            {student.fatherName && `Father: ${student.fatherName}`}
                          </div>
                          <div className="text-xs text-gray-400">
                            Roll: {student.rollNumber || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Mail className="h-3 w-3 mr-1 text-gray-400" />
                        {student.email || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-900 flex items-center mt-1">
                        <Phone className="h-3 w-3 mr-1 text-gray-400" />
                        {student.mobile}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <LocationIcon className="h-3 w-3 mr-1 text-gray-400" />
                        {student.city}, {student.state}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {student.groupNumber ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 textwrap-nowrap">
                          <Tag className="h-3 w-3 mr-1" />
                          Group {student.groupNumber}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">Not assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {student.scheduleDate ? (
                        <div>
                          <div className="text-sm text-gray-900 flex items-center">
                            <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                            {formatDate(student.scheduleDate)}
                          </div>
                          {student.location && (
                            <div className="text-sm text-gray-500 flex items-center mt-1">
                              <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                              {student.location.length > 20
                                ? student.location.substring(0, 20) + '...'
                                : student.location}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Not scheduled</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(student)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleViewStudent(student)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        {student.notificationSent && (
                          <CheckCircle className="h-5 w-5 text-green-600" title="Notification Sent" />
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-sm text-gray-500">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredStudents.length > 0 && (
          <div className="flex flex-wrap justify-center items-center gap-2 py-4 border-t border-gray-200">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className={`px-3 py-1 rounded ${page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              First
            </button>

            {page > 1 && (
              <button
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                Previous
              </button>
            )}

            {getPageNumbers().map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1 rounded ${page === p ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
                  }`}
              >
                {p}
              </button>
            ))}

            {page < totalPages && (
              <button
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                Next
              </button>
            )}

            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              className={`px-3 py-1 rounded ${page === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              Last
            </button>
          </div>
        )}
      </div>

      {/* Create Groups Modal */}
      {showGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create Student Groups</h2>
              <button
                onClick={() => setShowGroupModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Group Size
                </label>
                <input
                  type="number"
                  value={groupSize}
                  onChange={(e) => setGroupSize(parseInt(e.target.value))}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={groupType}
                  onChange={(e) => setGroupType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="test">Test</option>
                  {/* <option value="interview">Interview</option> */}
                </select>
              </div>

              <div className="text-sm bg-blue-50 text-blue-700 p-3 rounded-lg">
                <Users className="h-4 w-4 inline mr-1" />
                Ungrouped students: {stats.ungroupedStudents}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowGroupModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGroups}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Groups
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Schedule Test</h2>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Group Number
                </label>
                <select
                  value={scheduleData.groupNumber}
                  onChange={(e) => setScheduleData({ ...scheduleData, groupNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Group</option>
                  {groups.map(group => (
                    <option key={group} value={group}>Group {group}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Schedule Date
                </label>
                <input
                  type="date"
                  value={scheduleData.scheduleDate}
                  onChange={(e) => setScheduleData({ ...scheduleData, scheduleDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={scheduleData.location}
                  onChange={(e) => setScheduleData({ ...scheduleData, location: e.target.value })}
                  placeholder="Enter test location"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSchedule}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Notification Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Send Notification</h2>
              <button
                onClick={() => setShowNotificationModal(false)}
                className="text-gray-500 hover:text-gray-700 "
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Group Number
                </label>
                <select
                  value={notificationData.groupNumber}
                  onChange={(e) => setNotificationData({ ...notificationData, groupNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Group</option>
                  {groups.map(group => (
                    <option key={group} value={group}>Group {group}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={notificationData.type}
                  onChange={(e) => setNotificationData({ ...notificationData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {/* <option value="test">Test</option> */}
                  <option value="interview">Interview</option>
                </select>
              </div>

              <div className="text-sm bg-yellow-50 text-yellow-700 p-3 rounded-lg">
                <Clock className="h-4 w-4 inline mr-1" />
                This will send SMS notifications to all students in the selected group who have schedule date and location set.
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowNotificationModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSendNotification}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                Send Notifications
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Details Modal */}
      {showStudentModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-white pb-2 border-b">
              <h2 className="text-xl font-bold flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Student Details
              </h2>
              <button
                onClick={() => {
                  setShowStudentModal(false);
                  setSelectedStudent(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {loadingStudent ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2">Loading details...</span>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Personal Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                    <User className="h-4 w-4 mr-2 text-blue-600" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium">{selectedStudent.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Father's Name</p>
                      <p className="font-medium">{selectedStudent.fatherName || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Mother's Name</p>
                      <p className="font-medium">{selectedStudent.motherName || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Roll Number</p>
                      <p className="font-medium">{selectedStudent.rollNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Qualification</p>
                      <p className="font-medium">{selectedStudent.qualification || 'N/A'}</p>
                    </div>

                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-green-600" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{selectedStudent.email || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Mobile</p>
                      <p className="font-medium">{selectedStudent.mobile}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">City</p>
                      <p className="font-medium">{selectedStudent.city || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">State</p>
                      <p className="font-medium">{selectedStudent.state || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Exam Information */}
                {selectedStudent.exam && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                      <BookOpen className="h-4 w-4 mr-2 text-purple-600" />
                      Exam Information
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Exam Name</p>
                        <p className="font-medium">{selectedStudent.exam.name}</p>
                      </div>
                      {selectedStudent.exam.description && (
                        <div>
                          <p className="text-sm text-gray-500">Description</p>
                          <p className="font-medium">{selectedStudent.exam.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Test Schedule Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                    <CalendarClock className="h-4 w-4 mr-2 text-orange-600" />
                    Test Schedule
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Group Number</p>
                      <p className="font-medium">
                        {selectedStudent.groupNumber ? `Group ${selectedStudent.groupNumber}` : 'Not assigned'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Schedule Date</p>
                      <p className="font-medium">
                        {selectedStudent.scheduleDate ? formatDate(selectedStudent.scheduleDate) : 'Not scheduled'}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{selectedStudent.location || 'Not assigned'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Notification Status</p>
                      <p className="font-medium">
                        {selectedStudent.notificationSent ? (
                          <span className="text-green-600 flex items-center">
                            <Bell className="h-4 w-4 mr-1" />
                            Sent
                          </span>
                        ) : (
                          <span className="text-gray-500">Not sent</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Metadata */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-gray-600" />
                    System Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Student ID</p>
                      <p className="font-mono text-xs">{selectedStudent._id}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Type</p>
                      <p className="font-medium capitalize">{selectedStudent.type}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Interview Type</p>
                      <p className="font-medium capitalize">{selectedStudent.interviewType}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Registered On</p>
                      <p>{new Date(selectedStudent.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Last Updated</p>
                      <p>{new Date(selectedStudent.updatedAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OfflineTestStudents;