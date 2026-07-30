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
  FiRefreshCw
} from "react-icons/fi";
import GlobalTable from "../../common/GlobalTable";
import TableActionButton from "../../common/TableActionButton";

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
    } catch {
      toast.error("Failed to fetch contact details");
    }
  };

  useEffect(() => {
    fetchContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm]);

  const contactColumns = [
    {
      key: "name",
      header: "Name",
      render: (contact) => `${contact.firstName} ${contact.lastName}`,
    },
    {
      key: "email",
      header: "Email",
    },
    {
      key: "phone",
      header: "Phone",
    },
    {
      key: "message",
      header: "Message",
      cellClassName: "max-w-xs truncate",
    },
    {
      key: "actions",
      header: "Actions",
      render: (contact) => (
        <TableActionButton
          onClick={() => fetchContactById(contact._id)}
          tone="view"
          title="View"
        >
          <FiEye />
        </TableActionButton>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <div className="max-w-7xl mx-auto">

        <div>

          {/* UI-only: standardized page header; contact-message logic is unchanged. */}
          <div className="mb-6 flex flex-col gap-4 rounded-xl bg-gradient-to-r from-[#204972] to-[#87b105] p-6 text-white shadow-lg sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="flex items-center text-2xl font-bold">
                <FiMessageSquare className="mr-2" /> Contact Messages
              </h2>
              <p className="mt-1 opacity-90">View and manage customer enquiries</p>
            </div>
            {/* UI-only: place the existing refresh action at the header's right edge. */}
            <button
              onClick={fetchContacts}
              className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#204972] px-4 py-2 text-white shadow-sm transition hover:bg-[#183654]"
            >
              <FiRefreshCw /> Refresh
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">

            {/* Table */}
            <GlobalTable
              title={`Messages (${contacts.length})`}
              filters={{
                searchValue: searchTerm,
                onSearchChange: (value) => {
                  setSearchTerm(value);
                  setCurrentPage(1);
                },
                searchPlaceholder: "Search contacts...",
                exportData: contacts,
                exportColumns: [
                  { key: "firstName", header: "First Name" },
                  { key: "lastName", header: "Last Name" },
                  { key: "email", header: "Email" },
                  { key: "phone", header: "Phone" },
                  { key: "message", header: "Message" },
                  {
                    key: "createdAt",
                    header: "Created At",
                    value: (contact) =>
                      contact.createdAt ? new Date(contact.createdAt).toLocaleString() : "",
                  },
                ],
                exportFileName: "contact-messages.csv",
              }}
              columns={contactColumns}
              data={contacts}
              loading={loading}
              emptyText="No contacts found"
              loadingText="Loading contacts..."
              getRowKey={(contact) => contact._id}
              pagination={{
                currentPage,
                totalPages,
                onPageChange: setCurrentPage,
              }}
            />

          </div>
        </div>
      </div>

      {/* Modal */}

      {selectedContact && (

        <div className="fixed inset-0 z-50 bg-gray-900/20 backdrop-blur-sm flex justify-center items-center p-4">

          {/* UI-only: Contact Details overlay now follows the shared PV Classes theme. */}
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">

            <div className="flex items-center justify-between bg-gradient-to-r from-[#204972] to-[#87b105] p-5 text-white">
              <h3 className="flex items-center text-lg font-bold"><FiMessageSquare className="mr-2" /> Contact Details</h3>

              <button onClick={() => setSelectedContact(null)} className="rounded-full p-2 text-white/80 transition hover:bg-white/15 hover:text-white" aria-label="Close contact details">
                <FiX />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-3">
                <p className="flex items-center gap-3 rounded-lg bg-[#204972]/[0.04] p-3 text-slate-700"><FiUser className="shrink-0 text-[#204972]" />{selectedContact.firstName} {selectedContact.lastName}</p>
                <p className="flex items-center gap-3 rounded-lg bg-[#204972]/[0.04] p-3 text-slate-700"><FiMail className="shrink-0 text-[#204972]" />{selectedContact.email}</p>
                <p className="flex items-center gap-3 rounded-lg bg-[#204972]/[0.04] p-3 text-slate-700"><FiPhone className="shrink-0 text-[#204972]" />{selectedContact.phone}</p>
                <p className="flex items-center gap-3 rounded-lg bg-[#204972]/[0.04] p-3 text-slate-700"><FiCalendar className="shrink-0 text-[#204972]" />{new Date(selectedContact.createdAt).toLocaleString()}</p>
              </div>

              <div className="mt-4 rounded-xl border border-[#87b105]/20 bg-[#87b105]/[0.07] p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#527000]">Message</p>
                <p className="text-sm leading-6 text-slate-700">{selectedContact.message}</p>
              </div>

              <div className="mt-6 flex justify-end">
                <button onClick={() => setSelectedContact(null)} className="rounded-lg px-5 py-2 text-sm font-medium text-white transition form-cancel-button">Close</button>
              </div>
            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default ContactList;
