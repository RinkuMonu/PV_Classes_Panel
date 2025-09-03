// // components/TestSeries/TestSeriesList.jsx
// import React from 'react';

// const TestSeriesList = ({ testSeries, onEdit, onDelete, onManageTests }) => {
//     console.log("TestSeriesList render", testSeries);
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
//           {testSeries.length === 0 ? (
//             <tr>
//               <td colSpan="6" className="py-4 px-4 text-center text-gray-500">
//                 No test series found
//               </td>
//             </tr>
//           ) : (
//             testSeries.map((series) => (
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
  console.log("TestSeriesList render", testSeries);
  
  // Extract the actual series array from the API response
//   const seriesData = testSeries?.data?.[0]?.series || [];
const seriesData = testSeries?.data
  ? testSeries.data.reduce((acc, item) => acc.concat(item.series), [])
  : [];

  console.log("Extracted seriesData:", seriesData);
  
  return (
    <div className="bg-white shadow-md rounded">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-3 px-4 text-left">Title</th>
            <th className="py-3 px-4 text-left">Exam</th>
            <th className="py-3 px-4 text-left">Price</th>
            <th className="py-3 px-4 text-left">Tests</th>
            <th className="py-3 px-4 text-left">Status</th>
            <th className="py-3 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {seriesData.length === 0 ? (
            <tr>
              <td colSpan="6" className="py-4 px-4 text-center text-gray-500">
                No test series found
              </td>
            </tr>
          ) : (
            seriesData.map((series) => (
              <tr key={series._id} className="border-t hover:bg-gray-50">
                <td className="py-3 px-4">{series.title}</td>
                <td className="py-3 px-4">{series.exam_id?.name || 'N/A'}</td>
                <td className="py-3 px-4">
                  {series.discount_price > 0 ? (
                    <>
                      <span className="line-through text-gray-400">₹{series.price}</span>
                      <span className="ml-2 text-green-600">₹{series.discount_price}</span>
                    </>
                  ) : (
                    `₹${series.price}`
                  )}
                </td>
                <td className="py-3 px-4">{series.total_tests}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${series.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {series.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(series)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onManageTests(series)}
                      className="text-green-600 hover:text-green-800"
                    >
                      Manage Tests
                    </button>
                    <button
                      onClick={() => onDelete(series._id)}
                      className="text-red-600 hover:text-red-800"
                    >
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
  );
};

export default TestSeriesList;