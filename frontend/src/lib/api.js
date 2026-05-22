import axios from "axios";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export function normalizeApiError(error) {
  const response = error?.response;
  return {
    message: response?.data?.message || response?.data?.detail || error?.message || "Something went wrong.",
    status: response?.status || 500,
    data: response?.data || null,
  };
}

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(normalizeApiError(error)),
);

export default api;