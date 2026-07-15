import {
  Download,
  Edit,
  Eye,
  Trash2,
} from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import EditCustomerModal from "./EditCustomerModal";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { saveAs } from "file-saver";
import GlobalTable from "../../common/GlobalTable";

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

  const customerColumns = [
    {
      key: "srNo",
      header: "Sr.No",
      render: (_customer, index) => (currentPage - 1) * limit + index + 1,
    },
    {
      key: "name",
      header: "Name",
      cellClassName: "text-blue-600",
    },
    {
      key: "phone",
      header: "Phone",
      render: (customer) => customer.phone || "-",
    },
    {
      key: "email",
      header: "Email",
      cellClassName: "text-blue-600",
    },
    {
      key: "createdAt",
      header: "Joining Date",
      render: (customer) =>
        customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : "-",
    },
    {
      key: "actions",
      header: "Actions",
      render: (customer) => (
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
      ),
    },
  ];

  return (
    <>
      <ToastContainer />
      <div className=" bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            {/* UI-only: standardized page header; customer logic is unchanged. */}
            <div data-page-icon data-icon-symbol="♙" className="bg-gradient-to-r from-[#204972] to-[#87b105] rounded-xl shadow-lg mb-6 p-6 text-white">
              <h1 className="text-2xl font-bold">Customers</h1>
              <p className="mt-1 opacity-90">View and manage customer information</p>
            </div>
            <GlobalTable
              title={`Customers (${totalCustomers})`}
              actions={
                <>
                  <button
                    onClick={handleExport}
                    className="flex items-center gap-2 bg-transparent border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-8 py-2 border border-gray-300 text-sm bg-transparent hover:bg-gray-100 cursor-pointer"
                  >
                    Reset
                  </button>
                </>
              }
              filters={{
                searchValue: search,
                onSearchChange: (value) => {
                  setSearch(value);
                  setCurrentPage(1);
                },
                searchPlaceholder: "Search by name/email/phone",
              }}
              columns={customerColumns}
              data={customers}
              emptyText="No customers found."
              getRowKey={(customer) => customer._id}
              pagination={{
                currentPage,
                totalPages,
                onPageChange: setCurrentPage,
                rightContent: (
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(currentPage - 1) * limit + 1}</span> to{" "}
                    <span className="font-medium">{Math.min(currentPage * limit, totalCustomers)}</span> of{" "}
                    <span className="font-medium">{totalCustomers}</span> results
                  </p>
                ),
              }}
            />
            {isModalOpen && (
              <EditCustomerModal
                onClose={() => {
                  setIsModalOpen(false);
                  setEditingCustomer(null);
                }}
                // onAdd={(updatedCustomer) => {
                //   setIsModalOpen(false);
                // }}
                 onAdd={() => {
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
