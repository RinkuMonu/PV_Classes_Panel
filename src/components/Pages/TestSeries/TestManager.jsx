// components/TestSeries/TestManager.jsx
import React, { useState } from 'react';
import QuestionManager from './QuestionManager';
import { addTestToSeries, addQuestionsToTest } from '../../../services/testSeriesApi';

const TestManager = ({ series, onBack }) => {
  const [activeTestId, setActiveTestId] = useState(null);
  const [tests, setTests] = useState(series.tests || []);
  const [showTestForm, setShowTestForm] = useState(false);
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
    } catch (err) {
      console.error('Failed to add test', err);
    }
  };

  const handleManageQuestions = (testId) => {
    setActiveTestId(testId);
  };

  const handleBackToTests = () => {
    setActiveTestId(null);
  };

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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Tests: {series.title}</h2>
        <div className="flex space-x-4">
          <button
            onClick={onBack}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Back to Series
          </button>
          <button
            onClick={() => setShowTestForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add New Test
          </button>
        </div>
      </div>

      {showTestForm && (
        <div className="bg-white p-6 rounded shadow-md mb-6">
          <h3 className="text-xl font-bold mb-4">Add New Test</h3>
          <form onSubmit={handleAddTest} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newTest.title}
                  onChange={(e) => setNewTest({...newTest, title: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={newTest.subject}
                  onChange={(e) => setNewTest({...newTest, subject: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={newTest.type}
                  onChange={(e) => setNewTest({...newTest, type: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="daily_quiz">Daily Quiz</option>
                  <option value="full_test">Full Test</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time per Question (seconds)</label>
                <input
                  type="number"
                  value={newTest.perQuestionTimeSec}
                  onChange={(e) => setNewTest({...newTest, perQuestionTimeSec: parseInt(e.target.value) || 30})}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (seconds)</label>
                <input
                  type="number"
                  value={newTest.durationSec}
                  onChange={(e) => setNewTest({...newTest, durationSec: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Date</label>
                <input
                  type="datetime-local"
                  value={newTest.scheduleDate}
                  onChange={(e) => setNewTest({...newTest, scheduleDate: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={newTest.is_active}
                onChange={(e) => setNewTest({...newTest, is_active: e.target.checked})}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                Active
              </label>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowTestForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Test
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow-md rounded">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 text-left">Title</th>
              <th className="py-3 px-4 text-left">Subject</th>
              <th className="py-3 px-4 text-left">Type</th>
              <th className="py-3 px-4 text-left">Questions</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tests.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-4 px-4 text-center text-gray-500">
                  No tests found. Add your first test.
                </td>
              </tr>
            ) : (
              tests.map((test) => (
                <tr key={test._id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">{test.title}</td>
                  <td className="py-3 px-4">{test.subject}</td>
                  <td className="py-3 px-4 capitalize">{test.type.replace('_', ' ')}</td>
                  <td className="py-3 px-4">{test.questions?.length || 0}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${test.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {test.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleManageQuestions(test._id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Manage Questions
                    </button>
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

export default TestManager;