import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { useEffect, useState, useRef } from "react";
import { Download, Printer } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import html2canvas from "html2canvas";

export default function Invoice() {
  const { orderId } = useParams();
  const invoiceRef = useRef(null); 
  const url = import.meta.env.VITE_API_SERVER_URL;
  const navigate = useNavigate();
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const handleDownload = async () => {
    const element = invoiceRef.current;
    
    try {
      // Create a clone of the element to modify styles
      const clonedElement = element.cloneNode(true);
      clonedElement.style.position = 'absolute';
      clonedElement.style.left = '-9999px';
      clonedElement.style.top = '0';
      clonedElement.style.width = `${element.offsetWidth}px`;
      document.body.appendChild(clonedElement);

      // Replace any unsupported color functions with standard colors
      const elements = clonedElement.querySelectorAll('*');
      elements.forEach(el => {
        const styles = window.getComputedStyle(el);
        
        // Replace oklch colors with standard colors
        if (styles.color.includes('oklch')) {
          el.style.color = '#000000';
        }
        if (styles.backgroundColor.includes('oklch')) {
          el.style.backgroundColor = '#FFFFFF';
        }
        if (styles.borderColor.includes('oklch')) {
          el.style.borderColor = '#DDDDDD';
        }
      });

      // Use html2canvas with optimized settings
      const canvas = await html2canvas(clonedElement, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#FFFFFF',
        letterRendering: true,
        removeContainer: true
      });

      // Clean up the cloned element
      document.body.removeChild(clonedElement);
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // Create PDF with proper dimensions
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([canvas.width * 0.75, canvas.height * 0.75]);
      
      const img = await pdfDoc.embedPng(imgData);
      page.drawImage(img, {
        x: 0,
        y: 0,
        width: canvas.width * 0.75,
        height: canvas.height * 0.75,
      });
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      saveAs(blob, `Invoice_${orderId}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert('Failed to generate PDF. Please try printing instead.');
    }
  };

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${url}/api/orders/view-invoice/${orderId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setInvoiceData(response?.data?.invoice);
      } catch (error) {
        console.error("Error fetching invoice data:", error);
        setError("Failed to load invoice data.");
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [orderId, url]);

  const printInvoice = () => {
    window.print();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <p>Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => navigate("/orders")}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  if (!invoiceData) {
    return null;
  }

  const totalAmount = invoiceData.products.reduce((acc, item) => {
    return acc + parseFloat(item.product_id.discount_price.toString()) * item.quantity;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Force standard colors for PDF generation */}
      <style>
        {`
          .invoice-pdf * {
            color: #000 !important;
            background-color: #FFF !important;
            border-color: #DDD !important;
          }
          .status-badge {
            color: #FFF !important;
            
          }
          .text-red-500 {
            color: #EF4444 !important;
          }
          .bg-green-500 {
            background-color: #10B981 !important;
          }
          .bg-yellow-500 {
            background-color: #F59E0B !important;
          }
          .bg-red-500 {
            background-color: #EF4444 !important;
          }
        `}
      </style>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Invoice</h1>
        <button
          onClick={() => navigate("/orders")}
          className="text-blue-600 hover:text-blue-800"
        >
          Back to Orders
        </button>
      </div>
      
      <div 
        ref={invoiceRef} 
        className="invoice-pdf mx-auto md:p-8 bg-white shadow-lg rounded-lg print:shadow-none print:border print:border-gray-200"
        style={{ 
          maxWidth: '800px',
          fontFamily: 'Arial, sans-serif',
          lineHeight: '1.5',
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">INVOICE</h2>
            <span
              className={`status-badge px-3 py-1 rounded-full text-sm font-medium inline-block ${
                invoiceData.status === "delivered"
                  ? "bg-green-500"
                  : invoiceData.status === "pending"
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
            >
              {invoiceData.status.charAt(0).toUpperCase() + invoiceData.status.slice(1)}
            </span>
          </div>

          <div className="flex flex-col items-start md:items-end text-right space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-6 w-6 bg-gray-300 rounded-full" />
              <span className="text-lg font-semibold">RAJASTHAN BAZAR</span>
            </div>
            <p className="text-sm text-gray-600">
              123 MI Road, Near Panch Batti, Jaipur, Rajasthan – 302001
            </p>
            <p className="text-sm text-gray-600">0141-2567890</p>
            <p className="text-sm text-gray-600">rajasthanbazar@gmail.com</p>
            <p className="text-sm text-gray-600">rajasthanbazar.vercel.app</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 border-t border-b border-gray-200 py-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase">
              Date
            </h3>
            <p className="text-base font-medium">
              {new Date(invoiceData.createdAt).toLocaleDateString("en-IN", {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase">
              Invoice No
            </h3>
            <p className="text-base font-medium">#ORD_{invoiceData?._id}</p>
          </div>
          <div className="text-left sm:text-right">
            <h3 className="text-sm font-semibold text-gray-500 uppercase">
              Invoice To
            </h3>
            <p className="text-base font-medium">{invoiceData?.shipping_address?.full_name}</p>
            <p className="text-sm text-gray-600">{invoiceData?.user_id?.email}</p>
            <p className="text-sm text-gray-600">{invoiceData?.shipping_address?.mobile_number}</p>
            <p className="text-sm text-gray-600">
              {invoiceData?.shipping_address?.address}
            </p>
          </div>
        </div>

        <div className="mb-8 overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700 border border-gray-200 rounded-md overflow-hidden">
            <thead className="bg-gray-100 text-xs uppercase text-gray-600">
              <tr>
                <th className="px-4 py-3 border-b">SR.</th>
                <th className="px-4 py-3 border-b">Product Title</th>
                <th className="px-4 py-3 border-b text-right">Quantity</th>
                <th className="px-4 py-3 border-b text-right">Item Price</th>
                <th className="px-4 py-3 border-b text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {invoiceData.products.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-b">{index + 1}</td>
                  <td className="px-4 py-3 border-b font-medium text-gray-900">
                    {item?.product_id?.name}
                  </td>
                  <td className="px-4 py-3 border-b text-right">
                    {item?.quantity}
                  </td>
                  <td className="px-4 py-3 border-b text-right font-semibold text-gray-900">
                    <span>
                      ₹{item?.product_id?.discount_price?.toLocaleString("en-IN")}
                    </span>
                  </td>
                  <td className="px-4 py-3 border-b text-right font-semibold text-gray-500">
                    ₹{(parseFloat(item?.product_id?.discount_price?.toString()) * item.quantity).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-md">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase">
              Payment Method
            </h3>
            <p className="text-base font-medium">{invoiceData?.payment_method?.toUpperCase()}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase">
              Shipping Cost
            </h3>
            <p className="text-base font-medium">0</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase">
              Discount
            </h3>
            <p className="text-base font-medium">0</p>
          </div>
          <div className="text-left md:text-right">
            <h3 className="text-sm font-semibold text-gray-500 uppercase">
              Total Amount
            </h3>
            <p className="text-2xl font-bold text-red-500">
              ₹{totalAmount?.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-8 print:hidden">
        <button
          onClick={handleDownload}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md shadow-md flex items-center gap-2 transition-colors"
        >
          <Download className="h-5 w-5" />
          Download Invoice
        </button>
        <button 
          onClick={printInvoice}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md shadow-md flex items-center gap-2 transition-colors"
        >
          <Printer className="h-5 w-5" />
          Print Invoice
        </button>
      </div>
    </div>
  );
}