

// // components/TestSeries/TestSeriesList.jsx
// import React from 'react';

// const TestSeriesList = ({ testSeries, onEdit, onDelete, onManageTests }) => {
//   console.log("TestSeriesList render", testSeries);
  
//   // Extract the actual series array from the API response
// //   const seriesData = testSeries?.data?.[0]?.series || [];
// const seriesData = testSeries?.data
//   ? testSeries.data.reduce((acc, item) => acc.concat(item.series), [])
//   : [];

//   console.log("Extracted seriesData:", seriesData);
  
//   return (
//     <div className="bg-white shadow-md rounded">
//       <table className="min-w-full">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="py-3 px-4 text-left">Title</th>
//             <th className="py-3 px-4 text-left">Exam</th>
//             <th className="py-3 px-4 text-left">Price</th>
//             <th className="py-3 px-4 text-left">Tests</th>
//             <th className="py-3 px-4 text-left">Status</th>
//             <th className="py-3 px-4 text-left">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {seriesData.length === 0 ? (
//             <tr>
//               <td colSpan="6" className="py-4 px-4 text-center text-gray-500">
//                 No test series found
//               </td>
//             </tr>
//           ) : (
//             seriesData.map((series) => (
//               <tr key={series._id} className="border-t hover:bg-gray-50">
//                 <td className="py-3 px-4">{series.title}</td>
//                 <td className="py-3 px-4">{series.exam_id?.name || 'N/A'}</td>
//                 <td className="py-3 px-4">
//                   {series.discount_price > 0 ? (
//                     <>
//                       <span className="line-through text-gray-400">₹{series.price}</span>
//                       <span className="ml-2 text-green-600">₹{series.discount_price}</span>
//                     </>
//                   ) : (
//                     `₹${series.price}`
//                   )}
//                 </td>
//                 <td className="py-3 px-4">{series.total_tests}</td>
//                 <td className="py-3 px-4">
//                   <span className={`px-2 py-1 rounded-full text-xs ${series.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                     {series.is_active ? 'Active' : 'Inactive'}
//                   </span>
//                 </td>
//                 <td className="py-3 px-4">
//                   <div className="flex space-x-2">
//                     <button
//                       onClick={() => onEdit(series)}
//                       className="text-blue-600 hover:text-blue-800"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => onManageTests(series)}
//                       className="text-green-600 hover:text-green-800"
//                     >
//                       Manage Tests
//                     </button>
//                     <button
//                       onClick={() => onDelete(series._id)}
//                       className="text-red-600 hover:text-red-800"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default TestSeriesList;



// components/TestSeries/TestSeriesList.jsx
import React from 'react';

const TestSeriesList = ({ testSeries, onEdit, onDelete, onManageTests }) => {
  // Extract the actual series array from the API response
  const seriesData = testSeries?.data
    ? testSeries.data.reduce((acc, item) => acc.concat(item.series), [])
    : [];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tests</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {seriesData.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center py-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-lg font-medium">No test series found</p>
                    <p className="text-gray-500">Get started by creating a new test series</p>
                  </div>
                </td>
              </tr>
            ) : (
              seriesData.map((series) => (
                <tr key={series._id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{series.title}</div>
                    <div className="text-sm text-gray-500">{series.title_tag}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{series.exam_id?.name || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {series.discount_price > 0 ? (
                        <>
                          <span className="line-through text-gray-400 mr-2">₹{series.price}</span>
                          <span className="text-green-600 font-semibold">₹{series.discount_price}</span>
                        </>
                      ) : (
                        `₹${series.price}`
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {series.total_tests}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${series.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {series.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => onEdit(series)}
                        className="text-green-600 hover:text-green-900 flex items-center"
                        title="Edit"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => onManageTests(series)}
                        className="text-blue-600 hover:text-blue-900 flex items-center"
                        title="Manage Tests"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                        Tests
                      </button>
                      <button
                        onClick={() => onDelete(series._id)}
                        className="text-red-600 hover:text-red-900 flex items-center"
                        title="Delete"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TestSeriesList;
