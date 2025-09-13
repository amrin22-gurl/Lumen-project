import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const createAccessToken = (email, password) => 
  api.post('/auth/token', { email, password });

export const verifyToken = (token) => 
  api.post('/auth/verify', { token });

// Users
export const createUser = (userData) => 
  api.post('/users', userData);

export const getUserByEmail = (email) => 
  api.get(`/users/email/${email}`);

export const getUserById = (id) => 
  api.get(`/users/${id}`);

export const updateUserProfile = (id, data) => 
  api.put(`/users/${id}`, data);

export const getUserSubscriptions = (userId) => 
  api.get(`/users/${userId}/subscriptions`);

// Companies
export const createCompany = (companyData) => 
  api.post('/companies', companyData);

export const getCompanyById = (id) => 
  api.get(`/companies/${id}`);

export const updateCompany = (id, data) => 
  api.put(`/companies/${id}`, data);

export const getCompanyPlans = (companyId) => 
  api.get(`/companies/${companyId}/plans`);

export const getCompanyAnalytics = (companyId) => 
  api.get(`/companies/${companyId}/analytics`);

// Plans
export const createPlan = (planData) => 
  api.post('/plans', planData);

export const getAllActivePlans = () => 
  api.get('/plans/active');

export const getPlanById = (id) => 
  api.get(`/plans/${id}`);

export const updatePlan = (id, data) => 
  api.put(`/plans/${id}`, data);

export const deletePlan = (id) => 
  api.delete(`/plans/${id}`);

// Subscriptions
export const createSubscription = (subscriptionData) => 
  api.post('/subscriptions', subscriptionData);

export const getSubscriptionById = (id) => 
  api.get(`/subscriptions/${id}`);

export const upgradeSubscription = (id, planId) => 
  api.post(`/subscriptions/${id}/upgrade`, { planId });

export const downgradeSubscription = (id, planId) => 
  api.post(`/subscriptions/${id}/downgrade`, { planId });

export const cancelSubscription = (id) => 
  api.post(`/subscriptions/${id}/cancel`);

export const renewSubscription = (id) => 
  api.post(`/subscriptions/${id}/renew`);

export const toggleAutoRenew = (id) => 
  api.post(`/subscriptions/${id}/toggle-auto-renew`);

// Discounts
export const createDiscount = (discountData) => 
  api.post('/discounts', discountData);

export const getCompanyDiscounts = (companyId) => 
  api.get(`/companies/${companyId}/discounts`);

export const validateDiscountCode = (code) => 
  api.post('/discounts/validate', { code });

export const applyDiscount = (subscriptionId, discountCode) => 
  api.post('/discounts/apply', { subscriptionId, discountCode });

// Analytics
export const getPlanAnalytics = (planId) => 
  api.get(`/plans/${planId}/analytics`);

export const getSystemAnalytics = () => 
  api.get('/analytics/system');

export const getRevenuetrends = () => 
  api.get('/analytics/revenue-trends');

export default api;