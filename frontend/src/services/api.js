import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication Endpoints
export const signup = (userData) => 
  api.post('/auth/signup', userData);

export const login = (credentials) => 
  api.post('/auth/login', credentials);

export const verifyToken = () => 
  api.get('/auth/verify-token');

// User Endpoints
export const getUserProfile = () => 
  api.get('/user/profile');

export const updateUserProfile = (data) => 
  api.put('/user/profile', data);

export const changePassword = (passwordData) => 
  api.post('/user/change-password', passwordData);

export const getUserPlans = () => 
  api.get('/user/plans');

export const getPlanById = (planId) => 
  api.get(`/user/plans/${planId}`);

export const getUserSubscriptions = () => 
  api.get('/user/subscriptions');

export const getSubscriptionById = (subscriptionId) => 
  api.get(`/user/subscriptions/${subscriptionId}`);

export const createSubscription = (subscriptionData) => 
  api.post('/user/subscriptions', subscriptionData);

export const cancelSubscription = (subscriptionId, reason) => 
  api.post(`/user/subscriptions/${subscriptionId}/cancel`, { reason });

export const toggleAutoRenew = (subscriptionId, autoRenew) => 
  api.put(`/user/subscriptions/${subscriptionId}/auto-renew`, { auto_renew: autoRenew });

export const validateDiscountCode = (code) => 
  api.post('/user/discounts/validate', { code });

export const applyDiscount = (subscriptionId, code) => 
  api.post(`/user/subscriptions/${subscriptionId}/apply-discount`, { code });

export const getUserNotifications = (limit = 50) => 
  api.get(`/user/notifications?limit=${limit}`);

export const markNotificationRead = (notificationId) => 
  api.put(`/user/notifications/${notificationId}/read`);

export const getUnreadNotificationCount = () => 
  api.get('/user/notifications/unread-count');

export const getUserDashboard = () => 
  api.get('/user/dashboard');

// Admin Endpoints
export const getAdminDashboard = () => 
  api.get('/admin/dashboard');

export const getAdminUsers = () => 
  api.get('/admin/users');

export const getAdminUserById = (userId) => 
  api.get(`/admin/users/${userId}`);

export const updateAdminUser = (userId, data) => 
  api.put(`/admin/users/${userId}`, data);

export const deleteAdminUser = (userId) => 
  api.delete(`/admin/users/${userId}`);

export const getAdminPlans = () => 
  api.get('/admin/plans');

export const createAdminPlan = (planData) => 
  api.post('/admin/plans', planData);

export const updateAdminPlan = (planId, data) => 
  api.put(`/admin/plans/${planId}`, data);

export const deleteAdminPlan = (planId) => 
  api.delete(`/admin/plans/${planId}`);

export const getAdminSubscriptions = (status = 'all') => 
  api.get(`/admin/subscriptions?status=${status}`);

export const getAdminSubscriptionById = (subscriptionId) => 
  api.get(`/admin/subscriptions/${subscriptionId}`);

export const cancelAdminSubscription = (subscriptionId, reason) => 
  api.post(`/admin/subscriptions/${subscriptionId}/cancel`, { reason });

export const getAdminDiscounts = () => 
  api.get('/admin/discounts');

export const createAdminDiscount = (discountData) => 
  api.post('/admin/discounts', discountData);

export const sendAdminNotification = (notificationData) => 
  api.post('/admin/notifications/send', notificationData);

// Legacy exports for backward compatibility
export const createUser = signup;
export const getAllActivePlans = getUserPlans;
export const createPlan = createAdminPlan;
export const updatePlan = updateAdminPlan;
export const deletePlan = deleteAdminPlan;

export default api;