import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the correct JWT automatically
api.interceptors.request.use((config) => {

  let token = null;

  // Admin APIs
  if (config.url.startsWith("/admin")) {
    token = localStorage.getItem("adminToken");
  }

  // Manager APIs
  else if (config.url.startsWith("/manager")) {
    token = localStorage.getItem("managerToken");
  }

  // Customer / Public APIs
  else {
    token =
      localStorage.getItem("customerToken") ||
      localStorage.getItem("adminToken") ||
      localStorage.getItem("managerToken");
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;

});

export default api;