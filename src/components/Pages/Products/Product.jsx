import { useState, useEffect, useCallback } from "react";
import {
  Download,
  Upload,
  Trash2,
  Plus,
  Search,
  Eye,
  Pencil,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import AddProductModal from "./AddProductModal";
import { Link } from "react-router-dom";
import EditProductModal from "./EditProductModal";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import axiosInstance from "../../../config/AxiosInstance";
import Swal from "sweetalert2";
// Sample product data - could be fetched from an API in a real app
// const sampleProducts = [
//   {
//     id: "1",
//     name: "Variant",
//     category: "Woo",
//     price: 20.0,
//     salePrice: 10.0,
//     stock: 4,
//     status: "Selling",
//     published: true,
//     image: "https://picsum.photos/id/1015/400/300", // Generic product
//   },
//   {
//     id: "2",
//     name: "Erfertfg Dgsd Sdf Sdf",
//     category: "Water Filter",
//     price: 200.0,
//     salePrice: 130.0,
//     stock: 405,
//     status: "Selling",
//     published: false,
//     image: "https://images.unsplash.com/photo-1551049838-0a5d62803caa?w=400&h=300", // Water filter
//   },
//   {
//     id: "3",
//     name: "Premium T-Shirt",
//     category: "Men",
//     price: 450.0,
//     salePrice: 450.0,
//     stock: 4972,
//     status: "Selling",
//     published: true,
//     image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300", // T-shirt
//   },
//   {
//     id: "4",
//     name: "Himalaya Powder",
//     category: "Skin Care",
//     price: 174.97,
//     salePrice: 160.0,
//     stock: 5472,
//     status: "Selling",
//     published: false,
//     image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=300", // Skin care
//   },
//   {
//     id: "5",
//     name: "Green Leaf Lettuce",
//     category: "Fresh Vegetable",
//     price: 112.72,
//     salePrice: 112.72,
//     stock: 462,
//     status: "Selling",
//     published: true,
//     image: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&h=300", // Lettuce
//   },
//   {
//     id: "6",
//     name: "Rainbow Chard",
//     category: "Fresh Vegetable",
//     price: 7.07,
//     salePrice: 7.72,
//     stock: 472,
//     status: "Selling",
//     published: false,
//     image: "https://images.unsplash.com/photo-1603048719537-7a7b3f4e8ed0?w=400&h=300", // Chard
//   },
//   {
//     id: "7",
//     name: "Aloe Vera Gel",
//     category: "Skin Care",
//     price: 80.0,
//     salePrice: 65.0,
//     stock: 1200,
//     status: "Selling",
//     published: true,
//     image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300", // Aloe Vera
//   },
//   {
//     id: "8",
//     name: "Running Shoes",
//     category: "Footwear",
//     price: 1200.0,
//     salePrice: 999.0,
//     stock: 540,
//     status: "Selling",
//     published: true,
//     image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300", // Shoes
//   },
//   {
//     id: "9",
//     name: "Wireless Mouse",
//     category: "Electronics",
//     price: 850.0,
//     salePrice: 749.0,
//     stock: 200,
//     status: "Selling",
//     published: true,
//     image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=300", // Mouse
//   },
//   {
//     id: "10",
//     name: "Laptop Backpack",
//     category: "Accessories",
//     price: 1100.0,
//     salePrice: 950.0,
//     stock: 300,
//     status: "Selling",
//     published: false,
//     image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300", // Backpack
//   },
//   {
//     id: "11",
//     name: "LED Desk Lamp",
//     category: "Home & Living",
//     price: 600.0,
//     salePrice: 520.0,
//     stock: 150,
//     status: "Selling",
//     published: true,
//     image: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=400&h=300", // Desk Lamp
//   },
//   {
//     id: "12",
//     name: "Organic Honey",
//     category: "Grocery",
//     price: 340.0,
//     salePrice: 299.0,
//     stock: 620,
//     status: "Selling",
//     published: true,
//     image: "https://images.unsplash.com/photo-1558645835-2d0e0a5a1f4a?w=400&h=300", // Honey
//   },
//   {
//     id: "13",
//     name: "Bluetooth Speaker",
//     category: "Electronics",
//     price: 2500.0,
//     salePrice: 1999.0,
//     stock: 180,
//     status: "Selling",
//     published: true,
//     image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=300", // Speaker
//   },
//   {
//     id: "14",
//     name: "Cotton Bath Towel",
//     category: "Home & Living",
//     price: 400.0,
//     salePrice: 350.0,
//     stock: 270,
//     status: "Selling",
//     published: false,
//     image: "https://images.unsplash.com/photo-1615872325684-0695a5ffe786?w=400&h=300", // Towel
//   },
//   {
//     id: "15",
//     name: "Notebook Set",
//     category: "Stationery",
//     price: 150.0,
//     salePrice: 130.0,
//     stock: 999,
//     status: "Selling",
//     published: true,
//     image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300", // Notebook
//   }
// ];

// Helper function to extract unique categories
const getUniqueCategories = (products) => {
  const categories = new Set(products.map((product) => product.category));
  return Array.from(categories).sort();
};

const formatCurrency = (amount) => {
  return `₹${amount}`;
};

export default function Product() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [_loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPublished, setSelectedPublished] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedProducts, setSelectedProducts] = useState([]);
  // const [isBulkActionOpen, setIsBulkActionOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  // Find the current product based on ID
  const currentProduct = products.find(product => product.id === editingProductId);

  // Handle save edited product
  const handleSaveProduct = (updatedData) => {
    setProducts(products.map(product =>
      product.id === editingProductId ? { ...product, ...updatedData } : product
    ));
    setShowEditModal(false);
  };


  const deleteProduct = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axiosInstance.delete(`/products/${id}`);
        Swal.fire("Deleted!", "Product has been deleted.", "success");

        // Update the UI
        setProducts((prev) => prev.filter((product) => product._id !== id));
        setSelectedProducts((prev) => prev.filter((productId) => productId !== id));
      } catch (error) {
        Swal.fire("Error!", "Failed to delete the product.", "error");
        console.error("Failed to delete product:", error);
      }
    }
  };

