import {
  Download,
  Edit,
  Eye,
  Search,
  Trash2,
  Upload,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import EditCustomerModal from "./EditCustomerModal";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { saveAs } from "file-saver";

export default function Customer() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const limit = 10;
  const url = import.meta.env.VITE_API_SERVER_URL;
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(`${url}/api/users`, {
          params: {
            page: currentPage,
            limit,
            search: search.trim(),
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setCustomers(response.data.users);
        setTotalPages(response.data.totalPages);
        setTotalCustomers(response.data.total);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, [url, currentPage, search]);
  const getPageNumbers = (currentPage, totalPages) => {
    const delta = 2;
    const range = [];

    for (
      let i = Math.max(1, currentPage - delta);
      i <= Math.min(totalPages, currentPage + delta);
      i++
    ) {
      range.push(i);
    }
    // Generate page numbers for pagination
    const getPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5;

      if (totalPages <= maxVisiblePages) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);

        if (currentPage <= 3) {
          endPage = maxVisiblePages;
        } else if (currentPage >= totalPages - 2) {
          startPage = totalPages - maxVisiblePages + 1;
        }

        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }
      }

      return pages;
    };

    return range;
  };
  const handleReset = () => {
    setSearch("");
    setCurrentPage(1);
  };
  const customerDelete = async (e, id) => {
    e.preventDefault();
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this customer?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      try {
        const response = await axios.delete(`${url}/api/users/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.status === 200) {
          toast.success("Customer deleted successfully");
          setCustomers(customers.filter((customer) => customer._id !== id));
          setTotalCustomers(totalCustomers - 1);
        }
      } catch (error) {
        console.error("Error deleting customer:", error);
      }
    }
  };
  const handleExport = async () => {
    try {
      const response = await axios.get(`${url}/api/users/export`, {
        params: {
          page: currentPage,
          limit,
          search: search.trim(),
        },
        responseType: "blob", // Important!
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const blob = new Blob([response.data], {
        type: "text/csv;charset=utf-8",
      });
      const timestamp = Date.now(); // Gives current time in milliseconds
      saveAs(blob, `users_${timestamp}.csv`);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className=" bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between">
              <h1 className="text-2xl font-semibold text-gray-900 mb-4">
                Customers
              </h1>
              <div className="flex gap-3 mb-6 mr-4">
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 bg-transparent border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
                {/* <button className="flex items-center gap-2 bg-transparent border border-gray-300 px-4 py-2  text-sm hover:bg-gray-100">
                  <Upload className="w-4 h-4" />
                  Import
                </button> */}
              </div>
            </div>
            <div className=" mb-6">
              <div className="flex gap-4 mb-6 bg-white p-4 rounded">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name/email/phone"
                    className="pl-10 pr-3 py-2 border border-gray-300 rounded w-full bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <button
                  onClick={handleReset} // This resets state (search, page, etc.)
                  className="px-8 py-2 border border-gray-300 text-sm bg-transparent hover:bg-gray-100 cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden border-gray-100">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Sr.No
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Phone
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Joining Date
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
                    {customers && customers.length > 0 ? (
                      customers.map((customer, index) => (
                        <tr key={customer._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {(currentPage - 1) * limit + index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                            {customer.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {customer.phone || "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                            {customer.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {customer.createdAt
                              ? new Date(
                                  customer.createdAt
                                ).toLocaleDateString()
                              : "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                              <Link to={`/customer/${customer.id}`}>
                                <button className="h-8 w-8 p-0 hover:bg-gray-100 rounded inline-flex items-center justify-center">
                                  <Eye className="w-4 h-4 text-gray-400" />
                                </button>
                              </Link>

                              <button
                                onClick={() => {
                                  setEditingCustomer(customer);
                                  setIsModalOpen(true);
                                }}
                                className="h-8 w-8 p-0 hover:bg-gray-100 rounded inline-flex items-center justify-center"
                              >
                                <Edit className="w-4 h-4 text-gray-400" />
                              </button>
                              <button
                                onClick={(e) => customerDelete(e, customer._id)}
                                className="h-8 w-8 p-0 hover:bg-gray-100 rounded inline-flex items-center justify-center"
                              >
                                <Trash2 className="w-4 h-4 text-gray-400" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-6 py-4 text-center text-sm text-gray-500"
                        >
                          No customers found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{" "}
                      <span className="font-medium">
                        {(currentPage - 1) * limit + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {Math.min(currentPage * limit, totalCustomers)}
                      </span>{" "}
                      of <span className="font-medium">{totalCustomers}</span>{" "}
                      results
                    </p>
                  </div>

                  <div>
                    <nav
                      className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                      aria-label="Pagination"
                    >
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                      </button>

                      {getPageNumbers(currentPage, totalPages).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
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
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(totalPages, prev + 1)
                          )
                        }
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
            </div>

            {/* {filteredCustomers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No customers found matching your search.
                </p>
              </div>
            )} */}
            {isModalOpen && (
              <EditCustomerModal
                onClose={() => {
                  setIsModalOpen(false);
                  setEditingCustomer(null);
                }}
                onAdd={(updatedCustomer) => {
                  setIsModalOpen(false);
                }}
                onUpdateSuccess={(message) => {
                  toast.success(message || "Customer updated successfully");
                }}
                initialData={editingCustomer}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
