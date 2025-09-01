import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EditProductModal from "./EditProductModal";
import axiosInstance from "../../../config/AxiosInstance";

export default function ProductDetails() {
  const { id } = useParams();
  const [showEditModal, setShowEditModal] = useState(false);

  // Sample categories data
  const categories = [
    { id: "men", name: "Men" },
    { id: "women", name: "Women" },
    { id: "electronics", name: "Electronics" },
    { id: "home", name: "Home & Living" },
    { id: "groceries", name: "Groceries" },
    { id: "skincare", name: "Skin Care" },
  ];

  const sampleProducts = [
    {
      id: "1",
      name: "Variant",
      category: "Woo",
      price: 20.0,
      salePrice: 10.0,
      stock: 4,
      status: "Selling",
      published: true,
      image: "https://picsum.photos/id/1015/400/300",
      combination: "Red, Large",
      sku: "VAR-RED-L",
      barcode: "123456789",
      description: "A basic product variant with multiple options"
    },
    {
      id: "2",
      name: "Water Filter",
      category: "Home Appliances",
      price: 200.0,
      salePrice: 130.0,
      stock: 405,
      status: "Selling",
      published: false,
      image: "https://images.unsplash.com/photo-1587202372775-e98b1e52281f",
      combination: "Blue, Medium",
      sku: "WF-BLU-M",
      barcode: "234567890",
      description: "High-quality water filtration system"
    },
    {
      id: "3",
      name: "Premium T-Shirt",
      category: "Men",
      price: 450.0,
      salePrice: 450.0,
      stock: 4972,
      status: "Selling",
      published: true,
      image: "https://images.unsplash.com/photo-1585386959984-a415522adf6d",
      combination: "Black, XL",
      sku: "TSHIRT-BLK-XL",
      barcode: "345678901",
      description: "A T-shirt (also spelled tee-shirt or tee shirt), or tee for short, is a style of fabric shirt named after the T shape of its body and sleeves. Traditionally, it has short sleeves and a round neckline, known as a crew neck, which lacks a collar."
    },
    {
      id: "4",
      name: "Himalaya Powder",
      category: "Skin Care",
      price: 174.97,
      salePrice: 160.0,
      stock: 5472,
      status: "Selling",
      published: false,
      image: "https://images.unsplash.com/photo-1600180758890-6d9c53951f4b",
      combination: "50g",
      sku: "HIMA-50G",
      barcode: "456789012",
      description: "Natural skincare powder with Himalayan herbs"
    },
    {
      id: "5",
      name: "Green Leaf Lettuce",
      category: "Fresh Vegetable",
      price: 112.72,
      salePrice: 112.72,
      stock: 462,
      status: "Selling",
      published: true,
      image: "https://images.unsplash.com/photo-1576402187873-3f23c7b3f907",
      combination: "Organic",
      sku: "LET-ORG",
      barcode: "567890123",
      description: "Fresh organic lettuce from local farms"
    },
    {
      id: "6",
      name: "Rainbow Chard",
      category: "Fresh Vegetable",
      price: 7.07,
      salePrice: 7.72,
      stock: 472,
      status: "Selling",
      published: false,
      image: "https://images.unsplash.com/photo-1615485292645-6a866eb7c9b2",
      combination: "Bunch",
      sku: "CHARD-BUNCH",
      barcode: "678901234",
      description: "Colorful rainbow chard with vibrant stems"
    },
    {
      id: "7",
      name: "Aloe Vera Gel",
      category: "Skin Care",
      price: 80.0,
      salePrice: 65.0,
      stock: 1200,
      status: "Selling",
      published: true,
      image: "https://images.unsplash.com/photo-1616587894370-cd4b2390537a",
      combination: "200ml",
      sku: "ALOE-200",
      barcode: "789012345",
      description: "Pure aloe vera gel for skin hydration"
    },
    {
      id: "8",
      name: "Running Shoes",
      category: "Footwear",
      price: 1200.0,
      salePrice: 999.0,
      stock: 540,
      status: "Selling",
      published: true,
      image: "https://images.unsplash.com/photo-1528701800489-20beebae4d1f",
      combination: "Black, Size 10",
      sku: "SHOE-BLK-10",
      barcode: "890123456",
      description: "Comfortable running shoes with cushioning"
    },
    {
      id: "9",
      name: "Wireless Mouse",
      category: "Electronics",
      price: 850.0,
      salePrice: 749.0,
      stock: 200,
      status: "Selling",
      published: true,
      image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3",
      combination: "Black",
      sku: "MOUSE-BLK",
      barcode: "901234567",
      description: "Ergonomic wireless mouse with precision tracking"
    },
    {
      id: "10",
      name: "Laptop Backpack",
      category: "Accessories",
      price: 1100.0,
      salePrice: 950.0,
      stock: 300,
      status: "Selling",
      published: false,
      image: "https://images.unsplash.com/photo-1592503254549-986d94c0a940",
      combination: "Gray",
      sku: "BAG-GRAY",
      barcode: "012345678",
      description: "Durable laptop backpack with multiple compartments"
    }
  ];

  // Find the current product based on ID
  const [Product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  // Filter variants that belong to this product (group by name)
  const productVariants = sampleProducts.filter(product =>
    product.name === Product?.name
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Get current variants
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVariants = productVariants.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate total pages
  const totalPages = Math.ceil(productVariants.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (!Product) {
    return <div className="container mx-auto px-4 py-8 text-center text-xl">Product not found</div>;
  }

  // Handle save edited product
  // const handleSaveProduct = (updatedData) => {
  // In a real app, you would update the product in your state/API here
  // console.log("Updated product data:", updatedData);
  // You might want to update the currentProduct state here
  // };

  const handleSaveProduct = async (updatedData) => {
    try {
      const response = await axiosInstance.put(`/products/${id}`, updatedData);
      console.log("Product updated:", response.data);

      setProduct(response.data); // Update UI with new data
      setShowEditModal(false);   // Close modal
    } catch (error) {
      console.error("Failed to update product:", error);
      alert("Failed to update product");
    }
  };


  return (
    <div className="bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Product Details</h2>

      <div className=" p-6   mb-8">
        <div className="grid md:grid-cols-[200px_1fr] gap-8">
          {/* Product Image */}
          <div className="flex justify-center items-start">
            <img
              src={Product.image || "/placeholder.svg"}
              alt={Product.name}
              width={250}
              height={300}
              className="object-cover rounded-lg border"
            />
          </div>

          {/* Product Details */}
          <div>
            <p className="text-sm mb-2">
              Status: <span className={`${Product.published ? "text-green-600" : "text-gray-500"} font-medium`}>
                {Product.published ? "Published" : "Draft"}
              </span>
            </p>
            <h3 className="text-3xl font-bold mb-2">{Product.name}</h3>
            <p className="text-sm text-gray-600 mb-4">SKU: {Product.sku}</p>

            <div className="flex items-center gap-4 mb-4">
              <h4 className="text-4xl font-bold">₹{Product.price.numberDecimal}</h4>
              {Product.salePrice < Product.price && (
                <span className="text-gray-500 line-through">₹{Product.salePrice}</span>
              )}
              <span className={`${Product.stock > 0 ? "bg-green-600" : "bg-red-600"} text-white px-3 py-1 rounded-full text-sm`}>
                {Product.stock > 0 ? "In Stock" : "Out of Stock"}
              </span>
              <p className="text-sm text-gray-600">QUANTITY: {Product.stock}</p>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6">
              {Product.description || "No description available"}
            </p>

            <div className="mb-6">
              <p className="text-sm font-medium mb-2">Category: {Product.category}</p>
              <div className="flex flex-wrap gap-2">
                {Product.name.toLowerCase().split(' ').map((tag, index) => (
                  <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setShowEditModal(true)} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md">
                Edit Product
              </button>
              {/* <button className="border border-gray-300 hover:bg-gray-100 px-6 py-3 rounded-md">
                View Analytics
              </button> */}
            </div>
          </div>
        </div>
      </div>

      {productVariants.length > 1 && (
        <>
          <h2 className="text-2xl font-bold mb-6">Product Variant List</h2>

          <div className="bg-white p-6 rounded-lg shadow-sm overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left py-3 px-4 w-[50px]">SR</th>
                  <th className="text-left py-3 px-4 w-[80px]">IMAGE</th>
                  <th className="text-left py-3 px-4">COMBINATION</th>
                  <th className="text-left py-3 px-4">SKU</th>
                  <th className="text-left py-3 px-4">BARCODE</th>
                  <th className="text-right py-3 px-4">ORIGINAL PRICE</th>
                  <th className="text-right py-3 px-4">SALE PRICE</th>
                  <th className="text-right py-3 px-4">QUANTITY</th>
                </tr>
              </thead>
              <tbody>
                {currentVariants.map((variant, index) => (
                  <tr key={variant.id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4">{indexOfFirstItem + index + 1}</td>
                    <td className="py-3 px-4">
                      <img
                        src={variant.image || "/placeholder.svg"}
                        alt={variant.combination}
                        width={40}
                        height={40}
                        className="object-cover rounded-sm border"
                      />
                    </td>
                    <td className="py-3 px-4">
                      {variant.combination}
                      <br />
                      <span className="text-xs text-gray-500">({variant.id})</span>
                    </td>
                    <td className="py-3 px-4">{variant.sku}</td>
                    <td className="py-3 px-4">{variant.barcode}</td>
                    <td className="py-3 px-4 text-right">₹{variant.price.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right">₹{variant.salePrice.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right">{variant.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-gray-600">
                  {`SHOWING ${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, productVariants.length)} OF ${productVariants.length}`}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => paginate(i + 1)}
                      className={`px-3 py-1 rounded-md ${currentPage === i + 1 ? "bg-green-600 text-white" : "hover:bg-gray-100"}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
      <EditProductModal
        product={Product}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveProduct}
        categories={categories}
      />
    </div>
  );
}