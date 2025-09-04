import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../config/AxiosInstance'; 

function Review() {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ courseStats: [], coachingStats: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [approveDialog, setApproveDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [viewDialog, setViewDialog] = useState(false);
  const [filter, setFilter] = useState('all'); // all, pending, approved

  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, [filter]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/reviews');
      
      // Filter reviews based on selection
      let filteredReviews = response.data;
      if (filter === 'pending') {
        filteredReviews = response.data.filter(review => !review.approved);
      } else if (filter === 'approved') {
        filteredReviews = response.data.filter(review => review.approved);
      }
      
      setReviews(filteredReviews);
    } catch (error) {
      setError('Failed to fetch reviews');
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get('/reviews/review-details');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const approveReview = async (id) => {
    try {
      await axiosInstance.put(`/reviews/approve/${id}`);
      setSuccess('Review approved successfully');
      setApproveDialog(false);
      fetchReviews();
      fetchStats();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to approve review');
      console.error('Error approving review:', error);
    }
  };

  const handleApproveClick = (review) => {
    setSelectedReview(review);
    setApproveDialog(true);
  };

  const handleViewClick = (review) => {
    setSelectedReview(review);
    setViewDialog(true);
  };

  const getReviewTypeText = (reviewType) => {
    return reviewType === 'course' ? 'Course' : 'Coaching';
  };

  const getReviewTarget = (review) => {
    if (review.reviewType === 'course' && review.course) {
      return review.course.title;
    } else if (review.reviewType === 'coaching' && review.coaching) {
      return review.coaching.name;
    }
    return 'N/A';
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <svg
        key={index}
        className={`w-5 h-5 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Reviews Management</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
          <button onClick={() => setError('')} className="absolute top-0 right-0 p-3">
            <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{success}</span>
          <button onClick={() => setSuccess('')} className="absolute top-0 right-0 p-3">
            <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Course Reviews Summary</h2>
          {stats.courseStats.length > 0 ? (
            stats.courseStats.map((stat) => (
              <div key={stat.courseId} className="mb-4 last:mb-0">
                <h3 className="text-lg font-medium text-gray-700">{stat.courseTitle}</h3>
                <div className="flex items-center mt-1">
                  <div className="flex mr-2">
                    {renderStars(Math.round(stat.averageRating))}
                  </div>
                  <span className="text-sm text-gray-600">
                    ({stat.averageRating.toFixed(1)} avg, {stat.totalReviews} reviews)
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No course reviews yet</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Coaching Reviews Summary</h2>
          {stats.coachingStats.length > 0 ? (
            stats.coachingStats.map((stat) => (
              <div key={stat.coachingId} className="mb-4 last:mb-0">
                <h3 className="text-lg font-medium text-gray-700">{stat.coachingName}</h3>
                <div className="flex items-center mt-1">
                  <div className="flex mr-2">
                    {renderStars(Math.round(stat.averageRating))}
                  </div>
                  <span className="text-sm text-gray-600">
                    ({stat.averageRating.toFixed(1)} avg, {stat.totalReviews} reviews)
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No coaching reviews yet</p>
          )}
        </div>
      </div>

      {/* Filter Controls */}
      <div className="mb-6">
        <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-2">
          Filter Reviews
        </label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="block w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Reviews</option>
          <option value="pending">Pending Approval</option>
          <option value="approved">Approved</option>
        </select>
      </div>

      {/* Reviews Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Target
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comment
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <tr key={review._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{review.user?.name || 'Unknown User'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${review.reviewType === 'course' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                        {getReviewTypeText(review.reviewType)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getReviewTarget(review)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {renderStars(review.rating)}
                        <span className="ml-1 text-sm text-gray-600">({review.rating})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {review.comment ? (
                        <button
                          onClick={() => handleViewClick(review)}
                          className="text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View
                        </button>
                      ) : (
                        'No comment'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${review.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {review.approved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col space-y-2">
                        {!review.approved && (
                          <button
                            onClick={() => handleApproveClick(review)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm flex items-center"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Approve
                          </button>
                        )}
                        {review.comment && (
                          <button
                            onClick={() => handleViewClick(review)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm flex items-center"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                    {filter === 'all' ? 'No reviews found' : `No ${filter} reviews found`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approve Confirmation Dialog */}
      {approveDialog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Approve Review</h3>
              <p className="text-sm text-gray-500 mb-4">
                Are you sure you want to approve this review? This action cannot be undone.
              </p>
              {selectedReview && (
                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <p className="text-sm text-gray-700"><strong>User:</strong> {selectedReview.user?.name}</p>
                  <p className="text-sm text-gray-700"><strong>Rating:</strong> {selectedReview.rating}/5</p>
                  {selectedReview.comment && (
                    <p className="text-sm text-gray-700 mt-2"><strong>Comment:</strong> {selectedReview.comment}</p>
                  )}
                </div>
              )}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setApproveDialog(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => approveReview(selectedReview._id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Comment Dialog */}
      {viewDialog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Review Comment</h3>
              {selectedReview && (
                <div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-700"><strong>User:</strong> {selectedReview.user?.name}</p>
                    <div className="flex items-center mt-1">
                      <strong className="text-sm mr-2">Rating:</strong>
                      <div className="flex">
                        {renderStars(selectedReview.rating)}
                      </div>
                      <span className="ml-1 text-sm text-gray-600">({selectedReview.rating})</span>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
                    <p className="text-gray-700">{selectedReview.comment}</p>
                  </div>
                </div>
              )}
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setViewDialog(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Review;