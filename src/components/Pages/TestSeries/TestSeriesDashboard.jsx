// // components/TestSeries/TestSeriesDashboard.jsx
// import React, { useState, useEffect } from 'react';
// import TestSeriesList from './TestSeriesList';
// import TestSeriesForm from './TestSeriesForm';
// import TestManager from './TestManager';
// import QuestionManager from './QuestionManager';
// import { getTestSeries, createTestSeries, updateTestSeries, deleteTestSeries } from '../../../services/testSeriesApi';

// const TestSeriesDashboard = () => {
//   const [testSeries, setTestSeries] = useState([]);
//   const [selectedSeries, setSelectedSeries] = useState(null);
//   const [activeTab, setActiveTab] = useState('list');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     fetchTestSeries();
//   }, []);

//   const fetchTestSeries = async () => {
//     try {
//       setLoading(true);
//       const response = await getTestSeries();
//       setTestSeries(response.data);
//     } catch (err) {
//       setError('Failed to fetch test series');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateSeries = async (seriesData) => {
//     try {
//       await createTestSeries(seriesData);
//       fetchTestSeries();
//       setActiveTab('list');
//     } catch (err) {
//       setError('Failed to create test series');
//       console.error(err);
//     }
//   };

//   const handleUpdateSeries = async (id, seriesData) => {
//     try {
//       await updateTestSeries(id, seriesData);
//       fetchTestSeries();
//       setActiveTab('list');
//       setSelectedSeries(null);
//     } catch (err) {
//       setError('Failed to update test series');
//       console.error(err);
//     }
//   };

//   const handleDeleteSeries = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this test series?')) return;
    
//     try {
//       await deleteTestSeries(id);
//       fetchTestSeries();
//     } catch (err) {
//       setError('Failed to delete test series');
//       console.error(err);
//     }
//   };

//   const handleEditSeries = (series) => {
//     setSelectedSeries(series);
//     setActiveTab('edit');
//   };

//   const handleManageTests = (series) => {
//     setSelectedSeries(series);
//     setActiveTab('manage-tests');
//   };

//   if (loading) return <div className="text-center py-8">Loading test series...</div>;

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6">Test Series Management</h1>
      
//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}
      
//       <div className="mb-6">
//         <div className="flex border-b">
//           <button
//             className={`py-2 px-4 font-medium ${activeTab === 'list' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
//             onClick={() => setActiveTab('list')}
//           >
//             All Test Series
//           </button>
//           <button
//             className={`py-2 px-4 font-medium ${activeTab === 'create' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
//             onClick={() => setActiveTab('create')}
//           >
//             Create New
//           </button>
//           {selectedSeries && activeTab === 'edit' && (
//             <button
//               className={`py-2 px-4 font-medium ${activeTab === 'edit' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
//             >
//               Edit: {selectedSeries.title}
//             </button>
//           )}
//           {selectedSeries && activeTab === 'manage-tests' && (
//             <button
//               className={`py-2 px-4 font-medium ${activeTab === 'manage-tests' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
//             >
//               Manage Tests: {selectedSeries.title}
//             </button>
//           )}
//         </div>
//       </div>

//       {activeTab === 'list' && (
//         <TestSeriesList 
//           testSeries={testSeries}
//           onEdit={handleEditSeries}
//           onDelete={handleDeleteSeries}
//           onManageTests={handleManageTests}
//         />
//       )}

//       {activeTab === 'create' && (
//         <TestSeriesForm 
//           onSubmit={handleCreateSeries}
//           onCancel={() => setActiveTab('list')}
//         />
//       )}

//       {activeTab === 'edit' && selectedSeries && (
//         <TestSeriesForm 
//           series={selectedSeries}
//           onSubmit={(data) => handleUpdateSeries(selectedSeries._id, data)}
//           onCancel={() => {
//             setActiveTab('list');
//             setSelectedSeries(null);
//           }}
//         />
//       )}

//       {activeTab === 'manage-tests' && selectedSeries && (
//         <TestManager 
//           series={selectedSeries}
//           onBack={() => {
//             setActiveTab('list');
//             setSelectedSeries(null);
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default TestSeriesDashboard;



