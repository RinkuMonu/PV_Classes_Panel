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

const Orders = () => {
  const [ordersData, setOrdersData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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
  }, [page]);

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

  // ✅ Download full order list PDF
  const downloadOrdersPDF = async () => {
    try {
      // full data fetch without pagination
      const response = await axiosInstance.get(`/checkout/get-all?page=1&limit=100000`);
      const allOrders = response.data.orders || [];

      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Orders List", 14, 15);

      const tableColumn = [
        "S.No.",
        "Order Serial",
        "Order ID",
        "Customer",
        "Phone",
        "Payment Method",
        "Amount",
        "Status",
      ];

      const tableRows = allOrders.map((order, index) => [
        index + 1,
        order.serialNumber || "N/A",
        order._id || "N/A",
        order.user?.name || "Guest",
        order.user?.phone || "N/A",
        order.paymentMethod || "N/A",
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

      doc.save("orders-list.pdf");
    } catch (error) {
      console.error("Error downloading orders PDF:", error);
      toast.error("Failed to download PDF");
    }
  };

  return (
    <div className="p-6">
      {/* Top header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <ShoppingCart className="h-8 w-8 text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold">Orders</h1>
        </div>

        <button
          onClick={downloadOrdersPDF}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          <Download className="h-4 w-4" />
          Download PDF
        </button>
      </div>

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
            {ordersData.length > 0 ? (
              ordersData.map((order) => (
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
    </div>
  );
};

export default Orders;




// import {
//   Eye,
//   Pencil,
//   ShoppingCart,
//   Trash2,
// } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import axiosInstance from "../../../config/AxiosInstance";

// const Orders = () => {
//   const [ordersData, setOrdersData] = useState([]);
//   const navigate = useNavigate();

//   // ✅ Fetch all orders
//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const response = await axiosInstance.get("/checkout/get-all");
//         setOrdersData(response.data.orders || []);
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//       }
//     };
//     fetchOrders();
//   }, []);

//   // ✅ Status badge
//   const getStatusBadge = (status) => {
//     const statusClasses = {
//       pending: "bg-yellow-100 text-yellow-800",
//       processing: "bg-blue-100 text-blue-800",
//       completed: "bg-green-100 text-green-800",
//       cancel: "bg-red-100 text-red-800",
//     };
//     return (
//       <span
//         className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[status] || "bg-gray-100 text-gray-800"
//           }`}
//       >
//         {status}
//       </span>
//     );
//   };

//   // ✅ Change order status
//   const changeStatus = async (orderId, status) => {
//     try {
//       await axiosInstance.put(`/checkout/${orderId}/status`, {
//         orderId,
//         status,
//       });
//       toast.success("Status updated successfully!");
//       setOrdersData((prev) =>
//         prev.map((order) =>
//           order._id === orderId ? { ...order, orderStatus: status } : order
//         )
//       );
//     } catch (error) {
//       console.error("Error updating status:", error.response?.data || error.message);
//       toast.error("Failed to update status");
//     }
//   };

//   // ✅ View invoice
//   const handleViewInvoice = (orderId) => {
//     navigate(`/invoice/${orderId}`);
//   };

//   return (
//     <div className="p-6">
//       <div className="flex items-center mb-6">
//         <ShoppingCart className="h-8 w-8 text-blue-600 mr-2" />
//         <h1 className="text-2xl font-bold">Orders</h1>
//       </div>

//       <div className="overflow-x-auto bg-white shadow rounded-lg">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                 Order ID
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                 Customer
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                 Payment Method
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                 Amount
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                 Status
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                 Update Status
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {ordersData.length > 0 ? (
//               ordersData.map((order) => (
//                 <tr key={order._id}>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     #{order._id}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {order.user ? order.user.name : "Guest"}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                     {order.paymentMethod}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 text-sm">
//                     ₹{parseFloat(order.totalAmount).toLocaleString("en-IN")}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm">
//                     {getStatusBadge(order.orderStatus)}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <select
//                       onChange={(e) => changeStatus(order._id, e.target.value)}
//                       defaultValue={order.orderStatus}
//                       className="w-28 h-8 text-sm rounded-md border border-gray-300 py-1 px-2"
//                     >
//                       <option value="pending">Pending</option>
//                       <option value="processing">Processing</option>
//                       <option value="completed">Completed</option>
//                       <option value="cancel">Cancel</option>
//                     </select>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
//                     <button
//                       onClick={() => handleViewInvoice(order._id)}
//                       className="text-indigo-600 hover:text-indigo-900"
//                     >
//                       <Eye className="h-5 w-5" />
//                     </button>
//                     {/* <button className="text-green-600 hover:text-green-900">
//                       <Pencil className="h-5 w-5" />
//                     </button> */}
//                     {/* <button className="text-red-600 hover:text-red-900">
//                       <Trash2 className="h-5 w-5" />
//                     </button> */}
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td
//                   colSpan="7"
//                   className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500"
//                 >
//                   No orders found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Orders;



// import {
//   Eye,
//   Pencil,
//   ShoppingCart,
//   Trash2,
// } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import axiosInstance from "../../../config/AxiosInstance";

// const Orders = () => {
//   const [ordersData, setOrdersData] = useState([]);
//   const navigate = useNavigate();

//   // ✅ Fetch all orders
//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const response = await axiosInstance.get("/checkout/get-all");
//         setOrdersData(response.data.orders || []);
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//       }
//     };
//     fetchOrders();
//   }, []);

//   // ✅ Status badge
//   const getStatusBadge = (status) => {
//     const statusClasses = {
//       pending: "bg-yellow-100 text-yellow-800",
//       processing: "bg-blue-100 text-blue-800",
//       completed: "bg-green-100 text-green-800",
//       cancel: "bg-red-100 text-red-800",
//     };
//     return (
//       <span
//         className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[status] || "bg-gray-100 text-gray-800"
//           }`}
//       >
//         {status}
//       </span>
//     );
//   };

//   // ✅ Change order status
//   const changeStatus = async (orderId, status) => {
//     try {
//       await axiosInstance.put(`/checkout/${orderId}/status`, {
//         orderId,
//         status,
//       });
//       toast.success("Status updated successfully!");
//       setOrdersData((prev) =>
//         prev.map((order) =>
//           order._id === orderId ? { ...order, orderStatus: status } : order
//         )
//       );
//     } catch (error) {
//       console.error("Error updating status:", error.response?.data || error.message);
//       toast.error("Failed to update status");
//     }
//   };

//   // ✅ View invoice
//   const handleViewInvoice = (orderId) => {
//     navigate(`/invoice/${orderId}`);
//   };

//   return (
//     <div className="p-6">
//       <div className="flex items-center mb-6">
//         <ShoppingCart className="h-8 w-8 text-blue-600 mr-2" />
//         <h1 className="text-2xl font-bold">Orders</h1>
//       </div>

//       <div className="overflow-x-auto bg-white shadow rounded-lg">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                 Order ID
//               </th>

//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                 Serial No.
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                 Customer
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                 Payment Method
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                 Amount
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                 Status
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                 Update Status
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {ordersData.length > 0 ? (
//               ordersData.map((order) => (
//                 <tr key={order._id}>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     #{order._id}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {order.serialNumber || "N/A"}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {order.user ? order.user.name : "Guest"}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                     {order.paymentMethod}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 text-sm">
//                     ₹{parseFloat(order.totalAmount).toLocaleString("en-IN")}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm">
//                     {getStatusBadge(order.orderStatus)}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <select
//                       onChange={(e) => changeStatus(order._id, e.target.value)}
//                       defaultValue={order.orderStatus}
//                       className="w-28 h-8 text-sm rounded-md border border-gray-300 py-1 px-2"
//                     >
//                       <option value="pending">Pending</option>
//                       <option value="processing">Processing</option>
//                       <option value="completed">Completed</option>
//                       <option value="cancel">Cancel</option>
//                     </select>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
//                     <button
//                       onClick={() => handleViewInvoice(order._id)}
//                       className="text-indigo-600 hover:text-indigo-900"
//                     >
//                       <Eye className="h-5 w-5" />
//                     </button>
//                     {/* <button className="text-green-600 hover:text-green-900">
//                       <Pencil className="h-5 w-5" />
//                     </button> */}
//                     {/* <button className="text-red-600 hover:text-red-900">
//                       <Trash2 className="h-5 w-5" />
//                     </button> */}
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td
//                   colSpan="8"
//                   className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500"
//                 >
//                   No orders found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Orders;