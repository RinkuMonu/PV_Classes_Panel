// components/TestSeries/QuestionManager.jsx
import React, { useState } from 'react';
import { addQuestionsToTest } from '../../../services/testSeriesApi';

const QuestionManager = ({ series, test, onBack }) => {
  const [questions, setQuestions] = useState(test.questions || []);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    type: 'mcq_single',
    statement: '',
    options: [{ key: 'A', text: '' }],
    correctOptions: [],
    correctNumeric: '',
    marks: 1,
    negativeMarks: 0,
    explanation: '',
    subject: test.subject || '',
    topic: '',
    is_active: true
  });
  const [bulkJson, setBulkJson] = useState('');

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      // Prepare the question data
      const questionData = { ...newQuestion };
      
      // For numeric questions, clear options
      if (questionData.type === 'numeric') {
        questionData.options = [];
      }
      
      // Add the question to the list
      const updatedQuestions = [...questions, questionData];
      setQuestions(updatedQuestions);
      
      // Update the backend
      await addQuestionsToTest(series._id, test._id, { questions: [questionData] });
      
      // Reset form
      setNewQuestion({
        type: 'mcq_single',
        statement: '',
        options: [{ key: 'A', text: '' }],
        correctOptions: [],
        correctNumeric: '',
        marks: 1,
        negativeMarks: 0,
        explanation: '',
        subject: test.subject || '',
        topic: '',
        is_active: true
      });
      setShowQuestionForm(false);
    } catch (err) {
      console.error('Failed to add question', err);
    }
  };

  const handleAddOption = () => {
    const nextKey = String.fromCharCode(65 + newQuestion.options.length); // A, B, C, ...
    setNewQuestion({
      ...newQuestion,
      options: [...newQuestion.options, { key: nextKey, text: '' }]
    });
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index].text = value;
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  const handleCorrectOptionChange = (key, isChecked) => {
    let updatedCorrectOptions = [...newQuestion.correctOptions];
    
    if (isChecked) {
      if (newQuestion.type === 'mcq_single') {
        updatedCorrectOptions = [key]; // Only one correct answer for single choice
      } else {
        updatedCorrectOptions.push(key); // Add to correct answers for multi-choice
      }
    } else {
      updatedCorrectOptions = updatedCorrectOptions.filter(k => k !== key);
    }
    
    setNewQuestion({ ...newQuestion, correctOptions: updatedCorrectOptions });
  };

  const handleBulkAdd = async () => {
    try {
      const questionsToAdd = JSON.parse(bulkJson);
      if (!Array.isArray(questionsToAdd)) {
        alert('Bulk data must be an array of questions');
        return;
      }
      
      await addQuestionsToTest(series._id, test._id, { questions: questionsToAdd });
      setQuestions([...questions, ...questionsToAdd]);
      setBulkJson('');
      alert('Questions added successfully');
    } catch (err) {
      console.error('Failed to add bulk questions', err);
      alert('Error adding questions. Check the JSON format.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Questions: {test.title}</h2>
        <div className="flex space-x-4">
          <button
            onClick={onBack}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Back to Tests
          </button>
          <button
            onClick={() => setShowQuestionForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Question
          </button>
        </div>
      </div>

      {showQuestionForm && (
        <div className="bg-white p-6 rounded shadow-md mb-6">
          <h3 className="text-xl font-bold mb-4">Add New Question</h3>
          <form onSubmit={handleAddQuestion} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={newQuestion.type}
                onChange={(e) => {
                  const newType = e.target.value;
                  setNewQuestion({
                    ...newQuestion,
                    type: newType,
                    correctOptions: newType === 'numeric' ? [] : newQuestion.correctOptions,
                    options: newType === 'numeric' ? [] : newQuestion.options
                  });
                }}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="mcq_single">Single Choice MCQ</option>
                <option value="mcq_multi">Multiple Choice MCQ</option>
                <option value="numeric">Numeric</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Question Statement</label>
              <textarea
                value={newQuestion.statement}
                onChange={(e) => setNewQuestion({...newQuestion, statement: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
                rows="3"
                required
              ></textarea>
            </div>
            
            {(newQuestion.type === 'mcq_single' || newQuestion.type === 'mcq_multi') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Options</label>
                {newQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <span className="w-8 font-medium">{option.key}.</span>
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-md mr-2"
                      required
                    />
                    <input
                      type={newQuestion.type === 'mcq_single' ? 'radio' : 'checkbox'}
                      name="correctOption"
                      checked={newQuestion.correctOptions.includes(option.key)}
                      onChange={(e) => handleCorrectOptionChange(option.key, e.target.checked)}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="mt-2 px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
                >
                  + Add Option
                </button>
              </div>
            )}
            
            {newQuestion.type === 'numeric' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correct Numeric Answer</label>
                <input
                  type="number"
                  step="any"
                  value={newQuestion.correctNumeric}
                  onChange={(e) => setNewQuestion({...newQuestion, correctNumeric: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marks</label>
                <input
                  type="number"
                  value={newQuestion.marks}
                  onChange={(e) => setNewQuestion({...newQuestion, marks: parseInt(e.target.value) || 1})}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Negative Marks</label>
                <input
                  type="number"
                  value={newQuestion.negativeMarks}
                  onChange={(e) => setNewQuestion({...newQuestion, negativeMarks: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={newQuestion.subject}
                  onChange={(e) => setNewQuestion({...newQuestion, subject: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                <input
                  type="text"
                  value={newQuestion.topic}
                  onChange={(e) => setNewQuestion({...newQuestion, topic: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Explanation</label>
              <textarea
                value={newQuestion.explanation}
                onChange={(e) => setNewQuestion({...newQuestion, explanation: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
                rows="2"
              ></textarea>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={newQuestion.is_active}
                onChange={(e) => setNewQuestion({...newQuestion, is_active: e.target.checked})}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                Active
              </label>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowQuestionForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Question
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white p-6 rounded shadow-md mb-6">
        <h3 className="text-xl font-bold mb-4">Bulk Add Questions</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              JSON Format Questions (array of question objects)
            </label>
            <textarea
              value={bulkJson}
              onChange={(e) => setBulkJson(e.target.value)}
              className="w-full px-3 py-2 border rounded-md font-mono"
              rows="6"
              placeholder={`[
  {
    "type": "mcq_single",
    "statement": "What is the capital of France?",
    "options": [
      { "key": "A", "text": "London" },
      { "key": "B", "text": "Paris" },
      { "key": "C", "text": "Berlin" },
      { "key": "D", "text": "Madrid" }
    ],
    "correctOptions": ["B"],
    "marks": 1,
    "negativeMarks": 0.25,
    "subject": "Geography",
    "topic": "European Capitals"
  },
  {
    "type": "numeric",
    "statement": "What is 2 + 2?",
    "correctNumeric": 4,
    "marks": 1,
    "subject": "Math",
    "topic": "Basic Arithmetic"
  }
]`}
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleBulkAdd}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Add Bulk Questions
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium">Questions ({questions.length})</h3>
        </div>
        <div className="divide-y">
          {questions.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No questions added yet.
            </div>
          ) : (
            questions.map((question, index) => (
              <div key={index} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium mb-2">{index + 1}. {question.statement}</p>
                    
                    {(question.type === 'mcq_single' || question.type === 'mcq_multi') && (
                      <ul className="ml-6 mb-2">
                        {question.options.map((opt, optIndex) => (
                          <li 
                            key={optIndex} 
                            className={`${question.correctOptions.includes(opt.key) ? 'text-green-600 font-medium' : ''}`}
                          >
                            {opt.key}. {opt.text}
                            {question.correctOptions.includes(opt.key) && ' ✓'}
                          </li>
                        ))}
                      </ul>
                    )}
                    
                    {question.type === 'numeric' && (
                      <p className="mb-2">
                        <span className="font-medium">Correct Answer:</span> {question.correctNumeric}
                      </p>
                    )}
                    
                    <div className="text-sm text-gray-600">
                      <span className="mr-3">Marks: {question.marks}</span>
                      {question.negativeMarks > 0 && (
                        <span className="mr-3">Negative: {question.negativeMarks}</span>
                      )}
                      <span className="mr-3">Type: {question.type.replace('_', ' ')}</span>
                      {question.subject && <span className="mr-3">Subject: {question.subject}</span>}
                      {question.topic && <span>Topic: {question.topic}</span>}
                    </div>
                    
                    {question.explanation && (
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Explanation:</span> {question.explanation}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs ${question.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {question.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionManager;