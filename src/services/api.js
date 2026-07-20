import axios from "axios";

const rawApiUrl =
  import.meta.env
    .VITE_API_URL ||
  "http://localhost:5000/api";

const API_BASE_URL =
  String(rawApiUrl)
    .trim()
    .replace(/\/+$/, "");

const api =
  axios.create({
    baseURL:
      API_BASE_URL,

    headers: {
      "Content-Type":
        "application/json",
    },

    timeout:
      360000,
  });

api.interceptors.request.use(
  (config) => {
    const token =
      sessionStorage.getItem(
        "skillverseToken"
      ) ||
      sessionStorage.getItem(
        "token"
      ) ||
      localStorage.getItem(
        "skillverseToken"
      ) ||
      localStorage.getItem(
        "token"
      );

    if (token) {
      config.headers =
        config.headers || {};

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) =>
    Promise.reject(error)
);

api.interceptors.response.use(
  (response) =>
    response,

  (error) => {
    if (
      error.response?.status ===
      401
    ) {
      console.warn(
        "Unauthorized request"
      );
    }

    if (
      !error.response &&
      error.code ===
        "ERR_NETWORK"
    ) {
      console.error(
        "Backend network request failed:",
        API_BASE_URL
      );
    }

    return Promise.reject(
      error
    );
  }
);

export {
  API_BASE_URL,
};

export default api;