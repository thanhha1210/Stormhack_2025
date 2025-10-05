// src/services/api.ts
import axios from "axios";

// ✅ Vite uses import.meta.env instead of process.env
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001";

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: { "Content-Type": "application/json" },
});

// ✅ Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
