// // components/TestSeries/QuestionManager.jsx
// import React, { useState } from 'react';
// import { addQuestionsToTest } from '../../../services/testSeriesApi';

// const QuestionManager = ({ series, test, onBack }) => {
//   const [questions, setQuestions] = useState(test.questions || []);
//   const [showQuestionForm, setShowQuestionForm] = useState(false);
//   const [newQuestion, setNewQuestion] = useState({
//     type: 'mcq_single',
//     statement: '',
//     options: [{ key: 'A', text: '' }],
//     correctOptions: [],
//     correctNumeric: '',
//     marks: 1,
//     negativeMarks: 0,
//     explanation: '',
//     subject: test.subject || '',
//     topic: '',
//     is_active: true
//   });
//   const [bulkJson, setBulkJson] = useState('');

//   const handleAddQuestion = async (e) => {
//     e.preventDefault();
//     try {
//       // Prepare the question data
//       const questionData = { ...newQuestion };
      
//       // For numeric questions, clear options
//       if (questionData.type === 'numeric') {
//         questionData.options = [];
//       }
      
//       // Add the question to the list
//       const updatedQuestions = [...questions, questionData];
//       setQuestions(updatedQuestions);
      
//       // Update the backend
//       await addQuestionsToTest(series._id, test._id, { questions: [questionData] });
      
//       // Reset form
//       setNewQuestion({
//         type: 'mcq_single',
//         statement: '',
//         options: [{ key: 'A', text: '' }],
//         correctOptions: [],
//         correctNumeric: '',
//         marks: 1,
//         negativeMarks: 0,
//         explanation: '',
//         subject: test.subject || '',
//         topic: '',
//         is_active: true
//       });
//       setShowQuestionForm(false);
//     } catch (err) {
//       console.error('Failed to add question', err);
//     }
//   };

//   const handleAddOption = () => {
//     const nextKey = String.fromCharCode(65 + newQuestion.options.length); // A, B, C, ...
//     setNewQuestion({
//       ...newQuestion,
//       options: [...newQuestion.options, { key: nextKey, text: '' }]
//     });
//   };

//   const handleOptionChange = (index, value) => {
//     const updatedOptions = [...newQuestion.options];
//     updatedOptions[index].text = value;
//     setNewQuestion({ ...newQuestion, options: updatedOptions });
//   };

//   const handleCorrectOptionChange = (key, isChecked) => {
//     let updatedCorrectOptions = [...newQuestion.correctOptions];
    
//     if (isChecked) {
//       if (newQuestion.type === 'mcq_single') {
//         updatedCorrectOptions = [key]; // Only one correct answer for single choice
//       } else {
//         updatedCorrectOptions.push(key); // Add to correct answers for multi-choice
//       }
//     } else {
//       updatedCorrectOptions = updatedCorrectOptions.filter(k => k !== key);
//     }
    
//     setNewQuestion({ ...newQuestion, correctOptions: updatedCorrectOptions });
//   };

//   const handleBulkAdd = async () => {
//     try {
//       const questionsToAdd = JSON.parse(bulkJson);
//       if (!Array.isArray(questionsToAdd)) {
//         alert('Bulk data must be an array of questions');
//         return;
//       }
      
//       await addQuestionsToTest(series._id, test._id, { questions: questionsToAdd });
//       setQuestions([...questions, ...questionsToAdd]);
//       setBulkJson('');
//       alert('Questions added successfully');
//     } catch (err) {
//       console.error('Failed to add bulk questions', err);
//       alert('Error adding questions. Check the JSON format.');
//     }
//   };

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold">Manage Questions: {test.title}</h2>
//         <div className="flex space-x-4">
//           <button
//             onClick={onBack}
//             className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//           >
//             Back to Tests
//           </button>
//           <button
//             onClick={() => setShowQuestionForm(true)}
//             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//           >
//             Add Question
//           </button>
//         </div>
//       </div>

