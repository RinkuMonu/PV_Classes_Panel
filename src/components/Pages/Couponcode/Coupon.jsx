import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../../../config/AxiosInstance";
import { toast } from "react-toastify";

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
        const res = await axiosInstance.put(`/coupon/${editingId}`, form);
        toast.success("Coupon updated successfully");
      } else {
        const res = await axiosInstance.post("/coupon", form);
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
  const handleView = (coupon) => {
    setViewingCoupon(coupon);
    setIsViewModalOpen(true);
  };

  // ✅ Close view modal
  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setViewingCoupon(null);
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Coupon Manager
      </h2>

      {/* Coupon Form */}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className={`bg-white p-6 rounded-lg shadow-md mb-8 border transition-all duration-500 ${
          highlight ? "border-blue-500 ring-2 ring-blue-300" : "border-gray-200"
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
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
            <select
              name="discountType"
              value={form.discountType}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="fixed">Fixed Amount</option>
              <option value="percent">Percentage</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Value {form.discountType === "percent" ? "(%)" : "(₹)"}
            </label>
            <input
              type="number"
              name="discountValue"
              placeholder={form.discountType === "percent" ? "10" : "100"}
              value={form.discountValue}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              min="0"
              step={form.discountType === "percent" ? "1" : "0.01"}
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
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-3 rounded-md hover:from-blue-700 hover:to-blue-900 transition-all duration-200"
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
            className="ml-4 bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 transition-colors duration-200"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Coupon List */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          All Coupons ({coupons.length})
        </h3>

        {coupons.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="mt-4">No coupons found. Create your first coupon!</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {coupons.map((coupon) => (
                  <tr key={coupon._id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{coupon.code}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {coupon.discountType === 'percent' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">₹{coupon.minOrderAmount || 0}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {coupon.startDate ? new Date(coupon.startDate).toLocaleDateString() : 'No start date'} →
                        {coupon.endDate ? new Date(coupon.endDate).toLocaleDateString() : 'No end date'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleView(coupon)}
                          className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-md transition-colors duration-200"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEdit(coupon)}
                          className="text-yellow-600 hover:text-yellow-900 bg-yellow-100 hover:bg-yellow-200 px-3 py-1 rounded-md transition-colors duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(coupon._id)}
                          className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md transition-colors duration-200"
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

      {/* View Modal */}
      {isViewModalOpen && viewingCoupon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Coupon Details</h3>
              <button
                onClick={closeViewModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Code:</span>
                <span className="font-bold text-blue-600">{viewingCoupon.code}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">Discount Type:</span>
                <span className="capitalize">{viewingCoupon.discountType}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">Discount Value:</span>
                <span className="font-bold">
                  {viewingCoupon.discountType === 'percent'
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

            <div className="mt-6 flex justify-end">
              <button
                onClick={closeViewModal}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
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