// // import React, { useEffect, useState } from "react";
// // import { useParams } from "react-router-dom";
// // import axiosInstance from "../../../config/AxiosInstance";

// // const Invoice = () => {
// //   const { orderId } = useParams(); // match your route
// //   const [order, setOrder] = useState(null);

// //   // ✅ Fetch single order invoice
// //   useEffect(() => {
// //     const fetchInvoice = async () => {
// //       if (!orderId) {
// //         console.error("❌ Invoice ID missing");
// //         return;
// //       }
// //       try {
// //         console.log("📡 Fetching invoice for ID:", orderId);
// //         const response = await axiosInstance.get(`/checkout/${orderId}`);
// //         console.log("✅ Invoice API response:", response.data);
// //         setOrder(response.data.order);
// //       } catch (error) {
// //         console.error(
// //           "❌ Error fetching invoice:",
// //           error.response?.data || error.message
// //         );
// //       }
// //     };
// //     fetchInvoice();
// //   }, [orderId]);

// //   if (!order) {
// //     return (
// //       <div className="p-6">
// //         <p>Loading invoice...</p>
// //       </div>
// //     );
// //   }

// //   // Helper to render order items dynamically
// //   const renderOrderItems = () => {
// //     const items = [];

// //     // Courses
// //     order.courses?.forEach((course) =>
// //       items.push({ name: course.name, quantity: 1, price: course.price })
// //     );

// //     // Books
// //     order.books?.forEach((book) =>
// //       items.push({ name: book.name, quantity: 1, price: book.price })
// //     );

// //     // Test Series
// //     order.testSeries?.forEach((test) =>
// //       items.push({ name: test.name, quantity: 1, price: test.price })
// //     );

// //     // Combos
// //     order.combo?.forEach((combo) =>
// //       items.push({ name: combo.comboName || "Combo", quantity: 1, price: combo.price || 0 })
// //     );

// //     if (items.length === 0) return <p>No items in this order</p>;

// //     return (
// //       <ul className="list-disc list-inside">
// //         {items.map((item, index) => (
// //           <li key={index}>
// //             {item.name} × {item.quantity} = ₹
// //             {parseFloat(item.price * item.quantity).toLocaleString("en-IN")}
// //           </li>
// //         ))}
// //       </ul>
// //     );
// //   };

// //   return (
// //     <div className="p-8 bg-white shadow-lg rounded-lg max-w-3xl mx-auto">
// //       <h1 className="text-2xl font-bold mb-4">Invoice</h1>
// //       <div className="mb-6">
// //         <p>
// //           <strong>Order ID:</strong> {order._id}
// //         </p>
// //         <p>
// //           <strong>Customer:</strong> {order.user ? order.user.name : "Guest"}
// //         </p>
// //         <p>
// //           <strong>Email:</strong> {order.user ? order.user.email || "-" : "-"}
// //         </p>
// //         <p>
// //           <strong>Status:</strong> {order.orderStatus}
// //         </p>
// //       </div>

// //       <div className="mb-6">
// //         <h2 className="text-lg font-semibold mb-2">Order Items</h2>
// //         {renderOrderItems()}
// //       </div>

// //       <div className="mb-6">
// //         <p>
// //           <strong>Payment Method:</strong> {order.paymentMethod}
// //         </p>
// //         <p>
// //           <strong>Payment Status:</strong> {order.paymentStatus}
// //         </p>
// //         <p>
// //           <strong>Total Amount:</strong> ₹
// //           {parseFloat(order.totalAmount).toLocaleString("en-IN")}
// //         </p>
// //       </div>

// //       <button
// //         onClick={() => window.print()}
// //         className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
// //       >
// //         Print Invoice
// //       </button>
// //     </div>
// //   );
// // };

// // export default Invoice;


// import React, { useEffect, useState, useRef } from "react";
// import { useParams } from "react-router-dom";
// import axiosInstance from "../../../config/AxiosInstance";
// import { Download, Printer } from "lucide-react";
// // import html2canvas from "html2canvas";
// // import jsPDF from "jspdf";

// const Invoice = () => {
//   const { orderId } = useParams();
//   const [order, setOrder] = useState(null);
//   const invoiceRef = useRef();

