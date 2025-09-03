// components/TestSeries/TestSeriesDashboard.jsx
import React, { useState, useEffect } from 'react';
import TestSeriesList from './TestSeriesList';
import TestSeriesForm from './TestSeriesForm';
import TestManager from './TestManager';
import QuestionManager from './QuestionManager';
import { getTestSeries, createTestSeries, updateTestSeries, deleteTestSeries } from '../../../services/testSeriesApi';
// import {getTestSeries} from '../../../services/testSeriesApi';

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
    } catch (err) {
      setError('Failed to create test series');
      console.error(err);
    }
  };

  const handleUpdateSeries = async (id, seriesData) => {
    try {
      await updateTestSeries(id, seriesData);
      fetchTestSeries();
      setActiveTab('list');
      setSelectedSeries(null);
    } catch (err) {
      setError('Failed to update test series');
      console.error(err);
    }
  };

  const handleDeleteSeries = async (id) => {
    if (!window.confirm('Are you sure you want to delete this test series?')) return;
    
    try {
      await deleteTestSeries(id);
      fetchTestSeries();
    } catch (err) {
      setError('Failed to delete test series');
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

  if (loading) return <div className="text-center py-8">Loading test series...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Test Series Management</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-6">
        <div className="flex border-b">
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'list' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('list')}
          >
            All Test Series
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'create' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('create')}
          >
            Create New
          </button>
          {selectedSeries && activeTab === 'edit' && (
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'edit' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            >
              Edit: {selectedSeries.title}
            </button>
          )}
          {selectedSeries && activeTab === 'manage-tests' && (
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'manage-tests' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            >
              Manage Tests: {selectedSeries.title}
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