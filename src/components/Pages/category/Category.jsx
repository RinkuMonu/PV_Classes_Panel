"use client";
import { useEffect, useState } from "react";
import {
  Search,
  Pencil,
  Trash2,
  Plus,
  Upload,
  Download,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import AddCategoryModal from "./AddCategoryModal";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import EditCategoryModal from "./EditCategoryModal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../config/AxiosInstance";
import Swal from "sweetalert2";
import { Link } from "lucide-react";
// Mock data - in a real app, this would come from an API
const initialCategories = [
  {
    id: "A5F5",
    icon: "https://images.unsplash.com/photo-1600185365522-34902953931d", // skincare
    name: "Woo",
    description: "Woo",
    published: true,
    children: [
      {
        id: "A5F5-1",
        icon: "https://images.unsplash.com/photo-1618489914471-6e7e060d731d", // gel
        name: "Gel",
        description: "Gel for skin care",
        published: true,
      },
      {
        id: "A5F5-2",
        icon: "https://images.unsplash.com/photo-1588776814546-ec7ee0dcb5da", // cream
        name: "Cream",
        description: "Skin cream",
        published: true,
      },
    ],
  },
  {
    id: "0C24",
    icon: "https://images.unsplash.com/photo-1562967916-eb82221dfb36", // fish & meat
    name: "Fish & Meat",
    description: "Fish & Meat",
    published: true,
    children: [
      {
        id: "0C24-1",
        icon: "https://images.unsplash.com/photo-1553621042-f6e147245754", // fish
        name: "Fish",
        description: "Fresh fish",
        published: true,
      },
      {
        id: "0C24-2",
        icon: "https://images.unsplash.com/photo-1551183053-bf91a1d81141", // meat
        name: "Meat",
        description: "Fresh meat",
        published: true,
      },
      {
        id: "0C24-3",
        icon: "https://images.unsplash.com/photo-1617134820884-6f82f3b9f197", // shrimp
        name: "Shrimp",
        description: "Fresh shrimp",
        published: true,
      },
    ],
  },
  {
    id: "B771",
    icon: "https://images.unsplash.com/photo-1551024601-bec78aea704b", // beverages
    name: "Beverages",
    description: "Drinks and beverages",
    published: true,
    children: [
      {
        id: "B771-1",
        icon: "https://images.unsplash.com/photo-1600256707283-0e64eb13e3fc", // juice
        name: "Juice",
        description: "Fruit juice",
        published: true,
      },
      {
        id: "B771-2",
        icon: "https://images.unsplash.com/photo-1550565090-46b7f13c6c28", // soda
        name: "Soda",
        description: "Soft drinks",
        published: true,
      },
    ],
  },
  {
    id: "C842",
    icon: "https://images.unsplash.com/photo-1577801599403-03f43b0f1c99", // bakery
    name: "Bakery",
    description: "Freshly baked goods",
    published: true,
    children: [
      {
        id: "C842-1",
        icon: "https://images.unsplash.com/photo-1608198093002-ad4e005484b9", // bread
        name: "Bread",
        description: "Whole grain bread",
        published: true,
      },
      {
        id: "C842-2",
        icon: "https://images.unsplash.com/photo-1589308078053-189d48f81e4e", // croissant
        name: "Croissant",
        description: "Buttery croissant",
        published: true,
      },
    ],
  },
  {
    id: "D963",
    icon: "https://images.unsplash.com/photo-1580910051074-c03d287eab39", // dairy
    name: "Dairy",
    description: "Milk and dairy products",
    published: true,
    children: [
      {
        id: "D963-1",
        icon: "https://images.unsplash.com/photo-1582560471849-c09d95e5f08d", // cheese
        name: "Cheese",
        description: "Cheddar cheese",
        published: true,
      },
    ],
  },
];

export default function Category() {
  const [categories, setCategories] = useState(initialCategories);

  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [showAll, setShowAll] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showUpdateDrawer, setShowUpdateDrawer] = useState(false);
  const [filterName, setFilterName] = useState("");
  const navigate = useNavigate();
  const itemsPerPage = 10;
  const [categorie, setCategorie] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Filter categories based on search term
  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCategories.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  // Handle select all categories
  const handleSelectAll = (checked) => {
    if (checked) {
      const allIds = new Set(
        currentItems.flatMap((cat) => [
          cat.id,
          ...(cat.children || []).map((c) => c.id),
        ])
      );
      setSelectedCategories(allIds);
    } else {
      setSelectedCategories(new Set());
    }
  };

  // Toggle selection for a single category
  const handleSelectCategory = (id, checked) => {
    const newSelection = new Set(selectedCategories);
    checked ? newSelection.add(id) : newSelection.delete(id);
    setSelectedCategories(newSelection);
  };

  // Toggle published status
  const togglePublished = (id, isParent) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === id && isParent) {
          return { ...cat, published: !cat.published };
        }
        if (cat.children) {
          return {
            ...cat,
            children: cat.children.map((child) =>
              child.id === id
                ? { ...child, published: !child.published }
                : child
            ),
          };
        }
        return cat;
      })
    );
  };

  const handleDeleteCategory = async (categoryId) => {
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmResult.isConfirmed) {
      try {
        await axiosInstance.delete(`/categories/${categoryId}`);
        setCategories((prev) =>
          prev
            .filter((cat) => cat.id !== categoryId)
            .map((cat) => ({
              ...cat,
              children: cat.children
                ? cat.children.filter((child) => child.id !== categoryId)
                : [],
            }))
        );
        Swal.fire("Deleted!", "Category has been deleted.", "success");
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Something went wrong while deleting.", "error");
      }
    }
  };

  // Delete selected categories
  const deleteSelected = () => {
    setCategories((prev) =>
      prev
        .filter((cat) => !selectedCategories.has(cat.id))
        .map((cat) => ({
          ...cat,
          children: cat.children
            ? cat.children.filter((child) => !selectedCategories.has(child.id))
            : [],
        }))
    );
    setSelectedCategories(new Set());
  };

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

  // Update category
  const handleUpdateCategory = (updatedCategory) => {
    setCategories(prev =>
      prev.map(cat => {
        if (cat.id === updatedCategory.id) {
          return updatedCategory;
        }
        if (cat.children) {
          return {
            ...cat,
            children: cat.children.map(child =>
              child.id === updatedCategory.id ? updatedCategory : child
            )
          };
        }
        return cat;
      })
    );
    setShowUpdateDrawer(false);
  };

  // Check if all are selected
  const allSelected =
    selectedCategories.size ===
    currentItems.flatMap((cat) => [
      cat.id,
      ...(cat.children || []).map((c) => c.id),
    ]).length && currentItems.length > 0;

  // Check if some are selected (for indeterminate state)
  const someSelected = selectedCategories.size > 0 && !allSelected;

  const handleViewCategory = (categoryId) => {
    navigate(`/catalog/categories/${categoryId}`);
  };


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const queryParams = new URLSearchParams();
        queryParams.append("page", page);
        queryParams.append("limit", limit);
        if (filterName.trim()) {
          queryParams.append("name", filterName);
        }

        const response = await axiosInstance.get(`/categories/all?${queryParams.toString()}`);

        setCategorie(response?.data?.items || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [page, limit, filterName]);


  return (
    <div className="bg-gray-50 min-h-screen">
      {/* <input
        type="text"
        placeholder="Search by category name"
        value={filterName}
        onChange={(e) => setFilterName(e.target.value)}
        className="border px-3 py-1 rounded mb-4"
      /> */}


      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Category
          </h1>

          <div className="flex justify-between items-center mb-6 bg-white p-4 rounded">
            {/* Left side: Export and Import */}
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

            {/* Right side: Delete and Add Category */}
            <div className="flex gap-3">
              <button
                onClick={deleteSelected}
                disabled={selectedCategories.size === 0}
                className={`flex items-center gap-2 px-4 py-2  text-sm ${selectedCategories.size > 0
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2  text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Category
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="flex gap-4 mb-6 bg-white p-4 rounded">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by Category name"
              className="pl-10 pr-3 py-2 border border-gray-300 rounded w-full bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
            />
          </div>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2  text-sm">
            Filter
          </button>
          <button
            className="px-8 py-2 border border-gray-300  text-sm bg-transparent hover:bg-gray-100"
            onClick={() => {
              setSearchTerm("");
              setCurrentPage(1);
            }}
          >
            Reset
          </button>
        </div>

        {/* <div className="flex justify-end p-4 bg-gray-50">
          <div className="flex items-center gap-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={showAll}
                onChange={() => setShowAll(!showAll)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              <span className="ml-3 text-sm text-gray-900">Show All</span>
            </label>
          </div>
        </div> */}

        {/* Category Table */}
        <div className="w-full overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg mb-8">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:text-gray-400 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      ref={(input) => {
                        if (input) input.indeterminate = someSelected;
                      }}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ICON
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NAME
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    DESCRIPTION
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PUBLISHED
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categorie.length > 0 ? (
                  categorie.map((category) => (
                    <>
                      <tr key={category._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedCategories.has(category._id)}
                            onChange={(e) =>
                              handleSelectCategory(
                                category._id,
                                e.target.checked
                              )
                            }
                            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {category._id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img
                            src={category.icon}
                            alt={`${category.name} icon`}
                            className="w-6 h-6 rounded-full"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:underline cursor-pointer">
                          {category.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {category.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={category.published}
                              onChange={() =>
                                togglePublished(category._id, true)
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                          </label>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex justify-center gap-2">
                            <Tippy content="View">
                              <button onClick={() => handleViewCategory(category._id)} className="h-8 w-8 p-0 hover:bg-gray-100 rounded inline-flex items-center justify-center">
                                <Eye className="w-4 h-4 text-gray-400" />
                              </button>
                            </Tippy>
                            <Tippy content="Edit">
                              <button
                                className="h-8 w-8 p-0 hover:bg-gray-100 rounded inline-flex items-center justify-center"
                                onClick={() => {
                                  setSelectedCategory(category);
                                  setShowUpdateDrawer(true);
                                }}
                              >
                                <Pencil className="w-4 h-4 text-gray-400" />
                              </button>
                            </Tippy>
                            <Tippy content="Delete">
                              <button
                                onClick={() => handleDeleteCategory(category._id)}
                                className="h-8 w-8 p-0 hover:bg-red-100 rounded inline-flex items-center justify-center"
                              >
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </button>
                            </Tippy>
                          </div>
                        </td>
                      </tr>

                      {showAll &&
                        category.children &&
                        category.children.map((child) => (
                          <tr key={child.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="checkbox"
                                checked={selectedCategories.has(child.id)}
                                onChange={(e) =>
                                  handleSelectCategory(
                                    child.id,
                                    e.target.checked
                                  )
                                }
                                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {child.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <img
                                src={child.icon}
                                alt={`${child.name} icon`}
                                className="w-6 h-6 rounded-full"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:underline cursor-pointer pl-8">
                              — {child.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {child.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={child.published}
                                  onChange={() =>
                                    togglePublished(child.id, false)
                                  }
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                              </label>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <div className="flex justify-center gap-2">
                                <Tippy content="View">
                                  <button className="h-8 w-8 p-0 hover:bg-gray-100 rounded inline-flex items-center justify-center">
                                    <Eye className="w-4 h-4 text-gray-400" />
                                  </button>
                                </Tippy>
                                <Tippy content="Edit">
                                  <button
                                    className="h-8 w-8 p-0 hover:bg-gray-100 rounded inline-flex items-center justify-center"
                                    onClick={() => {
                                      setSelectedCategory(child);
                                      setShowUpdateDrawer(true);
                                    }}
                                  >
                                    <Pencil className="w-4 h-4 text-gray-400" />
                                  </button>
                                </Tippy>
                                <Tippy content="Delete">
                                  <button
                                    onClick={() => handleDeleteCategory(child.id)}
                                    className="h-8 w-8 p-0 hover:bg-red-100 rounded inline-flex items-center justify-center"
                                  >
                                    <Trash2 className="w-4 h-4 text-red-400" />
                                  </button>
                                </Tippy>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No categories found matching your search.
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
                {Math.min(indexOfLastItem, filteredCategories.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium">{filteredCategories.length}</span>{" "}
              results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
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
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === page
                    ? "z-10 bg-emerald-50 border-emerald-500 text-emerald-600"
                    : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                    }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Add Category Modal */}
        {isAddModalOpen && (
          <AddCategoryModal
            onClose={() => setIsAddModalOpen(false)}
            onAdd={(newCategory) => {
              const newCat = {
                id: `CAT-${Date.now()}`,
                icon: "/placeholder.svg",
                ...newCategory,
              };

              if (newCategory.parentId) {
                setCategories((prev) =>
                  prev.map((cat) =>
                    cat.id === newCategory.parentId
                      ? {
                        ...cat,
                        children: [...(cat.children || []), newCat],
                      }
                      : cat
                  )
                );
              } else {
                setCategories((prev) => [...prev, newCat]);
              }
            }}
          />
        )}

        {/* Edit Category Modal */}
        {showUpdateDrawer && selectedCategory && (
          <EditCategoryModal
            category={selectedCategory}
            onClose={() => setShowUpdateDrawer(false)}
            onUpdate={handleUpdateCategory}
          />
        )}
      </div>
    </div>
  );
}