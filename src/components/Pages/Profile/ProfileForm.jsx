import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import axiosInstance from '../../../config/AxiosInstance';
// import axiosInstance from '../../../config/AxiosInstance';
// import axios from 'axios';
// import axiosInstance from '';


const ProfileForm = ({
  initialData = {
    name: '',
    email: '',
    phone: '',
    role: ''
  },
  roleOptions = [
    // { value: '', label: 'Staff role', hidden: true },
    { value: 'Super Admin', label: 'Super Admin' },
    { value: 'Admin', label: 'Admin' },
    // { value: 'Cashier', label: 'Cashier' },
    // { value: 'CEO', label: 'CEO' },
    // { value: 'Manager', label: 'Manager' },
    // { value: 'Accountant', label: 'Accountant' },
    // { value: 'Driver', label: 'Driver' },
    // { value: 'Security Guard', label: 'Security Guard' },
    // { value: 'Deliver Person', label: 'Delivery Person' }
  ],
  // onSubmit = (data) => console.log(data),
  submitButtonText = 'Update Profile'
}) => {
  const [formData, setFormData] = useState(initialData);
  const [profileImage, setProfileImage] = useState(null);

  // const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get(`/users/profile`);
        const { name, email, phone, role } = response.data.user;
        setFormData({ name, email, phone, role });
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);


  const handleImageUpload = async () => {
    if (!selectedFile) return;

    try {
      const formData = new FormData();
      formData.append("profileImage", selectedFile);

      const response = await axiosInstance.put(`/users/upload-profile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Image uploaded:", response.data);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Profile image updated!',
      });
    } catch (error) {
      console.error("Image upload failed:", error.response?.data || error.message);
      alert("Failed to upload profile image.");
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.put(`/users/update-profile`, formData);
      console.log("Profile updated:", response.data);

      if (selectedFile) {
        await handleImageUpload();
      }
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Profile updated successfully!',
      });
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
      alert("Failed to update profile.");
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };



  const [selectedFile, setSelectedFile] = useState(null); // 👈 new state

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(URL.createObjectURL(file));
      setSelectedFile(file); // 👈 store actual file
    }
  };

  const formFields = [
    {
      label: 'Name',
      name: 'name',
      type: 'text',
      placeholder: 'Your Name'
    },
    {
      label: 'Email',
      name: 'email',
      type: 'email',
      placeholder: 'Email'
    },
    {
      label: 'Contact Number',
      name: 'phone',
      type: 'tel',
      placeholder: 'Contact Number'
    },
    {
      label: 'Your Role',
      name: 'role',
      type: 'select',
      options: roleOptions
    }
  ];

  return (
    <main className="h-full overflow-y-auto">
      <div className="sm:container grid lg:px-6 sm:px-4 px-2 mx-auto">
        <div className="tab tab-enter">
          <div className="container p-6 mx-auto bg-white dark:bg-gray-800 dark:text-gray-200 rounded-lg">
            <form onSubmit={handleSubmit}>
              <div className="p-6 flex-grow scrollbar-hide w-full max-h-full">
                {/* Profile Picture Section */}
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <label className="block text-sm text-gray-800 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium text-sm">
                    Profile Picture
                  </label>
                  <div className="col-span-8 sm:col-span-4">
                    <div className="w-full text-center">
                      <label className="border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer px-6 pt-5 pb-6 block">
                        <input
                          accept="image/*,.jpeg,.jpg,.png,.webp"
                          type="file"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                        <span className="mx-auto flex justify-center">
                          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="text-3xl text-emerald-500" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                            <polyline points="16 16 12 12 8 16"></polyline>
                            <line x1="12" y1="12" x2="12" y2="21"></line>
                            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path>
                            <polyline points="16 16 12 12 8 16"></polyline>
                          </svg>
                        </span>
                        <p className="text-sm mt-2">Drag your images here or click to browse</p>
                        <em className="text-xs text-gray-400">(Only *.jpeg, *.webp and *.png images will be accepted)</em>
                      </label>
                      <div className="text-emerald-500"></div>
                      {profileImage && (
                        <aside className="flex flex-row flex-wrap mt-4">
                          <div className="relative">
                            <img
                              className="inline-flex border rounded-md border-gray-100 dark:border-gray-600 w-24 max-h-24 p-2"
                              src={profileImage}
                              alt="profile preview"
                            />
                            <button
                              type="button"
                              className="absolute top-0 right-0 text-red-500 focus:outline-none"
                              onClick={() => setProfileImage(null)}
                            >
                              <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="15" y1="9" x2="9" y2="15"></line>
                                <line x1="9" y1="9" x2="15" y2="15"></line>
                              </svg>
                            </button>
                          </div>
                        </aside>
                      )}
                    </div>
                  </div>
                </div>

                {/* Dynamic Form Fields */}
                {formFields.map((field) => (
                  <div key={field.name} className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <label className="block text-gray-800 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium text-sm">
                      {field.label}
                    </label>
                    <div className="col-span-8 sm:col-span-4">
                      {field.type === 'select' ? (
                        <select
                          className="block w-full h-12 border bg-gray-100 px-2 py-1 text-sm dark:text-gray-300 focus:outline-none rounded-md form-select focus:bg-white dark:focus:bg-gray-700 focus:border-gray-200 border-gray-200 dark:border-gray-600 focus:shadow-none dark:focus:border-gray-500 dark:bg-gray-700 leading-5"
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleChange}
                        >
                          {field.options.map((option) => (
                            <option
                              key={option.value}
                              value={option.value}
                              hidden={option.hidden || false}
                            >
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          className="block w-full border px-3 py-1 text-sm focus:outline-none dark:text-gray-300 leading-5 rounded-md bg-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:border-gray-200 border-gray-200 dark:border-gray-600 dark:focus:border-gray-500 dark:bg-gray-700 mr-2 h-12 p-2"
                          type={field.type}
                          name={field.name}
                          placeholder={field.placeholder}
                          value={formData[field.name]}
                          onChange={handleChange}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <div className="flex flex-row-reverse pr-6 pb-6">
                <button
                  className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm text-white bg-emerald-500 border border-transparent active:bg-emerald-600 hover:bg-emerald-600 h-12 px-6"
                  type="submit"
                >
                  {submitButtonText}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfileForm;