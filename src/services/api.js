import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,

  headers: {
    "Content-Type": "application/json",
  },

  timeout: 360000,
});

api.interceptors.request.use(
  (config) => {
    const token =
      sessionStorage.getItem("token") ||
      sessionStorage.getItem(
        "skillverseToken"
      ) ||
      localStorage.getItem("token") ||
      localStorage.getItem(
        "skillverseToken"
      );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) =>
    Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (
      error.response?.status === 401
    ) {
      console.warn(
        "Unauthorized request"
      );
    }

    return Promise.reject(error);
  }
);

export default api;