import { useState } from "react";
import { Upload, Download, Trash2, Plus, Search, Pencil, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import AddAttributeModal from "./AddAttributeModal";
import EditAttributeModal from "./EditAttributeModal";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useNavigate } from "react-router-dom";
export default function AttributesPage() {
  const navigate = useNavigate();
  const [attributes, setAttributes] = useState([
    {
      id: "81B2",
      name: "Color",
      displayName: "Color",
      option: "Dropdown",
      published: true,
      variants: ["Red", "Blue", "Green"]
    },
    {
      id: "81B6",
      name: "Size",
      displayName: "Size",
      option: "Radio",
      published: true,
      variants: ["S", "M", "L"]
    },
    {
      id: "EA1B",
      name: "test",
      displayName: "test",
      option: "Radio",
      published: true,
      variants: []
    },
    {
      id: "B977",
      name: "tets",
      displayName: "ui",
      option: "Radio",
      published: false,
      variants: []
    },
    {
      id: "467D",
      name: "blue",
      displayName: "color",
      option: "Dropdown",
      published: false,
      variants: []
    },
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentAttribute, setCurrentAttribute] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState("all");
  const [selectedPublished, setSelectedPublished] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [isBulkActionOpen, setIsBulkActionOpen] = useState(false);

  const handleAddAttribute = (newAttribute) => {
    setAttributes([...attributes, newAttribute]);
  };

  const handleEditAttribute = (attribute) => {
    setCurrentAttribute(attribute);
    setIsEditModalOpen(true);
  };

  const handleUpdateAttribute = (updatedAttribute) => {
    setAttributes(attributes.map(attr => 
      attr.id === updatedAttribute.id ? updatedAttribute : attr
    ));
    setIsEditModalOpen(false);
  };

  const filteredAttributes = attributes
    .filter((attribute) => {
      const matchesSearch = attribute.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesOption = 
        selectedOption === "all" || attribute.option === selectedOption;
      const matchesPublished =
        selectedPublished === "all" ||
        (selectedPublished === "published" && attribute.published) ||
        (selectedPublished === "unpublished" && !attribute.published);

      return matchesSearch && matchesOption && matchesPublished;
    });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAttributes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAttributes.length / itemsPerPage);

  const togglePublished = (id) => {
    setAttributes(
      attributes.map((attribute) =>
        attribute.id === id
          ? { ...attribute, published: !attribute.published }
          : attribute
      )
    );
  };

  const deleteAttribute = (id) => {
    setAttributes(attributes.filter((attribute) => attribute.id !== id));
    setSelectedAttributes(
      selectedAttributes.filter((attributeId) => attributeId !== id)
    );
  };

  const handleSelectAttribute = (id) => {
    setSelectedAttributes((prev) =>
      prev.includes(id)
        ? prev.filter((attributeId) => attributeId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAllAttributes = (e) => {
    if (e.target.checked) {
      setSelectedAttributes(currentItems.map((attribute) => attribute.id));
    } else {
      setSelectedAttributes([]);
    }
  };

  const bulkDelete = () => {
    setAttributes(
      attributes.filter((attribute) => !selectedAttributes.includes(attribute.id))
    );
    setSelectedAttributes([]);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto ">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Attributes</h1>

          <div className="flex justify-between items-center mb-6 p-4 bg-white rounded">
            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-transparent border border-gray-300 px-4 py-2 rounded text-sm hover:bg-gray-100">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button className="flex items-center gap-2 bg-transparent border border-gray-300 px-4 py-2 rounded text-sm hover:bg-gray-100">
                <Upload className="w-4 h-4" />
                Import
              </button>
            </div>

            <div className="flex gap-3">
              <div className="relative">
                <button
                  className="flex items-center gap-2 bg-transparent border border-gray-300 px-4 py-2 rounded text-sm hover:bg-gray-100"
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
                    <button
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                      onClick={bulkDelete}
                    >
                      Delete Selected
                    </button>
                  </div>
                )}
              </div>
              <button
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
                onClick={bulkDelete}
                disabled={selectedAttributes.length === 0}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
              <button
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-sm"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus className="w-4 h-4" />
                Add Attribute
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
              placeholder="Search by attribute name"
              className="pl-10 pr-3 py-2 border border-gray-300 rounded w-full bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="w-[180px] px-3 py-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <option value="all">All Options</option>
            <option value="Dropdown">Dropdown</option>
            <option value="Radio">Radio</option>
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
            className="px-3 py-2 border border-gray-300 rounded text-sm bg-transparent hover:bg-gray-100"
            onClick={() => {
              setSearchTerm("");
              setSelectedOption("all");
              setSelectedPublished("all");
              setCurrentPage(1);
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
                      checked={
                        selectedAttributes.length === currentItems.length &&
                        currentItems.length > 0
                      }
                      onChange={handleSelectAllAttributes}
                    />
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    ID
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
                    Display Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Option
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
                    Values
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
                  currentItems.map((attribute) => (
                    <tr key={attribute.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          checked={selectedAttributes.includes(attribute.id)}
                          onChange={() => handleSelectAttribute(attribute.id)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {attribute.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {attribute.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {attribute.displayName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {attribute.option}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={attribute.published}
                            onChange={() => togglePublished(attribute.id)}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex flex-wrap gap-1">
                          <Tippy content="Edit Values">
                          <button 
                            className="h-8 w-8 p-0 hover:bg-gray-100 rounded inline-flex items-center justify-center"
                             onClick={() => navigate(`/catalog/attributes/${attribute.id}`)}
                          >
                            <Pencil className="w-4 h-4 text-gray-400" />
                          </button>
                          </Tippy>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                        <Tippy content="Edit">
                          <button 
                            className="h-8 w-8 p-0 hover:bg-gray-100 rounded inline-flex items-center justify-center"
                            onClick={() => handleEditAttribute(attribute)}
                          >
                            <Pencil className="w-4 h-4 text-gray-400" />
                          </button>
                          </Tippy>
                          <Tippy content="Delete">
                          <button
                            className="h-8 w-8 p-0 hover:bg-gray-100 rounded inline-flex items-center justify-center"
                            onClick={() => deleteAttribute(attribute.id)}
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
                    <td
                      colSpan="8"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No attributes found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4">
            <div className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(indexOfLastItem, filteredAttributes.length)}
              </span>{" "}
              of <span className="font-medium">{filteredAttributes.length}</span>{" "}
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
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Add Attribute Modal */}
        {isModalOpen && (
          <AddAttributeModal 
            onClose={() => setIsModalOpen(false)} 
            onAdd={handleAddAttribute}
          />
        )}

        {/* Edit Attribute Modal */}
        {isEditModalOpen && (
          <EditAttributeModal
            attribute={currentAttribute}
            onClose={() => setIsEditModalOpen(false)}
            onUpdate={handleUpdateAttribute}
          />
        )}
      </div>
    </div>
  );
}