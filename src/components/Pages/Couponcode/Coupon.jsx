"use client"

import { useEffect, useState } from "react"
import { Upload, Download, Pencil, Trash2, Plus, ChevronLeft, ChevronRight, MoreHorizontal, Search } from "lucide-react"
import AddCouponModal from "./AddCouponModal"
import { format } from "date-fns"
import Tippy from "@tippyjs/react"
import "tippy.js/dist/tippy.css"
import axiosInstance from "../../../config/axiosInstance"

export default function Coupon() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState(null)
  const [coupons, setCoupons] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedPublished, setSelectedPublished] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [selectedCoupons, setSelectedCoupons] = useState([])
  const [isBulkActionOpen, setIsBulkActionOpen] = useState(false)

  const handleEditClick = (coupon) => {
    setEditingCoupon(coupon)
    setIsModalOpen(true)
  }

  const handleAddCoupon = (newCoupon) => {
    if (editingCoupon) {
      // Update existing coupon
      setCoupons(
        coupons.map((coupon) =>
          coupon.id === editingCoupon.id
            ? {
                ...newCoupon,
                id: editingCoupon.id,
                image: newCoupon.bannerImage || coupon.image,
                status: new Date(newCoupon.validityDate) > new Date() ? "Active" : "Expired",
                startDate: format(new Date(), "dd MMM, yyyy"),
                endDate: format(newCoupon.validityDate, "dd MMM, yyyy"),
                discount:
                  newCoupon.discountType === "percentage"
                    ? `${newCoupon.discountValue}%`
                    : `$${newCoupon.discountValue}`,
              }
            : coupon,
        ),
      )
    } else {
      // Add new coupon
      const validityDate = newCoupon.validityDate || new Date()
      setCoupons([
        ...coupons,
        {
          ...newCoupon,
          id: `${coupons.length + 1}`,
          image: newCoupon.bannerImage || "/placeholder.svg",
          status: validityDate > new Date() ? "Active" : "Expired",
          startDate: format(new Date(), "dd MMM, yyyy"),
          endDate: format(validityDate, "dd MMM, yyyy"),
          discount:
            newCoupon.discountType === "percentage" ? `${newCoupon.discountValue}%` : `$${newCoupon.discountValue}`,
        },
      ])
    }
    setEditingCoupon(null)
  }

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true)
        const res = await axiosInstance.get(`/coupons?page=${currentPage}&limit=${itemsPerPage}`)
        const { items, totalItems, totalPages } = res.data
        const formattedCoupons = items.map((item) => ({
          id: item._id,
          campaignName: item.campaign_name,
          code: item.code,
          discount:
            item.discount_type === "percent"
              ? `${Number.parseFloat(item.discount_value.$numberDecimal)}%`
              : `₹${Number.parseFloat(item.discount_value.$numberDecimal)}`,
          published: item.is_active,
          startDate: format(new Date(item.valid_from), "dd MMM, yyyy"),
          endDate: format(new Date(item.valid_to), "dd MMM, yyyy"),
          status: new Date(item.valid_to) >= new Date() ? "Active" : "Expired",
          image: item.banner_image ? `/uploads/${item.banner_image}` : "/placeholder.svg",
        }))
        setCoupons(formattedCoupons)
        setTotalItems(totalItems)
        setTotalPages(totalPages)
      } catch (err) {
        console.error("Failed to fetch coupons:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchCoupons()
  }, [])

  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch =
      coupon.campaignName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      coupon.code.toLowerCase().includes(searchTerm?.toLowerCase())
    const matchesStatus = selectedStatus === "all" || coupon.status === selectedStatus
    const matchesPublished =
      selectedPublished === "all" ||
      (selectedPublished === "published" && coupon.published) ||
      (selectedPublished === "unpublished" && !coupon.published)
    return matchesSearch && matchesStatus && matchesPublished
  })

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedStatus, selectedPublished])

  // Pagination logic based on filtered data
  const filteredTotalItems = filteredCoupons.length
  const filteredTotalPages = Math.ceil(filteredTotalItems / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredCoupons.slice(indexOfFirstItem, indexOfLastItem)

  const togglePublished = (id) => {
    setCoupons(coupons.map((coupon) => (coupon.id === id ? { ...coupon, published: !coupon.published } : coupon)))
  }

  const deleteCoupon = (id) => {
    setCoupons(coupons.filter((coupon) => coupon.id !== id))
    setSelectedCoupons(selectedCoupons.filter((couponId) => couponId !== id))
  }

  const handleSelectCoupon = (id) => {
    setSelectedCoupons((prev) => (prev.includes(id) ? prev.filter((couponId) => couponId !== id) : [...prev, id]))
  }

  const handleSelectAllCoupons = (e) => {
    if (e.target.checked) {
      setSelectedCoupons(currentItems.map((coupon) => coupon.id))
    } else {
      setSelectedCoupons([])
    }
  }

  const bulkDelete = () => {
    setCoupons(coupons.filter((coupon) => !selectedCoupons.includes(coupon.id)))
    setSelectedCoupons([])
  }

  const handlePageChange = (page) => {
    if (page >= 1 && page <= filteredTotalPages) {
      setCurrentPage(page)
    }
  }

  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    if (filteredTotalPages <= maxVisiblePages) {
      for (let i = 1; i <= filteredTotalPages; i++) {
        pages.push(i)
      }
    } else {
      let startPage = Math.max(1, currentPage - 2)
      let endPage = Math.min(filteredTotalPages, currentPage + 2)
      if (currentPage <= 3) {
        endPage = maxVisiblePages
      } else if (currentPage >= filteredTotalPages - 2) {
        startPage = filteredTotalPages - maxVisiblePages + 1
      }
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }
    }
    return pages
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Coupons</h1>
          <div className="flex justify-between items-center mb-6 p-4 bg-white rounded">
            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-transparent border border-gray-300 px-4 py-2  text-sm hover:bg-gray-100">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button className="flex items-center gap-2 bg-transparent border border-gray-300 px-4 py-2  text-sm hover:bg-gray-100">
                <Upload className="w-4 h-4" />
                Import
              </button>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <button
                  className="flex items-center gap-2 bg-transparent border border-gray-300 px-4 py-2  rounded text-sm hover:bg-gray-100"
                  onClick={() => setIsBulkActionOpen(!isBulkActionOpen)}
                >
                  Bulk Action
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                {isBulkActionOpen && (
                  <div className="absolute right-0 z-10 mt-1 w-40 origin-top-right rounded-md border border-gray-200 bg-white shadow-lg">
                    <button className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100">
                      Edit Selected
                    </button>
                    <button className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100" onClick={bulkDelete}>
                      Delete Selected
                    </button>
                  </div>
                )}
              </div>
              <button
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2   text-sm"
                onClick={bulkDelete}
                disabled={selectedCoupons.length === 0}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
              <button
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2   text-sm"
                onClick={() => {
                  setEditingCoupon(null)
                  setIsModalOpen(true)
                }}
              >
                <Plus className="w-4 h-4" />
                Add Coupon
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6 p-4 bg-white rounded">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by coupon code/name"
              className="pl-10 pr-3 py-2 border border-gray-300 rounded w-full bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="w-[180px] px-3 py-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Expired">Expired</option>
          </select>
          <select
            className="w-[180px] px-3 py-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            value={selectedPublished}
            onChange={(e) => setSelectedPublished(e.target.value)}
          >
            <option value="all">All Visibility</option>
            <option value="published">Published</option>
            <option value="unpublished">Unpublished</option>
          </select>
          <button
            className="px-3 py-2 border border-gray-300  text-sm bg-transparent hover:bg-gray-100"
            onClick={() => {
              setSearchTerm("")
              setSelectedStatus("all")
              setSelectedPublished("all")
              setCurrentPage(1)
            }}
          >
            Reset
          </button>
        </div>

        {/* Table */}
        <div className="w-full overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg mb-8">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:text-gray-400 dark:bg-gray-800">
                <tr>
                  <th
                    scope="col"
                    className="w-[40px] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      checked={selectedCoupons.length === currentItems.length && currentItems.length > 0}
                      onChange={handleSelectAllCoupons}
                    />
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Campaign Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Code
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Discount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Published
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Start Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    End Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.length > 0 ? (
                  currentItems.map((coupon) => (
                    <tr key={coupon.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          checked={selectedCoupons.includes(coupon.id)}
                          onChange={() => handleSelectCoupon(coupon.id)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm">
                          <img
                            src={coupon.image || "/placeholder.svg"}
                            alt={coupon.campaignName}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                          {coupon.campaignName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{coupon.code}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{coupon.discount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={coupon.published}
                            onChange={() => togglePublished(coupon.id)}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{coupon.startDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{coupon.endDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            coupon.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {coupon.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Tippy content="Edit">
                            <button
                              className="h-8 w-8 p-0 hover:bg-gray-100 rounded inline-flex items-center justify-center"
                              onClick={() => handleEditClick(coupon)}
                            >
                              <Pencil className="w-4 h-4 text-gray-400" />
                            </button>
                          </Tippy>
                          <Tippy content="Delete">
                            <button
                              className="h-8 w-8 p-0 hover:bg-gray-100 rounded inline-flex items-center justify-center"
                              onClick={() => deleteCoupon(coupon.id)}
                            >
                              <Trash2 className="w-4 h-4 text-gray-400" />
                            </button>
                          </Tippy>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-6 py-4 text-center text-sm text-gray-500">
                      No coupons found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4">
            <div className="text-sm text-gray-500">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredTotalItems)} of {filteredTotalItems}{" "}
              results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    currentPage === page
                      ? "z-10 bg-emerald-50 border-emerald-500 text-emerald-600"
                      : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === filteredTotalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Add/Edit Coupon Modal */}
        {isModalOpen && (
          <AddCouponModal
            onClose={() => {
              setIsModalOpen(false)
              setEditingCoupon(null)
            }}
            onAdd={handleAddCoupon}
            coupon={editingCoupon}
          />
        )}
      </div>
    </div>
  )
}
