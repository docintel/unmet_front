// src/api/axiosInstance.js
import axios from "axios";

// Create axios instance
const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_APP_API_BASE_URL || "http://192.168.0.78:3009/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = "FOkB/AUT2wGXRv ablqvbg==";
    const Auth = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNoaXZhbS5jaGF1aGFuQHNoaW5lZGV6aWduLmNvbSIsIm5hbWUiOiJ2YXJ1biIsImdyb3VwSWQiOjcsImxvZ2luVHlwZSI6ImRpcmVjdCIsInVzZXJUb2tlbiI6IlQwWjEzVHFVNTF6cUVHUnhKWFNCUHc9PSIsInR5cGUiOiJzc28iLCJzc29NYWlsIjoic2hpdmFtLmNoYXVoYW5Ac2hpbmVkZXppZ24uY29tIiwiaWF0IjoxNzU5MTIzNDczLCJleHAiOjE3NTkxNjY2NzN9.1ITyuS-GRHSeIqB9i2ClSXDY_8SY65VxDS2SL2cFVYA`;
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
