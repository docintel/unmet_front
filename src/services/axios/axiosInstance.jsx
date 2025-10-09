import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const clearLocalStorage = () => {
  localStorage.removeItem("decrypted_token");
  // remove other stored items if needed
};

// ===== Request Interceptor =====
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("decrypted_token");
    if (token) {
      config.headers.auth = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ===== Response Interceptor with Refresh Queue =====
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // Queue the request if token is already refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.auth = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshRes = await fetch(
          import.meta.env.VITE_APP_API_BASE_URL + "/auth/refresh-token",
          { method: "POST", credentials: "include" }
        );

        if (!refreshRes.ok) {
          clearLocalStorage();
          window.location.href = "/";
          return Promise.reject(error);
        }

        const data = await refreshRes.json();
        const newToken = data.data.accessToken;

        localStorage.setItem("decrypted_token", newToken);
        processQueue(null, newToken);

        originalRequest.headers.auth = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        clearLocalStorage();
        window.location.href = "/";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
