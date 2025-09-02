// src/pages/AllUser.jsx
import { useState, useEffect, useMemo } from "react";
import {
  Download,
  Upload,
  Trash2,
  Plus,
  Search,
  Eye,
  Pencil,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import Swal from "sweetalert2";
import axiosInstance from "../../../config/AxiosInstance"; // adjust path if needed

const roleBadgeClass = (role) => {
  const r = String(role || "").toLowerCase();
  if (r === "admin") return "bg-purple-100 text-purple-800";
  if (r === "superadmin") return "bg-indigo-100 text-indigo-800";
  return "bg-gray-100 text-gray-800";
};
const statusBadgeClass = (status) => {
  const s = String(status || "").toLowerCase();
  if (s === "active") return "bg-green-100 text-green-800";
  if (s === "blocked") return "bg-red-100 text-red-800";
  return "bg-yellow-100 text-yellow-800"; // pending / others
};

const formatDateTime = (iso) => {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
};

export default function AllUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // filters
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // selection
  const [selectedUsers, setSelectedUsers] = useState([]);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // API per your curl: GET /api/users/getAllUser
      const res = await axiosInstance.get("/users/getAllUser", { headers });
      // response shape:
      // { message: "Users fetched successfully", data: [ ...users ] }
      const data = Array.isArray(res?.data?.data) ? res.data.data : [];
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err?.response?.data || err.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // derive role/status options from data
  const roleOptions = useMemo(() => {
    const set = new Set(users.map((u) => (u.role || "").toLowerCase()).filter(Boolean));
    return ["all", ...Array.from(set)];
  }, [users]);

  const statusOptions = useMemo(() => {
    const set = new Set(users.map((u) => (u.status || "").toLowerCase()).filter(Boolean));
    return ["all", ...Array.from(set)];
  }, [users]);

  // filter + search
  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return users.filter((u) => {
      const bySearch =
        !term ||
        (u.name && u.name.toLowerCase().includes(term)) ||
        (u.phone && String(u.phone).toLowerCase().includes(term)) ||
        (u.email && u.email.toLowerCase().includes(term)) ||
        (u._id && String(u._id).toLowerCase().includes(term));
      const byRole = roleFilter === "all" || String(u.role || "").toLowerCase() === roleFilter;
      const byStatus =
        statusFilter === "all" || String(u.status || "").toLowerCase() === statusFilter;
      return bySearch && byRole && byStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  // pagination (client-side)
  const totalUsers = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalUsers / itemsPerPage));
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIdx, startIdx + itemsPerPage);

  useEffect(() => {
    // reset to page 1 if filters/search change
    setCurrentPage(1);
  }, [searchTerm, roleFilter, statusFilter]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(currentItems.map((u) => u._id || u.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const deleteSingle = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete",
    });
    if (!confirm.isConfirmed) return;

    try {
      // Adjust endpoint if your backend is different:
      await axiosInstance.delete(`/users/${id}`);
      Swal.fire("Deleted!", "User removed.", "success");
      setUsers((prev) => prev.filter((u) => (u._id || u.id) !== id));
      setSelectedUsers((prev) => prev.filter((x) => x !== id));
    } catch (e) {
      Swal.fire("Error!", "Failed to delete user.", "error");
      console.error("Delete user error:", e);
    }
  };

  const bulkDelete = async () => {
    if (!selectedUsers.length) return;
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Selected users will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete",
    });
    if (!confirm.isConfirmed) return;

    try {
      await Promise.all(
        selectedUsers.map((id) =>
          axiosInstance.delete(`/users/${id}`).catch(() => null)
        )
      );
      Swal.fire("Deleted!", "Selected users removed.", "success");
      // refresh local state
      setUsers((prev) => prev.filter((u) => !selectedUsers.includes(u._id || u.id)));
      setSelectedUsers([]);
    } catch (e) {
      Swal.fire("Error!", "Failed to delete some users.", "error");
    }
  };

  const exportCSV = () => {
    const rows = [
      ["Name", "Phone", "Email", "Role", "Status", "Created At", "User ID"],
      ...filtered.map((u) => [
        u.name || "",
        u.phone || "",
        u.email || "",
        u.role || "",
        u.status || "",
        u.createdAt ? new Date(u.createdAt).toLocaleString() : "",
        u._id || u.id || "",
      ]),
    ];
    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);
      if (currentPage <= 3) end = maxVisible;
      else if (currentPage >= totalPages - 2) start = totalPages - maxVisible + 1;
      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };

  const resetFilters = () => {
    setSearchTerm("");
    setRoleFilter("all");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const indexOfFirstItem = totalUsers === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, totalUsers);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">All Users</h1>

          <div className="flex justify-between items-center mb-6 p-4 bg-white rounded">
            <div className="flex gap-3">
              <button
                onClick={exportCSV}
                className="flex items-center gap-2 bg-transparent border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <button className="flex items-center gap-2 bg-transparent border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100">
                <Upload className="w-4 h-4" />
                Import
              </button>
            </div>

            <div className="flex gap-3">
              <button
                className="bg-red-600 hover:bg-red-700 text-white flex items-center px-4 py-1"
                onClick={bulkDelete}
                disabled={selectedUsers.length === 0}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
              <button
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-sm"
                onClick={() => {/* open create user modal if you add one */}}
              >
                <Plus className="w-4 h-4" />
                Add User
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6 p-4 bg-white rounded">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, phone, email, or ID"
              className="pl-10 pr-3 py-2 border border-gray-300 rounded w-full bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="w-[180px] px-3 py-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            {roleOptions.map((r) => (
              <option key={r} value={r}>{r === "all" ? "All Roles" : r}</option>
            ))}
          </select>

          <select
            className="w-[180px] px-3 py-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s === "all" ? "All Statuses" : s}</option>
            ))}
          </select>

          <button onClick={resetFilters}>Reset</button>
        </div>

        {/* Table */}
        <div className="w-full overflow-hidden border border-gray-200 rounded-lg mb-8">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-100">
                <tr>
                  <th className="w-[40px] px-6 py-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      checked={selectedUsers.length === currentItems.length && currentItems.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Phone</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Created</th>
                  <th className="px-6 py-3">View</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="9" className="px-6 py-8 text-center text-sm text-gray-500">
                      Loading users…
                    </td>
                  </tr>
                ) : currentItems.length ? (
                  currentItems.map((u) => {
                    const id = u._id || u.id;
                    return (
                      <tr key={id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            checked={selectedUsers.includes(id)}
                            onChange={() => handleSelectUser(id)}
                          />
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <div className="flex items-center gap-2">
                            <img
                              src={
                                u.profile_image_url ||
                                "https://ui-avatars.com/api/?name=" +
                                  encodeURIComponent(u.name || u.phone || "User")
                              }
                              alt={u.name || u.phone || "User"}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                            <div className="flex flex-col">
                              <span>{u.name || "—"}</span>
                              <span className="text-xs text-gray-500">{id}</span>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {u.phone || "—"}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {u.email || "—"}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${roleBadgeClass(u.role)}`}>
                            {u.role || "—"}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeClass(u.status)}`}>
                            {u.status || "—"}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDateTime(u.createdAt)}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <Tippy content="View">
                            <Link
                              to={`/users/${id}`}
                              className="h-8 w-8 p-0 hover:bg-gray-100 rounded inline-flex items-center justify-center"
                            >
                              <Eye className="w-4 h-4 text-gray-400" />
                            </Link>
                          </Tippy>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <Tippy content="Edit">
                              <button
                                onClick={() => {/* open edit modal with 'u' */}}
                                className="h-8 w-8 p-0 hover:bg-gray-100 rounded inline-flex items-center justify-center"
                              >
                                <Pencil className="w-4 h-4 text-gray-400" />
                              </button>
                            </Tippy>

                            <Tippy content="Delete">
                              <button
                                className="h-8 w-8 p-0 hover:bg-gray-100 rounded inline-flex items-center justify-center"
                                onClick={() => deleteSingle(id)}
                              >
                                <Trash2 className="w-4 h-4 text-gray-400" />
                              </button>
                            </Tippy>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="9" className="px-6 py-8 text-center text-sm text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4">
            <div className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-medium">{totalUsers ? indexOfFirstItem : 0}</span> to{" "}
              <span className="font-medium">{indexOfLastItem}</span> of{" "}
              <span className="font-medium">{totalUsers}</span> results
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>

              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    currentPage === page
                      ? "z-10 bg-emerald-50 border-emerald-500 text-emerald-600"
                      : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* (Optional) Add/Edit modals go here if you implement them */}
      </div>
    </div>
  );
}
