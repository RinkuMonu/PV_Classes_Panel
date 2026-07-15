import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../../../config/AxiosInstance";
import { toast } from "react-toastify";
import GlobalTable from "../../common/GlobalTable";
import TableActionButton from "../../common/TableActionButton";
import { Eye, Pencil, TicketPercent, Trash2, X } from "lucide-react";

const CouponManager = () => {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({
    code: "",
    discountType: "fixed",
    discountValue: "",
    minOrderAmount: "",
    startDate: "",
    endDate: "",
    isActive: true,
  });
  const [editingId, setEditingId] = useState(null);
  const [viewingCoupon, setViewingCoupon] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const formRef = useRef(null);
  const [highlight, setHighlight] = useState(false);

  // ✅ Fetch coupons
  const fetchCoupons = async () => {
    try {
      const res = await axiosInstance.get("/coupon?status=all");
      setCoupons(res.data.data || []);
    } catch (err) {
      toast.error("Failed to fetch coupons");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // ✅ Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Create or Update coupon
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axiosInstance.put(`/coupon/${editingId}`, form);
        toast.success("Coupon updated successfully");
      } else {
        await axiosInstance.post("/coupon", form);
        toast.success("Coupon created successfully");
      }
      setForm({
        code: "",
        discountType: "fixed",
        discountValue: "",
        minOrderAmount: "",
        startDate: "",
        endDate: "",
        isActive: true,
      });
      setEditingId(null);
      fetchCoupons();
    } catch (err) {
      toast.error("Failed to save coupon");
      console.error(err);
    }
  };

  // ✅ Delete coupon
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;

    try {
      await axiosInstance.delete(`/coupon/${id}`);
      toast.success("Coupon deleted successfully");
      fetchCoupons();
    } catch (err) {
      toast.error("Failed to delete coupon");
      console.error(err);
    }
  };

  // ✅ Edit coupon
  const handleEdit = (coupon) => {
    setForm({
      code: coupon.code || "",
      discountType: coupon.discountType || "fixed",
      discountValue: coupon.discountValue || "",
      minOrderAmount: coupon.minOrderAmount || "",
      startDate: coupon.startDate ? coupon.startDate.split("T")[0] : "",
      endDate: coupon.endDate ? coupon.endDate.split("T")[0] : "",
      isActive: coupon.isActive ?? true,
    });
    setEditingId(coupon._id);

    // ✅ Scroll to form
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

    // ✅ Highlight for 2 sec
    setHighlight(true);
    setTimeout(() => setHighlight(false), 2000);
  };

  // ✅ View coupon details
  const handleView = async (coupon) => {
    try {
      const res = await axiosInstance.get(`/coupon/${coupon.code}`);

      setViewingCoupon(res.data.data);
      setIsViewModalOpen(true);

    } catch (error) {
      toast.error("Failed to fetch coupon details");
      console.error(error);
    }
  };

  // ✅ Close view modal
  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setViewingCoupon(null);
  };

  // UI-only: shared table filtering and pagination use the already-fetched coupon array.
  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch = `${coupon.code || ""} ${coupon.discountType || ""}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? coupon.isActive : !coupon.isActive);
    return matchesSearch && matchesStatus;
  });
  const totalPages = Math.max(Math.ceil(filteredCoupons.length / pageSize), 1);
  const visibleCoupons = filteredCoupons.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const couponColumns = [
    {
      key: "code",
      header: "Code",
      render: (coupon) => <div className="text-sm font-medium text-gray-900">{coupon.code}</div>,
    },
    {
      key: "discount",
      header: "Discount",
      render: (coupon) => (
        <div className="text-sm text-gray-900">
          {coupon.discountType === "percentage" ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
        </div>
      ),
    },
    {
      key: "minOrderAmount",
      header: "Min Order",
      render: (coupon) => <div className="text-sm text-gray-900">₹{coupon.minOrderAmount || 0}</div>,
    },
    {
      key: "validity",
      header: "Validity",
      render: (coupon) => (
        <div className="text-sm text-gray-500">
          {coupon.startDate ? new Date(coupon.startDate).toLocaleDateString() : "No start date"} →
          {coupon.endDate ? new Date(coupon.endDate).toLocaleDateString() : "No end date"}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (coupon) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${coupon.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {coupon.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (coupon) => (
        // UI-only: coupon actions use the same icon buttons as every GlobalTable.
        <div className="flex gap-2">
          <TableActionButton onClick={() => handleView(coupon)} tone="view" title="View"><Eye className="h-4 w-4" /></TableActionButton>
          <TableActionButton onClick={() => handleEdit(coupon)} tone="edit" title="Edit"><Pencil className="h-4 w-4" /></TableActionButton>
          <TableActionButton onClick={() => handleDelete(coupon._id)} tone="delete" title="Delete"><Trash2 className="h-4 w-4" /></TableActionButton>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* UI-only: standardized page header; coupon logic is unchanged. */}
      <div data-page-icon data-icon-symbol="%" className="bg-gradient-to-r from-[#204972] to-[#87b105] rounded-xl shadow-lg mb-6 p-6 text-white">
        <h2 className="text-2xl font-bold">Coupon Manager</h2>
        <p className="mt-1 opacity-90">Create and manage discount coupons</p>
      </div>

      {/* Coupon Form */}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className={`bg-white p-6 rounded-lg shadow-md mb-8 border transition-all duration-500 ${highlight ? "border-green-500 ring-2 ring-green-300" : "border-gray-200"
          }`}
      >
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          {editingId ? "Edit Coupon" : "Create New Coupon"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
            <input
              type="text"
              name="code"
              placeholder="e.g. SUMMER25"
              value={form.code}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
            <select
              name="discountType"
              value={form.discountType}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="fixed">Fixed Amount</option>
              <option value="percentage">Percentage</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Value {form.discountType === "percentage" ? "(%)" : "(₹)"}
            </label>
            <input
              type="number"
              name="discountValue"
              placeholder={form.discountType === "percentage" ? "10" : "100"}
              value={form.discountValue}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
              min="0"
              step={form.discountType === "percentage" ? "1" : "0.01"}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order Amount (₹)</label>
            <input
              type="number"
              name="minOrderAmount"
              placeholder="500"
              value={form.minOrderAmount}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="isActive"
              value={form.isActive}
              onChange={(e) =>
                setForm({ ...form, isActive: e.target.value === "true" })
              }
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="bg-[#87b105] text-white px-6 py-3 rounded-md hover:scale-105 ease-in-out transition-all duration-200"
        >
          {editingId ? "Update Coupon" : "Create Coupon"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm({
                code: "",
                discountType: "fixed",
                discountValue: "",
                minOrderAmount: "",
                startDate: "",
                endDate: "",
                isActive: true,
              });
            }}
            className="ml-4 bg-red-600 text-white px-6 py-3 rounded-md hover:scale-105 transition-colors duration-200 form-cancel-button"
          >
            Cancel
          </button>
        )}
      </form>

      {/* UI-only: Coupon list now uses the complete GlobalTable toolbar and footer design. */}
      <GlobalTable
        title={`All Coupons (${filteredCoupons.length})`}
        description="Search, filter, export, and manage discount coupons"
        columns={couponColumns}
        data={visibleCoupons}
        emptyText="No coupons found. Create your first coupon!"
        getRowKey={(coupon) => coupon._id}
        filters={{
          searchValue: search,
          onSearchChange: (value) => { setSearch(value); setCurrentPage(1); },
          searchPlaceholder: "Search coupon code or type...",
          filters: [{ key: "status", value: statusFilter, onChange: (value) => { setStatusFilter(value); setCurrentPage(1); }, options: [{ value: "all", label: "All Status" }, { value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }] }],
          resultText: `${filteredCoupons.length} coupon${filteredCoupons.length === 1 ? "" : "s"} found`,
          exportData: filteredCoupons,
          exportFileName: "coupons.csv",
          exportColumns: [{ key: "code", header: "Code" }, { key: "discountType", header: "Discount Type" }, { key: "discountValue", header: "Discount Value" }, { key: "minOrderAmount", header: "Minimum Order" }, { key: "isActive", header: "Active", value: (coupon) => coupon.isActive ? "Yes" : "No" }],
        }}
        pagination={{ currentPage, totalPages, onPageChange: setCurrentPage }}
      />

      {/* View Modal */}
      {isViewModalOpen && viewingCoupon && (
        <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          {/* UI-only: Coupon Details overlay follows the shared PV Classes modal theme. */}
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="flex justify-between items-center bg-gradient-to-r from-[#204972] to-[#87b105] p-5 text-white">
              <h3 className="flex items-center text-xl font-semibold"><TicketPercent className="mr-2" /> Coupon Details</h3>
              <button
                onClick={closeViewModal}
                className="rounded-full p-2 text-white/80 transition hover:bg-white/15 hover:text-white"
                aria-label="Close coupon details"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 p-6">
              <div className="flex justify-between">
                <span className="font-medium">Code:</span>
                <span className="rounded-full bg-[#87b105]/15 px-3 py-1 font-bold text-[#527000]">{viewingCoupon.code}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">Discount Type:</span>
                <span className="capitalize">{viewingCoupon.discountType}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">Discount Value:</span>
                <span className="font-bold">
                  {viewingCoupon.discountType === 'percentage'
                    ? `${viewingCoupon.discountValue}%`
                    : `₹${viewingCoupon.discountValue}`
                  }
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">Minimum Order:</span>
                <span>₹{viewingCoupon.minOrderAmount || 0}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">Start Date:</span>
                <span>{viewingCoupon.startDate ? new Date(viewingCoupon.startDate).toLocaleDateString() : 'Not set'}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">End Date:</span>
                <span>{viewingCoupon.endDate ? new Date(viewingCoupon.endDate).toLocaleDateString() : 'Not set'}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">Status:</span>
                <span className={viewingCoupon.isActive ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                  {viewingCoupon.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div className="px-6 pb-2">
              <span className="font-medium">Used By:</span>

              {viewingCoupon.usedBy && viewingCoupon.usedBy.length > 0 ? (
                <div className="mt-2 border rounded-md p-2 bg-gray-50 max-h-32 overflow-y-auto">
                  {viewingCoupon.usedBy.map((user) => (
                    <div key={user._id} className="flex justify-between text-sm py-1">
                      <span>{user.name}</span>
                      <span className="text-gray-500">{user.phone}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No users used this coupon</p>
              )}
            </div>

            <div className="mt-4 flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">
              <button
                onClick={closeViewModal}
                className="rounded-lg px-5 py-2 text-white transition form-cancel-button"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponManager;