//       {showQuestionForm && (
//         <div className="bg-white p-6 rounded shadow-md mb-6">
//           <h3 className="text-xl font-bold mb-4">Add New Question</h3>
//           <form onSubmit={handleAddQuestion} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
//               <select
//                 value={newQuestion.type}
//                 onChange={(e) => {
//                   const newType = e.target.value;
//                   setNewQuestion({
//                     ...newQuestion,
//                     type: newType,
//                     correctOptions: newType === 'numeric' ? [] : newQuestion.correctOptions,
//                     options: newType === 'numeric' ? [] : newQuestion.options
//                   });
//                 }}
//                 className="w-full px-3 py-2 border rounded-md"
//               >
//                 <option value="mcq_single">Single Choice MCQ</option>
//                 <option value="mcq_multi">Multiple Choice MCQ</option>
//                 <option value="numeric">Numeric</option>
//               </select>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Question Statement</label>
//               <textarea
//                 value={newQuestion.statement}
//                 onChange={(e) => setNewQuestion({...newQuestion, statement: e.target.value})}
//                 className="w-full px-3 py-2 border rounded-md"
//                 rows="3"
//                 required
//               ></textarea>
//             </div>
            
//             {(newQuestion.type === 'mcq_single' || newQuestion.type === 'mcq_multi') && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Options</label>
//                 {newQuestion.options.map((option, index) => (
//                   <div key={index} className="flex items-center mb-2">
//                     <span className="w-8 font-medium">{option.key}.</span>
//                     <input
//                       type="text"
//                       value={option.text}
//                       onChange={(e) => handleOptionChange(index, e.target.value)}
//                       className="flex-1 px-3 py-2 border rounded-md mr-2"
//                       required
//                     />
//                     <input
//                       type={newQuestion.type === 'mcq_single' ? 'radio' : 'checkbox'}
//                       name="correctOption"
//                       checked={newQuestion.correctOptions.includes(option.key)}
//                       onChange={(e) => handleCorrectOptionChange(option.key, e.target.checked)}
//                       className="h-4 w-4 text-blue-600 rounded"
//                     />
//                   </div>
//                 ))}
//                 <button
//                   type="button"
//                   onClick={handleAddOption}
//                   className="mt-2 px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
//                 >
//                   + Add Option
//                 </button>
//               </div>
//             )}
            
//             {newQuestion.type === 'numeric' && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Correct Numeric Answer</label>
//                 <input
//                   type="number"
//                   step="any"
//                   value={newQuestion.correctNumeric}
//                   onChange={(e) => setNewQuestion({...newQuestion, correctNumeric: e.target.value})}
//                   className="w-full px-3 py-2 border rounded-md"
//                   required
//                 />
//               </div>
//             )}
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Marks</label>
//                 <input
//                   type="number"
//                   value={newQuestion.marks}
//                   onChange={(e) => setNewQuestion({...newQuestion, marks: parseInt(e.target.value) || 1})}
//                   className="w-full px-3 py-2 border rounded-md"
//                   required
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Negative Marks</label>
//                 <input
//                   type="number"
//                   value={newQuestion.negativeMarks}
//                   onChange={(e) => setNewQuestion({...newQuestion, negativeMarks: parseInt(e.target.value) || 0})}
//                   className="w-full px-3 py-2 border rounded-md"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
//                 <input
//                   type="text"
//                   value={newQuestion.subject}
//                   onChange={(e) => setNewQuestion({...newQuestion, subject: e.target.value})}
//                   className="w-full px-3 py-2 border rounded-md"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
//                 <input
//                   type="text"
//                   value={newQuestion.topic}
//                   onChange={(e) => setNewQuestion({...newQuestion, topic: e.target.value})}
//                   className="w-full px-3 py-2 border rounded-md"
//                 />
//               </div>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Explanation</label>
//               <textarea
//                 value={newQuestion.explanation}
//                 onChange={(e) => setNewQuestion({...newQuestion, explanation: e.target.value})}
//                 className="w-full px-3 py-2 border rounded-md"
//                 rows="2"
//               ></textarea>
//             </div>
            
