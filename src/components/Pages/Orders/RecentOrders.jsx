// import { useState } from "react"
import { Search, Download, Printer, Eye, ChevronLeft, ChevronRight } from "lucide-react"
// import {  useNavigate } from "react-router-dom";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';


export default function RecentOrders({ recentData }) {

  return (
    <div className=" bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Recent Orders</h1>
        </div>

        {/* Orders Table */}
        {/* UI-only: recent-orders table now matches GlobalTable; order logic is unchanged. */}
        <div className="global-table-ui w-full mb-8">
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
        </div>


      </div>
    </div>
  )
}
