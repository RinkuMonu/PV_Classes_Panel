import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trash2, Plus, ChevronLeft, Pencil } from 'lucide-react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

const AttributesValues = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Sample data - in a real app, you would fetch this based on the id
  const attributeData = {
    '81B2': { name: 'Color', displayName: 'Color', type: 'Dropdown' },
    '81B6': { name: 'Size', displayName: 'Size', type: 'Radio' },
    'EA1B': { name: 'test', displayName: 'test', type: 'Radio' },
    'B977': { name: 'tets', displayName: 'ui', type: 'Radio' },
    '467D': { name: 'blue', displayName: 'color', type: 'Dropdown' }
  };

  const [values, setValues] = useState([
    { id: '81b3', name: 'Red', type: 'Dropdown', status: true },
    { id: '81b4', name: 'Green', type: 'Dropdown', status: true },
    { id: '81b5', name: 'Blue', type: 'Dropdown', status: true }
  ]);

  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newValue, setNewValue] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentValue, setCurrentValue] = useState(null);

  const currentAttribute = attributeData[id] || { 
    name: 'Unknown', 
    displayName: 'Unknown', 
    type: 'Dropdown' 
  };

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedItems(values.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const toggleItemSelection = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const toggleStatus = (id) => {
    setValues(values.map(item => 
      item.id === id ? { ...item, status: !item.status } : item
    ));
  };

  const handleAddValue = () => {
    if (newValue.trim()) {
      const newValueObj = {
        id: Math.random().toString(36).substr(2, 4).toUpperCase(),
        name: newValue,
        type: currentAttribute.type,
        status: true
      };
      setValues([...values, newValueObj]);
      setNewValue('');
      setIsAddModalOpen(false);
    }
  };

  const handleEditValue = (value) => {
    setCurrentValue(value);
    setIsEditModalOpen(true);
  };

  const handleUpdateValue = (updatedValue) => {
    setValues(values.map(item => 
      item.id === updatedValue.id ? updatedValue : item
    ));
    setIsEditModalOpen(false);
  };

  const deleteValue = (id) => {
    setValues(values.filter(item => item.id !== id));
    setSelectedItems(selectedItems.filter(itemId => itemId !== id));
  };

  const bulkDelete = () => {
    setValues(values.filter(item => !selectedItems.includes(item.id)));
    setSelectedItems([]);
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-4">
        {/* Breadcrumb and Header */}
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Attributes
          </button>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Attribute Values</h1>
              <div className="flex items-center mt-2 text-sm text-gray-600">
                <span className="font-medium">{currentAttribute.displayName}</span>
                <span className="mx-2">•</span>
                <span>{currentAttribute.type}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-lg shadow-xs">
          <div className="flex gap-3">
            <button
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-sm"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus className="w-4 h-4" />
              Add Value
            </button>
          </div>

          <div className="flex gap-3">
            <button
              className={`flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm ${
                selectedItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={bulkDelete}
              disabled={selectedItems.length === 0}
            >
              <Trash2 className="w-4 h-4" />
              Delete Selected
            </button>
          </div>
        </div>

        {/* Values Table */}
        <div className="w-full overflow-hidden border border-gray-200 rounded-lg mb-8 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      checked={selectAll}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {values.length > 0 ? (
                  values.map((value) => (
                    <tr key={value.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                          checked={selectedItems.includes(value.id)}
                          onChange={() => toggleItemSelection(value.id)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {value.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {value.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {value.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={value.status}
                            onChange={() => toggleStatus(value.id)}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex justify-end items-center gap-2">
                          <Tippy content="Edit">
                            <button
                              className="h-8 w-8 p-0 hover:bg-gray-100 rounded inline-flex items-center justify-center"
                              onClick={() => handleEditValue(value)}
                            >
                              <Pencil className="w-4 h-4 text-gray-400" />
                            </button>
                          </Tippy>
                          <Tippy content="Delete">
                            <button
                              className="h-8 w-8 p-0 hover:bg-gray-100 rounded inline-flex items-center justify-center"
                              onClick={() => deleteValue(value.id)}
                            >
                              <Trash2 className="w-4 h-4 text-gray-400" />
                            </button>
                          </Tippy>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                      No values found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Value Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add New Value</h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mb-4">
                <label htmlFor="valueName" className="block text-sm font-medium text-gray-700 mb-1">
                  Value Name
                </label>
                <input
                  type="text"
                  id="valueName"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="Enter value name"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddValue}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm font-medium hover:bg-emerald-700"
                >
                  Add Value
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Value Modal */}
        {isEditModalOpen && currentValue && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Edit Value</h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mb-4">
                <label htmlFor="editValueName" className="block text-sm font-medium text-gray-700 mb-1">
                  Value Name
                </label>
                <input
                  type="text"
                  id="editValueName"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  value={currentValue.name}
                  onChange={(e) => setCurrentValue({...currentValue, name: e.target.value})}
                />
              </div>
              <div className="flex items-center mb-4">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={currentValue.status}
                    onChange={() => setCurrentValue({...currentValue, status: !currentValue.status})}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    {currentValue.status ? 'Published' : 'Unpublished'}
                  </span>
                </label>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateValue(currentValue)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm font-medium hover:bg-emerald-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default AttributesValues;