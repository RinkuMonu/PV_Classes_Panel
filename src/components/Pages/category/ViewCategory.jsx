import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Eye, Pencil, Trash2, Plus, ChevronLeft, ChevronRight, X } from 'lucide-react';
import axiosInstance from "../../../config/AxiosInstance"; // Update path as needed
import Swal from "sweetalert2";


// ... (keep your initialCategories array the same) ...
// const initialCategories = [
//   {
//     id: "A5F5",
//     icon: "https://images.unsplash.com/photo-1600185365522-34902953931d", // skincare
//     name: "Woo",
//     description: "Woo",
//     published: true,
//     children: [
//       {
//         id: "A5F5-1",
//         icon: "https://images.unsplash.com/photo-1618489914471-6e7e060d731d", // gel
//         name: "Gel",
//         description: "Gel for skin care",
//         published: true,
//       },
//       {
//         id: "A5F5-2",
//         icon: "https://images.unsplash.com/photo-1588776814546-ec7ee0dcb5da", // cream
//         name: "Cream",
//         description: "Skin cream",
//         published: true,
//       },
//     ],
//   },
//   {
//     id: "0C24",
//     icon: "https://images.unsplash.com/photo-1562967916-eb82221dfb36", // fish & meat
//     name: "Fish & Meat",
//     description: "Fish & Meat",
//     published: true,
//     children: [
//       {
//         id: "0C24-1",
//         icon: "https://images.unsplash.com/photo-1553621042-f6e147245754", // fish
//         name: "Fish",
//         description: "Fresh fish",
//         published: true,
//       },
//       {
//         id: "0C24-2",
//         icon: "https://images.unsplash.com/photo-1551183053-bf91a1d81141", // meat
//         name: "Meat",
//         description: "Fresh meat",
//         published: true,
//       },
//       {
//         id: "0C24-3",
//         icon: "https://images.unsplash.com/photo-1617134820884-6f82f3b9f197", // shrimp
//         name: "Shrimp",
//         description: "Fresh shrimp",
//         published: true,
//       },
//     ],
//   },
//   {
//     id: "B771",
//     icon: "https://images.unsplash.com/photo-1551024601-bec78aea704b", // beverages
//     name: "Beverages",
//     description: "Drinks and beverages",
//     published: true,
//     children: [
//       {
//         id: "B771-1",
//         icon: "https://images.unsplash.com/photo-1600256707283-0e64eb13e3fc", // juice
//         name: "Juice",
//         description: "Fruit juice",
//         published: true,
//       },
//       {
//         id: "B771-2",
//         icon: "https://images.unsplash.com/photo-1550565090-46b7f13c6c28", // soda
//         name: "Soda",
//         description: "Soft drinks",
//         published: true,
//       },
//     ],
//   },
//   {
//     id: "C842",
//     icon: "https://images.unsplash.com/photo-1577801599403-03f43b0f1c99", // bakery
//     name: "Bakery",
//     description: "Freshly baked goods",
//     published: true,
//     children: [
//       {
//         id: "C842-1",
//         icon: "https://images.unsplash.com/photo-1608198093002-ad4e005484b9", // bread
//         name: "Bread",
//         description: "Whole grain bread",
//         published: true,
//       },
//       {
//         id: "C842-2",
//         icon: "https://images.unsplash.com/photo-1589308078053-189d48f81e4e", // croissant
//         name: "Croissant",
//         description: "Buttery croissant",
//         published: true,
//       },
//     ],
//   },
//   {
//     id: "D963",
//     icon: "https://images.unsplash.com/photo-1580910051074-c03d287eab39", // dairy
//     name: "Dairy",
//     description: "Milk and dairy products",
//     published: true,
//     children: [
//       {
//         id: "D963-1",
//         icon: "https://images.unsplash.com/photo-1582560471849-c09d95e5f08d", // cheese
//         name: "Cheese",
//         description: "Cheddar cheese",
//         published: true,
//       },
//     ],
//   },
// ];
export default function ViewCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    published: true
  });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axiosInstance.get(`/categories/${id}`);
        console.log("Category response:", response.data);

        // Set the entire category data
        setCategory(response.data);

        // If subCategories is an array of strings:
        setSubCategories(
          response.data.subCategories?.map((name, index) => ({
            id: index,
            name,
            description: "",
            icon: "",
            published: true,
          })) || []
        );
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    };

    fetchCategory();
  }, [id]);


  const handleSelectAll = (checked) => {
    if (checked) {
      const allIds = new Set(subCategories.map(sc => sc.id));
      setSelectedSubCategories(allIds);
    } else {
      setSelectedSubCategories(new Set());
    }
  };

  const handleSelectSubCategory = (subCategoryId, checked) => {
    const newSelection = new Set(selectedSubCategories);
    checked ? newSelection.add(subCategoryId) : newSelection.delete(subCategoryId);
    setSelectedSubCategories(newSelection);
  };

  const togglePublished = (subCategoryId) => {
    setSubCategories(prev =>
      prev.map(sc =>
        sc.id === subCategoryId ? { ...sc, published: !sc.published } : sc
      )
    );
  };

  const deleteSelected = async () => {
    const token = localStorage.getItem("token");

    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "This action will delete selected subcategories!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirmed.isConfirmed) return;

    try {
      const idsToDelete = [...selectedSubCategories];

      for (const subCategoryId of idsToDelete) {
        await axiosInstance.delete(`/categories/${subCategoryId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      Swal.fire("Deleted!", "Selected subcategories have been deleted.", "success");

      setSubCategories((prev) =>
        prev.filter((sc) => !selectedSubCategories.has(sc.id))
      );
      setSelectedSubCategories(new Set());
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to delete some subcategories", "error");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddSubCategory = () => {
    const newSubCategory = {
      id: `${category.id}-${subCategories.length + 1}`,
      ...formData
    };

    setSubCategories(prev => [...prev, newSubCategory]);
    setShowAddModal(false);
    setFormData({
      name: '',
      description: '',
      icon: '',
      published: true
    });
  };

  const handleEditSubCategory = () => {
    setSubCategories(prev =>
      prev.map(sc =>
        sc.id === editingSubCategory.id ? { ...sc, ...formData } : sc
      )
    );
    setShowEditModal(false);
    setEditingSubCategory(null);
    setFormData({
      name: '',
      description: '',
      icon: '',
      published: true
    });
  };

  const openEditModal = (subCategory) => {
    setEditingSubCategory(subCategory);
    setFormData({
      name: subCategory.name,
      description: subCategory.description,
      icon: subCategory.icon,
      published: subCategory.published
    });
    setShowEditModal(true);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSubCategories = subCategories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(subCategories.length / itemsPerPage);

  const allSelected = selectedSubCategories.size === subCategories.length && subCategories.length > 0;
  const someSelected = selectedSubCategories.size > 0 && !allSelected;

  if (!category) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <main className="h-full overflow-y-auto">
      <div className="sm:container grid lg:px-6 sm:px-4 px-2 mx-auto">
        <h1 className="my-6 text-lg font-bold text-gray-700">Category</h1>

        <div className="tab tab-enter">
          <div className="flex items-center pb-4">
            <ol className="flex items-center w-full overflow-hidden font-serif">
              <li className="text-sm pr-1 transition duration-200 ease-in cursor-pointer hover:text-emerald-500 font-semibold">
                <button onClick={() => navigate('/catalog/categories')}>Categories</button>
              </li>
              <span className="flex items-center font-serif">
                <li className="text-sm mt-[1px]">
                  <ChevronRight className="w-4 h-4" />
                </li>
                <li className="text-sm pl-1 transition duration-200 ease-in cursor-pointer text-blue-700 hover:text-emerald-500 font-semibold">
                  {category.name}
                </li>
              </span>
            </ol>
          </div>

          <div className="min-w-0 rounded overflow-hidden bg-white shadow-xs mb-5">
            <div className="p-4">
              <div className="flex justify-end items-end">
                <button
                  className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2  text-sm text-white bg-emerald-500 border border-transparent active:bg-emerald-600 hover:bg-emerald-600 h-10"
                  onClick={() => setShowAddModal(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Subcategory
                </button>

                <button
                  className={`align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2  text-sm text-white border border-transparent ml-3 h-10 ${selectedSubCategories.size > 0
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-gray-300 opacity-50 cursor-not-allowed"
                    }`}
                  disabled={selectedSubCategories.size === 0}
                  onClick={deleteSelected}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full overflow-hidden border border-gray-200 rounded-lg mb-8">
          <div className="w-full overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-100">
                <tr>
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      ref={(input) => {
                        if (input) input.indeterminate = someSelected;
                      }}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                  </td>
                  <td className="px-4 py-2">ID</td>
                  <td className="px-4 py-2">Icon</td>
                  <td className="px-4 py-2">Name</td>
                  <td className="px-4 py-2">Description</td>
                  <td className="px-4 py-2 text-center">PUBLISHED</td>
                  <td className="px-4 py-2 text-right">ACTIONS</td>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100 text-gray-800">
                {currentSubCategories.length > 0 ? (
                  currentSubCategories.map((subCat) => (
                    <tr key={subCat.id}>
                      <td className="px-4 py-2">
                        <input
                          type="checkbox"
                          checked={selectedSubCategories.has(subCat.id)}
                          onChange={(e) => handleSelectSubCategory(subCat.id, e.target.checked)}
                          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                      </td>
                      <td className="px-4 py-2 font-semibold uppercase text-xs">
                        {subCat.id}
                      </td>
                      <td className="px-4 py-2">
                        <div className="relative rounded-full inline-block w-8 h-8 p-1 mr-2 bg-gray-50">
                          <img
                            className="object-cover w-full h-full rounded-full"
                            src={subCat.icon}
                            alt={subCat.name}
                            loading="lazy"
                          />
                          <div className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
                        </div>
                      </td>
                      <td className="px-4 py-2 font-medium text-sm">
                        <button
                          className="text-blue-700 hover:underline"
                          onClick={() => navigate(`/catalog/categories/${subCat.id}`)}
                        >
                          {subCat.name}
                        </button>
                      </td>
                      <td className="px-4 py-2 text-sm">{subCat.description}</td>
                      <td className="px-4 py-2 text-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={subCat.published}
                            onChange={() => togglePublished(subCat.id)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex justify-end text-right">
                          <button
                            className="p-2 cursor-pointer text-gray-400 hover:text-emerald-600 focus:outline-none"
                            onClick={() => navigate(`/catalog/categories/${subCat.id}`)}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 cursor-pointer text-gray-400 hover:text-emerald-600 focus:outline-none"
                            onClick={() => openEditModal(subCat)}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 cursor-pointer text-gray-400 hover:text-red-600 focus:outline-none"
                            onClick={() => handleSelectSubCategory(subCat.id, true)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-4 py-4 text-center text-sm text-gray-500">
                      No subcategories found for this category.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t border-gray-200 bg-white text-gray-500">
            <div className="flex flex-col justify-between text-xs sm:flex-row">
              <span className="flex items-center font-semibold tracking-wide uppercase">
                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, subCategories.length)} of {subCategories.length}
              </span>
              <div className="flex mt-2 sm:mt-auto sm:justify-end">
                <nav aria-label="Table navigation">
                  <ul className="inline-flex items-center">
                    <li>
                      <button
                        className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none p-2 rounded-md text-gray-600 focus:outline-none border border-transparent"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        type="button"
                        aria-label="Previous"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <li key={page}>
                        <button
                          className={`align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-3 py-1 rounded-md text-xs border ${currentPage === page
                            ? "text-white bg-emerald-500 border-transparent"
                            : "text-gray-600 border-gray-300 bg-white"
                            }`}
                          onClick={() => setCurrentPage(page)}
                          type="button"
                        >
                          {page}
                        </button>
                      </li>
                    ))}
                    <li>
                      <button
                        className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none p-2 rounded-md text-gray-600 focus:outline-none border border-transparent"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        type="button"
                        aria-label="Next"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Subcategory Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-black/30 bg-opacity-50">
          <div className="relative w-auto max-w-md mx-auto my-6">
            <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
              <div className="flex items-start justify-between p-5 border-b border-solid border-gray-200 rounded-t">
                <h3 className="text-lg font-semibold">Add Subcategory</h3>
                <button
                  className="p-1 ml-auto bg-transparent border-0 text-gray-400 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                  onClick={() => setShowAddModal(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="relative p-6 flex-auto">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Name
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Subcategory name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="description"
                    name="description"
                    placeholder="Subcategory description"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="icon">
                    Icon URL
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="icon"
                    name="icon"
                    type="text"
                    placeholder="Image URL for icon"
                    value={formData.icon}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-4 flex items-center">
                  <input
                    id="published"
                    name="published"
                    type="checkbox"
                    checked={formData.published}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <label htmlFor="published" className="ml-2 text-sm font-medium text-gray-700">
                    Published
                  </label>
                </div>
              </div>
              <div className="flex items-center justify-end p-6 border-t border-solid border-gray-200 rounded-b">
                <button
                  className="text-gray-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={handleAddSubCategory}
                >
                  Add Subcategory
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Subcategory Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-black/30 bg-opacity-50">
          <div className="relative w-auto max-w-md mx-auto my-6">
            <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
              <div className="flex items-start justify-between p-5 border-b border-solid border-gray-200 rounded-t">
                <h3 className="text-lg font-semibold">Edit Subcategory</h3>
                <button
                  className="p-1 ml-auto bg-transparent border-0 text-gray-400 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                  onClick={() => setShowEditModal(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="relative p-6 flex-auto">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Name
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Subcategory name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="description"
                    name="description"
                    placeholder="Subcategory description"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="icon">
                    Icon URL
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="icon"
                    name="icon"
                    type="text"
                    placeholder="Image URL for icon"
                    value={formData.icon}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-4 flex items-center">
                  <input
                    id="published"
                    name="published"
                    type="checkbox"
                    checked={formData.published}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <label htmlFor="published" className="ml-2 text-sm font-medium text-gray-700">
                    Published
                  </label>
                </div>
              </div>
              <div className="flex items-center justify-end p-6 border-t border-solid border-gray-200 rounded-b">
                <button
                  className="text-gray-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={handleEditSubCategory}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
