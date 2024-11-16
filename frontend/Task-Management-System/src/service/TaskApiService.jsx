import axios from "axios";
import { getJwtToken } from "./AuthApiService"; // Import function to get JWT token

const API_BASE_URL = 'http://localhost:8080/api/v1/tasks';

// Axios interceptor for logging errors
axios.interceptors.response.use(
  response => response,
  error => {
    console.error('API request error:', error);
    return Promise.reject(error);
  }
);

// Helper to get authorization headers
const getAuthHeaders = () => {
  const token = getJwtToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Task API calls with JWT token in headers
export const retrieveAllTasks = (userId) =>
  axios.get(`${API_BASE_URL}/user/${userId}`, {
    headers: getAuthHeaders(),
  });

export const createTask = (task, userId) =>
  axios.post(`${API_BASE_URL}/user/${userId}`, task, {
    headers: getAuthHeaders(),
  });

export const retrieveTaskById = (taskId) =>
  axios.get(`${API_BASE_URL}/${taskId}`, {
    headers: getAuthHeaders(),
  });

export const updateTask = (task, id) =>
  axios.put(`${API_BASE_URL}/${id}`, task, {
    headers: getAuthHeaders(),
  });

export const deleteTask = (id) =>
  axios.delete(`${API_BASE_URL}/${id}`, {
    headers: getAuthHeaders(),
  });

export const markDone = (id) =>
  axios.post(`${API_BASE_URL}/${id}/task-done`, null, {
    headers: getAuthHeaders(),
  });
  

export const markPending = (id) =>
  axios.post(`${API_BASE_URL}/${id}/task-pending`, null, {
    headers: getAuthHeaders(),
  });
