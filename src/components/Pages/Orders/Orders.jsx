import {
  Eye,
  Pencil,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../../config/AxiosInstance";

const Orders = () => {
  const [ordersData, setOrdersData] = useState([]);
  const navigate = useNavigate();

  // ✅ Fetch all orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get("/checkout/get-all");
        setOrdersData(response.data.orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  // ✅ Status badge
  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancel: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[status] || "bg-gray-100 text-gray-800"
          }`}
      >
        {status}
      </span>
    );
  };

  // ✅ Change order status
  const changeStatus = async (orderId, status) => {
    try {
      await axiosInstance.put(`/checkout/${orderId}/status`, {
        orderId,
        status,
      });
      toast.success("Status updated successfully!");
      setOrdersData((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, orderStatus: status } : order
        )
      );
    } catch (error) {
      console.error("Error updating status:", error.response?.data || error.message);
      toast.error("Failed to update status");
    }
  };

  // ✅ View invoice
  const handleViewInvoice = (orderId) => {
    navigate(`/invoice/${orderId}`);
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <ShoppingCart className="h-8 w-8 text-blue-600 mr-2" />
        <h1 className="text-2xl font-bold">Orders</h1>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Payment Method
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Update Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ordersData.length > 0 ? (
              ordersData.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    #{order._id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.user ? order.user.name : "Guest"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {order.paymentMethod}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 text-sm">
                    ₹{parseFloat(order.totalAmount).toLocaleString("en-IN")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {getStatusBadge(order.orderStatus)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      onChange={(e) => changeStatus(order._id, e.target.value)}
                      defaultValue={order.orderStatus}
                      className="w-28 h-8 text-sm rounded-md border border-gray-300 py-1 px-2"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="cancel">Cancel</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
                    <button
                      onClick={() => handleViewInvoice(order._id)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    {/* <button className="text-green-600 hover:text-green-900">
                      <Pencil className="h-5 w-5" />
                    </button> */}
                    {/* <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-5 w-5" />
                    </button> */}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500"
                >
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