const fetchProducts = useCallback(async () => {
  setLoading(true);
  try {
    const response = await axiosInstance.get("/products", {
      params: {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        status: selectedStatus !== "all" ? selectedStatus : undefined,
        published:
          selectedPublished === "all"
            ? undefined
            : selectedPublished === "published",
      },
    });

    setProducts(response.data.items);
    setTotalProducts(response.data.total);

    if (response.data.products) {
      setCategories(getUniqueCategories(response.data.products));
    }
  } catch (error) {
    console.error("Failed to fetch products:", error);
  } finally {
    setLoading(false);
  }
}, [currentPage, searchTerm, selectedCategory, selectedStatus, selectedPublished, itemsPerPage]);

useEffect(() => {
  fetchProducts();
}, [fetchProducts]);


  // const filteredProducts = products
  //   .filter((product) => {
  //     const matchesSearch = product.name
  //       .toLowerCase()
  //       .includes(searchTerm.toLowerCase());
  //     const matchesCategory =
  //       selectedCategory === "all" || product.category === selectedCategory;
  //     const matchesStatus =
  //       selectedStatus === "all" || product.status === selectedStatus;
  //     const matchesPublished =
  //       selectedPublished === "all" ||
  //       (selectedPublished === "published" && product.published) ||
  //       (selectedPublished === "unpublished" && !product.published);

  //     return (
  //       matchesSearch && matchesCategory && matchesStatus && matchesPublished
  //     );
  //   })
  //   .sort((a, b) => {
  //     if (selectedPrice === "low-to-high") {
  //       return a.price - b.price;
  //     } else if (selectedPrice === "high-to-low") {
  //       return b.price - a.price;
  //     }
  //     return 0;
  //   });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  const togglePublished = (id) => {
    setProducts(
      products.map((product) =>
        product.id === id
          ? { ...product, published: !product.published }
          : product
      )
    );
  };

  // const deleteProduct = (id) => {
  //   setProducts(products.filter((product) => product.id !== id));
  //   setSelectedProducts(
  //     selectedProducts.filter((productId) => productId !== id)
  //   );
  // };

  const handleSelectProduct = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id)
        ? prev.filter((productId) => productId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAllProducts = (e) => {
    if (e.target.checked) {
      setSelectedProducts(currentItems.map((product) => product.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const bulkDelete = () => {
    setProducts(
      products.filter((product) => !selectedProducts.includes(product.id))
    );
    setSelectedProducts([]);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleAddProduct = (product) => {
    const newId = (products.length + 1).toString();
    setProducts([
      ...products,
      {
        ...product,
        id: newId,
        price: Number(product.price),
        salePrice: Number(product.salePrice),
        stock: Number(product.stock),
      },
    ]);

    // Update categories if new one was added
    if (!categories.includes(product.category) && product.category) {
      setCategories([...categories, product.category].sort());
    }
  };

  const handleEditClick = (productId) => {
    setEditingProductId(productId);
    setShowEditModal(true);
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

  return (
    <div className=" bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Products
          </h1>

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
              {/* <div className="relative">
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
              </div> */}
              <button
                className="bg-red-600 hover:bg-red-700 text-white flex items-center px-4 py-1 "
                onClick={bulkDelete}
                disabled={selectedProducts.length === 0}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
              <button
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2   text-sm"
                onClick={() => setIsAddModalOpen(true)}
              >
                <Plus className="w-4 h-4" />
                Add Product
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
              placeholder="Search Product"
              className="pl-10 pr-3 py-2 border border-gray-300 rounded w-full bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="w-[180px] px-3 py-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            className="w-[180px] px-3 py-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            value={selectedPrice}
            onChange={(e) => setSelectedPrice(e.target.value)}
          >
            <option value="all">All Prices</option>
            <option value="low-to-high">Low to High</option>
            <option value="high-to-low">High to Low</option>
          </select>
          <select
            className="w-[180px] px-3 py-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="Selling">Selling</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="Discontinued">Discontinued</option>
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
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
              setSelectedPrice("all");
              setSelectedStatus("all");
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
                        selectedProducts.length === currentItems.length &&
                        currentItems.length > 0
                      }
                      onChange={handleSelectAllProducts}
                    />
                  </th>
                  <th
                    scope="col"
                    className="px-6  text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Product Name
                  </th>
                  <th
                    scope="col"
                    className="px-6  text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-6  text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-6  text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Sale Price
                  </th>
                  <th
                    scope="col"
                    className="px-6  text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Stock
                  </th>
                  <th
                    scope="col"
                    className="px-6  text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6  text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    View
                  </th>
                  <th
                    scope="col"
                    className="px-6  text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Published
                  </th>
                  <th
                    scope="col"
                    className="px-6  text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.length > 0 ? (
                  currentItems.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleSelectProduct(product.id)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex items-center gap-2">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-6 w-6 rounded-full"
                          />
                          {product.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(product.salePrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.stock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${product.status === "Selling"
                            ? "bg-green-100 text-green-800"
                            : product.status === "Out of Stock"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                            }`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Tippy content="View">
                          <Link
                            to={`/catalog/products/${product._id}`}
                            className="h-8 w-8 p-0 hover:bg-gray-100 rounded inline-flex items-center justify-center"
                          >
                            <Eye className="w-4 h-4 text-gray-400" />
                          </Link>
                        </Tippy>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={product.published}
                            onChange={() => togglePublished(product._id)}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Tippy content="Edit">
                            <button
                              onClick={() => handleEditClick(product._id)}
                              className="h-8 w-8 p-0 hover:bg-gray-100 rounded inline-flex items-center justify-center"
                            >
                              <Pencil className="w-4 h-4 text-gray-400" />
                            </button>
                          </Tippy>
                          <Tippy content="Delete" className="bg-red-500">
                            <button
                              className="h-8 w-8 p-0 hover:bg-gray-100 rounded inline-flex items-center justify-center"
                              onClick={() => deleteProduct(product._id)}
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
                      colSpan="10"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No products found
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
                {Math.min(indexOfLastItem)}
              </span>{" "}
              of <span className="font-medium">{totalProducts}</span>{" "}
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
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === page
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

        {/* Add Product Modal */}
        <AddProductModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddProduct={handleAddProduct}
          categories={categories}
        />

        {/* Edit Product Modal */}
        {currentProduct && (
          <EditProductModal
            product={currentProduct}
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            onSave={handleSaveProduct}
            categories={categories}
          />
        )}
      </div>
    </div>
  );
}