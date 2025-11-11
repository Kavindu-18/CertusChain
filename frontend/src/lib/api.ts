import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
};

// Factories API
export const factoriesAPI = {
  getAll: () => api.get('/factories'),
  getById: (id: string) => api.get(`/factories/${id}`),
  create: (data: any) => api.post('/factories', data),
  update: (id: string, data: any) => api.put(`/factories/${id}`, data),
  delete: (id: string) => api.delete(`/factories/${id}`),
};

// Suppliers API
export const suppliersAPI = {
  getAll: () => api.get('/suppliers'),
  getById: (id: string) => api.get(`/suppliers/${id}`),
  create: (data: any) => api.post('/suppliers', data),
  update: (id: string, data: any) => api.put(`/suppliers/${id}`, data),
  delete: (id: string) => api.delete(`/suppliers/${id}`),
};

// Devices API
export const devicesAPI = {
  getAll: () => api.get('/devices'),
  create: (data: any) => api.post('/devices', data),
};

// Traceability API
export const traceabilityAPI = {
  createRawMaterial: (data: any) => api.post('/trace/raw-material', data),
  createProductionRun: (data: any) => api.post('/trace/production-run', data),
  createFinishedGood: (data: any) => api.post('/trace/finished-good', data),
  lookupQR: (qrCode: string) => axios.get(`${API_URL}/trace/${qrCode}`), // Public endpoint
};

// Ingest API
export const ingestAPI = {
  ingestIoTData: (data: any[]) => api.post('/ingest/iot', data),
};

// Reports API
export const reportsAPI = {
  getAll: () => api.get('/reports'),
  generate: (data: any) => api.post('/reports/generate', data),
  getById: (id: string) => api.get(`/reports/${id}`),
};

// Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
  create: (data: any) => api.post('/users', data),
  update: (id: string, data: any) => api.put(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
};
