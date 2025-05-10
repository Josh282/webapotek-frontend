import axios from "axios";

// Buat instance axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});


// Interceptor untuk nambah Authorization header otomatis
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
