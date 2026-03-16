import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || '/api';

// Admin instance — sends JWT token
const admin = axios.create({ baseURL: BASE });
admin.interceptors.request.use(cfg => {
  const token = localStorage.getItem('admin_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// Investor instance — sends investor JWT
const investor = axios.create({ baseURL: BASE });
investor.interceptors.request.use(cfg => {
  const token = localStorage.getItem('investor_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// Admin Auth API
export const authAPI = {
  setup:  (data)  => axios.post(`${BASE}/auth/setup`, data),
  login:  (data)  => axios.post(`${BASE}/auth/login`, data),
  forgot: (email) => axios.post(`${BASE}/auth/forgot`, { email }),
  reset:  (token, password) => axios.post(`${BASE}/auth/reset/${token}`, { password }),
};

// Admin API
export const adminAPI = {
  getSummary:     ()          => admin.get('/admin/summary'),
  getProducts:    ()          => admin.get('/products'),
  getProduct:     (id)        => admin.get(`/products/${id}`),
  createProduct:  (data)      => admin.post('/products', data),
  updateProduct:  (id, data)  => admin.put(`/products/${id}`, data),
  deleteProduct:  (id)        => admin.delete(`/products/${id}`),
  addInvestor:    (id, data)  => admin.post(`/products/${id}/investors`, data),
  removeInvestor: (id, aId)   => admin.delete(`/products/${id}/investors/${aId}`),
  saveSnapshot:   (id, data)  => admin.post(`/snapshots/${id}`, data),
  getSnapshots:   (id)        => admin.get(`/snapshots/${id}`),
};

// AI API
export const aiAPI = {
  report:   (id, language) => admin.post(`/ai/report/${id}`,   { language }),
  forecast: (id, language) => admin.post(`/ai/forecast/${id}`, { language }),
};

// Investor API
export const investorAPI = {
  login:     (creds) => investor.post('/investor/login', creds),
  getMyData: ()      => investor.get('/investor/me'),
};