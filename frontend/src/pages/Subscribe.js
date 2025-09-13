import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createSubscription, getPlanById } from '../services/api';

const Subscribe = () => {
  const [searchParams] = useSearchParams();
  const planId = searchParams.get('planId');
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    billingCycle: 'monthly',
    autoRenew: true,
    paymentMethod: 'credit_card'
  });

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        if (planId) {
          const response = await getPlanById(planId);
          setSelectedPlan(response.data.data);
        } else {
          setError('No plan selected');
        }
      } catch (error) {
        console.error('Error fetching plan:', error);
        setError('Plan not found');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchPlan();
    } else {
      setLoading(false);
    }
  }, [planId, user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!selectedPlan) return;

    setSubscribing(true);
    setError('');

    try {
      const subscriptionData = {
        plan_id: selectedPlan.plan_id,
        title: formData.title || `${selectedPlan.plan_name} Subscription`,
        billing_cycle: formData.billingCycle,
        auto_renew: formData.autoRenew,
        payment_method: formData.paymentMethod
      };

      const response = await createSubscription(subscriptionData);
      
      if (response.data.success) {
        // Redirect to subscription page after successful subscription
        navigate('/subscription', { 
          state: { 
            message: 'Subscription created successfully!',
            newSubscription: response.data.data 
          }
        });
      } else {
        setError(response.data.message || 'Failed to create subscription');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setError(error.response?.data?.message || 'Failed to create subscription');
    } finally {
      setSubscribing(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="mb-4">Please log in to subscribe to a plan.</p>
        <button 
          onClick={() => navigate('/login')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-8">Loading plan details...</div>;
  }

  if (error && !selectedPlan) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => navigate('/plans')}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Back to Plans
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Subscribe to Plan</h1>
              <p className="text-blue-100">Complete your subscription setup</p>
            </div>
            <button
              onClick={() => navigate('/plans')}
              className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded text-sm"
            >
              Back to Plans
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Plan Details */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Plan Details</h2>
              {selectedPlan && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">
                    {selectedPlan.plan_name}
                  </h3>
                  <p className="text-gray-600 mb-4">{selectedPlan.plan_description}</p>
                  
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-blue-600">
                      ${selectedPlan.price}
                    </span>
                    <span className="text-gray-600 ml-2">per month</span>
                  </div>

                  <div className="mb-4">
                    <p className="font-medium text-gray-700 mb-2">Features:</p>
                    <ul className="space-y-1">
                      {selectedPlan.features?.split(',').map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <span className="text-green-500 mr-2">✓</span>
                          {feature.trim()}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="text-sm text-gray-600">
                    <p><strong>Duration:</strong> {selectedPlan.duration_months} month(s)</p>
                  </div>
                </div>
              )}
            </div>

            {/* Subscription Form */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Subscription Details</h2>
              <form onSubmit={handleSubscribe} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subscription Title (Optional)
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="My Home Internet Plan"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Billing Cycle
                  </label>
                  <select
                    name="billingCycle"
                    value={formData.billingCycle}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly (Save 10%)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  >
                    <option value="credit_card">Credit Card</option>
                    <option value="debit_card">Debit Card</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="paypal">PayPal</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="autoRenew"
                    checked={formData.autoRenew}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-700">
                    Enable auto-renewal
                  </label>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={subscribing}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {subscribing ? 'Creating Subscription...' : 'Subscribe Now'}
                  </button>
                </div>
              </form>

              <div className="mt-6 pt-6 border-t">
                <h3 className="font-medium text-gray-700 mb-2">Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Plan Price:</span>
                    <span>${selectedPlan?.price}/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Billing:</span>
                    <span className="capitalize">{formData.billingCycle}</span>
                  </div>
                  {formData.billingCycle === 'yearly' && (
                    <div className="flex justify-between text-green-600">
                      <span>Yearly Discount:</span>
                      <span>-10%</span>
                    </div>
                  )}
                  <div className="flex justify-between font-medium pt-2 border-t">
                    <span>Total:</span>
                    <span>
                      ${formData.billingCycle === 'yearly' 
                        ? (selectedPlan?.price * 12 * 0.9).toFixed(2) 
                        : selectedPlan?.price}
                      /{formData.billingCycle === 'yearly' ? 'year' : 'month'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscribe;