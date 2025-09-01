import { useState, useEffect } from "react";
import { CloudUpload, X, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import Swal from "sweetalert2";
import axiosInstance from "../../../config/AxiosInstance";


const AddCouponModal = ({ onClose, onAdd, coupon }) => {
  const [formData, setFormData] = useState({
    campaignName: coupon?.campaignName || "",
    campaignCode: coupon?.code || "",
    discountValue: coupon?.discount ? coupon.discount.replace(/%|\$/g, "") : "",
    minAmount: coupon?.minAmount || "",
    published: coupon?.published ?? true,
  });

  const [isVisible, setIsVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(coupon?.image || null);
  const [isPercentage, setIsPercentage] = useState(
    coupon?.discount ? coupon.discount.includes("%") : true
  );
  const [date, setDate] = useState(
    coupon?.endDate ? format(new Date(coupon.endDate), "yyyy-MM-dd'T'HH:mm") : ""
  );

  useEffect(() => {
    setIsVisible(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const newCoupon = {
  //     campaignName: formData.campaignName,
  //     code: formData.campaignCode,
  //     discount: isPercentage ? `${formData.discountValue}%` : `$${formData.discountValue}`,
  //     minAmount: formData.minAmount,
  //     published: formData.published,
  //     endDate: date ? new Date(date) : new Date(),
  //     image: selectedFile ? URL.createObjectURL(selectedFile) : previewImage || "/placeholder.svg"
  //   };
  //   onAdd(newCoupon);
  //   handleClose();
  // };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    } else {
      alert('Please select a valid image file (JPEG, PNG, or WEBP)');
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewImage(null);
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const toggleDiscountType = () => {
    setIsPercentage(!isPercentage);
  };

  const togglePublished = () => {
    setFormData(prev => ({ ...prev, published: !prev.published }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newCouponData = {
      campaign_name: formData.campaignName,
      code: formData.campaignCode,
      discount_type: isPercentage ? "percent" : "fixed",
      discount_value: parseFloat(formData.discountValue),
      min_order_amount: parseFloat(formData.minAmount),
      valid_from: new Date().toISOString(), // Or allow user to select
      valid_to: date ? new Date(date).toISOString() : new Date().toISOString(),
      is_active: formData.published,
      usage_limit: 100, // You can make this dynamic if needed
    };

    try {
      // 1. Create Coupon
      const res = await axiosInstance.post("/coupons", newCouponData);
      const createdCoupon = res.data;

      // 2. Upload Image (if file is selected)
      if (selectedFile) {
        const formData = new FormData();
        formData.append("image", selectedFile);
        await axiosInstance.post(`/coupons/upload/${createdCoupon._id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      // 3. Success Alert
      Swal.fire({
        icon: "success",
        title: coupon ? "Coupon updated successfully!" : "Coupon created successfully!",
        showConfirmButton: false,
        timer: 2000,
      });

      // Optional: Call parent handler if needed
      onAdd(createdCoupon);
      handleClose();

    } catch (error) {
      console.error("Coupon creation failed:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Something went wrong. Please try again!",
      });
    }
  };


  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${isVisible ? 'opacity-50' : 'opacity-0'
          }`}
        onClick={handleClose}
      ></div>

      <div
        className={`fixed inset-y-0 right-0 w-full max-w-3xl z-50 transform transition-transform duration-300 ease-in-out ${isVisible ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex flex-col w-full h-full justify-between bg-white dark:bg-gray-800">
          {/* Header */}
          <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
            <div className="flex md:flex-row flex-col justify-between items-center">
              <div>
                <h4 className="text-xl font-medium dark:text-gray-300">
                  {coupon ? 'Edit Coupon' : 'Add Coupon'}
                </h4>
                <p className="mb-0 text-sm dark:text-gray-300">
                  {coupon ? 'Edit your coupon details' : 'Add your coupon and necessary information from here'}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="absolute focus:outline-none z-10 text-red-500 hover:bg-red-100 hover:text-gray-700 transition-colors duration-150 bg-white shadow-md mr-6 mt-6 right-0 left-auto w-10 h-10 rounded-full block text-center"
              >
                <X size={24} className="mx-auto" />
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="w-full relative dark:bg-gray-700 dark:text-gray-200 h-full overflow-auto">
            <form onSubmit={handleSubmit}>
              <div className="px-6 pt-8 flex-grow w-full pb-2">
                {/* Banner Image */}
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <label className="block text-sm text-gray-800 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium">
                    Coupon Banner Image
                  </label>
                  <div className="col-span-8 sm:col-span-4">
                    <div className="w-full text-center">
                      <label className="border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer px-6 pt-5 pb-6 flex flex-col items-center">
                        <input
                          accept="image/*,.jpeg,.jpg,.png,.webp"
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                        <CloudUpload className="text-3xl text-emerald-500 mb-2" />
                        <p className="text-sm mt-2">Drag your images here</p>
                        <em className="text-xs text-gray-400">
                          (Only *.jpeg, *.webp and *.png images will be accepted)
                        </em>
                      </label>
                      {previewImage && (
                        <aside className="flex flex-row flex-wrap mt-4">
                          <div className="relative">
                            <img
                              className="inline-flex border rounded-md border-gray-100 dark:border-gray-600 w-24 max-h-24 p-2 object-cover"
                              src={previewImage}
                              alt="coupon banner"
                            />
                            <button
                              type="button"
                              className="absolute top-0 right-0 text-red-500 focus:outline-none bg-white rounded-full p-1"
                              onClick={removeImage}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </aside>
                      )}
                    </div>
                  </div>
                </div>

                {/* Campaign Name */}
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <label className="block text-sm text-gray-800 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium">
                    Campaign Name
                  </label>
                  <div className="col-span-8 sm:col-span-4">
                    <input
                      className="block w-full h-12 border px-3 py-1 text-sm focus:outline-none dark:text-gray-300 leading-5 rounded-md bg-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:border-gray-200 border-gray-200 dark:border-gray-600 dark:focus:border-gray-500 dark:bg-gray-700 p-2"
                      type="text"
                      name="campaignName"
                      placeholder="Campaign Name"
                      value={formData.campaignName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Campaign Code */}
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <label className="block text-sm text-gray-800 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium">
                    Campaign Code
                  </label>
                  <div className="col-span-8 sm:col-span-4">
                    <input
                      className="block w-full h-12 border px-3 py-1 text-sm focus:outline-none dark:text-gray-300 leading-5 rounded-md bg-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:border-gray-200 border-gray-200 dark:border-gray-600 dark:focus:border-gray-500 dark:bg-gray-700 p-2"
                      type="text"
                      name="campaignCode"
                      placeholder="Campaign Code"
                      value={formData.campaignCode}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Coupon Validity Time */}
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <label className="block text-sm text-gray-800 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium">
                    Coupon Validity Time
                  </label>
                  <div className="col-span-8 sm:col-span-4">
                    <div className="relative">
                      <input
                        className="block w-full h-12 border px-3 py-1 text-sm focus:outline-none dark:text-gray-300 leading-5 rounded-md bg-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:border-gray-200 border-gray-200 dark:border-gray-600 dark:focus:border-gray-500 dark:bg-gray-700 pl-10 pr-3"
                        type="datetime-local"
                        name="endDate"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                      />
                      <CalendarIcon className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Discount Type */}
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <label className="block text-sm text-gray-800 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium">
                    Discount Type
                  </label>
                  <div className="col-span-8 sm:col-span-4">
                    <div className="mb-3">
                      <div className="flex flex-wrap items-center">
                        <div
                          className={`relative inline-block w-[125px] h-[33px] rounded-full cursor-pointer transition-colors duration-200 ${isPercentage ? 'bg-emerald-500' : 'bg-red-500'
                            }`}
                          onClick={toggleDiscountType}
                        >
                          <div
                            className={`absolute top-[2.5px] w-[28px] h-[28px] bg-white rounded-full transition-transform duration-200 ${isPercentage ? 'translate-x-[94.5px]' : 'translate-x-[2.5px]'
                              }`}
                          ></div>
                          <span
                            className={`absolute top-0 left-0 w-1/2 h-full flex items-center justify-center text-white text-sm ml-2 ${isPercentage ? 'opacity-100' : 'opacity-0'
                              }`}
                          >
                            Percentage
                          </span>
                          <span
                            className={`absolute top-0 right-0 w-1/2 h-full flex items-center justify-center text-white text-sm ${!isPercentage ? 'opacity-100' : 'opacity-0'
                              }`}
                          >
                            Fixed
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Discount */}
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <label className="block text-sm text-gray-800 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium">
                    DISCOUNT
                  </label>
                  <div className="col-span-8 sm:col-span-4">
                    <div className="flex flex-row">
                      <span className="inline-flex items-center px-3 rounded rounded-r-none border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm focus:border-emerald-300 dark:bg-gray-700 dark:text-gray-300 dark:border dark:border-gray-600">
                        {isPercentage ? '%' : '₹'}
                      </span>
                      <input
                        className="block w-full h-12 border px-3 py-1 text-sm focus:outline-none dark:text-gray-300 leading-5 rounded-md bg-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:border-gray-200 border-gray-200 dark:border-gray-600 dark:focus:border-gray-500 dark:bg-gray-700 p-2 rounded-l-none"
                        type="number"
                        name="discountValue"
                        value={formData.discountValue}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        max={isPercentage ? "100" : ""}
                        placeholder={isPercentage ? 'Percentage' : 'Fixed Amount'}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Minimum Amount */}
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <label className="block text-sm text-gray-800 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium">
                    Minimum Amount
                  </label>
                  <div className="col-span-8 sm:col-span-4">
                    <div className="flex flex-row">
                      <span className="inline-flex items-center px-3 rounded rounded-r-none border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm focus:border-emerald-300 dark:bg-gray-700 dark:text-gray-300 dark:border dark:border-gray-600">
                        ₹
                      </span>
                      <input
                        className="block w-full h-12 border px-3 py-1 text-sm focus:outline-none dark:text-gray-300 leading-5 rounded-md bg-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:border-gray-200 border-gray-200 dark:border-gray-600 dark:focus:border-gray-500 dark:bg-gray-700 p-2 rounded-l-none"
                        type="number"
                        name="minAmount"
                        value={formData.minAmount}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        placeholder="Minimum amount required"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Published */}
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <label className="block text-sm text-gray-800 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium">
                    Published
                  </label>
                  <div className="col-span-8 sm:col-span-4">
                    <div className="mb-3">
                      <div className="flex flex-wrap items-center">
                        <div
                          className={`relative inline-block w-[80px] h-[30px] rounded-full cursor-pointer transition-colors duration-200 ${formData.published ? 'bg-emerald-500' : 'bg-red-500'
                            }`}
                          onClick={togglePublished}
                        >
                          <div
                            className={`absolute top-[1px] w-[28px] h-[28px] bg-white rounded-full transition-transform duration-200 ${formData.published ? 'translate-x-[51px]' : 'translate-x-[1px]'
                              }`}
                          ></div>
                          <span
                            className={`absolute top-0 left-0 w-[45px] h-full flex items-center justify-center text-white text-sm ${formData.published ? 'opacity-100' : 'opacity-0'
                              }`}
                          >
                            Yes
                          </span>
                          <span
                            className={`absolute top-0 right-0 w-[45px] h-full flex items-center justify-center text-white text-sm ${!formData.published ? 'opacity-100' : 'opacity-0'
                              }`}
                          >
                            No
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="sticky bottom-0 bg-gray-100 dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600  shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent  shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  >
                    <span>{coupon ? 'Update Coupon' : 'Add Coupon'}</span>
                  </button>

                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddCouponModal;