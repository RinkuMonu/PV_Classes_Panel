"use client"
import { useState, useRef, useEffect } from "react"
import { UploadCloud, X, ArrowLeft, ArrowRight, DollarSign, Plus, Minus } from "lucide-react"
import axiosInstance from "../../../config/AxiosInstance"; // adjust path
import Swal from "sweetalert2";


export default function AddProductModal({ isOpen, onClose, onAddProduct }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [hasVariants, setHasVariants] = useState(false)
  const [images, setImages] = useState([])
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState("")
  const fileInputRef = useRef(null)

  // Dummy categories - replace with API call later
  const [categories, setCategories] = useState([]);

  console.log(categories);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/categories/all");
        console.log("Categories response:", res.data);
        if (res.data?.items && Array.isArray(res.data?.items)) {
          setCategories(res.data?.items);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    if (isOpen) fetchCategories();
  }, [isOpen]);

  // Available options
  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"]
  const availableColors = ["Red", "Blue", "Green", "Black", "White", "Yellow", "Purple", "Orange"]

  // New variant structure: array of size-color combinations
  const [sizeColorCombinations, setSizeColorCombinations] = useState([])
  const [variantCombinations, setVariantCombinations] = useState([])

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    salePrice: "",
    quantity: "",
    sku: "",
    barcode: "",
    slug: "",
    category: "",
    subcategory: "",
    images: [],
    weight: "",
    dimensions: "",
    manufacturer: "",
    metaTitle: "",
    metaDescription: "",
    taxClass: "",
    shippingClass: "",
    featured: false,
    isPopular: false,
    status: "draft",
  })


  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "category") {
      setFormData((prev) => ({
        ...prev,
        category: value,
        subcategory: "", // clear subcategory when category changes
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target
    // Remove any non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, "")
    setFormData((prev) => ({
      ...prev,
      [name]: numericValue,
    }))
  }

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) {
        const newTags = [...tags, tagInput.trim()]
        setTags(newTags)
        setFormData((prev) => ({ ...prev, tags: newTags.join(",") }))
        setTagInput("")
      }
    }
  }

  const removeTag = (index) => {
    const newTags = tags.filter((_, i) => i !== index)
    setTags(newTags)
    setFormData((prev) => ({ ...prev, tags: newTags.join(",") }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const newImages = files.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      url: URL.createObjectURL(file),
      isDefault: images.length === 0,
    }))
    setImages([...images, ...newImages])
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages.map((img) => img.file)],
    }))
  }

  const setDefaultImage = (id) => {
    setImages(
      images.map((img) => ({
        ...img,
        isDefault: img.id === id,
      })),
    )
  }

  const removeImage = (id) => {
    const imageToRemove = images.find((img) => img.id === id)
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.url)
    }
    const newImages = images.filter((img) => img.id !== id)
    const newDefaultImage =
      newImages.length > 0 && !newImages.some((img) => img.isDefault) ? { ...newImages[0], isDefault: true } : null
    setImages(
      newDefaultImage ? newImages.map((img) => (img.id === newDefaultImage.id ? newDefaultImage : img)) : newImages,
    )
    setFormData((prev) => ({
      ...prev,
      images: newImages.map((img) => img.file),
    }))
  }

  // New variant handling functions
  const addSizeColorCombination = () => {
    const newCombination = {
      id: Date.now(),
      size: "",
      colors: [],
    }
    setSizeColorCombinations([...sizeColorCombinations, newCombination])
  }

  const removeSizeColorCombination = (id) => {
    setSizeColorCombinations(sizeColorCombinations.filter((combo) => combo.id !== id))
  }

  const updateSizeColorCombination = (id, field, value) => {
    setSizeColorCombinations((prev) => prev.map((combo) => (combo.id === id ? { ...combo, [field]: value } : combo)))
  }

  const toggleColor = (combinationId, color) => {
    setSizeColorCombinations((prev) =>
      prev.map((combo) => {
        if (combo.id === combinationId) {
          const colors = combo.colors.includes(color)
            ? combo.colors.filter((c) => c !== color)
            : [...combo.colors, color]
          return { ...combo, colors }
        }
        return combo
      }),
    )
  }

  const generateVariants = () => {
    if (sizeColorCombinations.length === 0) {
      alert("Please add at least one size-color combination")
      return
    }

    const newVariants = []
    sizeColorCombinations.forEach((combo) => {
      if (combo.size && combo.colors.length > 0) {
        combo.colors.forEach((color) => {
          const variantId = `${combo.size}-${color}`
          // Check if this variant already exists
          const existingVariant = variantCombinations.find((v) => v.id === variantId)

          if (!existingVariant) {
            newVariants.push({
              id: variantId,
              name: `${combo.size} ${color}`,
              size: combo.size,
              color: color,
              sku: "",
              barcode: "",
              price: formData.price,
              salePrice: formData.salePrice,
              quantity: formData.quantity,
              weight: formData.weight,
              image: images.find((img) => img.isDefault)?.url || "",
            })
          }
        })
      }
    })

    // Add new variants to existing ones instead of replacing
    setVariantCombinations((prev) => [...prev, ...newVariants])

    // Show success message
    if (newVariants.length > 0) {
      alert(`${newVariants.length} new variant(s) added successfully!`)
    } else {
      alert("No new variants to add. All combinations already exist.")
    }
  }

  const regenerateAllVariants = () => {
    if (sizeColorCombinations.length === 0) {
      alert("Please add at least one size-color combination")
      return
    }

    const allVariants = []
    sizeColorCombinations.forEach((combo) => {
      if (combo.size && combo.colors.length > 0) {
        combo.colors.forEach((color) => {
          const variantId = `${combo.size}-${color}`
          // Find existing variant to preserve custom data
          const existingVariant = variantCombinations.find((v) => v.id === variantId)

          allVariants.push({
            id: variantId,
            name: `${combo.size} ${color}`,
            size: combo.size,
            color: color,
            sku: existingVariant?.sku || "",
            barcode: existingVariant?.barcode || "",
            price: existingVariant?.price || formData.price,
            salePrice: existingVariant?.salePrice || formData.salePrice,
            quantity: existingVariant?.quantity || formData.quantity,
            weight: existingVariant?.weight || formData.weight,
            image: existingVariant?.image || images.find((img) => img.isDefault)?.url || "",
          })
        })
      }
    })

    setVariantCombinations(allVariants)
    alert(`${allVariants.length} variant(s) regenerated successfully!`)
  }

  const removeVariant = (variantId) => {
    setVariantCombinations((prev) => prev.filter((variant) => variant.id !== variantId))
  }

  const clearAllVariants = () => {
    setVariantCombinations([])
    setSizeColorCombinations([])
  }

  // Remove the old clearVariants function as it's now replaced by clearAllVariants

  const nextStep = () => {
    if (currentStep === 1 && images.length === 0) {
      alert("Please upload at least one image")
      return
    }
    if (currentStep === 2) {
      if (!formData.title || !formData.price) {
        alert("Please fill all required fields")
        return
      }
    }
    setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // STEP 1: Create product
      const productPayload = {
        name: formData.title,
        slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, "-"),
        category_id: formData.category,
        subcategory_id: formData.subcategory || null,
        description: formData.description,
        price: formData.price,
        discount_price: formData.salePrice,
        stock: formData.quantity,
        popular: formData.isPopular,
        is_active: true,
        images: [], // We'll attach this after upload
        variants: hasVariants
          ? variantCombinations.map((v, index) => ({
            size: v.size,
            color: v.color,
            stock: v.quantity,
            price: v.price,
            sku: v.sku,
            index,
          }))
          : [],
      };

      const createRes = await axiosInstance.post("/products", [productPayload]);
      const createdProduct = createRes.data?.data?.[0];

      if (!createdProduct?._id) {
        throw new Error("Product creation failed");
      }

      // STEP 2: Upload images for the product
      for (const img of images) {
        const formDataImg = new FormData();
        formDataImg.append("image", img.file);
        await axiosInstance.post(`/products/${createdProduct._id}/images`, formDataImg, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      // STEP 3: Alert and Close
      Swal.fire({
        title: "Success!",
        text: "Product added successfully",
        icon: "success",
        confirmButtonColor: "#10B981", // Tailwind emerald-500
      });

      onAddProduct(createdProduct); // send new product to parent
      onClose(); // close modal

    } catch (err) {
      console.error("Submit failed:", err);
      Swal.fire({
        title: "Error",
        text: err.message || "Something went wrong",
        icon: "error",
      });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click()
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Upload Product Images"
      case 2:
        return "Basic Product Information"
      case 3:
        return "Product Variants"
      default:
        return "Add Product"
    }
  }

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Upload high-quality images of your product"
      case 2:
        return "Enter the basic details of your product"
      case 3:
        return "Configure product variants and combinations"
      default:
        return ""
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-end z-50 overflow-hidden" onClick={onClose}>
      <div
        className={`h-full w-full max-w-5xl bg-white dark:bg-gray-800 shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="w-full relative">
          <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
            <div>
              <h3 className="text-xl font-medium dark:text-gray-300">{getStepTitle()}</h3>
              <p className="mb-0 text-sm text-gray-600 dark:text-gray-400">{getStepDescription()}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          {/* Step Progress */}
          <div className="px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step <= currentStep
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-400"
                        }`}
                    >
                      {step}
                    </div>
                    {step < 3 && (
                      <div
                        className={`w-12 h-1 mx-2 ${step < currentStep ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-600"
                          }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              {currentStep === 2 && (
                <div className="flex items-center">
                  <span className="text-sm font-medium text-orange-500 dark:text-orange-400 mr-2">Has variants?</span>
                  <button
                    type="button"
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${hasVariants ? "bg-emerald-500" : "bg-red-500"
                      }`}
                    onClick={() => setHasVariants(!hasVariants)}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${hasVariants ? "translate-x-6" : "translate-x-1"
                        }`}
                    />
                  </button>
                  <span className="ml-2 text-sm font-medium">{hasVariants ? "Yes" : "No"}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {currentStep === 1 && (
            <div className="p-6 space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Product Images *
                </label>
                <div
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-emerald-500 transition-colors"
                  onClick={triggerFileInput}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*,.jpeg,.jpg,.png,.webp"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <UploadCloud className="mx-auto h-16 w-16 text-emerald-500 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Upload Product Images</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Drag and drop images here, or click to select files
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Only *.jpeg, *.webp and *.png images will be accepted
                  </p>
                </div>
                {images.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Uploaded Images ({images.length})
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {images.map((image) => (
                        <div key={image.id} className="relative group">
                          <img
                            src={image.url || "/placeholder.svg"}
                            alt="Preview"
                            className={`w-full h-32 object-cover rounded-lg border-2 cursor-pointer transition-all ${image.isDefault
                              ? "border-blue-500 ring-2 ring-blue-200"
                              : "border-gray-200 hover:border-gray-300"
                              }`}
                            onClick={() => setDefaultImage(image.id)}
                          />
                          {image.isDefault && (
                            <div className="absolute bottom-0 left-0 right-0 bg-blue-500 text-white text-xs text-center py-1 rounded-b-lg">
                              Default
                            </div>
                          )}
                          <button
                            type="button"
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeImage(image.id)
                            }}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Click on an image to set it as default
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="p-6 space-y-6">
              {/* Basic Information Form */}
              <div className="grid grid-cols-1 gap-6">
                {/* Product Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Product Title/Name *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-gray-300"
                    placeholder="Enter product title"
                    required
                  />
                </div>

                {/* Product Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Product Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-gray-300"
                    placeholder="Enter product description"
                  />
                </div>

                {/* Categories */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>

                  </div>
                  {categories.find((cat) => cat._id === formData.category)?.subcategories?.length > 0 && (
                    <div>
                      <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">
                        Subcategory
                      </label>
                      <select
                        id="subcategory"
                        name="subcategory"
                        value={formData.subcategory}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      >
                        <option value="">Select subcategory</option>
                        {categories
                          .find((cat) => cat._id === formData.category)
                          ?.subcategories.map((sub) => (
                            <option key={sub._id} value={sub._id}>
                              {sub.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Product Price *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handlePriceChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-gray-300"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="salePrice"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Sale Price
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="salePrice"
                        name="salePrice"
                        value={formData.salePrice}
                        onChange={handlePriceChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-gray-300"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="quantity"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Quantity
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-gray-300"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* SKU and Barcode */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="sku" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Product SKU
                    </label>
                    <input
                      type="text"
                      id="sku"
                      name="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-gray-300"
                      placeholder="Enter SKU"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="barcode"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Product Barcode
                    </label>
                    <input
                      type="text"
                      id="barcode"
                      name="barcode"
                      value={formData.barcode}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-gray-300"
                      placeholder="Enter barcode"
                    />
                  </div>
                </div>

                {/* Product Slug */}
                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Product Slug
                  </label>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-gray-300"
                    placeholder="product-slug"
                  />
                </div>

                {/* Product Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Product Tags
                  </label>
                  <div className="flex flex-wrap items-center border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 min-h-12">
                    {tags.map((tag, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-emerald-500 text-white rounded-full px-3 py-1 text-sm mr-2 mb-1"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          className="ml-2 focus:outline-none hover:bg-emerald-600 rounded-full p-1"
                          onClick={() => removeTag(index)}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    <input
                      type="text"
                      className="flex-grow bg-transparent focus:outline-none px-2 py-1 text-sm dark:text-gray-300 min-w-[120px]"
                      placeholder="Add tag (press Enter)"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                    />
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="form-checkbox h-5 w-5 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Mark as Featured Product</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="isPopular"
                      checked={formData.isPopular}
                      onChange={handleChange}
                      className="form-checkbox h-5 w-5 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Mark as Popular Product</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="p-6 space-y-6">
              {hasVariants ? (
                <div className="space-y-6">
                  {/* Size-Color Combinations */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Size & Color Combinations
                      </h4>
                      <button
                        type="button"
                        onClick={addSizeColorCombination}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Size
                      </button>
                    </div>

                    {sizeColorCombinations.length === 0 ? (
                      <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                        <p className="text-gray-500 dark:text-gray-400">
                          No size combinations added yet. Click "Add Size" to get started.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {sizeColorCombinations.map((combination) => (
                          <div
                            key={combination.id}
                            className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Size
                                  </label>
                                  <select
                                    value={combination.size}
                                    onChange={(e) => updateSizeColorCombination(combination.id, "size", e.target.value)}
                                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-600 dark:text-gray-300"
                                  >
                                    <option value="">Select Size</option>
                                    {availableSizes.map((size) => (
                                      <option key={size} value={size}>
                                        {size}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeSizeColorCombination(combination.id)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                              >
                                <Minus className="w-5 h-5" />
                              </button>
                            </div>

                            {combination.size && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  Colors for {combination.size}
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                  {availableColors.map((color) => (
                                    <label
                                      key={color}
                                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${combination.colors.includes(color)
                                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                                        : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
                                        }`}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={combination.colors.includes(color)}
                                        onChange={() => toggleColor(combination.id, color)}
                                        className="sr-only"
                                      />
                                      <div
                                        className={`w-4 h-4 rounded-full mr-2 border-2 ${color.toLowerCase() === "white" ? "border-gray-300" : "border-gray-400"
                                          }`}
                                        style={{ backgroundColor: color.toLowerCase() }}
                                      />
                                      <span className="text-sm text-gray-700 dark:text-gray-300">{color}</span>
                                    </label>
                                  ))}
                                </div>
                                {combination.colors.length > 0 && (
                                  <div className="mt-2">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      Selected: {combination.colors.join(", ")}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Variants Summary */}
                  {variantCombinations.length > 0 && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                            Current Variants: {variantCombinations.length}
                          </h5>
                          <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                            {variantCombinations.map((v) => v.name).join(", ")}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Generate Variants Buttons */}
                  <div className="flex justify-center space-x-4 flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={generateVariants}
                      className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                    >
                      Add New Variants
                    </button>
                    <button
                      type="button"
                      onClick={regenerateAllVariants}
                      className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    >
                      Regenerate All
                    </button>
                    <button
                      type="button"
                      onClick={clearAllVariants}
                      className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                    >
                      Clear All
                    </button>
                  </div>

                  {/* Variants Table */}
                  {variantCombinations.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Image
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Combination
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              SKU
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Price
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Sale Price
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Quantity
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {variantCombinations.map((variant, index) => (
                            <tr key={variant.id}>
                              <td className="px-4 py-3">
                                <div className="flex items-center">
                                  <img
                                    src={variant.image || "/placeholder.svg?height=40&width=40"}
                                    alt={variant.name}
                                    className="h-10 w-10 rounded-lg object-cover"
                                  />
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {variant.name}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{variant.id}</div>
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="text"
                                  value={variant.sku}
                                  onChange={(e) => {
                                    const newCombinations = [...variantCombinations]
                                    newCombinations[index].sku = e.target.value
                                    setVariantCombinations(newCombinations)
                                  }}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-300"
                                  placeholder="SKU"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="number"
                                  value={variant.price}
                                  onChange={(e) => {
                                    const newCombinations = [...variantCombinations]
                                    newCombinations[index].price = Number.parseFloat(e.target.value) || 0
                                    setVariantCombinations(newCombinations)
                                  }}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-300"
                                  step="0.01"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="number"
                                  value={variant.salePrice}
                                  onChange={(e) => {
                                    const newCombinations = [...variantCombinations]
                                    newCombinations[index].salePrice = Number.parseFloat(e.target.value) || 0
                                    setVariantCombinations(newCombinations)
                                  }}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-300"
                                  step="0.01"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="number"
                                  value={variant.quantity}
                                  onChange={(e) => {
                                    const newCombinations = [...variantCombinations]
                                    newCombinations[index].quantity = Number.parseInt(e.target.value) || 0
                                    setVariantCombinations(newCombinations)
                                  }}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-300"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newCombinations = variantCombinations.filter((_, i) => i !== index)
                                    setVariantCombinations(newCombinations)
                                  }}
                                  className="text-red-500 hover:text-red-700 transition-colors"
                                >
                                  <X size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Variants Selected</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    This product will be created without variants. You can enable variants in the previous step if
                    needed.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-800 p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 rounded-lg transition-colors"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </button>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 rounded-lg transition-colors"
              >
                Cancel
              </button>
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 rounded-lg transition-colors"
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 rounded-lg transition-colors"
                >
                  Add Product
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
