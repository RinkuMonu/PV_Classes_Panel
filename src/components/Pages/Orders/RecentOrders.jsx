import { useState } from "react"
import { Search, Download, Printer, Eye, ChevronLeft, ChevronRight } from "lucide-react"
import {  useNavigate } from "react-router-dom";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';



const getStatusBadge = (status) => {
  switch (status) {
    case "Pending":
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">{status}</span>
    case "Delivered":
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">{status}</span>
    case "Cancel":
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">{status}</span>
    default:
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>
  }
}

export default function RecentOrders({recentData}) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [orderLimitFilter, setOrderLimitFilter] = useState("")
  const [methodFilter, setMethodFilter] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  
  // // Pagination state
  // const [currentPage, setCurrentPage] = useState(1)
  // const itemsPerPage = 10 // Changed from 20 to 10
  // const totalItems = ordersData.length // Changed from hardcoded 206 to actual data length
  // const totalPages = Math.ceil(totalItems / itemsPerPage)

  // Filter orders based on search and filters
  // const filteredOrders = ordersData.filter(order => {
  //   const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
  //                        order.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase())
  //   const matchesStatus = !statusFilter || statusFilter === "all" || 
  //                        order.status.toLowerCase() === statusFilter.toLowerCase()
  //   const matchesMethod = !methodFilter || methodFilter === "all" || 
  //                        order.method.toLowerCase() === methodFilter.toLowerCase()
  //   return matchesSearch && matchesStatus && matchesMethod
  // })

  // Get current page's orders
  // const indexOfLastOrder = currentPage * itemsPerPage
  // const indexOfFirstOrder = indexOfLastOrder - itemsPerPage
  // const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder)

  // Generate page numbers for pagination
  // const getPageNumbers = () => {
  //   const pages = []
  //   const maxVisiblePages = 5
    
  //   if (totalPages <= maxVisiblePages) {
  //     for (let i = 1; i <= totalPages; i++) {
  //       pages.push(i)
  //     }
  //   } else {
  //     let startPage = Math.max(1, currentPage - 2)
  //     let endPage = Math.min(totalPages, currentPage + 2)
      
  //     if (currentPage <= 3) {
  //       endPage = maxVisiblePages
  //     } else if (currentPage >= totalPages - 2) {
  //       startPage = totalPages - maxVisiblePages + 1
  //     }
      
  //     for (let i = startPage; i <= endPage; i++) {
  //       pages.push(i)
  //     }
  //   }
    
  //   return pages
  // }
  const handleViewInvoice = (invoiceId) => {
    navigate(`/invoice/${invoiceId}`);
  };
  return (
    <div className=" bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Recent Orders</h1>

          {/* Top Filters Row */}
          {/* <div className="flex flex-wrap gap-4 mb-4 bg-white p-4 rounded">
            <div className="relative flex-1 min-w-40">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by Customer Name"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1) // Reset to first page when searching
                }}
                className="pl-10 bg-white w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <select 
              value={statusFilter} 
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setCurrentPage(1) // Reset to first page when filtering
              }}
              className="w-48 bg-white rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Status</option>
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="delivered">Delivered</option>
              <option value="cancel">Cancel</option>
            </select>

            <select 
              value={orderLimitFilter} 
              onChange={(e) => setOrderLimitFilter(e.target.value)}
              className="w-48 bg-white rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Order limits</option>
              <option value="10">Last 5 days Orders</option>
              <option value="25">Last 10 days Orders</option>
              <option value="50">Last 20 days Orders</option>
              <option value="100">Last 30 days Orders</option>
            </select>

            <select 
              value={methodFilter} 
              onChange={(e) => {
                setMethodFilter(e.target.value)
                setCurrentPage(1) // Reset to first page when filtering
              }}
              className="w-48 bg-white rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Method</option>
              <option value="all">All Methods</option>
              <option value="card">Card</option>
              <option value="cash">Cash</option>
            </select>

            <button className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center px-4 py-2 rounded-md">
              <Download className="h-4 w-4 mr-2" />
              Download All Orders
            </button>
          </div> */}

          {/* Date Filters Row */}
          {/* <div className="flex flex-wrap gap-4 items-end bg-white p-4 rounded">
            <div className="flex-1 min-w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-white w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex-1 min-w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <div className="relative">
                <input 
                  type="date" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)} 
                  className="bg-white w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
                />
              </div>
            </div>

            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2 rounded-md">
              Filter
            </button>

            <button 
              className="px-8 py-2 rounded-md border border-gray-300 bg-transparent hover:bg-gray-50"
              onClick={() => {
                setSearchTerm("")
                setStatusFilter("")
                setMethodFilter("")
                setStartDate("")
                setEndDate("")
                setCurrentPage(1)
              }}
            >
              Reset
            </button>
          </div> */}
        </div>

        {/* Orders Table */}
        <div className="w-full overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg mb-8">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:text-gray-400 dark:bg-gray-800">
                <tr>                  
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">ORDER TIME</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">CUSTOMER NAME</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">METHOD</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">AMOUNT</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">STATUS</th>
                  {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">ACTION</th> */}
                 
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                 {recentData && recentData.length > 0 ? (
                  recentData.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(order.createdAt).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                          timeZone: "Asia/Kolkata",
                        })}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm   text-gray-900">{order.shipping_address.full_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-700 text-sm">
                        {order.payment_method.toUpperCase()}
                      </span>

                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-sm text-gray-900">
                        ₹{Number(order.total_amount).toLocaleString("en-IN")}
                      </td>

                      <td className="px-6 py-4 text-sm whitespace-nowrap">{order.status.toUpperCase()}</td>
                      {/* <td className="px-6 py-4 whitespace-nowrap">
                        <select 
                          defaultValue={order.status.toLowerCase()}
                          className="w-24 h-8 rounded-md text-sm border border-gray-300 py-1 px-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="delivered">Delivered</option>
                          <option value="processing">Processing</option>
                          <option value="cancel">Cancel</option>
                        </select>
                      </td> */}
                     
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                      No orders found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
           {/* Pagination */}
        {/* {filteredOrders.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 rounded-b-lg">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstOrder + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(indexOfLastOrder, filteredOrders.length)}</span> of{' '}
                  <span className="font-medium">{filteredOrders.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
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
                          ? 'z-10 bg-emerald-50 border-emerald-500 text-emerald-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )} */}
        </div>

       
      </div>
    </div>
  )
}