const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Helper function to make API calls with fetch
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('access_token');
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));
    
    return {
      data,
      status: response.status,
      ok: response.ok,
    };
  } catch (error) {
    throw new Error(`API call failed: ${error.message}`);
  }
};

// Authentication Endpoints
export const signup = (userData) => 
  apiCall('/auth/signup', { method: 'POST', body: userData });

export const login = (credentials) => 
  apiCall('/auth/login', { method: 'POST', body: credentials });

export const verifyToken = () => 
  apiCall('/auth/verify-token');

// User Endpoints
export const getUserProfile = () => 
  apiCall('/user/profile');

export const updateUserProfile = (data) => 
  apiCall('/user/profile', { method: 'PUT', body: data });

export const changePassword = (passwordData) => 
  apiCall('/user/change-password', { method: 'POST', body: passwordData });

export const getUserPlans = () => 
  apiCall('/user/plans');

export const getPlanById = (planId) => 
  apiCall(`/user/plans/${planId}`);

export const getUserSubscriptions = () => 
  apiCall('/user/subscriptions');

export const getSubscriptionById = (subscriptionId) => 
  apiCall(`/user/subscriptions/${subscriptionId}`);

export const createSubscription = (subscriptionData) => 
  apiCall('/user/subscriptions', { method: 'POST', body: subscriptionData });

export const cancelSubscription = (subscriptionId, reason) => 
  apiCall(`/user/subscriptions/${subscriptionId}/cancel`, { method: 'POST', body: { reason } });

export const toggleAutoRenew = (subscriptionId, autoRenew) => 
  apiCall(`/user/subscriptions/${subscriptionId}/auto-renew`, { method: 'PUT', body: { auto_renew: autoRenew } });

export const validateDiscountCode = (code) => 
  apiCall('/user/discounts/validate', { method: 'POST', body: { code } });

export const applyDiscount = (subscriptionId, code) => 
  apiCall(`/user/subscriptions/${subscriptionId}/apply-discount`, { method: 'POST', body: { code } });

export const getUserNotifications = (limit = 50) => 
  apiCall(`/user/notifications?limit=${limit}`);

export const markNotificationRead = (notificationId) => 
  apiCall(`/user/notifications/${notificationId}/read`, { method: 'PUT' });

export const getUnreadNotificationCount = () => 
  apiCall('/user/notifications/unread-count');

export const getUserDashboard = () => 
  apiCall('/user/dashboard');

// Admin Endpoints
export const getAdminDashboard = () => 
  apiCall('/admin/dashboard');

export const getAdminUsers = () => 
  apiCall('/admin/users');

export const getAdminUserById = (userId) => 
  apiCall(`/admin/users/${userId}`);

export const updateAdminUser = (userId, data) => 
  apiCall(`/admin/users/${userId}`, { method: 'PUT', body: data });

export const deleteAdminUser = (userId) => 
  apiCall(`/admin/users/${userId}`, { method: 'DELETE' });

export const getAdminPlans = () => 
  apiCall('/admin/plans');

export const createAdminPlan = (planData) => 
  apiCall('/admin/plans', { method: 'POST', body: planData });

export const updateAdminPlan = (planId, data) => 
  apiCall(`/admin/plans/${planId}`, { method: 'PUT', body: data });

export const deleteAdminPlan = (planId) => 
  apiCall(`/admin/plans/${planId}`, { method: 'DELETE' });

export const getAdminSubscriptions = (status = 'all') => 
  apiCall(`/admin/subscriptions?status=${status}`);

export const getAdminSubscriptionById = (subscriptionId) => 
  apiCall(`/admin/subscriptions/${subscriptionId}`);

export const cancelAdminSubscription = (subscriptionId, reason) => 
  apiCall(`/admin/subscriptions/${subscriptionId}/cancel`, { method: 'POST', body: { reason } });

export const getAdminDiscounts = () => 
  apiCall('/admin/discounts');

export const createAdminDiscount = (discountData) => 
  apiCall('/admin/discounts', { method: 'POST', body: discountData });

export const sendAdminNotification = (notificationData) => 
  apiCall('/admin/notifications/send', { method: 'POST', body: notificationData });

// Legacy exports for backward compatibility
export const createUser = signup;
export const getAllActivePlans = getUserPlans;
export const createPlan = createAdminPlan;
export const updatePlan = updateAdminPlan;
export const deletePlan = deleteAdminPlan;

const api = { apiCall };
export default api;