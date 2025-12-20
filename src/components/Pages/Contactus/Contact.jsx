// // src/components/Admin/Contacts/ContactList.jsx

// import React, { useEffect, useState } from "react";
// import axiosInstance from "../../../config/AxiosInstance";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// function ContactList() {
//   const [contacts, setContacts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedContact, setSelectedContact] = useState(null);

//   // Fetch all contacts
//   const fetchContacts = async () => {
//     setLoading(true);
//     try {
//       const res = await axiosInstance.get("/contacts");
//       setContacts(res.data);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to fetch contacts");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch single contact by ID
//   const fetchContactById = async (id) => {
//     try {
//       const res = await axiosInstance.get(`/contacts/contact/${id}`);
//       setSelectedContact(res.data);
//       toast.success("Contact fetched successfully");
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to fetch contact details");
//     }
//   };

//   useEffect(() => {
//     fetchContacts();
//   }, []);

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">Contact Messages</h2>

//       {loading ? (
//         <p>Loading contacts...</p>
//       ) : (
//         <table className="w-full border border-gray-300 text-left">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="border p-2">#</th>
//               <th className="border p-2">Name</th>
//               <th className="border p-2">Email</th>
//               <th className="border p-2">Phone</th>
//               <th className="border p-2">Message</th>
//               <th className="border p-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {contacts.length > 0 ? (
//               contacts.map((contact, index) => (
//                 <tr key={contact._id}>
//                   <td className="border p-2">{index + 1}</td>
//                   <td className="border p-2">
//                     {contact.firstName} {contact.lastName}
//                   </td>
//                   <td className="border p-2">{contact.email}</td>
//                   <td className="border p-2">{contact.phone}</td>
//                   <td className="border p-2">{contact.message}</td>
//                   <td className="border p-2">
//                     <button
//                       onClick={() => fetchContactById(contact._id)}
//                       className="px-3 py-1 bg-blue-500 text-white rounded"
//                     >
//                       View
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="6" className="border p-2 text-center">
//                   No contact messages found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       )}

//       {/* Modal for Single Contact */}
//       {selectedContact && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white p-4 rounded shadow-lg max-w-md w-full">
//             <h3 className="text-lg font-bold mb-2">Contact Details</h3>
//             <p><strong>Name:</strong> {selectedContact.firstName} {selectedContact.lastName}</p>
//             <p><strong>Email:</strong> {selectedContact.email}</p>
//             <p><strong>Phone:</strong> {selectedContact.phone}</p>
//             <p><strong>Message:</strong> {selectedContact.message}</p>
//             <p><strong>Created:</strong> {new Date(selectedContact.createdAt).toLocaleString()}</p>
//             <div className="text-right mt-3">
//               <button
//                 onClick={() => setSelectedContact(null)}
//                 className="px-3 py-1 bg-red-500 text-white rounded"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ContactList;



// src/components/Admin/Contacts/ContactList.jsx

import React, { useEffect, useState } from "react";
import axiosInstance from "../../../config/AxiosInstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiEye, FiX, FiMessageSquare, FiUser, FiMail, FiPhone, FiCalendar, FiChevronLeft, FiChevronRight } from "react-icons/fi";

function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all contacts
  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/contacts");
      setContacts(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch contacts");
    } finally {
      setLoading(false);
    }
  };

  // Fetch single contact by ID
  const fetchContactById = async (id) => {
    try {
      const res = await axiosInstance.get(`/contacts/contact/${id}`);
      setSelectedContact(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch contact details");
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Filter contacts based on search term
  const filteredContacts = contacts.filter(contact => 
    contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm)
  );

  // Get current contacts for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentContacts = filteredContacts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
            <h2 className="text-2xl font-bold flex items-center">
              <FiMessageSquare className="mr-2" /> Contact Messages
            </h2>
            <p className="mt-1 opacity-90">Manage and review all customer inquiries</p>
          </div>

          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="relative w-64">
                <input
                  type="text"
                  placeholder="Search contacts..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
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
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg flex items-center transition-colors"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto rounded-lg shadow">
                  <table className="w-full text-left">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Phone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Message Preview</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentContacts.length > 0 ? (
                        currentContacts.map((contact) => (
                          <tr key={contact._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                  <span className="font-medium text-emerald-800">
                                    {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                                  </span>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {contact.firstName} {contact.lastName}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{contact.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{contact.phone}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-500 max-w-xs truncate">
                                {contact.message}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => fetchContactById(contact._id)}
                                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg flex items-center transition-colors"
                              >
                                <FiEye className="mr-1" /> View
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                            No contact messages found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {filteredContacts.length > itemsPerPage && (
                  <div className="flex items-center justify-between mt-6 px-4">
                    <div className="text-sm text-gray-700">
                      Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                      <span className="font-medium">
                        {Math.min(indexOfLastItem, filteredContacts.length)}
                      </span>{" "}
                      of <span className="font-medium">{filteredContacts.length}</span> results
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded-lg flex items-center ${currentPage === 1 
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                          : "bg-emerald-500 text-white hover:bg-emerald-600"}`}
                      >
                        <FiChevronLeft className="mr-1" /> Previous
                      </button>
                      <button
                        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded-lg flex items-center ${currentPage === totalPages 
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                          : "bg-emerald-500 text-white hover:bg-emerald-600"}`}
                      >
                        Next <FiChevronRight className="ml-1" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Single Contact */}
      {selectedContact && (
        <div className="fixed inset-0 bg-gray-50 bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 text-white">
              <h3 className="text-lg font-bold flex items-center">
                <FiUser className="mr-2" /> Contact Details
              </h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
                  <span className="font-medium text-emerald-800 text-lg">
                    {selectedContact.firstName.charAt(0)}{selectedContact.lastName.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold">
                    {selectedContact.firstName} {selectedContact.lastName}
                  </h4>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <FiMail className="text-emerald-500 mr-2" />
                  <span>{selectedContact.email}</span>
                </div>
                
                <div className="flex items-center text-gray-700">
                  <FiPhone className="text-emerald-500 mr-2" />
                  <span>{selectedContact.phone}</span>
                </div>
                
                <div className="flex items-center text-gray-700">
                  <FiCalendar className="text-emerald-500 mr-2" />
                  <span>{new Date(selectedContact.createdAt).toLocaleString()}</span>
                </div>
                
                <div className="pt-3">
                  <div className="flex items-start">
                    <FiMessageSquare className="text-emerald-500 mr-2 mt-1" />
                    <div>
                      <p className="font-medium text-gray-700 mb-1">Message:</p>
                      <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                        {selectedContact.message}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-100 px-6 py-3 flex justify-end">
              <button
                onClick={() => setSelectedContact(null)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg flex items-center transition-colors"
              >
                <FiX className="mr-1" /> Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContactList;