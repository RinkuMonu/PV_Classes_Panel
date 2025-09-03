import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../config/AxiosInstance";

const Invoice = () => {
  const { orderId } = useParams(); // match your route
  const [order, setOrder] = useState(null);

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
    order.courses?.forEach((course) =>
      items.push({ name: course.name, quantity: 1, price: course.price })
    );

    // Books
    order.books?.forEach((book) =>
      items.push({ name: book.name, quantity: 1, price: book.price })
    );

    // Test Series
    order.testSeries?.forEach((test) =>
      items.push({ name: test.name, quantity: 1, price: test.price })
    );

    // Combos
    order.combo?.forEach((combo) =>
      items.push({ name: combo.comboName || "Combo", quantity: 1, price: combo.price || 0 })
    );

    if (items.length === 0) return <p>No items in this order</p>;

    return (
      <ul className="list-disc list-inside">
        {items.map((item, index) => (
          <li key={index}>
            {item.name} × {item.quantity} = ₹
            {parseFloat(item.price * item.quantity).toLocaleString("en-IN")}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="p-8 bg-white shadow-lg rounded-lg max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Invoice</h1>
      <div className="mb-6">
        <p>
          <strong>Order ID:</strong> {order._id}
        </p>
        <p>
          <strong>Customer:</strong> {order.user ? order.user.name : "Guest"}
        </p>
        <p>
          <strong>Email:</strong> {order.user ? order.user.email || "-" : "-"}
        </p>
        <p>
          <strong>Status:</strong> {order.orderStatus}
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Order Items</h2>
        {renderOrderItems()}
      </div>

      <div className="mb-6">
        <p>
          <strong>Payment Method:</strong> {order.paymentMethod}
        </p>
        <p>
          <strong>Payment Status:</strong> {order.paymentStatus}
        </p>
        <p>
          <strong>Total Amount:</strong> ₹
          {parseFloat(order.totalAmount).toLocaleString("en-IN")}
        </p>
      </div>

      <button
        onClick={() => window.print()}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Print Invoice
      </button>
    </div>
  );
};

export default Invoice;