//             <div className="flex items-center">
//               <input
//                 type="checkbox"
//                 id="is_active"
//                 checked={newQuestion.is_active}
//                 onChange={(e) => setNewQuestion({...newQuestion, is_active: e.target.checked})}
//                 className="h-4 w-4 text-blue-600 rounded"
//               />
//               <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
//                 Active
//               </label>
//             </div>
            
//             <div className="flex justify-end space-x-4">
//               <button
//                 type="button"
//                 onClick={() => setShowQuestionForm(false)}
//                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//               >
//                 Add Question
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       <div className="bg-white p-6 rounded shadow-md mb-6">
//         <h3 className="text-xl font-bold mb-4">Bulk Add Questions</h3>
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               JSON Format Questions (array of question objects)
//             </label>
//             <textarea
//               value={bulkJson}
//               onChange={(e) => setBulkJson(e.target.value)}
//               className="w-full px-3 py-2 border rounded-md font-mono"
//               rows="6"
//               placeholder={`[
//   {
//     "type": "mcq_single",
//     "statement": "What is the capital of France?",
//     "options": [
//       { "key": "A", "text": "London" },
//       { "key": "B", "text": "Paris" },
//       { "key": "C", "text": "Berlin" },
//       { "key": "D", "text": "Madrid" }
//     ],
//     "correctOptions": ["B"],
//     "marks": 1,
//     "negativeMarks": 0.25,
//     "subject": "Geography",
//     "topic": "European Capitals"
//   },
//   {
//     "type": "numeric",
//     "statement": "What is 2 + 2?",
//     "correctNumeric": 4,
//     "marks": 1,
//     "subject": "Math",
//     "topic": "Basic Arithmetic"
//   }
// ]`}
//             ></textarea>
//           </div>
//           <div className="flex justify-end">
//             <button
//               onClick={handleBulkAdd}
//               className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
//             >
//               Add Bulk Questions
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white shadow-md rounded">
//         <div className="p-4 border-b">
//           <h3 className="text-lg font-medium">Questions ({questions.length})</h3>
//         </div>
//         <div className="divide-y">
//           {questions.length === 0 ? (
//             <div className="p-4 text-center text-gray-500">
//               No questions added yet.
//             </div>
//           ) : (
//             questions.map((question, index) => (
//               <div key={index} className="p-4">
//                 <div className="flex justify-between items-start">
//                   <div className="flex-1">
//                     <p className="font-medium mb-2">{index + 1}. {question.statement}</p>
                    
//                     {(question.type === 'mcq_single' || question.type === 'mcq_multi') && (
//                       <ul className="ml-6 mb-2">
//                         {question.options.map((opt, optIndex) => (
//                           <li 
//                             key={optIndex} 
//                             className={`${question.correctOptions.includes(opt.key) ? 'text-green-600 font-medium' : ''}`}
//                           >
//                             {opt.key}. {opt.text}
//                             {question.correctOptions.includes(opt.key) && ' ✓'}
//                           </li>
//                         ))}
//                       </ul>
//                     )}
                    
//                     {question.type === 'numeric' && (
//                       <p className="mb-2">
//                         <span className="font-medium">Correct Answer:</span> {question.correctNumeric}
//                       </p>
//                     )}
                    
//                     <div className="text-sm text-gray-600">
//                       <span className="mr-3">Marks: {question.marks}</span>
//                       {question.negativeMarks > 0 && (
//                         <span className="mr-3">Negative: {question.negativeMarks}</span>
//                       )}
//                       <span className="mr-3">Type: {question.type.replace('_', ' ')}</span>
//                       {question.subject && <span className="mr-3">Subject: {question.subject}</span>}
//                       {question.topic && <span>Topic: {question.topic}</span>}
//                     </div>
                    
//                     {question.explanation && (
//                       <div className="mt-2 text-sm">
//                         <span className="font-medium">Explanation:</span> {question.explanation}
//                       </div>
//                     )}
//                   </div>
                  
