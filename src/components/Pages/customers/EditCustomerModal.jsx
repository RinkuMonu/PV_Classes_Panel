import { useState, useEffect } from "react";
import { X } from "lucide-react";
import axios from "axios";

const EditCustomerModal = ({ onClose, initialData = {}, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    id: initialData._id || "",
    name: initialData.name || "",
    email: initialData.email || "",
    phone: initialData.phone || "",
    address: initialData.address || ""
  });
  
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const url = import.meta.env.VITE_API_SERVER_URL;

  useEffect(() => {
    setIsVisible(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await axios.put(
        `${url}/api/users/update/${formData.id}`, 
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      
      if (response.data.success) {
        if (onUpdateSuccess) {
          onUpdateSuccess("Customer updated successfully");
        }
        // Close the modal after successful update
        setTimeout(() => {
          handleClose();
        }, 1000);
      }
    } catch (error) {
      console.error("Error updating customer:", error);
      if (onUpdateSuccess) {
        onUpdateSuccess("Failed to update customer", true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isVisible ? "opacity-50" : "opacity-0"
        }`}
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div
        className={`fixed inset-y-0 right-0 w-full max-w-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col w-full h-full justify-between bg-white dark:bg-gray-800">
          {/* Close Button */}
          <button 
            onClick={handleClose}
            className="absolute focus:outline-none z-10 text-red-500 hover:bg-red-100 hover:text-gray-700 transition-colors duration-150 bg-white shadow-md mr-6 mt-6 right-0 left-auto w-10 h-10 rounded-full block text-center"
          >
            <X className="mx-auto" />
          </button>

          {/* Header */}
          <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
            <h4 className="text-xl font-medium dark:text-gray-300">Update Customer</h4>
            <p className="mb-0 text-sm dark:text-gray-300">
              Update your Customer necessary information from here
            </p>
          </div>

          {/* Form */}
          <div className="w-full relative dark:bg-gray-700 dark:text-gray-200 h-full overflow-auto">
            <form onSubmit={handleSubmit}>
              <div className="p-6 flex-grow w-full pb-2">

                {/* Name */}
                <div className="mb-6">
                  <input type="hidden" name="id" value={formData.id} />
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-md px-3 py-2 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Enter name"
                  />
                </div>

                {/* Email */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-md px-3 py-2 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="example@example.com"
                  />
                </div>

                {/* Phone */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-md px-3 py-2 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Enter phone number"
                  />
                </div>

                {/* Address */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    required
                    className="w-full border rounded-md px-3 py-2 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Enter address"
                  ></textarea>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="sticky bottom-0 bg-gray-100 dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-end space-x-3">
                  <button
                    type="button" 
                    onClick={handleClose}
                    disabled={isLoading}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
                  >
                    {isLoading ? "Updating..." : "Submit"}
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

export default EditCustomerModal;