// components/TestSeries/TestSeriesDashboard.jsx
import React, { useState, useEffect } from 'react';
import TestSeriesList from './TestSeriesList';
import TestSeriesForm from './TestSeriesForm';
import TestManager from './TestManager';
import QuestionManager from './QuestionManager';
import { getTestSeries, createTestSeries, updateTestSeries, deleteTestSeries } from '../../../services/testSeriesApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../../../config/AxiosInstance'; // <-- Import your axios instance


const TestSeriesDashboard = () => {
  const [testSeries, setTestSeries] = useState([]);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [activeTab, setActiveTab] = useState('list');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTestSeries();
  }, []);

  const fetchTestSeries = async () => {
    try {
      setLoading(true);
      const response = await getTestSeries();
      setTestSeries(response.data);
    } catch (err) {
      setError('Failed to fetch test series');
      toast.error('Failed to fetch test series');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSeries = async (seriesData) => {
    try {
      await createTestSeries(seriesData);
      fetchTestSeries();
      setActiveTab('list');
      toast.success('Test series created successfully!');
    } catch (err) {
      setError('Failed to create test series');
      toast.error('Failed to create test series');
      console.error(err);
    }
  };

  const handleUpdateSeries = async (id, seriesData) => {
    try {
      await updateTestSeries(id, seriesData);
      fetchTestSeries();
      setActiveTab('list');
      setSelectedSeries(null);
      toast.success('Test series updated successfully!');
    } catch (err) {
      setError('Failed to update test series');
      toast.error('Failed to update test series');
      console.error(err);
    }
  };

  const handleDeleteSeries = async (id) => {
    if (!window.confirm('Are you sure you want to delete this test series?')) return;
    
    try {
      await deleteTestSeries(id);
      fetchTestSeries();
      toast.success('Test series deleted successfully!');
    } catch (err) {
      setError('Failed to delete test series');
      toast.error('Failed to delete test series');
      console.error(err);
    }
  };

  const handleEditSeries = (series) => {
    setSelectedSeries(series);
    setActiveTab('edit');
  };

  const handleManageTests = (series) => {
    setSelectedSeries(series);
    setActiveTab('manage-tests');
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Test Series Management</h1>
        <p className="text-gray-600">Create and manage test series for your exams</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="flex border-b">
          <button
            className={`py-4 px-6 font-medium flex items-center ${activeTab === 'list' ? 'border-b-2 border-green-500 text-green-600 bg-green-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('list')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            All Test Series
          </button>
          
          <button
            className={`py-4 px-6 font-medium flex items-center ${activeTab === 'create' ? 'border-b-2 border-green-500 text-green-600 bg-green-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('create')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create New
          </button>
          {selectedSeries && activeTab === 'edit' && (
            <button
              className={`py-4 px-6 font-medium flex items-center border-b-2 border-green-500 text-green-600 bg-green-50`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit: {selectedSeries?.title}
            </button>
          )}
          {selectedSeries && activeTab === 'manage-tests' && (
            <button
              className={`py-4 px-6 font-medium flex items-center border-b-2 border-green-500 text-green-600 bg-green-50`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              Manage Tests: {selectedSeries?.title}
            </button>
          )}
        </div>
      </div>

      {activeTab === 'list' && (
        <TestSeriesList 
          testSeries={testSeries}
          onEdit={handleEditSeries}
          onDelete={handleDeleteSeries}
          onManageTests={handleManageTests}
        />
      )}

      {activeTab === 'create' && (
        <TestSeriesForm 
          onSubmit={handleCreateSeries}
          onCancel={() => setActiveTab('list')}
        />
      )}

      {activeTab === 'edit' && selectedSeries && (
        <TestSeriesForm 
          series={selectedSeries}
          onSubmit={(data) => handleUpdateSeries(selectedSeries._id, data)}
          onCancel={() => {
            setActiveTab('list');
            setSelectedSeries(null);
          }}
        />
      )}

      {activeTab === 'manage-tests' && selectedSeries && (
        <TestManager 
          series={selectedSeries}
          onBack={() => {
            setActiveTab('list');
            setSelectedSeries(null);
          }}
        />
      )}
    </div>
  );
};

export default TestSeriesDashboard;