//                   <div>
//                     <span className={`px-2 py-1 rounded-full text-xs ${question.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                       {question.is_active ? 'Active' : 'Inactive'}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QuestionManager;


// components/TestSeries/QuestionManager.jsx
import React, { useState } from 'react';
import { addQuestionsToTest } from '../../../services/testSeriesApi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

      // Success toast
      toast.success('Question added successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });

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
      toast.error('Failed to add question. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
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
        toast.error('Bulk data must be an array of questions', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
        return;
      }

      await addQuestionsToTest(series._id, test._id, { questions: questionsToAdd });
      setQuestions([...questions, ...questionsToAdd]);
      setBulkJson('');

      toast.success(`${questionsToAdd.length} questions added successfully!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    } catch (err) {
      console.error('Failed to add bulk questions', err);
      toast.error('Error adding questions. Check the JSON format.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ToastContainer />

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-green-100">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-green-800">Manage Questions</h2>
            <p className="text-green-600 mt-1">{test.title}</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={onBack}
              className="px-4 py-2 border border-green-300 rounded-lg text-green-700 hover:bg-green-50 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Tests
            </button>
            <button
              onClick={() => setShowQuestionForm(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Question
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Total Questions</h3>
            <p className="text-3xl font-bold text-green-600">{questions.length}</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Active Questions</h3>
            <p className="text-3xl font-bold text-green-600">
              {questions.filter(q => q.is_active).length}
            </p>
          </div>
        </div>
      </div>

      {showQuestionForm && (
        <div className="bg-white p-6 rounded-xl shadow-lg mb-6 border border-green-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-green-800">Add New Question</h3>
            <button
              onClick={() => setShowQuestionForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleAddQuestion} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-green-700 mb-2">Question Type</label>
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
                  className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="mcq_single">Single Choice MCQ</option>
                  <option value="mcq_multi">Multiple Choice MCQ</option>
                  <option value="numeric">Numeric</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-green-700 mb-2">Subject</label>
                <input
                  type="text"
                  value={newQuestion.subject}
                  onChange={(e) => setNewQuestion({ ...newQuestion, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-green-700 mb-2">Question Statement</label>
              <textarea
                value={newQuestion.statement}
                onChange={(e) => setNewQuestion({ ...newQuestion, statement: e.target.value })}
                className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                rows="3"
                required
              ></textarea>
            </div>

            {(newQuestion.type === 'mcq_single' || newQuestion.type === 'mcq_multi') && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-green-700">Options</label>
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm hover:bg-green-200 transition-colors flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Option
                  </button>
                </div>

                {newQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center mb-3 p-2 bg-white rounded-md">
                    <span className="w-8 font-medium text-green-700">{option.key}.</span>
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-green-200 rounded-md mr-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                      placeholder="Option text"
                    />
                    <div className="flex items-center">
                      <label className="mr-2 text-sm text-green-700">Correct</label>
                      <input
                        type={newQuestion.type === 'mcq_single' ? 'radio' : 'checkbox'}
                        name="correctOption"
                        checked={newQuestion.correctOptions.includes(option.key)}
                        onChange={(e) => handleCorrectOptionChange(option.key, e.target.checked)}
                        className="h-5 w-5 text-green-600 rounded focus:ring-green-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {newQuestion.type === 'numeric' && (
              <div>
                <label className="block text-sm font-medium text-green-700 mb-2">Correct Numeric Answer</label>
                <input
                  type="number"
                  step="any"
                  value={newQuestion.correctNumeric}
                  onChange={(e) => setNewQuestion({ ...newQuestion, correctNumeric: e.target.value })}
                  className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-green-700 mb-2">Marks</label>
                <input
                  type="number"
                  value={newQuestion.marks}
                  onChange={(e) => setNewQuestion({ ...newQuestion, marks: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-green-700 mb-2">Negative Marks</label>
                <input
                  type="number"
                  value={newQuestion.negativeMarks}
                  onChange={(e) => setNewQuestion({ ...newQuestion, negativeMarks: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-green-700 mb-2">Topic</label>
                <input
                  type="text"
                  value={newQuestion.topic}
                  onChange={(e) => setNewQuestion({ ...newQuestion, topic: e.target.value })}
                  className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div className="flex items-center justify-center mt-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={newQuestion.is_active}
                    onChange={(e) => setNewQuestion({ ...newQuestion, is_active: e.target.checked })}
                    className="h-5 w-5 text-green-600 rounded focus:ring-green-500"
                  />
                  <label htmlFor="is_active" className="ml-2 text-sm text-green-700 font-medium">
                    Active Question
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-green-700 mb-2">Explanation</label>
              <textarea
                value={newQuestion.explanation}
                onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                rows="2"
                placeholder="Add explanation for the correct answer"
              ></textarea>
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t border-green-100">
              <button
                type="button"
                onClick={() => setShowQuestionForm(false)}
                className="px-5 py-2 border border-green-300 rounded-lg text-green-700 hover:bg-green-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
              >
                Add Question
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-lg mb-6 border border-green-100">
        <h3 className="text-xl font-bold text-green-800 mb-4">Bulk Add Questions</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-green-700 mb-2">
              JSON Format Questions (array of question objects)
            </label>
            <textarea
              value={bulkJson}
              onChange={(e) => setBulkJson(e.target.value)}
              className="w-full px-4 py-3 border border-green-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              rows="8"
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
              className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              Add Bulk Questions
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-green-100">
        <div className="p-4 border-b border-green-200 bg-green-50">
          <h3 className="text-lg font-medium text-green-800">Questions ({questions.length})</h3>
        </div>
        <div className="divide-y divide-green-100">
          {questions.length === 0 ? (
            <div className="p-8 text-center text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-green-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>No questions added yet.</p>
              <button
                onClick={() => setShowQuestionForm(true)}
                className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                Add Your First Question
              </button>
            </div>
          ) : (
            questions.map((question, index) => (
              <div key={index} className="p-6 hover:bg-green-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-start">
                      <span className="flex-shrink-0 h-8 w-8 bg-green-100 text-green-800 rounded-full flex items-center justify-center font-medium mr-3">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-green-900 mb-2">{question.statement}</p>

                        {(question.type === 'mcq_single' || question.type === 'mcq_multi') && (
                          <ul className="ml-2 mb-3">
                            {question.options.map((opt, optIndex) => (
                              <li
                                key={optIndex}
                                className={`flex items-center py-1 ${question.correctOptions.includes(opt.key) ? 'text-green-700 font-medium' : 'text-gray-600'}`}
                              >
                                <span className="inline-block w-6 font-medium">{opt.key}.</span>
                                <span>{opt.text}</span>
                                {question.correctOptions.includes(opt.key) && (
                                  <span className="ml-2 text-green-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}

                        {question.type === 'numeric' && (
                          <p className="mb-3">
                            <span className="font-medium text-green-700">Correct Answer:</span>
                            <span className="ml-2 bg-green-100 text-green-700 px-2 py-1 rounded-md">{question.correctNumeric}</span>
                          </p>
                        )}

                        <div className="flex flex-wrap gap-3 text-sm">
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md">
                            Marks: {question.marks}
                          </span>
                          {question.negativeMarks > 0 && (
                            <span className="bg-red-100 text-red-700 px-2 py-1 rounded-md">
                              Negative: {question.negativeMarks}
                            </span>
                          )}
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md">
                            {question.type.replace('_', ' ')}
                          </span>
                          {question.subject && (
                            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-md">
                              {question.subject}
                            </span>
                          )}
                          {question.topic && (
                            <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md">
                              {question.topic}
                            </span>
                          )}
                        </div>

                        {question.explanation && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                            <span className="font-medium text-blue-700">Explanation:</span>
                            <p className="text-blue-800 mt-1">{question.explanation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="ml-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${question.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
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
