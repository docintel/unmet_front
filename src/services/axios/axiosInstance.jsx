// src/api/axiosInstance.js
import axios from "axios";
import { clearLocalStorage } from "../../helper/helper";

// Create axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL || "http://192.168.0.78:3009/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
  
    const auth = localStorage.getItem("decrypted_token");
     if (auth) {
      config.headers.auth = `Bearer `+ auth;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        clearLocalStorage() 
        window.location.href = "/";
      }
      // if (status === 403) {
      //   console.error("You don’t have permission to perform this action.");
      // }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
