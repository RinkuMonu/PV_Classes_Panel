import React, { useEffect, useState } from "react";
import axiosInstance from "../../../config/AxiosInstance";
import { toast } from "react-toastify";
import {
  FiEye,
  FiX,
  FiMessageSquare,
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi";

function ContactList() {

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const limit = 10;

  // Fetch contacts from backend
  const fetchContacts = async () => {
    setLoading(true);

    try {
      const res = await axiosInstance.get(
        `/contacts?page=${currentPage}&limit=${limit}&search=${searchTerm}`
      );

      setContacts(res.data.data);
      setTotalPages(res.data.pagination.totalPages);

    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch contacts");
    } finally {
      setLoading(false);
    }
  };

  // Fetch single contact
  const fetchContactById = async (id) => {
    try {
      const res = await axiosInstance.get(`/contacts/contact/${id}`);
      setSelectedContact(res.data);
    } catch (err) {
      toast.error("Failed to fetch contact details");
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [currentPage, searchTerm]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <div className="max-w-7xl mx-auto">

        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">

          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
            <h2 className="text-2xl font-bold flex items-center">
              <FiMessageSquare className="mr-2" /> Contact Messages
            </h2>
          </div>

          <div className="p-6">

            {/* Search */}
            <div className="flex justify-between items-center mb-6">

              <div className="relative w-64">

                <input
                  type="text"
                  placeholder="Search contacts..."
                  className="pl-10 pr-4 py-2 w-full border rounded-lg"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />

                <div className="absolute left-3 top-2.5 text-gray-400">
                  <FiUser size={18} />
                </div>

              </div>

              <button
                onClick={fetchContacts}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg"
              >
                Refresh
              </button>

            </div>

            {/* Table */}

            {loading ? (
              <div className="text-center py-10">Loading...</div>
            ) : (

              <>
                <div className="overflow-x-auto">

                  <table className="w-full text-left">

                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-xs">Name</th>
                        <th className="px-6 py-3 text-xs">Email</th>
                        <th className="px-6 py-3 text-xs">Phone</th>
                        <th className="px-6 py-3 text-xs">Message</th>
                        <th className="px-6 py-3 text-xs">Actions</th>
                      </tr>
                    </thead>

                    <tbody>

                      {contacts.map((contact) => (

                        <tr key={contact._id} className="border-b">

                          <td className="px-6 py-4">
                            {contact.firstName} {contact.lastName}
                          </td>

                          <td className="px-6 py-4">{contact.email}</td>

                          <td className="px-6 py-4">{contact.phone}</td>

                          <td className="px-6 py-4 max-w-xs truncate">
                            {contact.message}
                          </td>

                          <td className="px-6 py-4">

                            <button
                              onClick={() => fetchContactById(contact._id)}
                              className="px-3 py-1 bg-emerald-500 text-white rounded"
                            >
                              <FiEye />
                            </button>

                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

                {/* Pagination */}

                <div className="flex justify-between items-center mt-6">

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-emerald-500 text-white rounded"
                  >
                    <FiChevronLeft />
                  </button>

                  <span>
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(prev + 1, totalPages)
                      )
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-emerald-500 text-white rounded"
                  >
                    <FiChevronRight />
                  </button>

                </div>

              </>
            )}

          </div>
        </div>
      </div>

      {/* Modal */}

      {selectedContact && (

        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

          <div className="bg-white p-6 rounded-lg max-w-md w-full">

            <div className="flex justify-between mb-4">
              <h3 className="font-bold">Contact Details</h3>

              <button onClick={() => setSelectedContact(null)}>
                <FiX />
              </button>
            </div>

            <p>
              <FiUser className="inline mr-2" />
              {selectedContact.firstName} {selectedContact.lastName}
            </p>

            <p>
              <FiMail className="inline mr-2" />
              {selectedContact.email}
            </p>

            <p>
              <FiPhone className="inline mr-2" />
              {selectedContact.phone}
            </p>

            <p>
              <FiCalendar className="inline mr-2" />
              {new Date(selectedContact.createdAt).toLocaleString()}
            </p>

            <div className="bg-gray-100 p-3 mt-3 rounded">
              {selectedContact.message}
            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default ContactList;