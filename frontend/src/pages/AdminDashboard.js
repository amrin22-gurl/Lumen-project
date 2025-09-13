import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAdminDashboard, getAdminUsers, getAdminPlans, getAdminSubscriptions } from '../services/api';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [dashResponse, usersResponse, plansResponse, subsResponse] = await Promise.all([
          getAdminDashboard(),
          getAdminUsers(),
          getAdminPlans(),
          getAdminSubscriptions()
        ]);

        setDashboardData(dashResponse.data.data || null);
        setUsers(usersResponse.data.data || []);
        setPlans(plansResponse.data.data || []);
        setSubscriptions(subsResponse.data.data || []);
      } catch (error) {
        console.error('Error fetching admin data:', error);
        // Fallback mock data
        setDashboardData({
          overview: {
            total_users: 150,
            total_plans: 5,
            active_subscriptions: 89,
            total_revenue: 12450.50
          }
        });
        setUsers([
          { user_id: 1, name: 'John Doe', email: 'john@example.com', role: 'customer', signup_date: '2024-01-15' },
          { user_id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'customer', signup_date: '2024-01-20' }
        ]);
        setPlans([
          { plan_id: 1, plan_name: 'Basic Plan', price: 29.99, is_active: 1 },
          { plan_id: 2, plan_name: 'Premium Plan', price: 59.99, is_active: 1 }
        ]);
        setSubscriptions([
          { subscription_id: 1, user_name: 'John Doe', plan_name: 'Basic Plan', status: 'Active', start_date: '2024-01-15' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === 'admin') {
      fetchAdminData();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-8">Loading admin dashboard...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Overview Cards */}
      {dashboardData && (
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-600">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">
              {dashboardData.overview?.total_users || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-600">Total Plans</h3>
            <p className="text-3xl font-bold text-green-600">
              {dashboardData.overview?.total_plans || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-600">Active Subscriptions</h3>
            <p className="text-3xl font-bold text-purple-600">
              {dashboardData.overview?.active_subscriptions || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-600">Total Revenue</h3>
            <p className="text-3xl font-bold text-yellow-600">
              ${dashboardData.overview?.total_revenue || 0}
            </p>
          </div>
        </div>
      )}

      {/* Recent Users */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Signup Date</th>
              </tr>
            </thead>
            <tbody>
              {users.slice(0, 5).map((user) => (
                <tr key={user.user_id} className="border-t">
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-2">{user.signup_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Plans Overview */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Plans Overview</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div key={plan.plan_id} className="border rounded-lg p-4">
              <h3 className="font-semibold">{plan.plan_name}</h3>
              <p className="text-2xl font-bold text-blue-600">${plan.price}</p>
              <span className={`px-2 py-1 rounded text-xs ${
                plan.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {plan.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Subscriptions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Subscriptions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">User</th>
                <th className="px-4 py-2 text-left">Plan</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Start Date</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.slice(0, 5).map((subscription) => (
                <tr key={subscription.subscription_id} className="border-t">
                  <td className="px-4 py-2">{subscription.user_name}</td>
                  <td className="px-4 py-2">{subscription.plan_name}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      subscription.status === 'Active' ? 'bg-green-100 text-green-800' : 
                      subscription.status === 'Expired' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {subscription.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">{subscription.start_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;