//   // ✅ Fetch single order invoice
//   useEffect(() => {
//     const fetchInvoice = async () => {
//       if (!orderId) {
//         console.error("❌ Invoice ID missing");
//         return;
//       }
//       try {
//         console.log("📡 Fetching invoice for ID:", orderId);
//         const response = await axiosInstance.get(`/checkout/${orderId}`);
//         console.log("✅ Invoice API response:", response.data);
//         setOrder(response.data.order);
//       } catch (error) {
//         console.error(
//           "❌ Error fetching invoice:",
//           error.response?.data || error.message
//         );
//       }
//     };
//     fetchInvoice();
//   }, [orderId]);




//   // ✅ Print only the invoice
//   const handlePrint = () => {
//     const originalBody = document.body.innerHTML;
//     const printContent = invoiceRef.current.innerHTML;
    
//     document.body.innerHTML = printContent;
//     window.print();
//     document.body.innerHTML = originalBody;
//     window.location.reload(); // Reload to restore the original page
//   };

//   if (!order) {
//     return (
//       <div className="p-6">
//         <p>Loading invoice...</p>
//       </div>
//     );
//   }

//   // Helper to render order items dynamically
//   const renderOrderItems = () => {
//     const items = [];

//     // Courses
//     order.courses?.forEach((course) =>
//       items.push({ 
//         name: course.name, 
//         quantity: 1, 
//         price: course.price,
//         type: "Course"
//       })
//     );

//     // Books
//     order.books?.forEach((book) =>
//       items.push({ 
//         name: book.name, 
//         quantity: 1, 
//         price: book.price,
//         type: "Book"
//       })
//     );

//     // Test Series
//     order.testSeries?.forEach((test) =>
//       items.push({ 
//         name: test.name, 
//         quantity: 1, 
//         price: test.price,
//         type: "Test Series"
//       })
//     );

//     // Combos
//     order.combo?.forEach((combo) =>
//       items.push({ 
//         name: combo.comboName || "Combo", 
//         quantity: 1, 
//         price: combo.price || 0,
//         type: "Combo"
//       })
//     );

//     if (items.length === 0) return <p className="p-4 text-center">No items in this order</p>;

//     return (
//       <table className="w-full border-collapse mt-4">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="text-left p-2 border border-gray-300">Type</th>
//             <th className="text-left p-2 border border-gray-300">Item</th>
//             <th className="text-right p-2 border border-gray-300">Quantity</th>
//             <th className="text-right p-2 border border-gray-300">Price</th>
//             {/* <th className="text-right p-2 border border-gray-300">Total</th> */}
//           </tr>
//         </thead>
//         <tbody>
//           {items.map((item, index) => (
//             <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
//               <td className="p-2 border border-gray-300">{item.type}</td>
//               <td className="p-2 border border-gray-300">{item.name}</td>
//               <td className="p-2 border border-gray-300 text-right">{item.quantity}</td>
//               <td className="p-2 border border-gray-300 text-right">₹{parseFloat(order.totalAmount).toLocaleString("en-IN")}</td>
//               {/* <td className="p-2 border border-gray-300 text-right">₹{parseFloat(item.price).toLocaleString("en-IN")}</td> */}
//               {/* <td className="p-2 border border-gray-300 text-right">₹{parseFloat(item.price * item.quantity).toLocaleString("en-IN")}</td> */}
//             </tr>
//           ))}
        
//         </tbody>
//       </table>
//     );
//   };

//   // Get status color classes without oklch
//   const getStatusColor = (status) => {
//     switch(status) {
//       case 'completed': return 'bg-green-100 text-green-800';
//       case 'pending': return 'bg-yellow-100 text-yellow-800';
//       case 'processing': return 'bg-green-100 text-green-800';
//       case 'cancel': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   return (
//     <div className="p-8 bg-gray-100 min-h-screen">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-green-800">Invoice</h1>
//         <div className="flex space-x-2">
         
//           <button
//             onClick={handlePrint}
//             className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
//           >
//             <Printer className="h-5 w-5 mr-2" />
//             Print
//           </button>
//         </div>
//       </div>

//       <div ref={invoiceRef} className="bg-white shadow-lg rounded-lg p-8 max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="flex justify-between items-start mb-8 border-b pb-4">
//           <div>
//             <h2 className="text-2xl font-bold text-green-800">PV Classes</h2>
//             <p className="text-gray-600">Education for Success</p>
//             <p className="text-gray-600">Pvclasses01@gmail.com</p>
//             <p className="text-gray-600">0141-4511098</p>
//           </div>
//           <div className="text-right">
//             <h3 className="text-xl font-semibold">INVOICE</h3>
//             <p className="text-gray-600">Date: {new Date(order.createdAt || Date.now()).toLocaleDateString()}</p>
//             <p className="text-gray-600">Invoice #: {order._id}</p>
//           </div>
//         </div>

