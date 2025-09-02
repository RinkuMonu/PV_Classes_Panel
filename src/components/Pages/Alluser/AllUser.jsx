
// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';
// import axios from 'axios';

// const AllUser = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [editingUser, setEditingUser] = useState(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     address: '',
//     city: '',
//     state: '',
//     pincode: '',
//     district: '',
//     role: 'user',
//     experience: '',
//     specialization: '',
//     status: 'active'
//   });
//   const [profileImage, setProfileImage] = useState(null);

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');
//       const response = await axios.get('https://api.pvclasses.in/api/users/getAllUser', {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//       setUsers(response.data.data || response.data);
//     } catch (error) {
//       toast.error('Error fetching users');
//       console.error('Error fetching users:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (user) => {
//     setEditingUser(user);
//     setFormData({
//       name: user.name || '',
//       email: user.email || '',
//       phone: user.phone || '',
//       address: user.address || '',
//       city: user.city || '',
//       state: user.state || '',
//       pincode: user.pincode || '',
//       district: user.district || '',
//       role: user.role || 'user',
//       experience: user.experience || '',
//       specialization: user.specialization || '',
//       status: user.status || 'active'
//     });
//     setShowModal(true);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem('token');
//       const formDataToSend = new FormData();

//       // Append all form fields
//       Object.keys(formData).forEach(key => {
//         if (formData[key]) {
//           formDataToSend.append(key, formData[key]);
//         }
//       });

//       // Append profile image if selected
//       if (profileImage) {
//         formDataToSend.append('profile_image', profileImage);
//       }

//       if (editingUser) {
//         await axios.put(`https://api.pvclasses.in/api/users/updateUser`, formDataToSend, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'multipart/form-data'
//           }
//         });
//         toast.success('User updated successfully');
//       }

//       setShowModal(false);
//       resetForm();
//       fetchUsers();
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Error saving user');
//       console.error('Error saving user:', error);
//     }
//   };

//   const handleStatusChange = async (userId, currentStatus) => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.put(`https://api.pvclasses.in/api/users/updateStatus`, {
//         userId,
//         status: currentStatus === 'active' ? 'inactive' : 'active'
//       }, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//       toast.success('User status updated successfully');
//       fetchUsers();
//     } catch (error) {
//       toast.error('Error updating user status');
//       console.error('Error updating status:', error);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       name: '',
//       email: '',
//       phone: '',
//       address: '',
//       city: '',
//       state: '',
//       pincode: '',
//       district: '',
//       role: 'user',
//       experience: '',
//       specialization: '',
//       status: 'active'
//     });
//     setProfileImage(null);
//     setEditingUser(null);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Users Management</h1>
//       </div>

