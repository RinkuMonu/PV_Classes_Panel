import {
  Eye,
  ShoppingCart,
  Download,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../../config/AxiosInstance";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import GlobalTable from "../../common/GlobalTable";
import TableActionButton from "../../common/TableActionButton";

const Orders = () => {
  const [ordersData, setOrdersData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ✅ PDF Status Filter
  const [orderFilter, setOrderFilter] = useState("all");

  const limit = 10;

  const navigate = useNavigate();

  // ✅ Fetch paginated orders
  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get(
        `/checkout/get-all?page=${page}&limit=${limit}`
      );

      setOrdersData(response.data.orders || []);
      setTotalPages(response.data.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const filteredOrders = ordersData.filter((order) => {
  switch (orderFilter) {
    case "completed":
      return order.orderStatus?.toLowerCase() === "completed";

    case "cancelled":
      return order.orderStatus?.toLowerCase() === "cancelled";

    case "physical":
      return order.books?.some(
        (book) => book.deliveryType === "physical"
      );

    default:
      return true;
  }
});
  // ✅ Status badge
  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      cancel: "bg-red-100 text-red-800",
      shipped: "bg-purple-100 text-purple-800",
      packed: "bg-orange-100 text-orange-800",
      confirmed: "bg-emerald-100 text-emerald-800",
    };

    return (
      <span
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          statusClasses[status] || "bg-gray-100 text-gray-800"
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
      console.error(
        "Error updating status:",
        error.response?.data || error.message
      );
      toast.error("Failed to update status");
    }
  };

  // ✅ View invoice
  const handleViewInvoice = (orderId) => {
    navigate(`/invoice/${orderId}`);
  };

  // UI-only data helpers: normalize the API's single-object/array purchase fields.
  const toArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);

  const getPurchasedItems = (order) => [
    ...toArray(order.books).map((item) => ({ type: "book", name: item.book?.title })),
    ...toArray(order.courses).map((item) => ({ type: "course", name: item.course?.title })),
    ...toArray(order.testSeries).map((item) => ({ type: "testSeries", name: item.test?.title })),
    ...toArray(order.combo).map((item) => ({ type: "combo", name: item.combo?.title || item.title })),
  ].filter((item) => item.name);

  const getPurchasedProductNames = (order) =>
    getPurchasedItems(order).map((item) => item.name).join(", ") || "N/A";

  const getOrderTypes = (order) => [...new Set(getPurchasedItems(order).map((item) => item.type))];

  const filteredOrders = ordersData.filter((order) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = (
      order._id?.toLowerCase().includes(search) ||
      order.serialNumber?.toLowerCase().includes(search) ||
      order.user?.name?.toLowerCase().includes(search) ||
      order.user?.phone?.toLowerCase().includes(search) ||
      order.paymentMethod?.toLowerCase().includes(search) ||
      order.orderStatus?.toLowerCase().includes(search) ||
      getPurchasedProductNames(order).toLowerCase().includes(search)
    );

    const matchesStatus = !statusFilter || order.orderStatus === statusFilter;
    const matchesPayment = !paymentFilter || order.paymentStatus === paymentFilter;
    const matchesType = !orderTypeFilter || getOrderTypes(order).includes(orderTypeFilter);

    return matchesSearch && matchesStatus && matchesPayment && matchesType;
  });

  // ✅ Pagination page numbers
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

  // ✅ Download order list PDF according to selected status
  const downloadOrdersPDF = async () => {
    try {
      // full data fetch without pagination
      const response = await axiosInstance.get(
        `/checkout/get-all?page=1&limit=100000`
      );

      const allOrders = response.data.orders || [];

      // Filter orders according to selected status
      const filteredOrders = allOrders.filter((order) => {
  switch (orderFilter) {
    case "completed":
      return order.orderStatus?.toLowerCase() === "completed";

    case "cancelled":
      return order.orderStatus?.toLowerCase() === "cancelled";

    case "physical":
      return order.books?.some(
        (book) => book.deliveryType === "physical"
      );

    default:
      return true;
  }
});

      if (filteredOrders.length === 0) {
        toast.warning(`No ${orderFilter} orders found`);
        return;
      }

      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Orders List", 14, 15);

      const tableColumn = [
        "S.No.",
        "Order Serial",
        "Order ID",
        "Customer",
        "Purchased Product",
        "Product Type",
        "Phone",
        "Payment Method",
        "Payment Status",
        "Amount",
        "Status",
      ];

      const tableRows = filteredOrders.map((order, index) => [
        index + 1,
        order.serialNumber || "N/A",
        order._id || "N/A",
        order.user?.name || "Guest",
        getPurchasedProductNames(order),
        getOrderTypes(order).join(", ") || "N/A",
        order.user?.phone || "N/A",
        order.paymentMethod || "N/A",
        order.paymentStatus || "N/A",
        `₹${parseFloat(order.totalAmount || 0).toLocaleString("en-IN")}`,
        order.orderStatus || "N/A",
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 25,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [22, 163, 74] },
      });

      doc.save(`${orderFilter}-orders-list.pdf`);
    } catch (error) {
      console.error("Error downloading orders PDF:", error);
      toast.error("Failed to download PDF");
    }
  };

  const orderColumns = [
    {
      key: "orderId",
      header: "Order ID",
      render: (order) => <span className="font-medium text-gray-900">#{order._id}</span>,
    },
    {
      key: "serialNumber",
      header: "Serial No.",
      render: (order) => order.serialNumber || "N/A",
    },
    {
      key: "customer",
      header: "Customer",
      render: (order) => order.user ? order.user.name : "Guest",
    },
    {
      key: "purchasedProduct",
      header: "Purchased Product",
      cellClassName: "min-w-[240px] max-w-sm",
      render: (order) => (
        <span className="line-clamp-2" title={getPurchasedProductNames(order)}>
          {getPurchasedProductNames(order)}
        </span>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      render: (order) => order.user?.phone || "N/A",
    },
    {
      key: "paymentMethod",
      header: "Payment Method",
      render: (order) => order.paymentMethod || "N/A",
    },
    {
      key: "amount",
      header: "Amount",
      render: (order) => (
        <span className="font-medium text-gray-900">
          ₹{parseFloat(order.totalAmount || 0).toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (order) => getStatusBadge(order.orderStatus),
    },
    {
      key: "updateStatus",
      header: "Update Status",
      render: (order) => (
        <select
          onChange={(e) => changeStatus(order._id, e.target.value)}
          defaultValue={order.orderStatus}
          className="w-32 h-8 text-sm rounded-md border border-gray-300 py-1 px-2 outline-none focus:border-[#87b105] focus:ring-1 focus:ring-[#87b105]"
        >
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="confirmed">Confirmed</option>
          <option value="packed">Packed</option>
          <option value="shipped">Shipped</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (order) => (
        <TableActionButton
          tone="view"
          title="View invoice"
          onClick={() => handleViewInvoice(order._id)}
        >
          <Eye className="h-5 w-5" />
        </TableActionButton>
      ),
    },
  ];

  return (
    <div className="p-6">
      {/* Top header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <ShoppingCart className="h-8 w-8 text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold">Orders</h1>
        </div>

        <div className="flex items-center gap-3">
          <select
    value={orderFilter}
    onChange={(e)=>setOrderFilter(e.target.value)}
    className="h-10 px-3 border border-gray-300 rounded-md bg-white text-sm"
>
    <option value="all">All Orders</option>
    <option value="completed">Completed</option>
    <option value="cancelled">Cancelled</option>
    <option value="physical">Physical Book Orders</option>
</select>

          <button
            onClick={downloadOrdersPDF}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </button>
        </div>
      </div>

      <GlobalTable
        title={`Orders (${filteredOrders.length})`}
        filters={{
          searchValue: searchTerm,
          onSearchChange: setSearchTerm,
          searchPlaceholder: "Search orders or products...",
          filters: [
            {
              key: "orderStatus",
              value: statusFilter,
              onChange: setStatusFilter,
              options: [
                { value: "", label: "All order statuses" },
                { value: "completed", label: "Completed / Approved" },
                { value: "confirmed", label: "Confirmed" },
                { value: "pending", label: "Pending" },
                { value: "processing", label: "Processing" },
                { value: "cancelled", label: "Cancelled" },
              ],
            },
            {
              key: "paymentStatus",
              value: paymentFilter,
              onChange: setPaymentFilter,
              options: [
                { value: "", label: "All payment statuses" },
                { value: "paid", label: "Paid / Approved" },
                { value: "failed", label: "Failed" },
              ],
            },
            {
              key: "orderType",
              value: orderTypeFilter,
              onChange: setOrderTypeFilter,
              options: [
                { value: "", label: "All product types" },
                { value: "book", label: "Book orders" },
                { value: "course", label: "Course orders" },
                { value: "testSeries", label: "Test Series orders" },
                { value: "combo", label: "Combo orders" },
              ],
            },
          ],
          resultText: `Page ${page} of ${totalPages}`,
          exportData: filteredOrders,
          exportFileName: "orders.csv",
          exportColumns: [
            { key: "_id", header: "Order ID" },
            { key: "serialNumber", header: "Serial No." },
            { key: "customer", header: "Customer", value: (order) => order.user?.name || "Guest" },
            { key: "purchasedProduct", header: "Purchased Product", value: getPurchasedProductNames },
            { key: "productType", header: "Product Type", value: (order) => getOrderTypes(order).join(", ") || "N/A" },
            { key: "phone", header: "Phone", value: (order) => order.user?.phone || "N/A" },
            { key: "paymentMethod", header: "Payment Method" },
            { key: "paymentStatus", header: "Payment Status" },
            {
              key: "totalAmount",
              header: "Amount",
              value: (order) => parseFloat(order.totalAmount || 0).toLocaleString("en-IN"),
            },
            { key: "orderStatus", header: "Status" },
          ],
        }}
        columns={orderColumns}
        data={filteredOrders}
        emptyText={searchTerm || statusFilter || paymentFilter || orderTypeFilter ? "No orders match the selected filters" : "No orders found"}
        getRowKey={(order) => order._id}
        pagination={{
          currentPage: page,
          totalPages,
          onPageChange: setPage,
          rightContent: (
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-end">
              <p className="text-sm text-gray-500">
                Showing {filteredOrders.length} order{filteredOrders.length === 1 ? "" : "s"} on this page
              </p>
              <button
                onClick={downloadOrdersPDF}
                className="flex items-center gap-2 rounded bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:scale-105 ease-in-out"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </button>
            </div>
          ),
        }}
      />

      {/* eslint-disable-next-line no-constant-binary-expression */}
      {false && (
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Serial No.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Phone
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
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order)=>(
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    #{order._id}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {order.serialNumber || "N/A"}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.user ? order.user.name : "Guest"}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.user?.phone || "N/A"}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {order.paymentMethod}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 text-sm">
                    ₹{parseFloat(order.totalAmount || 0).toLocaleString("en-IN")}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {getStatusBadge(order.orderStatus)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      onChange={(e) => changeStatus(order._id, e.target.value)}
                      defaultValue={order.orderStatus}
                      className="w-32 h-8 text-sm rounded-md border border-gray-300 py-1 px-2"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="packed">Packed</option>
                      <option value="shipped">Shipped</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
                    <button
                      onClick={() => handleViewInvoice(order._id)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500"
                >
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-center gap-2 items-center p-4 border-t flex-wrap">
          {page > 1 && (
            <>
              <button
                onClick={() => setPage(1)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                1
              </button>
              {page > 3 && <span>...</span>}
            </>
          )}

          {getPageNumbers().map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 rounded ${
                page === p ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              {p}
            </button>
          ))}

          {page < totalPages - 2 && <span>...</span>}

          {page < totalPages && (
            <button
              onClick={() => setPage(totalPages)}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              {totalPages}
            </button>
          )}
        </div>
      </div>
      )}
    </div>
  );
};

export default Orders;

