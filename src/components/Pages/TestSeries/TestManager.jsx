
// components/TestSeries/TestManager.jsx
import React, { useEffect, useState } from 'react';
import QuestionManager from './QuestionManager';
import { addTestToSeries, deleteTestFromSeries  } from '../../../services/testSeriesApi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GlobalTable from '../../common/GlobalTable';
import TableActionButton from '../../common/TableActionButton';
import { ClipboardList, Trash2 } from 'lucide-react';

const TestManager = ({ series, onBack }) => {
  const [activeTestId, setActiveTestId] = useState(null);
  const [tests, setTests] = useState(series.tests || []);
  const [showTestForm, setShowTestForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [newTest, setNewTest] = useState({
    title: '',
    subject: '',
    type: 'daily_quiz',
    perQuestionTimeSec: 30,
    durationSec: 0,
    is_active: true,
    scheduleDate: ''
  });

  const handleAddTest = async (e) => {
    e.preventDefault();
    try {
      const response = await addTestToSeries(series._id, newTest);
      setTests([...tests, response.data.test]);
      setNewTest({
        title: '',
        subject: '',
        type: 'daily_quiz',
        perQuestionTimeSec: 30,
        durationSec: 0,
        is_active: true,
        scheduleDate: ''
      });
      setShowTestForm(false);
      toast.success('Test added successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      window.location.reload();

    } catch (err) {
      console.error('Failed to add test', err);
      toast.error('Failed to add test. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const handleDeleteTest = async (testId) => {
  if (!window.confirm("Are you sure you want to delete this test?")) return;
  
  try {
    // const response = await deleteTestFromSeries(series._id, testId);
    await deleteTestFromSeries(series._id, testId);
    toast.success("Test deleted successfully!");
    // Remove from local state
    setTests(tests.filter((t) => t._id !== testId));
  } catch (err) {
    console.error("Failed to delete test:", err);
    toast.error("Failed to delete test. Please try again.");
  }
};


  const handleManageQuestions = (testId) => {
    setActiveTestId(testId);
  };

  const handleBackToTests = () => {
    setActiveTestId(null);
  };

  // UI-only: filter and paginate the existing test list for the shared table.
  const filteredTests = tests.filter((test) => {
    const search = searchTerm.toLowerCase();
    return (
      test.title?.toLowerCase().includes(search) ||
      test.subject?.toLowerCase().includes(search) ||
      test.type?.toLowerCase().includes(search) ||
      (test.is_active ? 'active' : 'inactive').includes(search)
    );
  });

  const totalPages = Math.max(Math.ceil(filteredTests.length / pageSize), 1);
  const paginatedTests = filteredTests.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const firstVisibleTest = filteredTests.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastVisibleTest = Math.min(currentPage * pageSize, filteredTests.length);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // UI-only: global table columns with shared action symbols.
  const testColumns = [
    {
      key: 'title',
      header: 'Title',
      render: (test) => <div className="text-sm font-medium text-gray-900">{test.title}</div>,
    },
    {
      key: 'subject',
      header: 'Subject',
      render: (test) => <div className="text-sm text-gray-700">{test.subject}</div>,
    },
    {
      key: 'type',
      header: 'Type',
      render: (test) => (
        <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 capitalize">
          {test.type.replace('_', ' ')}
        </span>
      ),
    },
    {
      key: 'questions',
      header: 'Questions',
      render: (test) => test.questions?.length || 0,
    },
    {
      key: 'status',
      header: 'Status',
      render: (test) => (
        <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${test.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {test.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (test) => (
        <div className="flex items-center gap-2">
          <TableActionButton
            tone="view"
            onClick={() => handleManageQuestions(test._id)}
            title="Manage Questions"
          >
            <ClipboardList className="h-4 w-4" />
          </TableActionButton>
          <TableActionButton
            tone="delete"
            onClick={() => handleDeleteTest(test._id)}
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </TableActionButton>
        </div>
      ),
    },
  ];

  if (activeTestId) {
    const test = tests.find(t => t._id === activeTestId);
    return (
      <QuestionManager
        series={series}
        test={test}
        onBack={handleBackToTests}
      />
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer />

      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Manage Tests</h2>
          <p className="text-green-600 mt-1">{series.title}</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onBack}
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Series
          </button>
          <button
            onClick={() => setShowTestForm(true)}
            className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center shadow-md hover:shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            Add New Test
          </button>
        </div>
      </div>

      {showTestForm && (
        <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Add New Test</h3>
            <button
              onClick={() => setShowTestForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form onSubmit={handleAddTest} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newTest.title}
                  onChange={(e) => setNewTest({ ...newTest, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  value={newTest.subject}
                  onChange={(e) => setNewTest({ ...newTest, subject: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={newTest.type}
                  onChange={(e) => setNewTest({ ...newTest, type: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                >
                  <option value="daily_quiz">Daily Quiz</option>
                  <option value="full_test">Full Test</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time per Question (seconds)</label>
                <input
                  type="number"
                  value={newTest.perQuestionTimeSec}
                  onChange={(e) => setNewTest({ ...newTest, perQuestionTimeSec: parseInt(e.target.value) || 30 })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (seconds)</label>
                <input
                  type="number"
                  value={newTest.durationSec}
                  onChange={(e) => setNewTest({ ...newTest, durationSec: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Schedule Date</label>
                <input
                  type="datetime-local"
                  value={newTest.scheduleDate}
                  onChange={(e) => setNewTest({ ...newTest, scheduleDate: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={newTest.is_active}
                  onChange={(e) => setNewTest({ ...newTest, is_active: e.target.checked })}
                  className="h-4 w-4 text-green-600 rounded focus:ring-green-500 border-gray-300"
                />
              </div>
              <label htmlFor="is_active" className="ml-3 text-sm text-gray-700">
                Active
              </label>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => setShowTestForm(false)}
                className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors form-cancel-button"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
              >
                Add Test
              </button>
            </div>
          </form>
        </div>
      )}

      {/* UI-only: shared table filters, export, and Previous/Next pagination. */}
      <GlobalTable
        title={`Test List (${filteredTests.length})`}
        filters={{
          searchValue: searchTerm,
          onSearchChange: (value) => {
            setSearchTerm(value);
            setCurrentPage(1);
          },
          searchPlaceholder: 'Search tests...',
          resultText: `${filteredTests.length} test${filteredTests.length === 1 ? '' : 's'} found`,
          exportData: filteredTests,
          exportFileName: 'tests.csv',
          exportColumns: [
            { key: 'title', header: 'Title' },
            { key: 'subject', header: 'Subject' },
            { key: 'type', header: 'Type', value: (test) => test.type?.replace('_', ' ') || '' },
            { key: 'questions', header: 'Questions', value: (test) => test.questions?.length || 0 },
            { key: 'status', header: 'Status', value: (test) => test.is_active ? 'Active' : 'Inactive' },
          ],
        }}
        columns={testColumns}
        data={paginatedTests}
        emptyText="No tests found. Add your first test to get started."
        getRowKey={(test) => test._id}
        pagination={{
          currentPage,
          totalPages,
          onPageChange: setCurrentPage,
          rightContent: (
            <p className="text-sm text-gray-500">
              Showing {firstVisibleTest}-{lastVisibleTest} of {filteredTests.length}
            </p>
          ),
        }}
      />

    </div>
  );
};

export default TestManager;
