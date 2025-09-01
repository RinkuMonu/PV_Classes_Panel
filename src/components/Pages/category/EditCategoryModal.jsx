import { useState, useEffect } from "react";
import { CloudUpload, Folder, X } from "lucide-react";
import axiosInstance from "../../../config/AxiosInstance"; // adjust path as needed
import Swal from "sweetalert2";



const EditCategoryModal = ({ category, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: category?.name || "",
    description: category?.description || "",
    published: category?.published ?? true,
    parentId: category?.parentId || null,
    language: "en"
  });

  const [isVisible, setIsVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(category?.icon || null);

  useEffect(() => {
    setIsVisible(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
      if (previewImage && previewImage.startsWith('blob:')) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        published: formData.published,
        parentId: formData.parentId,
        language: formData.language,
        // Add icon if you're uploading image as base64 or URL string
      };
      console.log("Updating category with ID:", category._id);
      const response = await axiosInstance.put(`/categories/${category._id}`, payload);

      // Optional: update parent state
      if (onUpdate) {
        onUpdate(response.data); // or pass payload if you prefer
      }

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Category updated successfully",
        timer: 2000,
        showConfirmButton: false,
      });

      handleClose();

    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error?.response?.data?.message || "Something went wrong",
      });
    }
  };



  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && ["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    } else {
      alert("Please select a valid image file (JPEG, PNG, or WEBP)");
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewImage(null);
  };

  const togglePublished = () => {
    setFormData(prev => ({
      ...prev,
      published: !prev.published
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
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${isVisible ? "opacity-50" : "opacity-0"
          }`}
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div
        className={`fixed inset-y-0 right-0 w-full max-w-3xl z-50 transform transition-transform duration-300 ease-in-out ${isVisible ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="drawer-content h-full bg-white dark:bg-gray-800">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute focus:outline-none z-10 text-red-500 hover:bg-red-100 hover:text-gray-700 transition-colors duration-150 bg-white shadow-md mr-6 mt-6 right-0 left-auto w-10 h-10 rounded-full block text-center"
          >
            <X className="mx-auto" />
          </button>

          <div className="flex flex-col w-full h-full justify-between">
            {/* Header */}
            <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
              <div className="flex md:flex-row flex-col justify-between mr-20">
                <div>
                  <h4 className="text-xl font-medium dark:text-gray-300">Update Category</h4>
                  <p className="mb-0 text-sm dark:text-gray-300">
                    Update your Product category and necessary information from here
                  </p>
                </div>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="block w-20 h-10 border border-emerald-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 text-sm dark:text-gray-300 focus:outline-none rounded-md form-select focus:bg-white dark:focus:bg-gray-700"
                >
                  <option value="en">en</option>
                  <option value="fr">fr</option>
                  <option value="ur">ur</option>
                  <option value="hi">hi</option>
                  <option value="ar">ar</option>
                  <option value="de">de</option>
                </select>
              </div>
            </div>

            {/* Form */}
            <div className="w-full relative dark:bg-gray-700 dark:text-gray-200 h-full overflow-auto">
              <form onSubmit={handleSubmit}>
                <div className="p-6 flex-grow w-full pb-2">
                  {/* Name */}
                  <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <label className="block text-sm text-gray-800 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium">
                      Name
                    </label>
                    <div className="col-span-8 sm:col-span-4">
                      <input
                        className="block w-full h-12 border px-3 py-1 text-sm focus:outline-none dark:text-gray-300 leading-5 rounded-md bg-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:border-gray-200 border-gray-200 dark:border-gray-600 dark:focus:border-gray-500 dark:bg-gray-700 p-2"
                        type="text"
                        name="name"
                        placeholder="Category title"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <label className="block text-sm text-gray-800 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium">
                      Description
                    </label>
                    <div className="col-span-8 sm:col-span-4">
                      <textarea
                        className="block w-full border bg-gray-100 focus:bg-white text-sm dark:text-gray-300 rounded-md focus:outline-none p-3 border-gray-200 dark:border-gray-600 dark:focus:border-gray-600 dark:bg-gray-700"
                        name="description"
                        placeholder="Category Description"
                        rows="4"
                        value={formData.description}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                  </div>

                  {/* Parent Category */}
                  <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <label className="block text-sm text-gray-800 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium">
                      Parent Category
                    </label>
                    <div className="col-span-8 sm:col-span-4 relative">
                      <div className="flex items-center">
                        <Folder className="text-gray-400 mr-2" />
                        <input
                          className="block w-full h-12 border px-3 py-1 text-sm focus:outline-none dark:text-gray-300 leading-5 rounded-md bg-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:border-gray-200 border-gray-200 dark:border-gray-600 dark:focus:border-gray-500 dark:bg-gray-700"
                          type="text"
                          readOnly
                          name="parent"
                          placeholder="Parent Category"
                          value={formData.parentId || "None"}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Category Image */}
                  <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <label className="block text-sm text-gray-800 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium">
                      Category Image
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
                          <CloudUpload className="text-3xl text-emerald-500" />
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
                                alt="category preview"
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

                  {/* Published */}
                  <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <label className="block text-sm text-gray-800 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium">
                      Published
                    </label>
                    <div className="col-span-8 sm:col-span-4">
                      <div className="flex items-center">
                        <button
                          type="button"
                          className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none ${formData.published ? 'bg-emerald-500' : 'bg-gray-300'
                            }`}
                          onClick={togglePublished}
                        >
                          <span
                            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${formData.published ? 'translate-x-7' : 'translate-x-1'
                              }`}
                          />
                        </button>
                        <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                          {formData.published ? 'Yes' : 'No'}
                        </span>
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
                      Add Category
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditCategoryModal;