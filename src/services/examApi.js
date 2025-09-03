// services/examApi.js
import axios from 'axios';

const API_BASE_URL = 'https://api.pvclasses.in/api';

export const getExams = () => {
  return axios.get('/exams');
};