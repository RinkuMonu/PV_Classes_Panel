"use client"

import { useState } from "react"
import { Mail, Trash2, CircleDot, ChevronDown, Check, X } from "lucide-react"
import { Link } from "react-router-dom"

const notifications = [
  {
    id: "6878efd1281df60003b6ab2b",
    user: "ahmed salem",
    amount: 204.36,
    type: "New Order",
    timestamp: "17 Jul, 2025  6:12 PM",
    isRead: false,
    imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    orderLink: "/order/6878efd1281df60003b6ab25",
  },
  {
    id: "6878e3d90fc0f100031da8f1",
    user: "ahmed salem",
    amount: 50.78,
    type: "New Order",
    timestamp: "17 Jul, 2025  5:21 PM",
    isRead: false,
    imageUrl: "https://randomuser.me/api/portraits/men/33.jpg",
    orderLink: "/order/6878e3d80fc0f100031da8ec",
  },
  {
    id: "6877f99478afd10003994c14",
    user: "Elouna Pierre.",
    amount: 440.0,
    type: "New Order",
    timestamp: "17 Jul, 2025  12:42 AM",
    isRead: true,
    imageUrl: "https://randomuser.me/api/portraits/women/45.jpg",
    orderLink: "/order/6877f99378afd10003994c0f",
  },
  {
    id: "6876e04efe72fe000388de90",
    user: "Elouna Pierre.",
    amount: 252.48,
    type: "New Order",
    timestamp: "16 Jul, 2025  4:42 AM",
    isRead: false,
    imageUrl: "https://randomuser.me/api/portraits/women/46.jpg",
    orderLink: "/order/6876e04dfe72fe000388de8b",
  },
  {
    id: "687699b35d1d51000312a3fb",
    user: "Papa",
    amount: 169.36,
    type: "New Order",
    timestamp: "15 Jul, 2025  11:40 PM",
    isRead: false,
    imageUrl: "https://randomuser.me/api/portraits/men/50.jpg",
    orderLink: "/order/687699b25d1d51000312a3f6",
  },
];


export default function Notifications() {
  const [selectedNotifications, setSelectedNotifications] = useState(new Set())
  const [showAll, setShowAll] = useState(false)
  
  const displayedNotifications = showAll ? notifications : notifications.slice(0, 5)

  const handleSelectAll = (e) => {
    const checked = e.target.checked
    if (checked) {
      const allIds = new Set(displayedNotifications.map((n) => n.id))
      setSelectedNotifications(allIds)
    } else {
      setSelectedNotifications(new Set())
    }
  }

  const handleSelectNotification = (id, checked) => {
    setSelectedNotifications((prev) => {
      const newSelection = new Set(prev)
      if (checked) {
        newSelection.add(id)
      } else {
        newSelection.delete(id)
      }
      return newSelection
    })
  }

  const markAsRead = () => {
    // Implement mark as read logic
    setSelectedNotifications(new Set())
  }

  const deleteNotifications = () => {
    // Implement delete logic
    setSelectedNotifications(new Set())
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length
  const isAnySelected = selectedNotifications.size > 0
  const isAllSelected = selectedNotifications.size === displayedNotifications.length && displayedNotifications.length > 0

  return (
    <div className=" mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Notifications</h1>
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {unreadCount} unread
          </span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Action toolbar */}
        <div className={`p-2 flex items-center justify-between transition-all duration-200 ${isAnySelected ? 'bg-gray-200 dark:bg-gray-700' : 'bg-gray-200 dark:bg-gray-800'}`}>
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={handleSelectAll}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
            </label>
            
            {isAnySelected ? (
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {selectedNotifications.size} selected
              </span>
            ) : (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Select notifications
              </span>
            )}
          </div>
          
          {isAnySelected && (
            <div className="flex space-x-3">
              <button
                onClick={markAsRead}
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900 transition-colors"
              >
                <Check className="w-4 h-4 mr-2" />
                Mark as read
              </button>
              <button
                onClick={deleteNotifications}
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900 transition-colors"
              >
                <X className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Notifications list */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {displayedNotifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${!notification.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
            >
              <div className="flex items-start">
                <label className="flex items-center h-5">
                  <input
                    type="checkbox"
                    checked={selectedNotifications.has(notification.id)}
                    onChange={(e) => handleSelectNotification(notification.id, e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                  />
                </label>
                
                <Link 
                  to={notification.orderLink} 
                  className="flex-1 ml-4 min-w-0"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-600 overflow-hidden border border-gray-200 dark:border-gray-600 mr-3">
                      <img
                        className="h-full w-full object-cover"
                        src={notification.imageUrl || "/placeholder.svg"}
                        alt="User"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {notification.user} placed an order of ${notification.amount.toFixed(2)}
                      </p>
                      <div className="flex items-center mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                          {notification.type}
                        </span>
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                          {notification.timestamp}
                        </span>
                      </div>
                    </div>
                    
                    {!notification.isRead && (
                      <div className="ml-2 flex-shrink-0">
                        <span className="h-2 w-2 rounded-full bg-blue-500 inline-block"></span>
                      </div>
                    )}
                  </div>
                </Link>
                
                <button className="ml-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {!showAll && notifications.length > 5 && (
          <div className="p-4 text-center border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowAll(true)}
              className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center"
            >
              View all notifications
              <ChevronDown className="ml-1 h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}