import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserPlans } from '../services/api';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await getUserPlans();
        setPlans(response.data.data || []);
      } catch (error) {
        console.error('Error fetching plans:', error);
        // Fallback to mock data if API fails
        setPlans([
          {
            plan_id: 1,
            plan_name: 'Basic Plan',
            plan_description: 'Entry-level internet plan',
            price: 29.99,
            duration_months: 1,
            features: ['24/7 Support', 'Free Installation']
          },
          {
            plan_id: 2,
            plan_name: 'Premium Plan',
            plan_description: 'High-speed internet with unlimited data',
            price: 59.99,
            duration_months: 1,
            features: ['24/7 Support', 'Free Installation', 'Router Included']
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading plans...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Available Plans</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.plan_id} className="bg-white rounded-lg shadow-md p-6 border">
            <h3 className="text-xl font-semibold mb-2">{plan.plan_name}</h3>
            <p className="text-gray-600 mb-4">{plan.plan_description}</p>
            <div className="text-2xl font-bold text-blue-600 mb-4">
              ${plan.price}/month
            </div>
            <ul className="mb-6 space-y-2">
              {plan.features?.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <button 
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              onClick={() => {
                if (!user) {
                  window.location.href = '/login';
                } else {
                  alert('Subscription feature coming soon!');
                }
              }}
            >
              Subscribe
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Plans;