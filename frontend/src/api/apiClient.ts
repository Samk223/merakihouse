import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor to attach Bearer token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle unauthorized errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear local auth storage if unauthorized
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_info");
      
      // Optional: redirect to login page if window is defined
      if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
        window.location.href = "/login?expired=true";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