//       {loading ? (
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//         </div>
//       ) : (
//         <div className="bg-white shadow-md rounded-md overflow-hidden">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Name
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Phone
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Email
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Role
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {users.map((user) => (
//                 <tr key={user._id}>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       {user.profile_image_url ? (
//                         <img
//                           src={user.profile_image_url}
//                           alt={user.name}
//                           className="h-10 w-10 rounded-full object-cover mr-3"
//                         />
//                       ) : (
//                         <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
//                           <span className="text-gray-600 font-medium">
//                             {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
//                           </span>
//                         </div>
//                       )}
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">{user.name || 'No Name'}</div>
//                         {user.specialization && (
//                           <div className="text-sm text-gray-500">{user.specialization}</div>
//                         )}
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {user.phone}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {user.email || 'N/A'}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-2 py-1 text-xs rounded-full ${
//                       user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
//                       user.role === 'teacher' ? 'bg-blue-100 text-blue-800' :
//                       'bg-gray-100 text-gray-800'
//                     }`}>
//                       {user.role}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-2 py-1 text-xs rounded-full ${
//                       user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                     }`}>
//                       {user.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <button
//                       onClick={() => handleEdit(user)}
//                       className="text-blue-600 hover:text-blue-900 mr-3"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleStatusChange(user._id, user.status)}
//                       className={`${
//                         user.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
//                       }`}
//                     >
//                       {user.status === 'active' ? 'Deactivate' : 'Activate'}
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {showModal && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center overflow-y-auto">
//           <div className="bg-white p-6 rounded-md w-full max-w-2xl my-8 max-h-screen overflow-y-auto">
//             <h2 className="text-xl font-bold mb-4">
//               {editingUser ? 'Edit User' : 'Add User'}
//             </h2>
//             <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="col-span-2">
//                 <label className="block text-gray-700 mb-2">Name</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//               <div>
//                 <label className="block text-gray-700 mb-2">Phone</label>
//                 <input
//                   type="text"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-gray-700 mb-2">Email</label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//               <div>
//                 <label className="block text-gray-700 mb-2">Role</label>
//                 <select
//                   name="role"
//                   value={formData.role}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 >
//                   <option value="user">User</option>
//                   <option value="teacher">Teacher</option>
//                   <option value="admin">Admin</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-gray-700 mb-2">Status</label>
//                 <select
//                   name="status"
//                   value={formData.status}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 >
//                   <option value="active">Active</option>
//                   <option value="inactive">Inactive</option>
//                 </select>
//               </div>
//               {formData.role === 'teacher' && (
//                 <>
//                   <div>
//                     <label className="block text-gray-700 mb-2">Experience</label>
//                     <input
//                       type="text"
//                       name="experience"
//                       value={formData.experience}
//                       onChange={handleInputChange}
//                       className="w-full p-2 border border-gray-300 rounded-md"
//                       placeholder="e.g., 5 years"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-gray-700 mb-2">Specialization</label>
//                     <input
//                       type="text"
//                       name="specialization"
//                       value={formData.specialization}
//                       onChange={handleInputChange}
//                       className="w-full p-2 border border-gray-300 rounded-md"
//                       placeholder="e.g., Mathematics"
//                     />
//                   </div>
//                 </>
//               )}
//               <div>
//                 <label className="block text-gray-700 mb-2">Address</label>
//                 <input
//                   type="text"
//                   name="address"
//                   value={formData.address}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//               <div>
//                 <label className="block text-gray-700 mb-2">City</label>
//                 <input
//                   type="text"
//                   name="city"
//                   value={formData.city}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//               <div>
//                 <label className="block text-gray-700 mb-2">State</label>
//                 <input
//                   type="text"
//                   name="state"
//                   value={formData.state}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//               <div>
//                 <label className="block text-gray-700 mb-2">Pincode</label>
//                 <input
//                   type="text"
//                   name="pincode"
//                   value={formData.pincode}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//               <div>
//                 <label className="block text-gray-700 mb-2">District</label>
//                 <input
//                   type="text"
//                   name="district"
//                   value={formData.district}
//                   onChange={handleInputChange}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//               <div className="col-span-2">
//                 <label className="block text-gray-700 mb-2">Profile Image</label>
//                 <input
//                   type="file"
//                   onChange={(e) => setProfileImage(e.target.files[0])}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                   accept="image/*"
//                 />
//               </div>
//               <div className="col-span-2 flex justify-end">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowModal(false);
//                     resetForm();
//                   }}
//                   className="mr-2 px-4 py-2 border border-gray-300 rounded-md"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
//                 >
//                   {editingUser ? 'Update' : 'Create'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllUser;



import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    district: '',
    role: 'user',
    experience: '',
    specialization: '',
    status: 'active'
  });
  const [profileImage, setProfileImage] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('https://api.pvclasses.in/api/users/getAllUser', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(response.data.data || response.data);
    } catch (error) {
      toast.error('Error fetching users');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      city: user.city || '',
      state: user.state || '',
      pincode: user.pincode || '',
      district: user.district || '',
      role: user.role || 'user',
      experience: user.experience || '',
      specialization: user.specialization || '',
      status: user.status || 'active'
    });
    setErrors({});
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();

      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append profile image if selected
      if (profileImage) {
        formDataToSend.append('profile_image', profileImage);
      }

      if (editingUser) {
        await axios.put(`https://api.pvclasses.in/api/users/updateUser`, formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('User updated successfully');
      }

      setShowModal(false);
      resetForm();
      fetchUsers();
    } catch (error) {
      if (error.response?.status === 400) {
        if (error.response?.data?.message?.includes('duplicate')) {
          if (error.response?.data?.message?.includes('phone')) {
            setErrors({ phone: 'This phone number is already registered' });
            toast.error('Phone number already exists');
          } else if (error.response?.data?.message?.includes('email')) {
            setErrors({ email: 'This email is already registered' });
            toast.error('Email already exists');
          }
        }
      } else {
        toast.error(error.response?.data?.message || 'Error saving user');
      }
      console.error('Error saving user:', error);
    }
  };

  const handleStatusChange = async (userId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://api.pvclasses.in/api/users/updateStatus`, {
        userId,
        status: currentStatus === 'active' ? 'inactive' : 'active'
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success('User status updated successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Error updating user status');
      console.error('Error updating status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      district: '',
      role: 'user',
      experience: '',
      specialization: '',
      status: 'active'
    });
    setProfileImage(null);
    setEditingUser(null);
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Check if email already exists in other users
  const isEmailUnique = (email) => {
    if (!email) return true;
    return !users.some(user => 
      user.email === email && user._id !== editingUser?._id
    );
  };

  // Check if phone already exists in other users
  const isPhoneUnique = (phone) => {
    if (!phone) return true;
    return !users.some(user => 
      user.phone === phone && user._id !== editingUser?._id
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users Management</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {user.profile_image_url ? (
                        <img
                          src={user.profile_image_url}
                          alt={user.name}
                          className="h-10 w-10 rounded-full object-cover mr-3"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                          <span className="text-gray-600 font-medium">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                          </span>
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name || 'No Name'}</div>
                        {user.specialization && (
                          <div className="text-sm text-gray-500">{user.specialization}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.email || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'teacher' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleStatusChange(user._id, user.status)}
                      className={`${
                        user.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                      }`}
                    >
                      {user.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center overflow-y-auto">
          <div className="bg-white p-6 rounded-md w-full max-w-2xl my-8 max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingUser ? 'Edit User' : 'Add User'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Phone *</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-md ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                  disabled={!!editingUser} // Disable phone editing for existing users
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-md ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
                {formData.email && !errors.email && !isEmailUnique(formData.email) && (
                  <p className="text-yellow-600 text-xs mt-1">
                    Warning: This email is already used by another user
                  </p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="user">User</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              {formData.role === 'teacher' && (
                <>
                  <div>
                    <label className="block text-gray-700 mb-2">Experience</label>
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="e.g., 5 years"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Specialization</label>
                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="e.g., Mathematics"
                    />
                  </div>
                </>
              )}
              <div>
                <label className="block text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">District</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-gray-700 mb-2">Profile Image</label>
                <input
                  type="file"
                  onChange={(e) => setProfileImage(e.target.files[0])}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  accept="image/*"
                />
              </div>
              <div className="col-span-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="mr-2 px-4 py-2 border border-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  {editingUser ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;