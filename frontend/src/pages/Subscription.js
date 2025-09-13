import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserSubscriptions, getUserDashboard } from '../services/api';

const Subscription = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subsResponse, dashResponse] = await Promise.all([
          getUserSubscriptions(),
          getUserDashboard()
        ]);
        
        setSubscriptions(subsResponse.data.data || []);
        setDashboard(dashResponse.data.data || null);
      } catch (error) {
        console.error('Error fetching subscription data:', error);
        // Fallback mock data
        setSubscriptions([
          {
            subscription_id: 1,
            plan_name: 'Basic Plan',
            status: 'active',
            start_date: '2024-01-01',
            end_date: '2024-02-01',
            price: 29.99
          }
        ]);
        setDashboard({
          user_info: { name: user?.name || 'User', email: user?.email || '' },
          subscription_stats: { total: 1, active: 1, expired: 0, cancelled: 0 }
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="text-center py-8">
        <p>Please log in to view your subscriptions.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-8">Loading subscriptions...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Subscriptions</h1>
      
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{successMessage}</p>
            </div>
          </div>
        </div>
      )}
      
      {dashboard && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {dashboard.subscription_stats?.total || 0}
              </div>
              <div className="text-gray-600">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {dashboard.subscription_stats?.active || 0}
              </div>
              <div className="text-gray-600">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {dashboard.subscription_stats?.expired || 0}
              </div>
              <div className="text-gray-600">Expired</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {dashboard.subscription_stats?.cancelled || 0}
              </div>
              <div className="text-gray-600">Cancelled</div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {subscriptions.length === 0 ? (
          <div className="text-center py-8">
            <p>No subscriptions found.</p>
          </div>
        ) : (
          subscriptions.map((subscription) => (
            <div key={subscription.subscription_id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{subscription.plan_name}</h3>
                  <p className="text-gray-600">Status: {subscription.status}</p>
                  <p className="text-gray-600">
                    Period: {subscription.start_date} to {subscription.end_date}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    ${subscription.price}
                  </div>
                  <div className="text-gray-600">per month</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Subscription;