"use client"
import { useState, useRef, useEffect } from "react"
import { UploadCloud, X, DollarSign, Plus, Minus, Save } from "lucide-react"
import axiosInstance from "../../../config/AxiosInstance"
import Swal from "sweetalert2"

export default function UpdateProductForm({ product, isOpen, onClose, onSave }) {
  const [hasVariants, setHasVariants] = useState(product?.hasVariants || false)
  const [images, setImages] = useState([])
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState("")
  const fileInputRef = useRef(null)
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Available options
  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"]
  const availableColors = ["Red", "Blue", "Green", "Black", "White", "Yellow", "Purple", "Orange"]

  // Variant structure
  const [sizeColorCombinations, setSizeColorCombinations] = useState([])
  const [variantCombinations, setVariantCombinations] = useState([])

  const [formData, setFormData] = useState({
    // Basic Information
    title: "",
    description: "",
    shortDescription: "",
    category: "",
    subcategory: "",
    brand: "",
    manufacturer: "",

    // Pricing & Inventory
    price: "",
    salePrice: "",
    quantity: "",
    sku: "",
    barcode: "",
    trackQuantity: true,
    allowBackorders: false,
    lowStockThreshold: "",

    // Shipping & Physical
    weight: "",
    length: "",
    width: "",
    height: "",
    shippingClass: "",

    // SEO & Meta
    slug: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",

    // Product Settings
    featured: false,
    isPopular: false,
    status: "draft",
    visibility: "public",
    taxClass: "",

    // Additional Fields
    purchaseNote: "",
    menuOrder: 0,
    enableReviews: true,
    images: [],
  })

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/categories")
        if (res.data?.items && Array.isArray(res.data?.items)) {
          setCategories(res.data?.items)
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      }
    }
    if (isOpen) fetchCategories()
  }, [isOpen])

  // Fetch product data
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        if (isOpen && product?._id) {
          const res = await axiosInstance.get(`/products/${product._id}`);
          console.log(res.data);
          
          const fetchedProduct = res.data;

          if (!fetchedProduct || typeof fetchedProduct !== "object") {
            console.error("Invalid product data:", fetchedProduct);
            return;
          }

          setFormData((prev) => ({
            ...prev,
            title: fetchedProduct.name || "",
            slug: fetchedProduct.slug || "",
            description: fetchedProduct.description || "",
            shortDescription: fetchedProduct.short_description || "", // optional if you support it
            category: fetchedProduct.category_id || "",
            subcategory: fetchedProduct.subcategory_id || "",
            brand: fetchedProduct.brand || "",
            manufacturer: fetchedProduct.manufacturer || "",

            price: parseFloat(fetchedProduct.price?.$numberDecimal || "0"),
            salePrice: parseFloat(fetchedProduct.discount_price?.$numberDecimal || "0"),
            quantity: fetchedProduct.stock || 0,
            sku: fetchedProduct.sku || "",
            barcode: fetchedProduct.barcode || "",

            weight: fetchedProduct.weight || "",
            length: fetchedProduct.length || "",
            width: fetchedProduct.width || "",
            height: fetchedProduct.height || "",
            shippingClass: fetchedProduct.shippingClass || "",

            metaTitle: fetchedProduct.meta_title || "",
            metaDescription: fetchedProduct.meta_description || "",
            metaKeywords: fetchedProduct.meta_keywords || "",

            featured: fetchedProduct.featured || false,
            isPopular: fetchedProduct.popular || false,
            status: fetchedProduct.is_active ? "published" : "draft",
            visibility: fetchedProduct.visibility || "public",
            taxClass: fetchedProduct.tax_class || "",

            purchaseNote: fetchedProduct.purchase_note || "",
            menuOrder: fetchedProduct.menu_order || 0,
            enableReviews: fetchedProduct.enable_reviews ?? true,

            trackQuantity: fetchedProduct.track_quantity ?? true,
            allowBackorders: fetchedProduct.allow_backorders ?? false,
            lowStockThreshold: fetchedProduct.low_stock_threshold || "",
          }))
          setTags(typeof fetchedProduct?.tags === "string" ? fetchedProduct.tags.split(",") : [])
          setHasVariants(fetchedProduct.hasVariants || false);

          // ✅ If variants exist
          if (fetchedProduct.variants?.length > 0) {
            setVariantCombinations(
              fetchedProduct.variants.map((v) => ({
                id: `${v.size}-${v.color}`,
                name: `${v.size} ${v.color}`,
                size: v.size,
                color: v.color,
                sku: v.sku || "",
                price: parseFloat(v.price?.$numberDecimal || "0"),
                salePrice: parseFloat(v.sale_price?.$numberDecimal || "0"),
                quantity: v.stock || 0,
              }))
            )

            // Optional: generate options for select dropdowns
            // const sizes = [
            //   ...new Set(fetchedProduct.variants.map((v) => v.size).filter(Boolean)),
            // ];
            // const colors = [
            //   ...new Set(fetchedProduct.variants.map((v) => v.color).filter(Boolean)),
            // ];
            // setVariantOptions({ size: sizes, color: colors });
          }

          // ✅ Existing images
          if (fetchedProduct.images?.length > 0) {
            const existingImages = fetchedProduct.images.map((img, index) => ({
              id: index,
              url: img.image_url,
              file: null,
              isDefault: img.is_primary || index === 0,
              isExisting: true,
            }))
            setImages(existingImages)
          }
        }
      } catch (err) {
        console.error("❌ Error fetching product details:", err);
      }
    };

    fetchProductDetails();
  }, [isOpen, product?._id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name === "category") {
      setFormData((prev) => ({
        ...prev,
        category: value,
        subcategory: "",
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }))
    }
  }

  const handlePriceChange = (e) => {
    const { name, value } = e.target
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
      isExisting: false,
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
    if (imageToRemove && !imageToRemove.isExisting) {
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
      images: newImages.filter((img) => !img.isExisting).map((img) => img.file),
    }))
  }

  // Variant handling functions
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
    setVariantCombinations((prev) => [...prev, ...newVariants])
    if (newVariants.length > 0) {
      alert(`${newVariants.length} new variant(s) added successfully!`)
    }
  }

  const clearAllVariants = () => {
    setVariantCombinations([])
    setSizeColorCombinations([])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const productPayload = {
        name: formData.title,
        slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, "-"),
        category_id: formData.category,
        subcategory_id: formData.subcategory || null,
        description: formData.description,
        short_description: formData.shortDescription,
        price: formData.price,
        discount_price: formData.salePrice,
        stock: formData.quantity,
        sku: formData.sku,
        barcode: formData.barcode,
        weight: formData.weight,
        length: formData.length,
        width: formData.width,
        height: formData.height,
        brand: formData.brand,
        manufacturer: formData.manufacturer,
        meta_title: formData.metaTitle,
        meta_description: formData.metaDescription,
        meta_keywords: formData.metaKeywords,
        featured: formData.featured,
        popular: formData.isPopular,
        status: formData.status,
        visibility: formData.visibility,
        tax_class: formData.taxClass,
        shipping_class: formData.shippingClass,
        track_quantity: formData.trackQuantity,
        allow_backorders: formData.allowBackorders,
        low_stock_threshold: formData.lowStockThreshold,
        purchase_note: formData.purchaseNote,
        menu_order: formData.menuOrder,
        enable_reviews: formData.enableReviews,
        tags: tags.join(","),
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
      }

      const updateRes = await axiosInstance.put(`/products/${product._id}`, productPayload)

      // Upload new images if any
      const newImages = images.filter((img) => !img.isExisting && img.file)
      for (const img of newImages) {
        const formDataImg = new FormData()
        formDataImg.append("image", img.file)
        await axiosInstance.post(`/products/${product._id}/images`, formDataImg, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      }

      Swal.fire({
        title: "Success!",
        text: "Product updated successfully",
        icon: "success",
        confirmButtonColor: "#10B981",
      })

      onSave(updateRes.data?.product || updateRes.data)
      onClose()
    } catch (err) {
      console.error("Update failed:", err)
      Swal.fire({
        title: "Error",
        text: err.message || "Something went wrong",
        icon: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current.click()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-hidden" onClick={onClose}>
      <div
        className="h-full w-full max-w-7xl bg-white dark:bg-gray-800 shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Update Product</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Update all product information and settings</p>
          </div>
          <div className="flex items-center space-x-3">
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
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Basic Information */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Basic Information</h4>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Product Title *
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
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-gray-300"
                        placeholder="Enter detailed product description"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="shortDescription"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Short Description
                      </label>
                      <textarea
                        id="shortDescription"
                        name="shortDescription"
                        value={formData.shortDescription}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-gray-300"
                        placeholder="Enter short description"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="brand"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                          Brand
                        </label>
                        <input
                          type="text"
                          id="brand"
                          name="brand"
                          value={formData.brand}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-gray-300"
                          placeholder="Enter brand name"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="manufacturer"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                          Manufacturer
                        </label>
                        <input
                          type="text"
                          id="manufacturer"
                          name="manufacturer"
                          value={formData.manufacturer}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-gray-300"
                          placeholder="Enter manufacturer name"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Images */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Product Images</h4>
                  <div
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-emerald-500 transition-colors mb-4"
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
                    <UploadCloud className="mx-auto h-12 w-12 text-emerald-500 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Upload Product Images</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Drag and drop images here, or click to select files
                    </p>
                  </div>
                  {images.length > 0 && (
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
                  )}
                </div>

                {/* Pricing & Inventory */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Pricing & Inventory</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label
                        htmlFor="price"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Regular Price *
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
                        Stock Quantity
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label htmlFor="sku" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        SKU
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
                        Barcode
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
                    <div>
                      <label
                        htmlFor="lowStockThreshold"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Low Stock Threshold
                      </label>
                      <input
                        type="number"
                        id="lowStockThreshold"
                        name="lowStockThreshold"
                        value={formData.lowStockThreshold}
                        onChange={handleChange}
                        min="0"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-gray-300"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="trackQuantity"
                        checked={formData.trackQuantity}
                        onChange={handleChange}
                        className="form-checkbox h-5 w-5 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                      <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                        Track quantity for this product
                      </span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="allowBackorders"
                        checked={formData.allowBackorders}
                        onChange={handleChange}
                        className="form-checkbox h-5 w-5 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                      <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Allow backorders</span>
                    </label>
                  </div>
                </div>

                {/* Shipping & Physical Properties */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Shipping & Physical Properties
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label
                        htmlFor="weight"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        id="weight"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-gray-300"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="length"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Length (cm)
                      </label>
                      <input
                        type="number"
                        id="length"
                        name="length"
                        value={formData.length}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-gray-300"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="width"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Width (cm)
                      </label>
                      <input
                        type="number"
                        id="width"
                        name="width"
                        value={formData.width}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-gray-300"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="height"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Height (cm)
                      </label>
                      <input
                        type="number"
                        id="height"
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-gray-300"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="shippingClass"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Shipping Class
                    </label>
                    <select
                      id="shippingClass"
                      name="shippingClass"
                      value={formData.shippingClass}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-gray-300"
                    >
                      <option value="">No shipping class</option>
                      <option value="standard">Standard</option>
                      <option value="express">Express</option>
                      <option value="overnight">Overnight</option>
                    </select>
                  </div>
                </div>

                {/* SEO & Meta Information */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    SEO & Meta Information
                  </h4>
                  <div className="space-y-4">
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
                    <div>
                      <label
                        htmlFor="metaTitle"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Meta Title
                      </label>
                      <input
                        type="text"
                        id="metaTitle"
                        name="metaTitle"
                        value={formData.metaTitle}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-gray-300"
                        placeholder="Enter meta title"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="metaDescription"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Meta Description
                      </label>
                      <textarea
                        id="metaDescription"
                        name="metaDescription"
                        value={formData.metaDescription}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-gray-300"
                        placeholder="Enter meta description"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="metaKeywords"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Meta Keywords
                      </label>
                      <input
                        type="text"
                        id="metaKeywords"
                        name="metaKeywords"
                        value={formData.metaKeywords}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-gray-300"
                        placeholder="keyword1, keyword2, keyword3"
                      />
                    </div>
                  </div>
                </div>

                {/* Product Variants */}
                {hasVariants && (
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Product Variants</h4>

                    {/* Size-Color Combinations */}
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center">
                        <h5 className="text-md font-medium text-gray-900 dark:text-gray-100">
                          Size & Color Combinations
                        </h5>
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
                                      onChange={(e) =>
                                        updateSizeColorCombination(combination.id, "size", e.target.value)
                                      }
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
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Generate Variants Buttons */}
                    <div className="flex justify-center space-x-4 flex-wrap gap-2 mb-6">
                      <button
                        type="button"
                        onClick={generateVariants}
                        className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                      >
                        Generate Variants
                      </button>
                      <button
                        type="button"
                        onClick={clearAllVariants}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
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
                                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {variant.name}
                                  </div>
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
                )}
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                {/* Categories */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Categories</h4>
                  <div className="space-y-4">
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
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-gray-300"
                        required
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
                        <label
                          htmlFor="subcategory"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                          Subcategory
                        </label>
                        <select
                          id="subcategory"
                          name="subcategory"
                          value={formData.subcategory}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-gray-300"
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
                </div>

                {/* Product Tags */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Product Tags</h4>
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

                {/* Product Settings */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Product Settings</h4>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="status"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-gray-300"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="private">Private</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="visibility"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Visibility
                      </label>
                      <select
                        id="visibility"
                        name="visibility"
                        value={formData.visibility}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-gray-300"
                      >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                        <option value="password">Password Protected</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="taxClass"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Tax Class
                      </label>
                      <select
                        id="taxClass"
                        name="taxClass"
                        value={formData.taxClass}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-gray-300"
                      >
                        <option value="">Standard</option>
                        <option value="reduced">Reduced Rate</option>
                        <option value="zero">Zero Rate</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="menuOrder"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Menu Order
                      </label>
                      <input
                        type="number"
                        id="menuOrder"
                        name="menuOrder"
                        value={formData.menuOrder}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-gray-300"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Product Features */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Product Features</h4>
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
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="enableReviews"
                        checked={formData.enableReviews}
                        onChange={handleChange}
                        className="form-checkbox h-5 w-5 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                      <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Enable Reviews</span>
                    </label>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Additional Information
                  </h4>
                  <div>
                    <label
                      htmlFor="purchaseNote"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Purchase Note
                    </label>
                    <textarea
                      id="purchaseNote"
                      name="purchaseNote"
                      value={formData.purchaseNote}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-gray-300"
                      placeholder="Enter purchase note for customers"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6 mt-8">
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Update Product
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
