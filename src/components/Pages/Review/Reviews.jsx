import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../../config/AxiosInstance';
import GlobalTable from '../../common/GlobalTable';
import TableActionButton from '../../common/TableActionButton';
import { MessageSquareText, X } from 'lucide-react';

function Review() {
  const [reviews, setReviews] = useState([]);
  const [_stats, setStats] = useState({ courseStats: [], coachingStats: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [approveDialog, setApproveDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [viewDialog, setViewDialog] = useState(false);
  const [filter, setFilter] = useState('all'); // all, pending, approved
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;


const fetchReviews = useCallback(async () => {
  try {
    setLoading(true);
    const response = await axiosInstance.get('/reviews/all'); 
    let allReviews = response.data.reviews || [];

    let filteredReviews = allReviews;
    if (filter === 'pending') {
      filteredReviews = allReviews.filter(review => !review.approved);
    } else if (filter === 'approved') {
      filteredReviews = allReviews.filter(review => review.approved);
    }

    setReviews(filteredReviews);
    setCurrentPage(1);
  } catch (error) {
    setError('Failed to fetch reviews');
    console.error('Error fetching reviews:', error);
  } finally {
    setLoading(false);
  }
}, [filter]); // include filter here

const fetchStats = useCallback(async () => {
  try {
    const response = await axiosInstance.get('/reviews/review-details');
    setStats(response.data);
  } catch (error) {
    console.error('Error fetching stats:', error);
  }
}, []); // no dependencies if axiosInstance is stable

useEffect(() => {
  fetchReviews();
  fetchStats();
}, [fetchReviews, fetchStats ,filter]);



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

  const totalPages = Math.max(Math.ceil(reviews.length / pageSize), 1);
  const paginatedReviews = reviews.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const firstVisibleReview = reviews.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastVisibleReview = Math.min(currentPage * pageSize, reviews.length);

  const reviewColumns = [
    {
      key: 'user',
      header: 'User',
      render: (review) => (
        <div className="text-sm font-medium text-gray-900">{review.user?.name || 'Unknown User'}</div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (review) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${review.reviewType === 'course' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
          {getReviewTypeText(review.reviewType)}
        </span>
      ),
    },
    {
      key: 'target',
      header: 'Target',
      render: (review) => getReviewTarget(review),
    },
    {
      key: 'rating',
      header: 'Rating',
      render: (review) => (
        <div className="flex items-center">
          {renderStars(review.rating)}
          <span className="ml-1 text-sm text-gray-600">({review.rating})</span>
        </div>
      ),
    },
    {
      key: 'comment',
      header: 'Comment',
      render: (review) => (
        review.comment ? (
          <TableActionButton
            tone="view"
            title="View comment"
            onClick={() => handleViewClick(review)}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </TableActionButton>
        ) : (
          'No comment'
        )
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (review) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${review.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {review.approved ? 'Approved' : 'Pending'}
        </span>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      render: (review) => new Date(review.createdAt).toLocaleDateString(),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (review) => (
        <div className="flex items-center gap-2">
          {!review.approved && (
            <TableActionButton
              tone="success"
              title="Approve review"
              onClick={() => handleApproveClick(review)}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </TableActionButton>
          )}
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4">
      {/* UI-only: standardized page header; review logic is unchanged. */}
      <div data-page-icon data-icon-symbol="★" className="bg-gradient-to-r from-[#204972] to-[#87b105] rounded-xl shadow-lg mb-6 p-6 text-white">
        <h1 className="text-2xl font-bold">Reviews Management</h1>
        <p className="mt-1 opacity-90">Manage and analyze user reviews</p>
      </div>

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
        {/* <div className="bg-white rounded-lg shadow p-6">
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
        </div> */}

        {/* <div className="bg-white rounded-lg shadow p-6">
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
        </div> */}
      </div>
      {/* Reviews Table */}
      <GlobalTable
        title={`Reviews (${reviews.length})`}
        filters={{
          filters: [
            {
              key: "review-status",
              value: filter,
              onChange: (value) => {
                setFilter(value);
                setCurrentPage(1);
              },
              options: [
                { value: "all", label: "All Reviews" },
                { value: "pending", label: "Pending Approval" },
                { value: "approved", label: "Approved" },
              ],
            },
          ],
          exportData: reviews,
          exportFileName: "reviews.csv",
          exportColumns: [
            { key: "user", header: "User", value: (review) => review.user?.name || "Unknown User" },
            { key: "type", header: "Type", value: (review) => getReviewTypeText(review.reviewType) },
            { key: "target", header: "Target", value: (review) => getReviewTarget(review) },
            { key: "rating", header: "Rating", value: (review) => review.rating },
            { key: "comment", header: "Comment", value: (review) => review.comment || "" },
            { key: "status", header: "Status", value: (review) => (review.approved ? "Approved" : "Pending") },
            {
              key: "date",
              header: "Date",
              value: (review) => review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "",
            },
          ],
        }}
        columns={reviewColumns}
        data={paginatedReviews}
        emptyText={filter === "all" ? "No reviews found" : `No ${filter} reviews found`}
        getRowKey={(review) => review._id}
        pagination={{
          currentPage,
          totalPages,
          onPageChange: setCurrentPage,
          rightContent: (
            <p className="text-sm text-gray-500">
              Showing {firstVisibleReview}-{lastVisibleReview} of {reviews.length}
            </p>
          ),
        }}
      />

      {/* Approve Confirmation Dialog */}
      {approveDialog && (
        <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
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
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 form-cancel-button"
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
        <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          {/* UI-only: Review Comment overlay uses the shared themed modal presentation. */}
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
            <div className="flex items-center justify-between bg-gradient-to-r from-[#204972] to-[#87b105] p-5 text-white">
              <h3 className="flex items-center text-xl font-semibold"><MessageSquareText className="mr-2" /> Review Comment</h3>
              <button onClick={() => setViewDialog(false)} className="rounded-full p-2 text-white/80 transition hover:bg-white/15 hover:text-white" aria-label="Close review comment">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
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
                  <div className="border border-[#204972]/10 rounded-xl p-4 bg-gradient-to-br from-[#204972]/[0.04] to-[#87b105]/[0.07]">
                    <p className="text-gray-700">{selectedReview.comment}</p>
                  </div>
                </div>
              )}
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setViewDialog(false)}
                  className="px-5 py-2 text-white rounded-lg transition form-cancel-button"
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
