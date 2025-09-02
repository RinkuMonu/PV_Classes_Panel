import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://api.pvclasses.in/api",
    //  baseURL: "http://localhost:5006/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;