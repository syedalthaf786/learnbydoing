import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://learnbydoing-1.onrender.com/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Course Management API
export const courseAPI = {
  getAllCourses: () => api.get('/courses'),
  getCourse: (id) => api.get(`/courses/${id}`),
  createCourse: (data) => api.post('/courses', data),
  updateCourse: (id, data) => api.put(`/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/courses/${id}`),
};

// Project Management API
export const projectAPI = {
  getAllProjects: () => api.get('/projects'),
  getProject: (id) => api.get(`/projects/${id}`),
  createProject: (data) => api.post('/projects', data),
  updateProject: (id, data) => api.put(`/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/projects/${id}`),
};

// User Management API
export const userAPI = {
  getAllUsers: () => api.get('/users'),
  getUser: (id) => api.get(`/users/${id}`),
  createUser: (data) => api.post('/users', data),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

// Mentor Management API
export const mentorAPI = {
  getAllMentors: () => api.get('/mentors'),
  getMentor: (id) => api.get(`/mentors/${id}`),
  createMentor: (data) => api.post('/mentors', data),
  updateMentor: (id, data) => api.put(`/mentors/${id}`, data),
  deleteMentor: (id) => api.delete(`/mentors/${id}`),
};

export default api; 