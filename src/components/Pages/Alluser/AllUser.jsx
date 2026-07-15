
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
// import axios from 'axios';
import axiosInstance from '../../../config/AxiosInstance'; // <-- Import your axios instance
import GlobalTable from '../../common/GlobalTable';
import TableActionButton from '../../common/TableActionButton';
import { Download, Eye, UserCheck, UserX, UsersRound, X } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const [search, setSearch] = useState("");

  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");

  const [notificationData, setNotificationData] = useState({
    title: "",
    exam: "",
    testDate: "",
    lastDate: "",
    location: ""
  });

  const [sending, setSending] = useState(false);

  const [showNotificationModal, setShowNotificationModal] = useState(false);


  const [showModal, setShowModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    district: '',
    role: 'user',
    experience: '',
    specialization: '',
    status: 'active'
  });
  const [profileImage, setProfileImage] = useState(null);
  const [errors, setErrors] = useState({});


  useEffect(() => {
    fetchUsers();
    // Refresh is intentionally controlled by pagination and filter values below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, selectedExam]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      // const response = await axiosInstance.get(`/users/getAllUser?page=${page}&limit=${limit}&search=${search}`, {
      //   headers: {
      //     Authorization: `Bearer ${token}`
      //   }
      // });

      let url = `/users/getAllUser?page=${page}&limit=${limit}&search=${search}`;

      if (selectedExam) {
        url = `/users/exam/${selectedExam}`;
      }

      const response = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (selectedExam) {
        setUsers(response.data);
        setTotalPages(1);
      } else {
        // 👇 Normal API
        setUsers(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      }

    } catch (error) {
      toast.error("Error fetching users");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleViewInfo = (user) => {
    setSelectedUser(user);
    setShowInfoModal(true);
  };

  // const handleEdit = (user) => {
  //   setEditingUser(user);
  //   setFormData({
  //     name: user.name || '',
  //     email: user.email || '',
  //     phone: user.phone || '',
  //     address: user.address || '',
  //     city: user.city || '',
  //     state: user.state || '',
  //     pincode: user.pincode || '',
  //     district: user.district || '',
  //     role: user.role || 'user',
  //     experience: user.experience || '',
  //     specialization: user.specialization || '',
  //     status: user.status || 'active'
  //   });
  //   setErrors({});
  //   setShowModal(true);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();

      // Append all form fields 
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append profile image if selected
      if (profileImage) {
        formDataToSend.append('profile_image', profileImage);
      }

      if (editingUser) {
        // await axios.put(`https://api.pvclasses.in/api/users/updateUser`, formDataToSend, {
        await axiosInstance.put('/users/updateUser', formDataToSend, {

          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('User updated successfully');
      }

      setShowModal(false);
      resetForm();
      fetchUsers();
    } catch (error) {
      if (error.response?.status === 400) {
        if (error.response?.data?.message?.includes('duplicate')) {
          if (error.response?.data?.message?.includes('phone')) {
            setErrors({ phone: 'This phone number is already registered' });
            toast.error('Phone number already exists');
          } else if (error.response?.data?.message?.includes('email')) {
            setErrors({ email: 'This email is already registered' });
            toast.error('Email already exists');
          }
        }
      } else {
        toast.error(error.response?.data?.message || 'Error saving user');
      }
      console.error('Error saving user:', error);
    }
  };

  const handleStatusChange = async (userId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      // await axios.put(`https://api.pvclasses.in/api/users/updateStatus`, {
      await axiosInstance.put('/users/updateStatus', {

        userId,
        status: currentStatus === 'active' ? 'inactive' : 'active'
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success('User status updated successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Error updating user status');
      console.error('Error updating status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      district: '',
      role: 'user',
      experience: '',
      specialization: '',
      status: 'active'
    });
    setProfileImage(null);
    setEditingUser(null);
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    // 
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Check if email already exists in other users
  const isEmailUnique = (email) => {
    if (!email) return true;
    return !users.some(user =>
      user.email === email && user._id !== editingUser?._id
    );
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const res = await axiosInstance.get("/exams");
      setExams(res.data);
    } catch (error) {
      console.error("Error fetching exams", error);
    }
  };


  const downloadUsersPDF = () => {
    try {
      const doc = new jsPDF();

      doc.setFontSize(16);
      doc.text("Users List", 14, 15);

      const tableColumn = [
        "S.No.",
        "Serial No.",
        "Name",
        "Phone",
        "Email",
        "Role",
        "Status"
      ];

      const tableRows = users.map((user, index) => [
        index + 1,
        user.serialNumber || "N/A",
        user.name || "N/A",
        user.phone || "N/A",
        user.email || "N/A",
        user.role || "N/A",
        user.status || "N/A"
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 25,
        styles: {
          fontSize: 9
        },
        headStyles: {
          fillColor: [22, 163, 74] // green
        }
      });

      doc.save("users-list.pdf");
    } catch (error) {
      console.error("PDF download error:", error);
      toast.error("Failed to download PDF");
    }
  };

  const handleSendNotification = async () => {
    try {
      if (
        !notificationData.title ||
        !notificationData.exam ||
        !notificationData.testDate ||
        !notificationData.lastDate ||
        !notificationData.location
      ) {
        return toast.error("All fields are required");
      }

      setSending(true);

      await axiosInstance.post("/users/send-whatsapp", notificationData);

      toast.success("Notification sent successfully 🚀");

      setShowNotificationModal(false);

      // reset form
      setNotificationData({
        title: "",
        exam: "",
        testDate: "",
        lastDate: "",
        location: ""
      });

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send notification");
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  // UI-only: user table columns are now passed into GlobalTable.
  // API, pagination, PDF download, status update, and modal logic remain unchanged.
  const userColumns = [
    {
      key: "name",
      header: "Name",
      width: "210px",
      headerClassName: "w-[210px] max-w-[210px]",
      cellClassName: "w-[210px] max-w-[210px]",
      render: (user) => (
        <div className="flex min-w-0 items-center">
          {user.profile_image_url ? (
            <img
              src={user.profile_image_url}
              alt={user.name}
              className="mr-3 h-10 w-10 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="mr-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-300">
              <span className="text-gray-600 font-medium">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </span>
            </div>
          )}

          <div className="min-w-0">
            {/* UI-only: keep the avatar circular while long user names wrap inside the remaining space. */}
            <div className="break-words text-sm font-medium text-gray-900">
              {user.name || "No Name"}
            </div>
            {user.specialization && (
              <div className="text-sm text-gray-500">{user.specialization}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "serialNumber",
      header: "Serial No.",
      width: "110px",
      headerClassName: "min-w-[110px] whitespace-nowrap",
      cellClassName: "min-w-[110px] whitespace-nowrap",
      render: (user) => user.serialNumber || "N/A",
    },
    {
      key: "phone",
      header: "Phone",
    },
    {
      key: "email",
      header: "Email",
      render: (user) => user.email || "N/A",
    },
    {
      key: "role",
      header: "Role",
      render: (user) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            user.role === "admin"
              ? "bg-purple-100 text-purple-800"
              : user.role === "teacher"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"
          }`}
        >
          {user.role}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (user) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            user.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {user.status}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (user) => (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <TableActionButton
            tone="view"
            onClick={() => handleViewInfo(user)}
            title="View Info"
          >
            <Eye className="h-4 w-4" />
          </TableActionButton>

          <TableActionButton
            tone={user.status === "active" ? "delete" : "success"}
            onClick={() => handleStatusChange(user._id, user.status)}
            title={user.status === "active" ? "Deactivate" : "Activate"}
          >
            {user.status === "active" ? (
              <UserX className="h-4 w-4" />
            ) : (
              <UserCheck className="h-4 w-4" />
            )}
          </TableActionButton>
        </div>
      ),
    },
  ];

  // UI-only: exam filter options are now passed into GlobalTable filters.
  const userFilterOptions = [
    {
      key: "exam",
      value: selectedExam,
      onChange: (value) => {
        setSelectedExam(value);
        setPage(1);
      },
      options: [
        { value: "", label: "All Exams" },
        ...exams.map((exam) => ({
          value: exam._id,
          label: exam.name,
        })),
      ],
    },
  ];

  // Changed: CSV export fields are passed into TableFilters, so export stays consistent across tables.
  const userExportColumns = [
    { key: "serialNumber", header: "Serial No.", value: (user) => user.serialNumber || "N/A" },
    { key: "name", header: "Name", value: (user) => user.name || "No Name" },
    { key: "phone", header: "Phone", value: (user) => user.phone || "N/A" },
    { key: "email", header: "Email", value: (user) => user.email || "N/A" },
    { key: "role", header: "Role", value: (user) => user.role || "N/A" },
    { key: "status", header: "Status", value: (user) => user.status || "N/A" },
  ];

  return (
    <div className="p-6">

      {/* UI-only: standardized page header; existing notification handler is positioned at the right. */}
      <div className="bg-gradient-to-r from-[#204972] to-[#87b105] rounded-xl shadow-lg mb-6 p-6 text-white flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {/* UI-only: use a clear white user symbol consistent with other page headers. */}
          <h1 className="flex items-center text-2xl font-bold"><UsersRound /> Users Management</h1>
          <p className="mt-1 opacity-90">View and manage registered users</p>
        </div>
        <button
          onClick={() => setShowNotificationModal(true)}
          className="self-start sm:self-auto bg-[#204972] hover:bg-[#183654] text-white px-4 py-2 rounded-lg cursor-pointer transition-colors"
        >
          📢 Send Notification
        </button>
      </div>

      <div className="bg-white shadow-md rounded-md overflow-hidden">
          {/* UI-only: users table now owns shared filters, export, actions, and pagination. */}
          <GlobalTable
            title={`Users (${users.length})`}
            filters={{
              searchValue: search,
              onSearchChange: (value) => {
                setSearch(value);
                setPage(1);
              },
              searchPlaceholder: "Search user by name...",
              filters: userFilterOptions,
              exportData: users,
              exportColumns: userExportColumns,
              exportFileName: `users-${new Date().toISOString().split("T")[0]}.csv`,
            }}
            columns={userColumns}
            data={users}
            loading={loading}
            loadingText="Loading users..."
            emptyText="No users found"
            wrapperClassName="border-0 rounded-none shadow-none"
            pagination={{
              currentPage: page,
              totalPages,
              onPageChange: setPage,
              rightContent: (
                <button
                  onClick={downloadUsersPDF}
                  className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:scale-105"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </button>
              ),
            }}
          />
        </div>

      {showInfoModal && selectedUser && (
        <div className="fixed inset-0 z-50 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center overflow-y-auto p-4">
          {/* UI-only: User Information overlay follows the shared PV Classes theme. */}
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 z-10 flex items-center justify-between bg-gradient-to-r from-[#204972] to-[#87b105] p-5 text-white">
              <h2 className="flex items-center text-xl font-bold"><UsersRound className="mr-2" /> User Information</h2>
              <button type="button" onClick={() => setShowInfoModal(false)} className="rounded-full p-2 text-white/80 transition hover:bg-white/15 hover:text-white" aria-label="Close user information"><X className="h-5 w-5" /></button>
            </div>

            <div className="p-6">

            <div className="flex items-center mb-6">
              {selectedUser.profile_image_url ? (
                <img
                  src={selectedUser.profile_image_url}
                  alt={selectedUser.name}
                  className="h-20 w-20 rounded-full object-cover mr-4"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center mr-4">
                  <span className="text-gray-600 font-medium text-2xl">
                    {selectedUser.name ? selectedUser.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold">{selectedUser.name || 'No Name'}</h3>
                <p className="text-gray-600">{selectedUser.phone}</p>
                <p className="text-gray-600">{selectedUser.email || 'No Email'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Role</label>
                <p className="bg-gray-100 p-2 rounded-md">{selectedUser.role}</p>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Status</label>
                <p className={`p-2 rounded-md ${selectedUser.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                  {selectedUser.status}
                </p>
              </div>
            </div>

            {/* UI-only: show parent names from the existing user details response. */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Father&apos;s Name</label>
                <p className="bg-gray-100 p-2 rounded-md">{selectedUser.fatherName || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Mother&apos;s Name</label>
                <p className="bg-gray-100 p-2 rounded-md">{selectedUser.motherName || 'N/A'}</p>
              </div>
            </div>

            {selectedUser.role === 'teacher' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Experience</label>
                  <p className="bg-gray-100 p-2 rounded-md">{selectedUser.experience || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Specialization</label>
                  <p className="bg-gray-100 p-2 rounded-md">{selectedUser.specialization || 'N/A'}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Address</label>
                <p className="bg-gray-100 p-2 rounded-md">{selectedUser.address || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">City</label>
                <p className="bg-gray-100 p-2 rounded-md">{selectedUser.city || 'N/A'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">State</label>
                <p className="bg-gray-100 p-2 rounded-md">{selectedUser.state || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Pincode</label>
                <p className="bg-gray-100 p-2 rounded-md">{selectedUser.pincode || 'N/A'}</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">District</label>
              <p className="bg-gray-100 p-2 rounded-md">{selectedUser.district || 'N/A'}</p>
            </div>

            {/* Purchase Summary */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Purchase Summary</h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-sm text-gray-600">Courses</p>
                  <p className="text-lg font-bold">
                    {selectedUser.purchases?.courses?.length || 0}
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-md">
                  <p className="text-sm text-gray-600">Books</p>
                  <p className="text-lg font-bold">
                    {selectedUser.purchases?.books?.length || 0}
                  </p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-md">
                  <p className="text-sm text-gray-600">Test Series</p>
                  <p className="text-lg font-bold">
                    {selectedUser.purchases?.testSeries?.length || 0}
                  </p>
                </div>
                <div className="bg-purple-50 p-3 rounded-md">
                  <p className="text-sm text-gray-600">Combo</p>
                  <p className="text-lg font-bold">
                    {selectedUser.purchases?.combo?.length || 0}
                  </p>
                </div>
              </div>

              {/* Orders */}
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Orders</h4>
                {selectedUser.orders?.length ? (
                  <div className="space-y-3">
                    {selectedUser.orders.map((order) => (
                      <div key={order._id} className="border rounded-md p-3 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <p>
                            <span className="font-medium">Order ID:</span> {order._id}
                          </p>
                          <p>
                            <span className="font-medium">Serial No:</span> {order.serialNumber || "N/A"}
                          </p>
                          <p>
                            <span className="font-medium">Payment:</span> {order.paymentMethod || "N/A"}
                          </p>
                          <p>
                            <span className="font-medium">Amount:</span> ₹{order.totalAmount || 0}
                          </p>
                          <p>
                            <span className="font-medium">Payment Status:</span> {order.paymentStatus || "N/A"}
                          </p>
                          <p>
                            <span className="font-medium">Order Status:</span> {order.orderStatus || "N/A"}
                          </p>
                          <p>
                            <span className="font-medium">Date:</span>{" "}
                            {order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No orders found</p>
                )}
              </div>

              {/* Purchased Courses */}
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Purchased Courses</h4>
                {selectedUser.purchases?.courses?.length ? (
                  <div className="space-y-2">
                    {selectedUser.purchases.courses.map((course, index) => (
                      <div key={index} className="border rounded-md p-3 bg-gray-50 text-sm">
                        <p><span className="font-medium">Title:</span> {course.title || "N/A"}</p>
                        <p><span className="font-medium">Price:</span> ₹{course.price || 0}</p>
                        <p><span className="font-medium">Order Status:</span> {course.orderStatus || "N/A"}</p>
                        <p><span className="font-medium">Payment Status:</span> {course.paymentStatus || "N/A"}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No courses purchased</p>
                )}
              </div>

              {/* Purchased Books */}
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Purchased Books</h4>
                {selectedUser.purchases?.books?.length ? (
                  <div className="space-y-2">
                    {selectedUser.purchases.books.map((book, index) => (
                      <div key={index} className="border rounded-md p-3 bg-gray-50 text-sm">
                        <p><span className="font-medium">Title:</span> {book.title || "N/A"}</p>
                        <p><span className="font-medium">Price:</span> ₹{book.price || 0}</p>
                        <p><span className="font-medium">Order Status:</span> {book.orderStatus || "N/A"}</p>
                        <p><span className="font-medium">Payment Status:</span> {book.paymentStatus || "N/A"}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No books purchased</p>
                )}
              </div>

              {/* Purchased Test Series */}
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Purchased Test Series</h4>
                {selectedUser.purchases?.testSeries?.length ? (
                  <div className="space-y-2">
                    {selectedUser.purchases.testSeries.map((test, index) => (
                      <div key={index} className="border rounded-md p-3 bg-gray-50 text-sm">
                        <p><span className="font-medium">Title:</span> {test.title || "N/A"}</p>
                        <p><span className="font-medium">Price:</span> ₹{test.price || 0}</p>
                        <p><span className="font-medium">Order Status:</span> {test.orderStatus || "N/A"}</p>
                        <p><span className="font-medium">Payment Status:</span> {test.paymentStatus || "N/A"}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No test series purchased</p>
                )}
              </div>

              {/* Purchased Combo */}
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Purchased Combo</h4>
                {selectedUser.purchases?.combo?.length ? (
                  <div className="space-y-2">
                    {selectedUser.purchases.combo.map((combo, index) => (
                      <div key={index} className="border rounded-md p-3 bg-gray-50 text-sm">
                        <p><span className="font-medium">Title:</span> {combo.title || "N/A"}</p>
                        <p><span className="font-medium">Price:</span> ₹{combo.price || 0}</p>
                        <p><span className="font-medium">Order Status:</span> {combo.orderStatus || "N/A"}</p>
                        <p><span className="font-medium">Payment Status:</span> {combo.paymentStatus || "N/A"}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No combo purchased</p>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowInfoModal(false)}
                className="text-white px-5 py-2 rounded-lg transition form-cancel-button"
              >
                Close
              </button>
            </div>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center overflow-y-auto p-4">
          {/* UI-only: Add/Edit User overlay uses the same shared themed modal header and actions. */}
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 z-10 flex items-center justify-between bg-gradient-to-r from-[#204972] to-[#87b105] p-5 text-white">
              <h2 className="flex items-center text-xl font-bold"><UsersRound className="mr-2" /> {editingUser ? 'Edit User' : 'Add User'}</h2>
              <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="rounded-full p-2 text-white/80 transition hover:bg-white/15 hover:text-white" aria-label="Close user form"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
              <div className="col-span-2">
                <label className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Phone *</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-md ${errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  required
                  disabled={!!editingUser} // Disable phone editing for existing users
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
                {formData.email && !errors.email && !isEmailUnique(formData.email) && (
                  <p className="text-yellow-600 text-xs mt-1">
                    Warning: This email is already used by another user
                  </p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="user">User</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              {formData.role === 'teacher' && (
                <>
                  <div>
                    <label className="block text-gray-700 mb-2">Experience</label>
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="e.g., 5 years"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Specialization</label>
                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="e.g., Mathematics"
                    />
                  </div>
                </>
              )}
              <div>
                <label className="block text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">District</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-gray-700 mb-2">Profile Image</label>
                <input
                  type="file"
                  onChange={(e) => setProfileImage(e.target.files[0])}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  accept="image/*"
                />
              </div>
              <div className="col-span-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="mr-2 px-4 py-2 border border-gray-300 rounded-md form-cancel-button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  {editingUser ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/*  notification modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6">

            <h2 className="text-lg font-semibold mb-4">
              📢 Send WhatsApp Notification
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Title ( PV Classes – जरूरी सूचना )"
                value={notificationData.title}
                onChange={(e) =>
                  setNotificationData({ ...notificationData, title: e.target.value })
                }
                className="border p-2 rounded"
              />

              <input
                type="text"
                placeholder="Exam ( KVS / NVS Special Educator Tier-2 ) "
                value={notificationData.exam}
                onChange={(e) =>
                  setNotificationData({ ...notificationData, exam: e.target.value })
                }
                className="border p-2 rounded"
              />

              <input
                type="text"
                placeholder="Test Date ( 21 march ) "
                value={notificationData.testDate}
                onChange={(e) =>
                  setNotificationData({ ...notificationData, testDate: e.target.value })
                }
                className="border p-2 rounded"
              />

              <input
                type="text"
                placeholder="Last Date ( 20 march ) "
                value={notificationData.lastDate}
                onChange={(e) =>
                  setNotificationData({ ...notificationData, lastDate: e.target.value })
                }
                className="border p-2 rounded"
              />

              <input
                type="text"
                placeholder="Location ( Jaipur (Rajasthan) ) "
                value={notificationData.location}
                onChange={(e) =>
                  setNotificationData({ ...notificationData, location: e.target.value })
                }
                className="border p-2 rounded col-span-2"
              />
            </div>

            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => setShowNotificationModal(false)}
                className="px-4 py-2 border rounded form-cancel-button"
              >
                Cancel
              </button>

              {/* UI-only: match the global action style with the PV Classes theme green. */}
              <button
                onClick={handleSendNotification}
                disabled={sending}
                className="inline-flex h-10 min-w-24 items-center justify-center rounded-lg bg-[#87b105] px-4 py-2 text-sm font-medium text-white transition hover:scale-105 hover:bg-[#6f9204] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sending ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
