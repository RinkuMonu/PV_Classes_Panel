// services/testSeriesApi.js
import axios from 'axios';

const API_BASE_URL = 'https://api.pvclasses.in/api';
// const API_BASE_URL = 'http://localhost:5006/api';

// Set up axios defaults
axios.defaults.baseURL = API_BASE_URL;

// Add a request interceptor to include the auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log("Interceptor token:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getTestSeries = () => {
  return axios.get('/test-series');
};

export const getTestSeriesById = (id) => {
  return axios.get(`/test-series/${id}`);
};

export const getTestSeriesByExam = (examId) => {
  return axios.get(`/test-series/exam/${examId}`);
};

export const createTestSeries = (formData) => {
  return axios.post('/test-series', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const updateTestSeries = (id, formData) => {
  return axios.put(`/test-series/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const deleteTestSeries = (id) => {
  return axios.delete(`/test-series/${id}`);
};

export const addTestToSeries = (seriesId, testData) => {
  return axios.post(`/test-series/${seriesId}/tests`, testData);
};

export const deleteQuestionFromTest = (seriesId, testId, questionId) => {
  return axios.delete(`/test-series/${seriesId}/tests/${testId}/questions/${questionId}`);
};

export const deleteTestFromSeries = (seriesId, testId) => {
  return axios.delete(`/test-series/delete-test/${seriesId}/${testId}`);
};


export const addQuestionsToTest = (seriesId, testId, questionsData) => {
  return axios.post(`/test-series/${seriesId}/tests/${testId}/questions`, questionsData);
};

export const startTestAttempt = (seriesId, testId) => {
  return axios.post(`/test-series/${seriesId}/tests/${testId}/start`);
};

export const getCurrentQuestion = (seriesId, attemptId) => {
  return axios.get(`/test-series/${seriesId}/attempts/${attemptId}/current`);
};

export const submitAnswer = (seriesId, attemptId, answerData) => {
  return axios.post(`/test-series/${seriesId}/attempts/${attemptId}/answer`, answerData);
};

export const finishAttempt = (seriesId, attemptId) => {
  return axios.post(`/test-series/${seriesId}/attempts/${attemptId}/finish`);
};

export const getAnswerSheet = (seriesId) => {
  return axios.get(`/test-series/get-answer-sheet/${seriesId}`);
};