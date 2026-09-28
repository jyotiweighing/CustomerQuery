import axios from "axios";
// import API from "../../config/api";
const api = axios.create({
  // baseURL:"https://customerquery.onrender.com/api"
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
