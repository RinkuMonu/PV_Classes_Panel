import { useState, useEffect } from "react";
import { X } from "lucide-react";

const AddAttributeModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    title: "",
    displayName: "",
    option: "",
    variants: [],
    type: "Color" // Default type
  });

  const [isVisible, setIsVisible] = useState(false);
  const [newVariant, setNewVariant] = useState("");

  useEffect(() => {
    setIsVisible(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAttribute = {
      ...formData,
      id: `ATTR-${Date.now()}`
    };
    onAdd(newAttribute);
    handleClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddVariant = (e) => {
    if (e.key === 'Enter' && newVariant.trim()) {
      e.preventDefault();
      setFormData(prev => ({
        ...prev,
        variants: [...prev.variants, newVariant.trim()]
      }));
      setNewVariant("");
    }
  };

  const handleRemoveVariant = (index) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
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
        className={`fixed inset-y-0 right-0 w-full max-w-3xl z-50 transform transition-transform duration-300 ease-in-out ${
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
            <div className="flex md:flex-row flex-col justify-between items-center">
              <div>
                <h4 className="text-xl font-medium dark:text-gray-300">Add Attribute Value</h4>
                <p className="mb-0 text-sm dark:text-gray-300">
                  Add your attribute values and necessary information from here
                </p>
              </div>
              {/* <select
                name="language"
                className="block w-20 h-10 border border-emerald-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 text-sm dark:text-gray-300 focus:outline-none rounded-md form-select focus:bg-white dark:focus:bg-gray-700"
              >
                <option value="en" hidden>en</option>
                <option value="fr">fr</option>
                <option value="ur">ur</option>
                <option value="hi">hi</option>
                <option value="ar">ar</option>
                <option value="de">de</option>
              </select> */}
            </div>
          </div>

          {/* Form */}
          <div className="w-full relative dark:bg-gray-700 dark:text-gray-200 h-full overflow-auto">
            <form onSubmit={handleSubmit}>
              <div className="px-6 pt-8 flex-grow w-full pb-40">
                {/* Attribute Title */}
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <label className="block text-sm text-gray-800 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium">
                    Attribute Title
                  </label>
                  <div className="col-span-8 sm:col-span-4">
                    <input
                      className="block w-full h-12 border px-3 py-1 text-sm focus:outline-none dark:text-gray-300 leading-5 rounded-md bg-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:border-gray-200 border-gray-200 dark:border-gray-600 dark:focus:border-gray-500 dark:bg-gray-700 p-2"
                      type="text"
                      name="title"
                      placeholder="Color or Size or Dimension or Material or Fabric"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Display Name */}
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6 relative">
                  <label className="block text-sm text-gray-800 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium">
                    Display Name
                  </label>
                  <div className="col-span-8 sm:col-span-4">
                    <input
                      className="block w-full h-12 border px-3 py-1 text-sm focus:outline-none dark:text-gray-300 leading-5 rounded-md bg-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:border-gray-200 border-gray-200 dark:border-gray-600 dark:focus:border-gray-500 dark:bg-gray-700 p-2"
                      type="text"
                      name="displayName"
                      placeholder="Display Name"
                      value={formData.displayName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Options */}
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6 relative">
                  <label className="block text-sm text-gray-800 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium">
                    Options
                  </label>
                  <div className="col-span-8 sm:col-span-4">
                    <select
                      className="block w-full h-12 border bg-gray-100 px-2 py-1 text-sm dark:text-gray-300 focus:outline-none rounded-md form-select focus:bg-white dark:focus:bg-gray-700 focus:border-gray-200 border-gray-200 dark:border-gray-600 focus:shadow-none dark:focus:border-gray-500 dark:bg-gray-700 leading-5"
                      name="option"
                      value={formData.option}
                      onChange={handleChange}
                      required
                    >
                      <option value="" hidden>Select type</option>
                      <option value="Dropdown">Dropdown</option>
                      <option value="Radio">Radio</option>
                    </select>
                  </div>
                </div>

                {/* Variants */}
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6 relative">
                  <label className="block text-sm text-gray-800 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium">
                    Variants
                  </label>
                  <div className="col-span-8 sm:col-span-4">
                    <div className="react-tag-input border rounded-md bg-gray-100 dark:bg-gray-700 p-2 min-h-12">
                      <ul id="tags" className="flex flex-wrap gap-2 mb-2">
                        {formData.variants.map((variant, index) => (
                          <li key={index} className="react-tag-input__tag bg-emerald-100 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-100 px-3 py-1 rounded-md flex items-center">
                            <span className="tag-title react-tag-input__tag__content">{variant}</span>
                            <button
                              type="button"
                              className="react-tag-input__tag__remove ml-2 text-emerald-600 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-100"
                              onClick={() => handleRemoveVariant(index)}
                            >
                              <X size={14} />
                            </button>
                          </li>
                        ))}
                      </ul>
                      <input
                        className="react-tag-input__input w-full bg-transparent focus:outline-none px-2 py-1"
                        type="text"
                        placeholder="Press enter to add variant"
                        value={newVariant}
                        onChange={(e) => setNewVariant(e.target.value)}
                        onKeyDown={handleAddVariant}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="fixed z-10 bottom-0 w-full right-0 py-4 lg:py-8 px-6 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex bg-gray-50 border-t border-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm text-gray-600 border-gray-200 border dark:text-gray-400 bg-gray-200 hover:bg-red-50 hover:border-red-100 hover:text-red-600 dark:bg-gray-700 dark:border-gray-700 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-red-700 w-full h-12"
                  >
                    Cancel
                  </button>
                </div>
                <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                  <button
                    type="submit"
                    className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm text-white bg-emerald-500 border border-transparent active:bg-emerald-600 hover:bg-emerald-600 w-full h-12"
                  >
                    <span>Add Attribute</span>
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

export default AddAttributeModal;