//         {/* Customer Info */}
//         <div className="grid grid-cols-2 gap-8 mb-8">
//           <div>
//             <h4 className="font-semibold text-gray-700 mb-2">Bill To:</h4>
//             <p className="font-medium">{order.user ? order.user.name : "Guest"}</p>
//             {order.user && order.user.email && (
//               <p className="text-gray-600">{order.user.email}</p>
//             )}
//             {order.user && order.user.phone && (
//               <p className="text-gray-600">{order.user.phone}</p>
//             )}
//           </div>
//           <div>
//             <h4 className="font-semibold text-gray-700 mb-2">Order Details:</h4>
//             <p>
//               <span className="font-medium">Status:</span> 
//               <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(order.orderStatus)}`}>
//                 {order.orderStatus}
//               </span>
//             </p>
//             <p>
//               <span className="font-medium">Payment Method:</span> 
//               <span className="ml-2 capitalize">{order.paymentMethod}</span>
//             </p>
//             <p>
//               <span className="font-medium">Payment Status:</span> 
//               <span className="ml-2 capitalize">{order.paymentStatus}</span>
//             </p>
//           </div>
//         </div>

//         {/* Order Items */}
//         <div className="mb-8">
//           <h4 className="font-semibold text-gray-700 mb-4">Order Items:</h4>
//           {renderOrderItems()}
//         </div>

//         {/* Footer */}
//         <div className="border-t pt-6 text-center text-gray-500 text-sm">
//           <p>Thank you for your business!</p>
//           <p>PV Classes - Transforming Education</p>
//           <p>For any queries, please contact: Pvclasses01@gmail.com</p>
//         </div>
//       </div>

//       {/* Print styles - hidden on screen but visible in print */}
//       <style>
//         {`
//           @media print {
//             body * {
//               visibility: hidden;
//             }
//             #invoice-print, #invoice-print * {
//               visibility: visible;
//             }
//             #invoice-print {
//               position: absolute;
//               left: 0;
//               top: 0;
//               width: 100%;
//             }
//           }
//         `}
//       </style>
//     </div>
//   );
// };

// export default Invoice;


import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../config/AxiosInstance";
import { Download, Printer } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Invoice = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const invoiceRef = useRef();

  // ✅ Fetch single order invoice
  useEffect(() => {
    const fetchInvoice = async () => {
      if (!orderId) {
        console.error("❌ Invoice ID missing");
        return;
      }
      try {
        console.log("📡 Fetching invoice for ID:", orderId);
        const response = await axiosInstance.get(`/checkout/${orderId}`);
        console.log("✅ Invoice API response:", response.data);
        setOrder(response.data.order);
      } catch (error) {
        console.error(
          "❌ Error fetching invoice:",
          error.response?.data || error.message
        );
      }
    };
    fetchInvoice();
  }, [orderId]);

  // ✅ Download invoice as PDF (oklch issue fixed)
  const downloadInvoice = async () => {
    try {
      const input = invoiceRef.current;
      if (!input) return;

      // Temporarily replace unsupported oklch colors
      const changedNodes = [];
      const allNodes = input.querySelectorAll("*");

      allNodes.forEach((node) => {
        const style = window.getComputedStyle(node);

        const propsToCheck = [
          "color",
          "backgroundColor",
          "borderTopColor",
          "borderRightColor",
          "borderBottomColor",
          "borderLeftColor",
        ];

        propsToCheck.forEach((prop) => {
          const value = style[prop];
          if (value && value.includes("oklch")) {
            changedNodes.push({
              node,
              prop,
              oldValue: node.style[prop],
            });

            if (prop === "backgroundColor") {
              node.style[prop] = "#ffffff";
            } else if (prop.includes("border")) {
              node.style[prop] = "#d1d5db";
            } else {
              node.style[prop] = "#111827";
            }
          }
        });
      });

      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      // restore original styles
      changedNodes.forEach(({ node, prop, oldValue }) => {
        node.style[prop] = oldValue;
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`invoice-${orderId}.pdf`);
    } catch (error) {
      console.error("❌ Error generating PDF:", error);
      alert("Failed to download invoice PDF");
    }
  };

  // ✅ Print only the invoice
  const handlePrint = () => {
    const originalBody = document.body.innerHTML;
    const printContent = invoiceRef.current.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalBody;
    window.location.reload(); // Reload to restore the original page
  };

  if (!order) {
    return (
      <div className="p-6">
        <p>Loading invoice...</p>
      </div>
    );
  }

  // Helper to render order items dynamically
  const renderOrderItems = () => {
    const items = [];

    // Courses
    order.courses?.forEach((item) => {
      if (item.course) {
        items.push({
          name: item.course.title || "-",
          quantity: 1,
          price: item.course.price || 0,
          type: "Course",
        });
      }
    });

    // Books
    order.books?.forEach((item) => {
      if (item.book) {
        items.push({
          name: item.book.title || "-",
          quantity: 1,
          price: item.book.price || 0,
          type: "Book",
        });
      }
    });

    // Test Series
    order.testSeries?.forEach((item) => {
      if (item.test) {
        items.push({
          name: item.test.title || "-",
          quantity: 1,
          price: item.test.price || 0,
          type: "Test Series",
        });
      }
    });

    // Combos
    order.combo?.forEach((item) => {
      if (item.combo) {
        items.push({
          name: item.combo.title || "Combo",
          quantity: 1,
          price: item.combo.price || 0,
          type: "Combo",
        });
      }
    });

    if (items.length === 0)
      return <p className="p-4 text-center">No items in this order</p>;

    return (
      <table className="w-full border-collapse mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-2 border border-gray-300">Type</th>
            <th className="text-left p-2 border border-gray-300">Item</th>
            <th className="text-right p-2 border border-gray-300">Quantity</th>
            <th className="text-right p-2 border border-gray-300">Price</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
              <td className="p-2 border border-gray-300">{item.type}</td>
              <td className="p-2 border border-gray-300">{item.name}</td>
              <td className="p-2 border border-gray-300 text-right">
                {item.quantity}
              </td>
              <td className="p-2 border border-gray-300 text-right">
                ₹{parseFloat(item.price).toLocaleString("en-IN")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // Get status color classes
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-green-100 text-green-800";
      case "cancel":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-800">Invoice</h1>
        <div className="flex space-x-2">
          <button
            onClick={handlePrint}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Printer className="h-5 w-5 mr-2" />
            Print
          </button>
        </div>
      </div>

      <div
        ref={invoiceRef}
        id="invoice-print"
        className="bg-white shadow-lg rounded-lg p-8 max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-8 border-b pb-4">
          <div>
            <h2 className="text-2xl font-bold text-green-800">PV Classes</h2>
            <p className="text-gray-600">Education for Success</p>
            <p className="text-gray-600">Pvclasses01@gmail.com</p>
            <p className="text-gray-600">0141-4511098</p>
          </div>
          <div className="text-right">
            <h3 className="text-xl font-semibold">INVOICE</h3>
            <p className="text-gray-600">
              Date:{" "}
              {new Date(order.createdAt || Date.now()).toLocaleDateString()}
            </p>
            <p className="text-gray-600">Invoice #: {order._id}</p>
          </div>
        </div>

        {/* Customer Info */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Bill To:</h4>
            <p className="font-medium">{order.user ? order.user.name : "Guest"}</p>
            {order.user && order.user.email && (
              <p className="text-gray-600">{order.user.email}</p>
            )}
            {order.user && order.user.phone && (
              <p className="text-gray-600">{order.user.phone}</p>
            )}
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Order Details:</h4>
            <p>
              <span className="font-medium">Status:</span>
              <span
                className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(
                  order.orderStatus
                )}`}
              >
                {order.orderStatus}
              </span>
            </p>
            <p>
              <span className="font-medium">Payment Method:</span>
              <span className="ml-2 capitalize">{order.paymentMethod}</span>
            </p>
            <p>
              <span className="font-medium">Payment Status:</span>
              <span className="ml-2 capitalize">{order.paymentStatus}</span>
            </p>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-8">
          <h4 className="font-semibold text-gray-700 mb-4">Order Items:</h4>
          {renderOrderItems()}
        </div>

        {/* Footer */}
        <div className="border-t pt-6 text-center text-gray-500 text-sm">
          <p>Thank you for your business!</p>
          <p>PV Classes - Transforming Education</p>
          <p>For any queries, please contact: Pvclasses01@gmail.com</p>
        </div>
      </div>

      {/* Right bottom fixed PDF download button */}
      <button
        onClick={downloadInvoice}
        className="fixed bottom-6 right-6 flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-lg z-50"
      >
        <Download className="h-5 w-5 mr-2" />
        Download
      </button>

      {/* Print styles - hidden on screen but visible in print */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #invoice-print, #invoice-print * {
              visibility: visible;
            }
            #invoice-print {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
          }
        `}
      </style>
    </div>
  );
};


export default Invoice;