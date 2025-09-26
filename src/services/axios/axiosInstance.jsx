// src/api/axiosInstance.js
import axios from "axios";

// Create axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL || "http://192.168.10.11:3001",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
 
    const token = "FOkB/AUT2wGXRv ablqvbg==";
    const Auth = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IndpbHByb3BoeUBpbmZvcm1lZC5wcm8iLCJuYW1lIjoid2lscHJvcGh5IiwiZ3JvdXBJZCI6MywibG9naW5UeXBlIjoiZGlyZWN0IiwidXNlclRva2VuIjoiRk9rQi9BVVQyd0dYUnYgYWJscXZiZz09IiwicGFzc3dvcmRJZCI6MjE0NzU0MTMwMCwiaWF0IjoxNzU4Nzk0NDkzLCJleHAiOjE3NTg3OTgwOTN9.7w6CcqLIPOhfHrbi-48vhdAxD5uIgFg1WSMh2tmRmeM`
    if (token) {
      config.headers.token = token;
    }
     if (Auth) {
      config.headers.Auth = Auth;
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
      // if (status === 401) {
      //   localStorage.removeItem("accessToken");
      //   window.location.href = "/";
      // } 
      // if (status === 403) {
      //   console.error("You don’t have permission to perform this action.");
      // }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
